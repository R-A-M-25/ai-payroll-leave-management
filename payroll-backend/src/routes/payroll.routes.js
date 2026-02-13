const express = require("express");
const router = express.Router();

const { verifyToken, allowRoles } = require("../middleware/auth.middleware");
const payrollController = require("../controllers/payroll.controller");

// HR assigns salary
router.post(
  "/salary",
  verifyToken,
  allowRoles("HR"),
  payrollController.assignSalary
);

module.exports = router;

// HR runs payroll
router.post(
  "/run",
  verifyToken,
  allowRoles("HR"),
  payrollController.runPayroll
);

// Employee views own payslips
router.get(
  "/payslips",
  verifyToken,
  allowRoles("EMPLOYEE"),
  payrollController.getMyPayslips
);
