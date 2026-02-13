const pool = require("../config/db");

exports.applyLeave = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { start_date, end_date, leave_type, reason } = req.body;

    // 1. Find employee record
    const employeeResult = await pool.query(
      "SELECT id, manager_id FROM employees WHERE user_id = $1",
      [userId]
    );

    if (employeeResult.rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const { id: employeeId, manager_id: managerId } =
      employeeResult.rows[0];

    if (!managerId) {
      return res
        .status(400)
        .json({ message: "Manager not assigned" });
    }

    // 2. Insert leave request
    await pool.query(
      `INSERT INTO leaves
       (employee_id, manager_id, start_date, end_date, leave_type, reason)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [employeeId, managerId, start_date, end_date, leave_type, reason]
    );

    res.status(201).json({
      message: "Leave applied successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getManagerLeaves = async (req, res) => {
  try {
    const userId = req.user.userId;

    // 1. Find manager's employee record
    const managerResult = await pool.query(
      "SELECT id FROM employees WHERE user_id = $1",
      [userId]
    );

    if (managerResult.rows.length === 0) {
      return res.status(404).json({ message: "Manager not found" });
    }

    const managerId = managerResult.rows[0].id;

    // 2. Fetch leave requests assigned to this manager
    const leavesResult = await pool.query(
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
      JOIN employees e ON l.employee_id = e.id
      JOIN users u ON e.user_id = u.id
      WHERE l.manager_id = $1
      ORDER BY l.applied_at DESC
      `,
      [managerId]
    );

    res.json(leavesResult.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { leaveId } = req.params;
    const { status } = req.body; // APPROVED or REJECTED

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // 1. Get manager employee ID
    const managerResult = await pool.query(
      "SELECT id FROM employees WHERE user_id = $1",
      [userId]
    );

    if (managerResult.rows.length === 0) {
      return res.status(404).json({ message: "Manager not found" });
    }

    const managerId = managerResult.rows[0].id;

    // 2. Fetch leave and validate ownership + status
    const leaveResult = await pool.query(
      "SELECT status FROM leaves WHERE id = $1 AND manager_id = $2",
      [leaveId, managerId]
    );

    if (leaveResult.rows.length === 0) {
      return res.status(404).json({ message: "Leave not found or access denied" });
    }

    if (leaveResult.rows[0].status !== "PENDING") {
      return res
        .status(400)
        .json({ message: "Leave already processed" });
    }

    // 3. Update leave status
    await pool.query(
      `
      UPDATE leaves
      SET status = $1, reviewed_at = CURRENT_TIMESTAMP
      WHERE id = $2
      `,
      [status, leaveId]
    );

    res.json({ message: `Leave ${status.toLowerCase()} successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyLeaves = async (req, res) => {
  try {
    const userId = req.user.userId;

    // 1. Find employee record
    const employeeResult = await pool.query(
      "SELECT id FROM employees WHERE user_id = $1",
      [userId]
    );

    if (employeeResult.rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const employeeId = employeeResult.rows[0].id;

    // 2. Fetch employee's leaves
    const leavesResult = await pool.query(
      `
      SELECT 
        id,
        start_date,
        end_date,
        leave_type,
        reason,
        status,
        applied_at,
        reviewed_at
      FROM leaves
      WHERE employee_id = $1
      ORDER BY applied_at DESC
      `,
      [employeeId]
    );

    res.json(leavesResult.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getPendingLeaves = async (req, res) => {
  const userId = req.user.userId;

  // Step 1: get manager employee_id
  const managerResult = await pool.query(
    "SELECT id FROM employees WHERE user_id = $1",
    [userId]
  );

  const managerEmployeeId = managerResult.rows[0].id;

  // Step 2: fetch pending leaves for that manager
  const result = await pool.query(
    `
    SELECT l.id, l.leave_type, l.start_date, l.end_date,
           u.email AS employee_email
    FROM leaves l
    JOIN employees e ON l.employee_id = e.id
    JOIN users u ON e.user_id = u.id
    WHERE l.status = 'PENDING'
    AND e.manager_id = $1
    ORDER BY l.applied_at DESC
    `,
    [managerEmployeeId]
  );

  res.json(result.rows);
};
