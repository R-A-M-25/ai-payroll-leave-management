const express = require("express");
const router = express.Router();

const employeeController = require("../controllers/employee.controller");

const {verifyToken,allowRoles}
= require("../middleware/auth.middleware");


/* Profile */

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


/* Manager Team ⭐ */

router.get(
"/team",
verifyToken,
allowRoles("MANAGER"),
employeeController.getTeam
);


module.exports=router;