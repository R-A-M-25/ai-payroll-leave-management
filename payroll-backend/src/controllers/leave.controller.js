const pool = require("../config/db");

/* ===============================
   APPLY LEAVE (EMPLOYEE)
================================= */
exports.applyLeave = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { start_date, end_date, leave_type, reason } = req.body;

    /* ---------- 1. Validation ---------- */
    if (!start_date || !end_date || !leave_type || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (reason.trim().length < 5) {
      return res.status(400).json({
        message: "Reason must be at least 5 characters long"
      });
    }

    const start = new Date(start_date);
    const end = new Date(end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start > end) {
      return res.status(400).json({
        message: "End date cannot be before start date"
      });
    }

    if (start < today) {
      return res.status(400).json({
        message: "Cannot apply leave in the past"
      });
    }

    /* ---------- 2. Get Employee Record ---------- */
    const employeeResult = await pool.query(
      "SELECT id, manager_id FROM employees WHERE user_id = $1",
      [userId]
    );

    if (employeeResult.rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const { id: employeeId, manager_id: managerId } =
      employeeResult.rows[0];

    if (!managerId) {
      return res.status(400).json({
        message: "Manager not assigned"
      });
    }

    /* ---------- 3. Prevent Overlapping Leave ---------- */
    const overlapCheck = await pool.query(
      `
      SELECT 1 FROM leaves
      WHERE employee_id = $1
      AND status IN ('PENDING', 'APPROVED')
      AND (
        start_date <= $3 AND end_date >= $2
      )
      `,
      [employeeId, start_date, end_date]
    );

    if (overlapCheck.rows.length > 0) {
      return res.status(400).json({
        message: "You already have a leave request during this period"
      });
    }

    // Check leave balance (CL and SL only)
if (leave_type !== "LOP") {
  const balanceResult = await pool.query(
    `
    SELECT SUM(end_date - start_date + 1) AS total_days
    FROM leaves
    WHERE employee_id = $1
    AND leave_type = $2
    AND status IN ('APPROVED', 'PENDING')
    AND EXTRACT(YEAR FROM start_date) = EXTRACT(YEAR FROM CURRENT_DATE)
    `,
    [employeeId, leave_type]
  );

  const used = balanceResult.rows[0].total_days
    ? parseInt(balanceResult.rows[0].total_days)
    : 0;

  const quota = leave_type === "CL" ? 12 : 8;

  const requestedDays =
    (new Date(end_date) - new Date(start_date)) /
      (1000 * 60 * 60 * 24) + 1;

  if (used + requestedDays > quota) {
    return res.status(400).json({
      message: `${leave_type} balance insufficient. Apply LOP instead.`
    });
  }
}

    /* ---------- 4. Calculate Days (Optional Future Use) ---------- */
    const totalDays =
      (end - start) / (1000 * 60 * 60 * 24) + 1;

    /* ---------- 5. Insert Leave ---------- */
    await pool.query(
      `
      INSERT INTO leaves
      (employee_id, manager_id, start_date, end_date, leave_type, reason)
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        employeeId,
        managerId,
        start_date,
        end_date,
        leave_type,
        reason.trim()
      ]
    );

    res.status(201).json({
      message: "Leave applied successfully",
      totalDays
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET EMPLOYEE'S LEAVES
================================= */
exports.getMyLeaves = async (req, res) => {
  try {
    const userId = req.user.userId;

    const employeeResult = await pool.query(
      "SELECT id FROM employees WHERE user_id = $1",
      [userId]
    );

    if (employeeResult.rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const employeeId = employeeResult.rows[0].id;

    const leavesResult = await pool.query(
  `
  SELECT 
    l.id,
    l.start_date,
    l.end_date,
    l.leave_type,
    l.reason,
    l.status,
    l.applied_at,
    l.reviewed_at,
    m_user.name AS manager_name
  FROM leaves l
  JOIN employees e ON l.employee_id = e.id
  LEFT JOIN employees m ON l.manager_id = m.id
  LEFT JOIN users m_user ON m.user_id = m_user.id
  WHERE l.employee_id = $1
  ORDER BY l.applied_at DESC
  `,
  [employeeId]
);

    res.json(leavesResult.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET MANAGER LEAVES
================================= */
exports.getManagerLeaves = async (req, res) => {
  try {
    const userId = req.user.userId;

    const managerResult = await pool.query(
      "SELECT id FROM employees WHERE user_id = $1",
      [userId]
    );

    if (managerResult.rows.length === 0) {
      return res.status(404).json({ message: "Manager not found" });
    }

    const managerId = managerResult.rows[0].id;

    const leavesResult = await pool.query(
      `
      SELECT 
        l.id,
        u.email AS employee_email,
        l.start_date,
        l.end_date,
        l.leave_type,
        l.reason,
        l.status,
        l.applied_at
      FROM leaves l
      JOIN employees e ON l.employee_id = e.id
      JOIN users u ON e.user_id = u.id
      WHERE l.manager_id = $1
      ORDER BY l.applied_at DESC
      `,
      [managerId]
    );

    res.json(leavesResult.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   UPDATE LEAVE STATUS (MANAGER)
================================= */
exports.updateLeaveStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { leaveId } = req.params;
    const { status } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const managerResult = await pool.query(
      "SELECT id FROM employees WHERE user_id = $1",
      [userId]
    );

    if (managerResult.rows.length === 0) {
      return res.status(404).json({ message: "Manager not found" });
    }

    const managerId = managerResult.rows[0].id;

    const leaveResult = await pool.query(
      "SELECT status FROM leaves WHERE id = $1 AND manager_id = $2",
      [leaveId, managerId]
    );

    if (leaveResult.rows.length === 0) {
      return res.status(404).json({
        message: "Leave not found or access denied"
      });
    }

    if (leaveResult.rows[0].status !== "PENDING") {
      return res.status(400).json({
        message: "Leave already processed"
      });
    }

    await pool.query(
      `
      UPDATE leaves
      SET status = $1,
          reviewed_at = CURRENT_TIMESTAMP
      WHERE id = $2
      `,
      [status, leaveId]
    );

    res.json({
      message: `Leave ${status.toLowerCase()} successfully`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET PENDING LEAVES (MANAGER)
================================= */
exports.getPendingLeaves = async (req, res) => {
  try {
    const userId = req.user.userId;

    const managerResult = await pool.query(
      "SELECT id FROM employees WHERE user_id = $1",
      [userId]
    );

    if (managerResult.rows.length === 0) {
      return res.status(404).json({ message: "Manager not found" });
    }

    const managerEmployeeId = managerResult.rows[0].id;

    const result = await pool.query(
      `
      SELECT 
        l.id,
        l.leave_type,
        l.start_date,
        l.end_date,
        u.email AS employee_email
      FROM leaves l
      JOIN employees e ON l.employee_id = e.id
      JOIN users u ON e.user_id = u.id
      WHERE l.status = 'PENDING'
      AND e.manager_id = $1
      ORDER BY l.applied_at DESC
      `,
      [managerEmployeeId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getLeaveBalance = async (req, res) => {
  try {
    const userId = req.user.userId;

    const employeeResult = await pool.query(
      "SELECT id FROM employees WHERE user_id = $1",
      [userId]
    );

    if (employeeResult.rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const employeeId = employeeResult.rows[0].id;

    const year = new Date().getFullYear();

    const result = await pool.query(
      `
      SELECT leave_type,
             SUM(end_date - start_date + 1) AS total_days
      FROM leaves
      WHERE employee_id = $1
      AND status IN ('APPROVED', 'PENDING')
      AND EXTRACT(YEAR FROM start_date) = $2
      GROUP BY leave_type
      `,
      [employeeId, year]
    );

    const used = {
      CL: 0,
      SL: 0,
      LOP: 0
    };

    result.rows.forEach(row => {
      used[row.leave_type] = parseInt(row.total_days);
    });

    const balance = {
      CL: 12 - used.CL,
      SL: 8 - used.SL,
      LOP: "Unlimited"
    };

    res.json({
      year,
      used,
      balance
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};