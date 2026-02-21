const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { verifyToken } = require("../middleware/auth.middleware");

// GET profile
router.get("/profile", verifyToken, async (req, res) => {
 try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
      SELECT 
        u.id,
        u.name,
        u.email,
        e.department,
        e.designation,
        e.created_at
      FROM users u
      JOIN employees e ON e.user_id = u.id
      WHERE u.id = $1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
    

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, department } = req.body;

    // ✅ Validate BEFORE DB call
    if (!name || !department) {
      return res.status(400).json({ message: "All fields required" });
    }
    if (!name?.trim() || !department?.trim()) {
  return res.status(400).json({ message: "Invalid input" });
}

    const cleanName = name.trim();
    const cleanDepartment = department.trim();

    const result = await pool.query(
      `UPDATE users
       SET name = $1,
           department = $2
       WHERE id = $3
       RETURNING id, name, email, department, doj`,
      [cleanName, cleanDepartment, userId]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;