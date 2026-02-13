const pool = require("../config/db");

exports.assignSalary = async (req, res) => {
  try {
    const { employee_id, monthly_salary, effective_from } = req.body;

    if (!employee_id || !monthly_salary || !effective_from) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (monthly_salary <= 0) {
      return res.status(400).json({ message: "Salary must be greater than zero" });
    }

    // Verify employee exists
    const employeeCheck = await pool.query(
      "SELECT id FROM employees WHERE id = $1",
      [employee_id]
    );

    if (employeeCheck.rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Insert salary record
    await pool.query(
      `
      INSERT INTO employee_salary (employee_id, monthly_salary, effective_from)
      VALUES ($1, $2, $3)
      `,
      [employee_id, monthly_salary, effective_from]
    );

    res.status(201).json({ message: "Salary assigned successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.runPayroll = async (req, res) => {
  const client = await pool.connect();

  try {
    const { month, year } = req.body;
    const hrUserId = req.user.userId;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" });
    }

    await client.query("BEGIN");

    // 1. Check if payroll already ran
    const payrollCheck = await client.query(
      "SELECT id FROM payroll_runs WHERE month = $1 AND year = $2",
      [month, year]
    );

    if (payrollCheck.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Payroll already executed for this month" });
    }

    // 2. Create payroll run
    const payrollRunResult = await client.query(
      `
      INSERT INTO payroll_runs (month, year, run_by, status)
      VALUES ($1, $2, $3, 'COMPLETED')
      RETURNING id
      `,
      [month, year, hrUserId]
    );

    const payrollRunId = payrollRunResult.rows[0].id;

    // 3. Fetch all employees
    const employeesResult = await client.query(
      "SELECT id FROM employees"
    );

    for (const emp of employeesResult.rows) {
      // 4. Get latest salary
      const salaryResult = await client.query(
        `
        SELECT monthly_salary
        FROM employee_salary
        WHERE employee_id = $1
        ORDER BY effective_from DESC
        LIMIT 1
        `,
        [emp.id]
      );

      if (salaryResult.rows.length === 0) {
        continue; // skip employees without salary
      }

      const monthlySalary = Number(salaryResult.rows[0].monthly_salary);
      const dailySalary = monthlySalary / 30;

      // 5. Count approved LOP leaves
      // ✅ NEW — Correct LOP day calculation
const lopResult = await client.query(
  `
  SELECT
    COALESCE(
      SUM(
        (
          LEAST(
            end_date,
            (DATE_TRUNC('month', MAKE_DATE($3, $2, 1)) 
              + INTERVAL '1 month - 1 day')::date
          )
          -
          GREATEST(
            start_date,
            DATE_TRUNC('month', MAKE_DATE($3, $2, 1))::date
          )
        ) + 1
      ),
      0
    ) AS lop_days
  FROM leaves
  WHERE employee_id = $1
    AND leave_type = 'LOP'
    AND status = 'APPROVED'
    AND start_date <= (
      DATE_TRUNC('month', MAKE_DATE($3, $2, 1))
        + INTERVAL '1 month - 1 day'
    )
    AND end_date >= DATE_TRUNC('month', MAKE_DATE($3, $2, 1));
  `,
  [emp.id, month, year]
);

const lopDays = Number(lopResult.rows[0].lop_days);

      const lopDeduction = lopDays * dailySalary;
      const netSalary = monthlySalary - lopDeduction;

      // 6. Generate payslip
      await client.query(
        `
        INSERT INTO payslips
        (employee_id, payroll_run_id, base_salary, lop_days, lop_deduction, net_salary)
        VALUES ($1, $2, $3, $4, $5, $6)
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

    await client.query("COMMIT");

    res.status(201).json({
      message: "Payroll executed successfully",
      payrollRunId
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ message: "Payroll execution failed" });
  } finally {
    client.release();
  }
};

exports.getMyPayslips = async (req, res) => {
  try {
    const userId = req.user.userId;

    // 1. Resolve employee
    const employeeResult = await pool.query(
      "SELECT id FROM employees WHERE user_id = $1",
      [userId]
    );

    if (employeeResult.rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const employeeId = employeeResult.rows[0].id;

    // 2. Fetch payslips
    const payslipsResult = await pool.query(
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
      JOIN payroll_runs pr ON p.payroll_run_id = pr.id
      WHERE p.employee_id = $1
      ORDER BY pr.year DESC, pr.month DESC
      `,
      [employeeId]
    );

    res.json(payslipsResult.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
