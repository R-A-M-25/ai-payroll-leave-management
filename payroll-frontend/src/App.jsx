
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import PayslipDetail from "./pages/employee/PayslipDetail";
import Login from "./pages/Login";

import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import ApplyLeave from "./pages/employee/ApplyLeave";
import LeaveHistory from "./pages/employee/LeaveHistory";
import LeaveRequests from "./pages/manager/LeaveRequests";
import PayrollManagement from "./pages/hr/PayrollManagement";


// import ManagerDashboard from "./pages/manager/ManagerDashboard";
// import HRDashboard from "./pages/hr/HRDashboard";
const ManagerDashboard = () => <h2>Manager Dashboard (Coming Soon)</h2>;
const HRDashboard = () => <h2>HR Dashboard (Coming Soon)</h2>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager"
        element={
          <ProtectedRoute allowedRoles={["MANAGER"]}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hr"
        element={
          <ProtectedRoute allowedRoles={["HR"]}>
            <HRDashboard />
          </ProtectedRoute>
        }
      />

      <Route
  path="/employee/payslip/:id"
  element={
    <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
      <PayslipDetail />
    </ProtectedRoute>
  }
/> <Route
  path="/employee/apply-leave"
  element={
    <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
      <ApplyLeave />
    </ProtectedRoute>
  }
/>

<Route
  path="/employee/leaves"
  element={
    <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
      <LeaveHistory />
    </ProtectedRoute>
  }
/>
<Route
  path="/manager/leaves"
  element={
    <ProtectedRoute allowedRoles={["MANAGER"]}>
      <LeaveRequests />
    </ProtectedRoute>
  }
/>

<Route
  path="/hr/payroll"
  element={
    <ProtectedRoute allowedRoles={["HR"]}>
      <PayrollManagement />
    </ProtectedRoute>
  }
/>

</Routes>
);
}

export default App;
