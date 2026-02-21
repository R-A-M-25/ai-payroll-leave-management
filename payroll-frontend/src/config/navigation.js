export const navigationConfig = {
  HR: [
    { name: "Dashboard", path: "/hr" },
    { name: "Payroll", path: "/hr/payroll" },
    { name: "Employees", path: "/hr/employees" }
  ],
  MANAGER: [
    { name: "Dashboard", path: "/manager" },
    { name: "Leave Requests", path: "/manager/leaves" }
  ],
  // EMPLOYEE: [
  //   { name: "Dashboard", path: "/employee" },
  //   { name: "Apply Leave", path: "/employee/apply-leave" },
  //   { name: "Leave History", path: "/employee/leaves" }
  // ]
  EMPLOYEE: [
    { name: "Overview", path: "/employee" },
    { name: "Analytics", path: "/employee/analytics" },
    { name: "Leaves", path: "/employee/leaves" },
    { name: "Payslips", path: "/employee/payslips" },
    { name: "Profile", path: "/employee/profile" },
    { name: "Apply Leave", path: "/employee/apply-leave" },
  ]
};
