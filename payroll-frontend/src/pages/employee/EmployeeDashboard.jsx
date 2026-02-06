// import { Link } from "react-router-dom";

// const EmployeeDashboard = () => {
//   return (
//     <div className="container">
//       <h2>Employee Dashboard</h2>

//       <div className="card">
//         <p><strong>Leave Balance:</strong> 10 days</p>
//         <p><strong>Last Salary:</strong> ₹45,000</p>
//       </div>

//       <div className="actions">
//         <Link to="/employee/apply-leave">
//           <button>Apply Leave</button>
//         </Link>

//         <Link to="/employee/payslips">
//           <button className="secondary">View Payslips</button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default EmployeeDashboard;

import Layout from "../../components/Layout";

const EmployeeDashboard = () => {
  return (
    <Layout>
      <h2>Employee Dashboard</h2>
      <p>Leave Balance: 10 days</p>
    </Layout>
  );
};

export default EmployeeDashboard;

