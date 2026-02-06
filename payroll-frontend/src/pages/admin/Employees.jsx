const Employees = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Employees</h2>

      <button>Add Employee</button>

      <table border="1" cellPadding="8" style={{ marginTop: "10px" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Salary</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ram</td>
            <td>Employee</td>
            <td>₹45,000</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Employees;
