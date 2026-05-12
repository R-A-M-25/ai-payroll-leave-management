import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";

/* Employee */
import EmployeeOverview from "./pages/employee/EmployeeOverview";
import EmployeeAnalytics from "./pages/employee/EmployeeAnalytics";
import LeaveHistory from "./pages/employee/LeaveHistory";
import Payslips from "./pages/employee/Payslips";
import ApplyLeave from "./pages/employee/ApplyLeave";
import EmployeeProfile from "./pages/employee/EmployeeProfile";

/* Manager */
import ManagerOverview from "./pages/manager/ManagerOverview";
import ManagerLeaves from "./pages/manager/ManagerLeaves";
import ManagerTeam from "./pages/manager/ManagerTeam";
import ManagerLayout from "./components/layout/ManagerLayout";

/* HR */
import AdminDashboard from "./pages/hr/AdminDashboard";
import Employees from "./pages/hr/Employees";
import PayrollManagement from "./pages/hr/PayrollManagement";

/* Layout */
import DashboardLayout from "./components/layout/DashboardLayout";

function App() {
  return (
    <Routes>

      {/* LOGIN */}
      <Route path="/" element={<Login />} />



      {/* ================= EMPLOYEE ================= */}

      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<EmployeeOverview />} />
        <Route path="analytics" element={<EmployeeAnalytics />} />
        <Route path="leaves" element={<LeaveHistory />} />
        <Route path="payslips" element={<Payslips />} />
        <Route path="profile" element={<EmployeeProfile />} />
        <Route path="apply-leave" element={<ApplyLeave />} />
      </Route>



      {/* ================= MANAGER ================= */}

      <Route
        path="/manager"
        element={
          <ProtectedRoute allowedRoles={["MANAGER"]}>
            <ManagerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ManagerOverview />} />
        <Route path="team" element={<ManagerTeam />} />
        <Route path="leaves" element={<ManagerLeaves />} />
        <Route path="profile" element={<EmployeeProfile />} />
      </Route>



      {/* ================= HR ================= */}

      <Route
        path="/hr"
        element={
          <ProtectedRoute allowedRoles={["HR"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />

        {/* Organization Hub */}
        <Route path="employees" element={<Employees />} />

        {/* Payroll Center */}
        <Route path="payroll-management" element={<PayrollManagement />} />

        <Route path="profile" element={<EmployeeProfile />} />
      </Route>

    </Routes>
  );
}

export default App;