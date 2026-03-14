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

router.get(
"/profile",
verifyToken,
employeeController.getProfile
);

router.put(
"/profile",
verifyToken,
employeeController.updateProfile
);


/* ===============================
   MANAGER ROUTES
================================= */

router.get(
"/team",
verifyToken,
allowRoles("MANAGER"),
managerController.getTeam
);


/* ===============================
   HR ROUTES
================================= */

router.get(
"/all",
verifyToken,
allowRoles("HR"),
hrController.getAllEmployees
);

router.post(
"/create",
verifyToken,
allowRoles("HR"),
hrController.createEmployee
);


module.exports = router;