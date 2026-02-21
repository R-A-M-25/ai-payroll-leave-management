const express = require("express");
const router = express.Router();

const { verifyToken, allowRoles } = require("../middleware/auth.middleware");
const leaveController = require("../controllers/leave.controller");

// Employee applies for leave
router.post(
  "/apply",
  verifyToken,
  allowRoles("EMPLOYEE"),
  leaveController.applyLeave
);

module.exports = router;

// Manager views team leave requests
router.get(
  "/manager",
  verifyToken,
  allowRoles("MANAGER", "HR"),
  leaveController.getManagerLeaves
);

// Manager approves / rejects leave
router.put(
  "/:leaveId/status",
  verifyToken,
  allowRoles("MANAGER", "HR"),
  leaveController.updateLeaveStatus
);

// Employee views own leave history
router.get(
  "/my",
  verifyToken,
  allowRoles("EMPLOYEE"),
  leaveController.getMyLeaves
);

// Employee views leave balance
router.get(
  "/balance",
  verifyToken,
  allowRoles("EMPLOYEE"),
  leaveController.getLeaveBalance
);
