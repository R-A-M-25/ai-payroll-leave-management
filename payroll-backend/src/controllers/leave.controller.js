const pool = require("../config/db");
const { createNotification } = require("./notification.controller");

/* ===============================
   APPLY LEAVE (EMPLOYEE)
================================= */

exports.applyLeave = async (req, res) => {
  try {

    const userId = req.user.userId;
    const { start_date, end_date, leave_type, reason } = req.body;

    /* ---------- Validation ---------- */

    if (!start_date || !end_date || !leave_type || !reason) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (reason.trim().length < 5) {
      return res.status(400).json({
        message: "Reason must be at least 5 characters long"
      });
    }

    const start = new Date(start_date);
    const end = new Date(end_date);
    const today = new Date();

    today.setHours(0,0,0,0);

    if (start > end) {
      return res.status(400).json({
        message: "End date cannot be before start date"
      });
    }

    if (start < today) {
      return res.status(400).json({
        message: "Cannot apply leave in the past"
      });
    }

    /* ---------- Get Employee ---------- */

    const employeeResult = await pool.query(
      "SELECT id, manager_id FROM employees WHERE user_id = $1",
      [userId]
    );

    if (employeeResult.rows.length === 0) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    const { id: employeeId, manager_id: managerId } =
      employeeResult.rows[0];

    if (!managerId) {
      return res.status(400).json({
        message: "Manager not assigned"
      });
    }

    /* ---------- Overlapping Leave ---------- */

    const overlapCheck = await pool.query(
      `
      SELECT 1 FROM leaves
      WHERE employee_id = $1
      AND status IN ('PENDING','APPROVED')
      AND (start_date <= $3 AND end_date >= $2)
      `,
      [employeeId, start_date, end_date]
    );

    if (overlapCheck.rows.length > 0) {
      return res.status(400).json({
        message: "You already have a leave request during this period"
      });
    }

    /* ---------- Calculate days ---------- */

    const totalDays =
      (end - start) / (1000 * 60 * 60 * 24) + 1;

    /* ---------- Check Leave Balance ---------- */

    if (leave_type !== "LOP") {

      const balanceResult = await pool.query(
        `
        SELECT cl_balance, sl_balance
        FROM leave_balances
        WHERE employee_id = $1
        `,
        [employeeId]
      );

      if (balanceResult.rows.length === 0) {
        // Auto-heal missing balances for legacy employees
        await pool.query(
          "INSERT INTO leave_balances (employee_id, year, cl_balance, sl_balance) VALUES ($1, extract(year from current_date), 12, 12)",
          [employeeId]
        );
        balanceResult.rows.push({ cl_balance: 12, sl_balance: 12 });
      }

      const balance = balanceResult.rows[0];

      if (leave_type === "CL" && balance.cl_balance < totalDays) {
        return res.status(400).json({
          message: "CL balance insufficient. Apply LOP instead."
        });
      }

      if (leave_type === "SL" && balance.sl_balance < totalDays) {
        return res.status(400).json({
          message: "SL balance insufficient. Apply LOP instead."
        });
      }

    }

    /* ---------- Insert Leave ---------- */

    await pool.query(
      `
      INSERT INTO leaves
      (employee_id, manager_id, start_date, end_date, leave_type, reason)
      VALUES ($1,$2,$3,$4,$5,$6)
      `,
      [
        employeeId,
        managerId,
        start_date,
        end_date,
        leave_type,
        reason.trim()
      ]
    );

    // Notify Manager
    const mgrResult = await pool.query("SELECT user_id FROM employees WHERE id = $1", [managerId]);
    if (mgrResult.rows.length > 0) {
      await createNotification(
        mgrResult.rows[0].user_id, 
        "New Leave Request", 
        `An employee has applied for ${totalDays} day(s) of ${leave_type}.`, 
        "leave"
      );
    }

    res.status(201).json({
      message: "Leave applied successfully",
      totalDays
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error"
    });

  }
};


/* ===============================
   GET EMPLOYEE LEAVES
================================= */

exports.getMyLeaves = async (req,res)=>{

  try{

    const userId=req.user.userId;

    const employeeResult=await pool.query(
      "SELECT id FROM employees WHERE user_id=$1",
      [userId]
    );

    if(employeeResult.rows.length===0){
      return res.status(404).json({
        message:"Employee not found"
      });
    }

    const employeeId=employeeResult.rows[0].id;

    const result=await pool.query(
      `
      SELECT 
        l.id,
        l.start_date,
        l.end_date,
        l.leave_type,
        l.reason,
        l.status,
        l.applied_at,
        l.reviewed_at,
        m_user.name AS manager_name
      FROM leaves l
      LEFT JOIN employees m ON l.manager_id = m.id
      LEFT JOIN users m_user ON m.user_id = m_user.id
      WHERE l.employee_id=$1
      ORDER BY l.applied_at DESC
      `,
      [employeeId]
    );

    res.json(result.rows);

  }catch(err){

    console.error(err);

    res.status(500).json({
      message:"Server error"
    });

  }

};


/* ===============================
   GET MANAGER LEAVES
================================= */

