const pool = require("../config/db");
const bcrypt = require("bcrypt");


/* ===============================
   HR: GET ALL EMPLOYEES
================================= */

exports.getAllEmployees = async (req, res) => {

  try {

    const result = await pool.query(
      `
      SELECT 
        e.id,
        u.id AS user_id,
        u.name,
        u.email,
        r.name AS role_name,
        e.department,
        e.designation,
        e.base_salary,
        e.manager_id
      FROM users u
      LEFT JOIN employees e ON u.id = e.user_id
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.role_id IN (1,2)
      ORDER BY u.created_at DESC
      `
    );

    res.json(result.rows);

  } catch (err) {

    console.error("GET ALL EMPLOYEES ERROR:", err);

    res.status(500).json({
      error: err.message
    });

  }

};



/* ===============================
   HR: CREATE EMPLOYEE
================================= */

exports.createEmployee = async (req, res) => {

  const client = await pool.connect();

  try {

    /* Extract body FIRST */

    const body = req.body || {};

    const {
      name,
      email,
      department,
      designation,
      base_salary,
      role = 'EMPLOYEE', // EMPLOYEE or MANAGER
      manager_id
    } = body;

    /* Validate required fields */

    if (!name || !email || !department) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    // Determine role_id based on role string
    // Assuming 1 = EMPLOYEE, 2 = MANAGER, 3 = HR
    const roleId = role.toUpperCase() === 'MANAGER' ? 2 : 1;



    await client.query("BEGIN");


    /* Default password */

    const salt = await bcrypt.genSalt(10);

    const password_hash = await bcrypt.hash("Welcome@123", salt);


    /* Create user */

    const userRes = await client.query(
      `
      INSERT INTO users (name, email, password_hash, role_id)
      VALUES ($1,$2,$3,$4)
      RETURNING id
      `,
      [name, email, password_hash, roleId]
    );

    const userId = userRes.rows[0].id;


    /* Create employee */

    const empRes = await client.query(
      `
      INSERT INTO employees
      (user_id, manager_id, department, designation, base_salary)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING id
      `,
      [
        userId,
        (roleId === 1 && manager_id) ? Number(manager_id) : null,
        department,
        designation || (roleId === 2 ? "Manager" : "Employee"),
        base_salary || 0
      ]
    );

    const employeeId = empRes.rows[0].id;


    /* Initialize leave balance */

    await client.query(
      `
      INSERT INTO leave_balances
      (employee_id, year, cl_balance, sl_balance)
      VALUES ($1, extract(year from current_date), 12, 12)
      `,
      [employeeId]
    );


    await client.query("COMMIT");


    res.status(201).json({
      message: "Employee created successfully",
      default_password: "Welcome@123",
      employee_id: employeeId
    });


  } catch (err) {

    await client.query("ROLLBACK");

    console.error("CREATE EMPLOYEE ERROR:", err);

    if (err.code === "23505") {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    res.status(500).json({
      error: err.message
    });

  } finally {

    client.release();

  }

};


/* ===============================
   HR: UPDATE EMPLOYEE
================================= */

exports.updateEmployee = async (req, res) => {

  try {

    const employeeId = req.params.id;

    const {
      department,
      designation,
      base_salary,
      manager_id
    } = req.body;

    // Convert empty string to null to support 'No Manager' removal
    const parsedManagerId = manager_id === "" ? null : manager_id;
    // IF manager_id wasn't provided at all (undefined), we don't want to overwrite with null.
    // But our frontend always sends all fields. We'll handle both.
    const isManagerIdProvided = manager_id !== undefined;

    const result = await pool.query(
      `
      UPDATE employees
      SET 
        department = COALESCE($1, department),
        designation = COALESCE($2, designation),
        base_salary = COALESCE($3, base_salary),
        manager_id = CASE WHEN $6::boolean THEN $4::int ELSE manager_id END
      WHERE id = $5
      RETURNING *
      `,
      [
        department,
        designation,
        base_salary,
        parsedManagerId,
        employeeId,
        isManagerIdProvided
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    res.json({
      message: "Employee updated successfully",
      employee: result.rows[0]
    });

  } catch (err) {

    console.error("UPDATE EMPLOYEE ERROR:", err);

    res.status(500).json({
      error: err.message
    });

  }

};


/* ===============================
   HR: DEACTIVATE EMPLOYEE
================================= */

exports.deactivateEmployee = async (req, res) => {

  try {

    const employeeId = req.params.id;

    const result = await pool.query(
      `
      UPDATE employees
      SET status = 'inactive'
      WHERE id = $1
      RETURNING *
      `,
      [employeeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    res.json({
      message: "Employee deactivated successfully"
    });

  } catch (err) {

    console.error("DEACTIVATE EMPLOYEE ERROR:", err);

    res.status(500).json({
      error: err.message
    });

  }

};


/* ===============================
   HR: GET ALL MANAGERS
================================= */

exports.getManagers = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        e.id,
        u.id AS user_id,
        u.name,
        u.email,
        e.department,
        (SELECT COUNT(*) FROM employees emp WHERE emp.manager_id = e.id) as team_size
      FROM users u
      JOIN employees e ON u.id = e.user_id
      WHERE u.role_id = 2
      ORDER BY u.name ASC
      `
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET MANAGERS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


/* ===============================
   HR: GET EMPLOYEES BY MANAGER
================================= */

exports.getEmployeesByManager = async (req, res) => {
  try {
    const { managerId } = req.params;
    const result = await pool.query(
      `
      SELECT 
        e.id,
        u.id AS user_id,
        u.name,
        u.email,
        r.name AS role_name,
        e.department,
        e.designation,
        e.base_salary
      FROM users u
      JOIN employees e ON u.id = e.user_id
      JOIN roles r ON u.role_id = r.id
      WHERE e.manager_id = $1
      ORDER BY u.name ASC
      `,
      [managerId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET EMPLOYEES BY MANAGER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};