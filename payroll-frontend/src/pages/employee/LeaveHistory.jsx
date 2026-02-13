import { useEffect, useState } from "react";
import api from "../../api/api";

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      const res = await api.get("/leaves/my");
      setLeaves(res.data);
    };
    fetchLeaves();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Leave History</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Type</th>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((l) => (
            <tr key={l.id}>
              <td>{l.leave_type}</td>
              <td>{l.start_date}</td>
              <td>{l.end_date}</td>
              <td>{l.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveHistory;
