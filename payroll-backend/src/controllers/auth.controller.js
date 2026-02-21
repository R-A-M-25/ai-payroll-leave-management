const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 2. Find user
   const userResult = await pool.query(
  `SELECT 
      users.id,
      users.name,
      users.email,
      users.department,
      users.doj,
      users.password_hash,
      roles.name AS role
   FROM users
   JOIN roles ON users.role_id = roles.id
   WHERE users.email = $1`,
  [email]
);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = userResult.rows[0];

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4. Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 5. Respond
    res.json({
  token,
  role: user.role,
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    department: user.department,
    doj: user.doj,
    role: user.role
  }
});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
