const Payroll = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Payroll Processing</h2>

      <label>Select Month:</label>
      <input type="month" />

      <div style={{ marginTop: "10px" }}>
        <button disabled>Generate Payroll</button>
      </div>
    </div>
  );
};

export default Payroll;
