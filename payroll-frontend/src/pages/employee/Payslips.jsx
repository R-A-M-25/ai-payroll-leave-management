import { useEffect, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { FileText, IndianRupee, FileCheck, Calendar as CalendarIcon } from "lucide-react";

export default function Payslips() {
  const { token } = useAuth();
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayslips();
  }, []);

  const fetchPayslips = async () => {
    try {
      const res = await api.get("/payroll/payslips");
      setPayslips(res.data);
    } catch (err) {
      console.log("Payslip Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatMonth = (month, year) => {
    const date = new Date(year, month - 1);
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] w-full">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="glass-panel p-8 bg-gradient-to-br from-emerald-600/90 to-teal-700/90 text-white relative overflow-hidden border-none shadow-xl shadow-emerald-500/20 shrink-0">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            My Payslips
          </h1>
          <p className="text-emerald-100 max-w-2xl text-lg opacity-90">
            Access and download your historical monthly salary slips.
          </p>
        </div>
      </div>

      <div className="glass-panel p-0 overflow-hidden flex flex-col animate-slide-up flex-1">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <FileText size={20} />
            </div>
            Payslip History
          </h2>
          <div className="text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-lg">
            {payslips.length} Records
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {payslips.length === 0 ? (
            <div className="p-16 text-center text-slate-400 flex flex-col items-center">
              <FileCheck size={48} className="mb-4 opacity-20" />
              <p className="font-medium text-slate-500">No payslips available yet.</p>
              <p className="text-sm mt-1">Your generated payslips will appear here.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Period</th>
                  <th className="px-6 py-4">Base Salary</th>
                  <th className="px-6 py-4">LOP Information</th>
                  <th className="px-6 py-4">Deduction</th>
                  <th className="px-6 py-4 text-right">Net Salary</th>
                  <th className="px-6 py-4 text-center">Generated On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {payslips.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                        <CalendarIcon size={16} className="text-slate-400" />
                        {formatMonth(p.month, p.year)}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">₹{p.base_salary?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      {p.lop_days > 0 ? (
                        <span className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-md text-xs font-bold border border-orange-200">{p.lop_days} Days LOP</span>
                      ) : (
                        <span className="text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded-md text-xs border border-slate-200">0 Days</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-red-600">
                      {p.lop_deduction > 0 ? `- ₹${p.lop_deduction?.toLocaleString()}` : '₹0'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1 font-bold text-emerald-600 text-base">
                        <IndianRupee size={16} />
                        {p.net_salary?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-500 font-medium">
                      {new Date(p.generated_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}