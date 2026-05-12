import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { Receipt, PlayCircle, History, UserCheck, Search, Users, Activity } from "lucide-react";

export default function PayrollManagement() {
  const { token } = useAuth();
  
  const [activeTab, setActiveTab] = useState("run"); // run | assign | history
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  
  // Assign Salary State
  const [assignForm, setAssignForm] = useState({
    employee_id: "",
    monthly_salary: "",
    effective_from: ""
  });

  // Run Payroll State
  const [runForm, setRunForm] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  // History State
  const [payrollHistory, setPayrollHistory] = useState([]);

  useEffect(() => {
    if (activeTab === "assign") {
      fetchEmployees();
    } else if (activeTab === "history") {
      fetchPayrollHistory();
    }
  }, [activeTab]);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employee/all");
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPayrollHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get("/payroll/history");
      setPayrollHistory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignSalary = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/payroll/salary", assignForm);
      alert(res.data.message);
      setAssignForm({ employee_id: "", monthly_salary: "", effective_from: "" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error assigning salary");
    } finally {
      setLoading(false);
    }
  };

  const handleRunPayroll = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/payroll/run", runForm);
      alert(res.data.message);
      setActiveTab("history"); // move to history to show it
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error running payroll");
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('default', { month: 'long' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Hero Section */}
      <div className="glass-panel p-8 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white relative overflow-hidden border-none shadow-2xl shadow-emerald-500/20">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -left-10 bottom-0 w-60 h-60 bg-yellow-400/20 rounded-full blur-[60px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-sm flex items-center gap-4">
              <Receipt size={40} className="text-emerald-100" />
              Payroll Center
            </h1>
            <p className="mt-2 text-emerald-50 max-w-xl text-lg font-medium">
              Assign compensation, automate salary generation, and review all previous payroll execution cycles.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex items-center border-b border-slate-200 mb-6 px-1">
        <button
          onClick={() => setActiveTab("run")}
          className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all border-b-2 ${activeTab === "run" ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          <PlayCircle size={18} />
          Execute Payroll
        </button>
        <button
          onClick={() => setActiveTab("assign")}
          className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all border-b-2 ${activeTab === "assign" ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          <UserCheck size={18} />
          Assign Salary
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all border-b-2 ${activeTab === "history" ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          <History size={18} />
          Payroll History
        </button>
      </div>

      {/* Conditional Content */}
      <div className="glass-panel relative overflow-hidden bg-white animate-slide-up">
        {activeTab === "run" && (
          <div className="p-8 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Activity size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Run Monthly Payroll</h2>
              <p className="text-slate-500 mt-2">Generate payslips for all active employees and apply LOP deductions automatically.</p>
            </div>

            <form onSubmit={handleRunPayroll} className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Target Month</label>
                  <select 
                    value={runForm.month} 
                    onChange={(e) => setRunForm({...runForm, month: parseInt(e.target.value)})}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <option key={m} value={m}>{getMonthName(m)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Target Year</label>
                  <input 
                    type="number" 
                    value={runForm.year} 
                    onChange={(e) => setRunForm({...runForm, year: parseInt(e.target.value)})}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70 disabled:active:scale-100"
              >
                {loading ? (
                   <div className="w-6 h-6 border-2 border-white border-t-transparent flex items-center justify-center rounded-full animate-spin"></div>
                ) : (
                  <><PlayCircle size={22} /> Execute Payroll Cycle</>
                )}
              </button>
            </form>
          </div>
        )}

        {activeTab === "assign" && (
          <div className="p-8 max-w-2xl mx-auto">
             <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <UserCheck size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Assign Compensation</h2>
              <p className="text-slate-500 mt-2">Update an employee's base salary ensuring it takes effect from the specified date forward.</p>
            </div>

            <form onSubmit={handleAssignSalary} className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
               <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Select Employee</label>
                  <select 
                    required
                    value={assignForm.employee_id} 
                    onChange={(e) => setAssignForm({...assignForm, employee_id: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer"
                  >
                    <option value="">-- Select Member --</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.department} • {emp.role_name})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Monthly Salary</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input 
                        type="number" 
                        required
                        placeholder="e.g. 7500"
                        value={assignForm.monthly_salary} 
                        onChange={(e) => setAssignForm({...assignForm, monthly_salary: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Effective From</label>
                    <input 
                      type="date" 
                      required
                      value={assignForm.effective_from} 
                      onChange={(e) => setAssignForm({...assignForm, effective_from: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-200 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
                >
                  {loading ? 'Assigning...' : 'Assign Compensation Package'}
                </button>
            </form>
          </div>
        )}

        {activeTab === "history" && (
           <div className="overflow-x-auto">
             {loading ? (
                <div className="p-16 flex justify-center items-center">
                  <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
             ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-500 border-b border-slate-200">
                      <th className="p-5 font-bold text-sm uppercase tracking-wider">Cycle Period</th>
                      <th className="p-5 font-bold text-sm uppercase tracking-wider">Status</th>
                      <th className="p-5 font-bold text-sm uppercase tracking-wider text-right">Target Audience</th>
                      <th className="p-5 font-bold text-sm uppercase tracking-wider text-right">Total Disbursed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payrollHistory.map(run => (
                      <tr key={run.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-5">
                          <div className="font-bold text-slate-800 text-lg">{getMonthName(run.month)} {run.year}</div>
                          <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-bold">Run ID: #{run.id}</div>
                        </td>
                        <td className="p-5">
                          {run.status === "COMPLETED" ? (
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold rounded-full text-xs uppercase tracking-wide">
                              {run.status}
                            </span>
                          ) : (
                             <span className="px-3 py-1 bg-amber-100 text-amber-700 font-bold rounded-full text-xs uppercase tracking-wide">
                              {run.status}
                            </span>
                          )}
                        </td>
                        <td className="p-5 text-right font-bold text-slate-700">
                          {run.total_employees} Personnel
                        </td>
                        <td className="p-5 text-right font-black text-emerald-600 text-lg">
                          {formatCurrency(run.total_disbursed)}
                        </td>
                      </tr>
                    ))}
                    {payrollHistory.length === 0 && (
                      <tr>
                        <td colSpan="4" className="p-12 text-center text-slate-500 font-medium">No payroll history found. Execute a payroll run to populate this view.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
             )}
           </div>
        )}

      </div>
    </div>
  );
}