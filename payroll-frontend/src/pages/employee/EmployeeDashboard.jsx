import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const EmployeeDashboard = () => {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchPayslips = async () => {
      try {
        const res = await api.get("/payroll/payslips");
        setPayslips(res.data);
      } catch (err) {
        console.error("Failed to fetch payslips", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayslips();
  }, []);

  if (loading) return <p>Loading...</p>;

  const latest = payslips[0];

  return (
  <div style={styles.container}>
    <h2>Employee Dashboard</h2>

    {latest && (
      <>
        {/* Salary Cards */}
        <div style={styles.cardRow}>
          <div style={styles.card}>
            <h4>Base Salary</h4>
            <p>₹{latest.base_salary}</p>
          </div>

          <div style={styles.card}>
            <h4>LOP Deduction</h4>
            <p style={{ color: "red" }}>
              - ₹{latest.lop_deduction}
            </p>
          </div>

          <div style={styles.card}>
            <h4>Net Salary</h4>
            <p style={{ color: "green" }}>
              ₹{latest.net_salary}
            </p>
          </div>
        </div>

        {/* Salary Visualization */}
        <div style={styles.chartBox}>
          <h3>Salary Breakdown</h3>

          <div style={styles.bar}>
            <span>Base</span>
            <div
              style={{
                ...styles.barFill,
                width: "100%",
                background: "#4caf50",
              }}
            >
              ₹{latest.base_salary}
            </div>
          </div>

          <div style={styles.bar}>
            <span>Deduction</span>
            <div
              style={{
                ...styles.barFill,
                width: `${(latest.lop_deduction / latest.base_salary) * 100}%`,
                background: "#f44336",
              }}
            >
              ₹{latest.lop_deduction}
            </div>
          </div>

          <div style={styles.bar}>
            <span>Net</span>
            <div
              style={{
                ...styles.barFill,
                width: `${(latest.net_salary / latest.base_salary) * 100}%`,
                background: "#2196f3",
              }}
            >
              ₹{latest.net_salary}
            </div>
          </div>
        </div>
      </>
    )}

    {/* Payslip History */}
    <h3>Payslip History</h3>
    <table border="1" cellPadding="8">
      <thead>
        <tr>
          <th>Month</th>
          <th>Year</th>
          <th>Base</th>
          <th>LOP Days</th>
          <th>Net</th>
        </tr>
      </thead>
      <tbody>
        {payslips.map((p) => (
          <tr
  key={p.id}
  style={{ cursor: "pointer", background: "#fff" }}
  onMouseOver={(e) => (e.currentTarget.style.background = "#f5f5f5")}
  onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
  onClick={() => navigate(`/employee/payslip/${p.id}`)}
>


            <td>{p.month}</td>
            <td>{p.year}</td>
            <td>₹{p.base_salary}</td>
            <td>{p.lop_days}</td>
            <td>₹{p.net_salary}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

};

const styles = {
  container: {
    padding: "20px",
  },
  cardRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  },
  card: {
    border: "1px solid #ccc",
    padding: "15px",
    width: "200px",
    borderRadius: "6px",
    background: "#fafafa",
  },
  chartBox: {
    border: "1px solid #ccc",
    padding: "15px",
    marginBottom: "30px",
    width: "500px",
  },
  bar: {
    marginBottom: "10px",
  },
  barFill: {
    color: "white",
    padding: "5px",
    marginTop: "4px",
    borderRadius: "4px",
  },
};


export default EmployeeDashboard;
