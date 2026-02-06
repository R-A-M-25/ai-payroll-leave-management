import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>HR / Admin Dashboard</h2>

      <p><strong>Total Employees:</strong> 25</p>
      <p><strong>Payroll Status:</strong> Pending</p>

      <Link to="/admin/employees">
        <button>Manage Employees</button>
      </Link>

      <Link to="/admin/payroll" style={{ marginLeft: "10px" }}>
        <button>Process Payroll</button>
      </Link>
    </div>
  );
};

export default AdminDashboard;
