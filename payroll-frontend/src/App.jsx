import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";

import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import ApplyLeave from "./pages/employee/ApplyLeave";
import Payslips from "./pages/employee/Payslips";

import ManagerDashboard from "./pages/manager/ManagerDashboard";
import LeaveRequests from "./pages/manager/LeaveRequests";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Employees from "./pages/admin/Employees";
import Payroll from "./pages/admin/Payroll";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Employee */}
        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/apply-leave"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <ApplyLeave />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/payslips"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <Payslips />
            </ProtectedRoute>
          }
        />

        {/* Manager */}
        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/leave-requests"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <LeaveRequests />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["HR"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employees"
          element={
            <ProtectedRoute allowedRoles={["HR"]}>
              <Employees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payroll"
          element={
            <ProtectedRoute allowedRoles={["HR"]}>
              <Payroll />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
