const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// All notification routes require authentication
router.use(verifyToken);

// GET /api/notifications -> get all user notifications
router.get("/", notificationController.getNotifications);

// PUT /api/notifications/read-all -> mark all as read
router.put("/read-all", notificationController.markAllAsRead);

// PUT /api/notifications/:id/read -> mark specific notification as read
router.put("/:id/read", notificationController.markAsRead);

module.exports = router;
