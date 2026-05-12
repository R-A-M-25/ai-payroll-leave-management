const pool = require("./src/config/db");

async function setupNotificationsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
          id SERIAL PRIMARY KEY,
          user_id INTEGER,
          title VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          type VARCHAR(50) DEFAULT 'info',
          is_read BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Notifications table created successfully.");
  } catch (err) {
    console.error("Error creating notifications table:", err.message);
  } finally {
    process.exit();
  }
}

setupNotificationsTable();
