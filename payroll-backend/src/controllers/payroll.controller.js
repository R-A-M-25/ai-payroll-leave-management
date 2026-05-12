const pool = require("../config/db");
const { createNotification } = require("./notification.controller");

/* ===============================
   ASSIGN SALARY (HR)
================================= */

exports.assignSalary = async (req, res) => {
  try {

    const { employee_id, monthly_salary, effective_from } = req.body;

    if (!employee_id || !monthly_salary || !effective_from) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    if (monthly_salary <= 0) {
      return res.status(400).json({
        message: "Salary must be greater than zero"
      });
    }

    const employeeCheck = await pool.query(
      "SELECT id FROM employees WHERE id=$1",
      [employee_id]
    );

    if (employeeCheck.rows.length === 0) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    await pool.query(
      `
      INSERT INTO employee_salary
      (employee_id,monthly_salary,effective_from)
      VALUES ($1,$2,$3)
      `,
      [employee_id, monthly_salary, effective_from]
    );

    res.status(201).json({
      message: "Salary assigned successfully"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error"
    });

  }
};



/* ===============================
   RUN PAYROLL (HR)
================================= */

exports.runPayroll = async (req, res) => {

  const client = await pool.connect();

  let payrollRunId = null;

  try {

    const { month, year } = req.body;
    const hrUserId = req.user.userId;

    /* ---------- Validation ---------- */

    if (!month || !year) {
      return res.status(400).json({
        message: "Month and year required"
      });
    }

    if (month < 1 || month > 12) {
      return res.status(400).json({
        message: "Invalid month"
      });
    }

    if (year < 2020 || year > 2100) {
      return res.status(400).json({
        message: "Invalid year"
      });
    }

    await client.query("BEGIN");

    /* ---------- Prevent duplicate payroll ---------- */

    const payrollCheck = await client.query(
      "SELECT id FROM payroll_runs WHERE month=$1 AND year=$2",
      [month, year]
    );

    if (payrollCheck.rows.length > 0) {

      await client.query("ROLLBACK");

      return res.status(400).json({
        message: "Payroll already executed for this month"
      });

    }

    /* ---------- Create payroll run (PROCESSING) ---------- */

    const payrollRun = await client.query(
      `
      INSERT INTO payroll_runs
      (month,year,run_by,status)
      VALUES ($1,$2,$3,'PROCESSING')
      RETURNING id
      `,
      [month, year, hrUserId]
    );

    payrollRunId = payrollRun.rows[0].id;

    /* ---------- Days in month ---------- */

    const daysInMonth =
      new Date(year, month, 0).getDate();

    /* ---------- Get active employees ---------- */

    const employees = await client.query(
      "SELECT id FROM employees WHERE status='active'"
    );

    for (const emp of employees.rows) {

      /* ---------- Get salary ---------- */

      const salaryResult = await client.query(
        `
        SELECT monthly_salary
        FROM employee_salary
        WHERE employee_id=$1
        AND effective_from <= MAKE_DATE($2,$3,1)
        ORDER BY effective_from DESC
        LIMIT 1
        `,
        [emp.id, year, month]
      );

      if (salaryResult.rows.length === 0) continue;

      const monthlySalary =
        Number(salaryResult.rows[0].monthly_salary);

      const dailySalary =
        Number((monthlySalary / daysInMonth).toFixed(2));

      /* ---------- Calculate LOP ---------- */

      const lopResult = await client.query(
        `
        SELECT
        COALESCE(
        SUM(
          (LEAST(
            end_date,
            (DATE_TRUNC('month', MAKE_DATE($3,$2,1))
             + INTERVAL '1 month - 1 day')::date
          )
          -
          GREATEST(
            start_date,
            DATE_TRUNC('month', MAKE_DATE($3,$2,1))::date
          )) + 1
        ),0) AS lop_days
        FROM leaves
        WHERE employee_id=$1
        AND leave_type='LOP'
        AND status='APPROVED'
        AND start_date <=
          (DATE_TRUNC('month', MAKE_DATE($3,$2,1))
           + INTERVAL '1 month - 1 day')
        AND end_date >=
          DATE_TRUNC('month', MAKE_DATE($3,$2,1))
        `,
        [emp.id, month, year]
      );

      const lopDays =
        Number(lopResult.rows[0].lop_days);

      const lopDeduction =
        Number((lopDays * dailySalary).toFixed(2));

      const netSalary =
        Number(
          Math.max(
            0,
            monthlySalary - lopDeduction
          ).toFixed(2)
        );

      /* ---------- Generate payslip ---------- */

      await client.query(
        `
        INSERT INTO payslips
        (employee_id,payroll_run_id,base_salary,lop_days,lop_deduction,net_salary)
        VALUES ($1,$2,$3,$4,$5,$6)
        `,
        [
          emp.id,
          payrollRunId,
          monthlySalary,
          lopDays,
          lopDeduction,
          netSalary
        ]
      );

    }

    /* ---------- Mark payroll completed ---------- */

    await client.query(
      `
      UPDATE payroll_runs
      SET status='COMPLETED'
      WHERE id=$1
      `,
      [payrollRunId]
    );

    await client.query("COMMIT");

    // Extract users to notify
    const notifyResult = await pool.query(
      `SELECT e.user_id FROM payslips p JOIN employees e ON p.employee_id = e.id WHERE p.payroll_run_id = $1`,
      [payrollRunId]
    );
    for (const row of notifyResult.rows) {
      await createNotification(
        row.user_id,
        "Payslip Generated",
        `Your payslip for ${month}/${year} is now available for viewing.`,
        "payroll"
      );
    }

    res.status(201).json({
      message: "Payroll executed successfully",
      payrollRunId
    });

  } catch (err) {

    await client.query("ROLLBACK");

    if (payrollRunId) {

      await pool.query(
        `
        UPDATE payroll_runs
        SET status='FAILED'
        WHERE id=$1
        `,
        [payrollRunId]
      );

    }

    console.error(err);

    res.status(500).json({
      message: "Payroll execution failed"
    });

  } finally {

    client.release();

  }

};



/* ===============================
   EMPLOYEE VIEW PAYSLIPS
================================= */

exports.getMyPayslips = async (req, res) => {

  try {

    const userId = req.user.userId;

    const employee = await pool.query(
      "SELECT id FROM employees WHERE user_id=$1",
      [userId]
    );

    if (employee.rows.length === 0) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    const employeeId = employee.rows[0].id;

    const result = await pool.query(
      `
      SELECT
        p.id,
        pr.month,
        pr.year,
        p.base_salary,
        p.lop_days,
        p.lop_deduction,
        p.net_salary,
        p.generated_at
      FROM payslips p
      JOIN payroll_runs pr
      ON p.payroll_run_id = pr.id
      WHERE p.employee_id = $1
      ORDER BY pr.year DESC, pr.month DESC
      `,
      [employeeId]
    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error"
    });

  }

};

/* ===============================
   HR: GET ALL PAYROLL RUNS
================================= */

exports.getAllPayrollRuns = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        pr.id,
        pr.month,
        pr.year,
        pr.status,
        COUNT(p.id) AS total_employees,
        COALESCE(SUM(p.net_salary), 0) AS total_disbursed
      FROM payroll_runs pr
      LEFT JOIN payslips p ON pr.id = p.payroll_run_id
      GROUP BY pr.id
      ORDER BY pr.year DESC, pr.month DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("GET PAYROLL RUNS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};