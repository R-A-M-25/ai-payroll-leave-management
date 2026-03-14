const pool = require("../config/db");
const bcrypt = require("bcrypt");

/* ===============================
   MANAGER TEAM
================================= */

exports.getTeam = async (req, res) => {

  try {

    const userId = req.user.userId;

    const manager = await pool.query(
      "SELECT id FROM employees WHERE user_id=$1",
      [userId]
    );

    if (manager.rows.length === 0) {
      return res.status(404).json({
        message: "Manager not found"
      });
    }

    const managerId = manager.rows[0].id;

    const result = await pool.query(
      `
      SELECT 
        u.name,
        u.email,
        e.department,
        e.designation,
        e.created_at
      FROM employees e
      JOIN users u
      ON e.user_id = u.id
      WHERE e.manager_id = $1
      ORDER BY u.name
      `,
      [managerId]
    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error"
    });

  }

};
