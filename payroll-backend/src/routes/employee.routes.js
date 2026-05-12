const express = require("express");
const router = express.Router();

const employeeController = require("../controllers/employee.controller");
const managerController = require("../controllers/manager.controller");
const hrController = require("../controllers/hr.controller");

const { verifyToken, allowRoles } =
require("../middleware/auth.middleware");


/* ===============================
   EMPLOYEE ROUTES
================================= */

// Get employee profile
router.get(
  "/profile",
  verifyToken,
  employeeController.getProfile
);

// Update employee profile
router.put(
  "/profile",
  verifyToken,
  employeeController.updateProfile
);

// Change employee password
router.put(
  "/password",
  verifyToken,
  employeeController.changePassword
);


/* ===============================
   MANAGER ROUTES
================================= */

// Manager view team members
router.get(
  "/team",
  verifyToken,
  allowRoles("MANAGER"),
  managerController.getTeam
);


/* ===============================
   HR ROUTES
================================= */

// Get all employees
router.get(
  "/all",
  verifyToken,
  allowRoles("HR"),
  hrController.getAllEmployees
);

// Create employee
router.post(
  "/create",
  verifyToken,
  allowRoles("HR"),
  hrController.createEmployee
);

// Update employee
router.put(
  "/update/:id",
  verifyToken,
  allowRoles("HR"),
  hrController.updateEmployee
);

// Deactivate employee
router.patch(
  "/deactivate/:id",
  verifyToken,
  allowRoles("HR"),
  hrController.deactivateEmployee
);

// Get all managers
router.get(
  "/managers",
  verifyToken,
  allowRoles("HR"),
  hrController.getManagers
);

// Get employees by manager
router.get(
  "/manager/:managerId/team",
  verifyToken,
  allowRoles("HR"),
  hrController.getEmployeesByManager
);

module.exports = router;