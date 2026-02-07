const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { verifyToken, allowRoles } = require("../middleware/auth.middleware");

// Login route
router.post("/login", authController.login);

// Protected test route (JWT + role check)
router.get(
  "/protected",
  verifyToken,
  allowRoles("HR"),
  (req, res) => {
    res.json({
      message: "Protected route accessed",
      user: req.user,
    });
  }
);

// Simple test route (optional)
router.get("/test", (req, res) => {
  res.json({ message: "Auth route working" });
});

module.exports = router;
