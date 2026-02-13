import { useEffect, useState } from "react";
import api from "../../api/api";

const LeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");


  const fetchRequests = async () => {
    try {
      const res = await api.get("/leaves/manager");
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch leave requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
  try {
    const res = await api.put(`/leaves/${id}/status`, {
      status: action === "approve" ? "APPROVED" : "REJECTED",
    });

    setMessage(res.data.message);
    fetchRequests();
  } catch (err) {
    setMessage(err.response?.data?.message || "Action failed");
  }
};



  if (loading) return <p>Loading requests...</p>;
{message && (
  <p style={{ color: "green", fontWeight: "bold" }}>
    {message}
  </p>
)}

  return (
    <div style={{ padding: "20px" }}>
      <h2>Pending Leave Requests</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Type</th>
            <th>From</th>
            <th>To</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan="5">No pending requests</td>
            </tr>
          ) : (
            requests.map((r) => (
              <tr key={r.id}>
                <td>{r.employee_email}</td>
                <td>{r.leave_type}</td>
                <td>{new Date(r.start_date).toLocaleDateString()}</td>
                <td>{new Date(r.end_date).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleAction(r.id, "approve")}>
                    Approve
                  </button>
                  &nbsp;
                  <button onClick={() => handleAction(r.id, "reject")}>
                    Reject
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveRequests;
