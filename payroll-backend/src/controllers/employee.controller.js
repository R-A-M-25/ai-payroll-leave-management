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
        e.created_at,
        u.doj
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

    const { name } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters." });
    }

    await pool.query(
      `
      UPDATE users
      SET name = $1
      WHERE id = $2
      `,
      [name.trim(), userId]
    );

    // Department updating has been intentionally removed from this endpoint.
    // Employees should not be able to change their own role or department.

    const updated = await pool.query(
      `
      SELECT 
        u.name,
        u.email,
        e.department,
        e.designation,
        e.created_at,
        u.doj
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


/* ===============================
   CHANGE PASSWORD
================================= */

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new passwords are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long." });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different from current." });
    }

    // Fetch user
    const userResult = await pool.query("SELECT password_hash FROM users WHERE id = $1", [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password_hash } = userResult.rows[0];

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    // Update in database
    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [newHash, userId]);

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
