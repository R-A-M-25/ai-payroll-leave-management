import { useState } from "react";

const ApplyLeave = () => {
  const [leaveType, setLeaveType] = useState("CL");
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Leave submitted (mock)");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Apply Leave</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Leave Type:</label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
          >
            <option value="CL">Casual Leave</option>
            <option value="SL">Sick Leave</option>
            <option value="LOP">Loss of Pay</option>
          </select>
        </div>

        <div>
          <label>Reason:</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ApplyLeave;
