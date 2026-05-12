const express = require("express");
const router = express.Router();

const { verifyToken, allowRoles } = require("../middleware/auth.middleware");
const leaveController = require("../controllers/leave.controller");

/* ===============================
   EMPLOYEE LEAVE ROUTES
================================= */

// Apply Leave
router.post(
  "/apply",
  verifyToken,
  allowRoles("EMPLOYEE"),
  leaveController.applyLeave
);

// Employee Leave History
router.get(
  "/my",
  verifyToken,
  allowRoles("EMPLOYEE"),
  leaveController.getMyLeaves
);

// Leave Balance
router.get(
  "/balance",
  verifyToken,
  allowRoles("EMPLOYEE"),
  leaveController.getLeaveBalance
);

/* ===============================
   MANAGER / HR LEAVE ROUTES
================================= */

// Manager or HR view pending leaves
router.get(
  "/manager",
  verifyToken,
  allowRoles("MANAGER","HR"),
  leaveController.getManagerLeaves
);

// Manager / HR approve or reject leave
router.put(
  "/:leaveId/status",
  verifyToken,
  allowRoles("MANAGER","HR"),
  leaveController.updateLeaveStatus
);

module.exports = router;