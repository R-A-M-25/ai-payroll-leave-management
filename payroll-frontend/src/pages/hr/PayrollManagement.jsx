import { useState, useEffect } from "react";
import api from "../../api/api";

const PayrollManagement = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);

  const fetchPayrollHistory = async () => {
    try {
      const res = await api.get("/payroll/all");
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch payroll history", err);
    }
  };

  useEffect(() => {
    fetchPayrollHistory();
  }, []);

  const runPayroll = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.post("/payroll/run", {
        month: Number(month),
        year: Number(year),
      });

      setMessage(res.data.message);
      fetchPayrollHistory();
    } catch (err) {
      setMessage(err.response?.data?.message || "Payroll failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>HR Payroll Management</h2>

      {message && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          {message}
        </p>
      )}

      <form onSubmit={runPayroll}>
        <label>Month:</label>
        <input
          type="number"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          required
        />

        <br /><br />

        <label>Year:</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">Run Payroll</button>
      </form>

      <hr />

      <h3>Payroll History</h3>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Month</th>
            <th>Year</th>
            <th>Base</th>
            <th>LOP Days</th>
            <th>Deduction</th>
            <th>Net</th>
          </tr>
        </thead>
        <tbody>
          {history.map((p) => (
            <tr key={p.id}>
              <td>{p.employee_id}</td>
              <td>{p.month}</td>
              <td>{p.year}</td>
              <td>{p.base_salary}</td>
              <td>{p.lop_days}</td>
              <td>{p.lop_deduction}</td>
              <td>{p.net_salary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollManagement;
