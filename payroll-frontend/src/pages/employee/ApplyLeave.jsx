import { useState } from "react";
import api from "../../api/api";

const ApplyLeave = () => {
  const [leaveType, setLeaveType] = useState("CL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/leaves/apply", {
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason,
      });

      setMessage("Leave applied successfully");
      setStartDate("");
      setEndDate("");
      setReason("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to apply leave");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h2>Apply Leave</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>Leave Type</label>
        <select
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value)}
        >
          <option value="CL">Casual Leave (CL)</option>
          <option value="SL">Sick Leave (SL)</option>
          <option value="LOP">Loss of Pay (LOP)</option>
        </select>

        <br /><br />

        <label>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />

        <br /><br />

        <label>End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />

        <br /><br />

        <label>Reason</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <br /><br />

        <button type="submit">Apply Leave</button>
      </form>
    </div>
  );
};

export default ApplyLeave;
