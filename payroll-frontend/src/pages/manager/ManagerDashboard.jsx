import { Link } from "react-router-dom";

const ManagerDashboard = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Manager Dashboard</h2>

      <p><strong>Pending Leave Requests:</strong> 3</p>

      <Link to="/manager/leave-requests">
        <button>View Leave Requests</button>
      </Link>
    </div>
  );
};

export default ManagerDashboard;
