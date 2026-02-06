import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      style={{
        width: "220px",
        background: "#1976d2",
        color: "#fff",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      <h3>Payroll System</h3>

      {/* EMPLOYEE */}
      {role === "EMPLOYEE" && (
        <>
          <Link to="/employee/dashboard">Dashboard</Link><br />
          <Link to="/employee/apply-leave">Apply Leave</Link><br />
          <Link to="/employee/payslips">Payslips</Link>
        </>
      )}

      {/* MANAGER */}
      {role === "MANAGER" && (
        <>
          <Link to="/manager/dashboard">Dashboard</Link><br />
          <Link to="/manager/leave-requests">Leave Requests</Link>
        </>
      )}

      {/* HR */}
      {role === "HR" && (
        <>
          <Link to="/admin/dashboard">Dashboard</Link><br />
          <Link to="/admin/employees">Employees</Link><br />
          <Link to="/admin/payroll">Payroll</Link>
        </>
      )}

      <hr />

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Sidebar;