exports.getManagerLeaves = async (req,res)=>{

  try{

    const userId=req.user.userId;

    const managerResult=await pool.query(
      "SELECT id FROM employees WHERE user_id=$1",
      [userId]
    );

    if(managerResult.rows.length===0){
      return res.status(404).json({
        message:"Manager not found"
      });
    }

    const managerId=managerResult.rows[0].id;

    const result=await pool.query(
      `
      SELECT 
        l.id,
        u.email AS employee_email,
        l.start_date,
        l.end_date,
        l.leave_type,
        l.reason,
        l.status,
        l.applied_at
      FROM leaves l
      JOIN employees e ON l.employee_id=e.id
      JOIN users u ON e.user_id=u.id
      WHERE e.manager_id=$1
      ORDER BY l.applied_at DESC
      `,
      [managerId]
    );

    res.json(result.rows);

  }catch(err){

    console.error(err);

    res.status(500).json({
      message:"Server error"
    });

  }

};


/* ===============================
   UPDATE LEAVE STATUS
================================= */

exports.updateLeaveStatus = async (req,res)=>{

  const client = await pool.connect();

  try{

    const userId=req.user.userId;
    const {leaveId}=req.params;
    const {status}=req.body;

    if(!["APPROVED","REJECTED"].includes(status)){
      return res.status(400).json({
        message:"Invalid status"
      });
    }

    await client.query("BEGIN");

    const managerResult=await client.query(
      "SELECT id FROM employees WHERE user_id=$1",
      [userId]
    );

    if(managerResult.rows.length===0){
      return res.status(404).json({
        message:"Manager not found"
      });
    }

    const managerId=managerResult.rows[0].id;

    const leaveResult=await client.query(
      `
      SELECT l.employee_id, l.leave_type, 
             CAST(DATE_PART('day', l.end_date::timestamp - l.start_date::timestamp) + 1 AS INTEGER) AS total_days, 
             l.status, e.user_id AS emp_user_id
      FROM leaves l
      JOIN employees e ON l.employee_id = e.id
      WHERE l.id=$1 AND e.manager_id=$2
      `,
      [leaveId,managerId]
    );

    if(leaveResult.rows.length===0){
      return res.status(404).json({
        message:"Leave not found or access denied"
      });
    }

    const leave=leaveResult.rows[0];

    if(leave.status!=="PENDING"){
      return res.status(400).json({
        message:"Leave already processed"
      });
    }

    await client.query(
      `
      UPDATE leaves
      SET status=$1,
      reviewed_at=CURRENT_TIMESTAMP
      WHERE id=$2
      `,
      [status,leaveId]
    );

    if(status==="APPROVED" && leave.leave_type!=="LOP"){

      if(leave.leave_type==="CL"){
        await client.query(
          `
          UPDATE leave_balances
          SET cl_balance=GREATEST(0,cl_balance-$1)
          WHERE employee_id=$2
          `,
          [leave.total_days,leave.employee_id]
        );
      }

      if(leave.leave_type==="SL"){
        await client.query(
          `
          UPDATE leave_balances
          SET sl_balance=GREATEST(0,sl_balance-$1)
          WHERE employee_id=$2
          `,
          [leave.total_days,leave.employee_id]
        );
      }

    }

    await client.query("COMMIT");

    // Notify Employee
    await createNotification(
       leave.emp_user_id,
       `Leave Request ${status === 'APPROVED' ? 'Approved' : 'Rejected'}`,
       `Your leave request for ${leave.total_days} day(s) of ${leave.leave_type} has been ${status.toLowerCase()} by your manager.`,
       "leave"
    );

    res.json({
      message:`Leave ${status.toLowerCase()} successfully`
    });

  }catch(err){

    await client.query("ROLLBACK");

    console.error(err);

    res.status(500).json({
      message:"Server error"
    });

  }finally{

    client.release();

  }

};


/* ===============================
   GET LEAVE BALANCE
================================= */

exports.getLeaveBalance = async (req,res)=>{

  try{

    const userId=req.user.userId;

    const employeeResult=await pool.query(
      "SELECT id FROM employees WHERE user_id=$1",
      [userId]
    );

    if(employeeResult.rows.length===0){
      return res.status(404).json({
        message:"Employee not found"
      });
    }

    const employeeId=employeeResult.rows[0].id;

    const result=await pool.query(
      `
      SELECT cl_balance,sl_balance
      FROM leave_balances
      WHERE employee_id=$1
      `,
      [employeeId]
    );

    let balance;
    if(result.rows.length === 0) {
       // Auto-heal missing balances
       await pool.query(
         "INSERT INTO leave_balances (employee_id, year, cl_balance, sl_balance) VALUES ($1, extract(year from current_date), 12, 12)",
         [employeeId]
       );
       balance = { cl_balance: 12, sl_balance: 12 };
    } else {
       balance = result.rows[0];
    }

    res.json({
      CL:balance.cl_balance,
      SL:balance.sl_balance,
      LOP:"Unlimited"
    });

  }catch(err){

    console.error(err);

    res.status(500).json({
      message:"Server error"
    });

  }

};