const express = require("express");
const router = express.Router();

const { verifyToken, allowRoles } = require("../middleware/auth.middleware");
const leaveController = require("../controllers/leave.controller");

// Apply Leave
router.post(
  "/apply",
  verifyToken,
  allowRoles("EMPLOYEE"),
  leaveController.applyLeave
);

// Employee Leave History ⭐
router.get(
  "/my",
  verifyToken,
  allowRoles("EMPLOYEE"),
  leaveController.getMyLeaves
);

// Leave Balance ⭐
router.get(
  "/balance",
  verifyToken,
  allowRoles("EMPLOYEE"),
  leaveController.getLeaveBalance
);

// Manager Leaves
router.get(
  "/manager",
  verifyToken,
  allowRoles("MANAGER","HR"),
  leaveController.getManagerLeaves
);

// Update Status
router.put(
  "/:leaveId/status",
  verifyToken,
  allowRoles("MANAGER","HR"),
  leaveController.updateLeaveStatus
);


module.exports = router;