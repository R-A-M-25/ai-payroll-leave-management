const pool = require("../config/db");

// 1. Get all notifications for the logged in user
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await pool.query(
      "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// 2. Mark a specific notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    await pool.query(
      "UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2",
      [id, userId]
    );
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error("Error marking notification:", err);
    res.status(500).json({ message: "Failed to update notification" });
  }
};

// 3. Mark all notifications as read for user
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    await pool.query(
      "UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false",
      [userId]
    );
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("Error marking all notifications:", err);
    res.status(500).json({ message: "Failed to update notifications" });
  }
};

// 4. Create a system notification (Utility function, not usually a direct exposed endpoint but good for internal use)
exports.createNotification = async (userId, title, message, type = 'info') => {
  try {
    await pool.query(
      "INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)",
      [userId, title, message, type]
    );
  } catch (err) {
    console.error("Silent Error: Failed to create system notification:", err);
  }
};
