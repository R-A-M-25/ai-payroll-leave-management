
// // import { Routes, Route } from "react-router-dom";
// // import ProtectedRoute from "./routes/ProtectedRoute";
// // import PayslipDetail from "./pages/employee/PayslipDetail";
// // import Login from "./pages/Login";

// // // import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
// // import EmployeeOverview from "./pages/employee/EmployeeOverview";
// // import EmployeeAnalytics from "./pages/employee/EmployeeAnalytics";
// // import LeaveHistory from "./pages/employee/LeaveHistory";
// // import Payslips from "./pages/employee/Payslips";
// // import ApplyLeave from "./pages/employee/ApplyLeave";
// // import LeaveHistory from "./pages/employee/LeaveHistory";
// // import LeaveRequests from "./pages/manager/LeaveRequests";
// // import PayrollManagement from "./pages/hr/PayrollManagement";
// // import DashboardLayout from "./components/layout/DashboardLayout";


// // // import ManagerDashboard from "./pages/manager/ManagerDashboard";
// // // import HRDashboard from "./pages/hr/HRDashboard";
// // const ManagerDashboard = () => <h2>Manager Dashboard (Coming Soon)</h2>;
// // const HRDashboard = () => <h2>HR Dashboard (Coming Soon)</h2>;

// // function App() {
// //   return (
// //     <Routes>
// //       <Route path="/" element={<Login />} />

// //       <Route
// //   path="/employee"
// //   element={
// //     <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
// //       <DashboardLayout />
// //     </ProtectedRoute>
// //   }
// // >
// //   <Route index element={<EmployeeOverview />} />
// //   <Route path="analytics" element={<EmployeeAnalytics />} />
// //   <Route path="leaves" element={<LeaveHistory />} />
// //   <Route path="payslips" element={<Payslips />} />
// // </Route>

// //       <Route
// //         path="/manager"
// //         element={
// //           <ProtectedRoute allowedRoles={["MANAGER"]}>
// //             <ManagerDashboard />
// //           </ProtectedRoute>
// //         }
// //       />

// //       {/* <Route
// //         path="/hr"
// //         element={
// //           <ProtectedRoute allowedRoles={["HR"]}>
// //             <HRDashboard />
// //           </ProtectedRoute>
// //         }
// //       /> */}

// //       <Route
// //   path="/employee/payslip/:id"
// //   element={
// //     <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
// //       <PayslipDetail />
// //     </ProtectedRoute>
// //   }
// // /> <Route
// //   path="/employee/apply-leave"
// //   element={
// //     <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
// //       <ApplyLeave />
// //     </ProtectedRoute>
// //   }
// // />

// // <Route
// //   path="/employee/leaves"
// //   element={
// //     <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
// //       <LeaveHistory />
// //     </ProtectedRoute>
// //   }
// // />
// // <Route
// //   path="/manager/leaves"
// //   element={
// //     <ProtectedRoute allowedRoles={["MANAGER"]}>
// //       <LeaveRequests />
// //     </ProtectedRoute>
// //   }
// // />

// // {/* <Route
// //   path="/hr/payroll"
// //   element={
// //     <ProtectedRoute allowedRoles={["HR"]}>
// //       <PayrollManagement />
// //     </ProtectedRoute>
// //   }
// // /> */}

// // <Route
// //   path="/hr"
// //   element={
// //     <ProtectedRoute allowedRoles={["HR"]}>
// //       <DashboardLayout />
// //     </ProtectedRoute>
// //   }
// // >
// //   <Route index element={<HRDashboard />} />
// //   <Route path="payroll" element={<PayrollManagement />} />
// // </Route>


// // </Routes>
// // );
// // }

// // export default App;



// import { Routes, Route } from "react-router-dom";
// import ProtectedRoute from "./routes/ProtectedRoute";
// import Login from "./pages/Login";

// import EmployeeOverview from "./pages/employee/EmployeeOverview";
// import EmployeeAnalytics from "./pages/employee/EmployeeAnalytics";
// import LeaveHistory from "./pages/employee/LeaveHistory";
// import Payslips from "./pages/employee/Payslips";
// import ApplyLeave from "./pages/employee/ApplyLeave";
// import PayslipDetail from "./pages/employee/PayslipDetail";
// import EmployeeProfile from "./pages/employee/EmployeeProfile";


// import ManagerOverview from "./pages/manager/ManagerOverview";
// import PayrollManagement from "./pages/hr/PayrollManagement";
// import ManagerLeaves from "./pages/manager/ManagerLeaves";
// import TeamMembers from "./pages/manager/TeamMembers";  
// import ManagerLayout from "./layouts/ManagerLayout";
// import ManagerTeam from "./pages/manager/ManagerTeam";

// import DashboardLayout from "./components/layout/DashboardLayout";

// const ManagerDashboard = () => <h2>Manager Dashboard (Coming Soon)</h2>;
// const HRDashboard = () => <h2>HR Dashboard (Coming Soon)</h2>;

// function App() {
//   return (
//     <Routes>

//       <Route path="/" element={<Login />} />

//       {/* EMPLOYEE WORKSPACE */}
//       <Route
//         path="/employee"
//         element={
//           <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
//             <DashboardLayout />
//           </ProtectedRoute>
//         }
//       >
//         {/* <Route index element={<EmployeeOverview />} />
//         <Route path="profile" element={<EmployeeProfile />} />
//         <Route path="analytics" element={<EmployeeAnalytics />} />
//         <Route path="leaves" element={<LeaveHistory />} />
//         <Route path="payslips" element={<Payslips />} />
//         <Route path="apply-leave" element={<ApplyLeave />} />
//         <Route path="payslip/:id" element={<PayslipDetail />} />
//         <Route path="profile" element={<EmployeeProfile />} /> */}
//         <Route index element={<EmployeeOverview />} />
//   <Route path="analytics" element={<EmployeeAnalytics />} />
//   <Route path="leaves" element={<LeaveHistory />} />
//   <Route path="payslips" element={<Payslips />} />
//   <Route path="profile" element={<EmployeeProfile />} />
//   <Route path="apply-leave" element={<ApplyLeave />} />

   
//       </Route>

//       {/* MANAGER */}
//       <Route
//         path="/manager"
//         element={
//           <ProtectedRoute allowedRoles={["MANAGER"]}>
//             <ManagerOverview />
//             <ManagerDashboard />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/manager/leaves"
//         element={
//           <ProtectedRoute allowedRoles={["MANAGER"]}>
//             {/* <LeaveRequests /> */}
//             <ManagerLeaves />
//           </ProtectedRoute>
//         }
//       />
//       <Route path="/manager/team" element={<TeamMembers/>}/>
      

//       {/* HR WORKSPACE */}
//       <Route
//         path="/hr"
//         element={
//           <ProtectedRoute allowedRoles={["HR"]}>
//             <DashboardLayout />
//           </ProtectedRoute>
//         }
//       >
//         <Route index element={<HRDashboard />} />
//         <Route path="payroll" element={<PayrollManagement />} />
//       </Route>

//     </Routes>
//   );
// }

// export default App;


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
import PayrollManagement from "./pages/hr/PayrollManagement";

/* Layout */
import DashboardLayout from "./components/layout/DashboardLayout";

const HRDashboard = () => <h2>HR Dashboard</h2>;

function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />

      {/* EMPLOYEE */}
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


      {/* MANAGER */}
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
      </Route>


      {/* HR */}
      <Route
        path="/hr"
        element={
          <ProtectedRoute allowedRoles={["HR"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HRDashboard />} />
        <Route path="payroll" element={<PayrollManagement />} />
      </Route>

    </Routes>
  );
}

export default App;