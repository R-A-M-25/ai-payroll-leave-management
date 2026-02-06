const Payslips = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Payslips</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Month</th>
            <th>Net Salary</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Jan 2026</td>
            <td>₹45,000</td>
            <td>Generated</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Payslips;
