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
        u.id,
        u.name,
        u.email,
        r.role_name,
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
  manager_id
} = body;


    /* Validate required fields */

    if (!name || !email || !department) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }


    await client.query("BEGIN");


    /* Default password */

    const salt = await bcrypt.genSalt(10);

    const password_hash = await bcrypt.hash("Welcome@123", salt);


    /* Create user */

    const userRes = await client.query(
      `
      INSERT INTO users (name, email, password_hash, role_id)
      VALUES ($1,$2,$3,2)
      RETURNING id
      `,
      [name, email, password_hash]
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
        manager_id ? Number(manager_id) : null,
        department,
        designation || "Employee",
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