import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";

const PayslipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayslip = async () => {
      try {
        const res = await api.get("/payroll/payslips");
        const found = res.data.find((p) => p.id === Number(id));
        setPayslip(found);
      } catch (err) {
        console.error("Failed to fetch payslip", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayslip();
  }, [id]);

  if (loading) return <p>Loading payslip...</p>;
  if (!payslip) return <p>Payslip not found</p>;

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)}>⬅ Back</button>

      <h2>Payslip Detail</h2>
      <p>
        <strong>Month:</strong> {payslip.month}/{payslip.year}
      </p>

      <hr />

      <p><strong>Base Salary:</strong> ₹{payslip.base_salary}</p>
      <p><strong>LOP Days:</strong> {payslip.lop_days}</p>
      <p style={{ color: "red" }}>
        <strong>LOP Deduction:</strong> ₹{payslip.lop_deduction}
      </p>
      <p style={{ color: "green" }}>
        <strong>Net Salary:</strong> ₹{payslip.net_salary}
      </p>
    </div>
  );
};

export default PayslipDetail;
