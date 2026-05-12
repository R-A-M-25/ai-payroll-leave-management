const pool = require("./src/config/db");

async function fixLeavesTable() {
  try {
    await pool.query(`
      ALTER TABLE leaves
      ADD COLUMN IF NOT EXISTS total_days INTEGER DEFAULT 0;
    `);
    console.log("Successfully added total_days column to leaves table.");
  } catch (err) {
    console.error("Error modifying leaves table:", err.message);
  } finally {
    process.exit();
  }
}

fixLeavesTable();
