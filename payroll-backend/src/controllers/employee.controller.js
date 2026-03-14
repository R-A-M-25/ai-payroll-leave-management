const pool = require("../config/db");
const bcrypt = require("bcrypt");


/* ===============================
   GET PROFILE
================================= */

exports.getProfile = async (req, res) => {

  try {

    const userId = req.user.userId;

    const result = await pool.query(
      `
      SELECT 
        u.name,
        u.email,
        e.department,
        e.designation,
        e.created_at
      FROM users u
      JOIN employees e
      ON u.id = e.user_id
      WHERE u.id = $1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error"
    });

  }

};



/* ===============================
   UPDATE PROFILE
================================= */

exports.updateProfile = async (req, res) => {

  try {

    const userId = req.user.userId;

    const { name, department } = req.body;

    await pool.query(
      `
      UPDATE users
      SET name = $1
      WHERE id = $2
      `,
      [name, userId]
    );

    await pool.query(
      `
      UPDATE employees
      SET department = $1
      WHERE user_id = $2
      `,
      [department, userId]
    );


    const updated = await pool.query(
      `
      SELECT 
        u.name,
        u.email,
        e.department,
        e.designation,
        e.created_at
      FROM users u
      JOIN employees e
      ON u.id = e.user_id
      WHERE u.id = $1
      `,
      [userId]
    );

    res.json(updated.rows[0]);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error"
    });

  }

};






