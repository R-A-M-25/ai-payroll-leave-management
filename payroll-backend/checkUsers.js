const pool = require("./src/config/db");

async function check() {
  try {
    const res = await pool.query("SELECT data_type FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'id'");
    console.log("Users ID type:", res.rows[0].data_type);
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
}
check();
