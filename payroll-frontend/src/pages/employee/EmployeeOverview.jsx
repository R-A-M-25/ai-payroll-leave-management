import { useEffect, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, FileText, IndianRupee, Clock,
  ArrowRight, ShieldCheck, Activity, User
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function EmployeeOverview() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [balance, setBalance] = useState(null);
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(token) fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [profileRes, balanceRes, payrollRes] = await Promise.all([
        api.get("/employee/profile").catch(() => ({ data: user })),
        api.get("/leaves/balance").catch(() => ({ data: { balance: { CL: 0, SL: 0 } } })),
        api.get("/payroll/payslips").catch(() => ({ data: [] }))
      ]);

      setProfile(profileRes.data);
      setBalance(balanceRes.data || { CL: 0, SL: 0 });
      setPayslips(payrollRes.data || []);
    } catch (err) {
      console.log("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] w-full">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>
      </div>
    );
  }

  // Format chart data (reverse to show chronological order)
  const chartData = [...payslips].reverse().map(p => ({
    name: `${p.month}/${p.year.toString().slice(-2)}`,
    salary: p.net_salary
  }));

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <div className="space-y-8 animate-fade-in relative">
      
      {/* Premium Ambient Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] animate-float-reverse delay-300"></div>
      </div>

      {/* Hero Welcome Section */}
      <div className="glass-panel p-10 bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white relative overflow-hidden border border-white/10 shadow-[0_20px_40px_-15px_rgba(30,58,138,0.5)] rounded-3xl animate-slide-up">
        {/* Dynamic Inner Glows */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-400/20 rounded-full blur-[80px] pointer-events-none animate-float"></div>
        <div className="absolute right-40 -bottom-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-[60px] pointer-events-none animate-float-reverse delay-500"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md mb-6 border border-white/10 shadow-inner">
               <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
               <p className="text-white font-bold tracking-widest text-xs uppercase">{currentDate}</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-indigo-200">
              Welcome back, {profile?.name || user?.name || 'Employee'}
            </h1>
            <p className="mt-4 text-blue-100/90 max-w-2xl text-lg font-medium leading-relaxed drop-shadow">
              Your digital HQ. Monitor your compensation trends, manage schedules, and review active leave pipelines natively.
            </p>
          </div>
          <button 
            onClick={() => navigate("/employee/apply-leave")}
            className="group relative overflow-hidden bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:-translate-y-1 transition-all duration-300 w-fit flex items-center gap-3"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            <Calendar size={20} className="text-indigo-600 group-hover:rotate-12 transition-transform duration-300" /> 
            <span className="relative z-10">Apply For Leave</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-8 bg-white/60 backdrop-blur-2xl border border-white/60 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.2)] transition-all duration-500 ease-out animate-slide-up delay-150 group cursor-default">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-blue-500 transition-colors">Casual Leaves</p>
              <h3 className="text-5xl font-black text-slate-800 tracking-tighter">{balance?.CL ?? 0}</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100/50 text-blue-600 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.8)] border border-blue-100 group-hover:scale-110 transition-transform duration-500">
              <Activity size={28} />
            </div>
          </div>
          <div className="mt-8 w-full bg-slate-100/80 h-2.5 rounded-full overflow-hidden shadow-inner flex">
            <div className="bg-gradient-to-r from-blue-400 to-indigo-600 h-full rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${Math.min((balance?.CL ?? 0) * 10, 100)}%` }}>
               <div className="absolute top-0 right-0 w-8 h-full bg-white/40 blur-[2px] animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 bg-white/60 backdrop-blur-2xl border border-white/60 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.2)] transition-all duration-500 ease-out animate-slide-up delay-200 group cursor-default">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-emerald-500 transition-colors">Medical Leaves</p>
              <h3 className="text-5xl font-black text-slate-800 tracking-tighter">{balance?.SL ?? 0}</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100/50 text-emerald-600 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.8)] border border-emerald-100 group-hover:scale-110 transition-transform duration-500">
              <ShieldCheck size={28} />
            </div>
          </div>
          <div className="mt-8 w-full bg-slate-100/80 h-2.5 rounded-full overflow-hidden shadow-inner flex">
            <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${Math.min((balance?.SL ?? 0) * 10, 100)}%` }}>
               <div className="absolute top-0 right-0 w-8 h-full bg-white/40 blur-[2px] animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 bg-white/60 backdrop-blur-2xl border border-white/60 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.2)] transition-all duration-500 ease-out animate-slide-up delay-300 group cursor-default">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-purple-500 transition-colors">Loss of Pay</p>
              <h3 className="text-5xl font-black text-slate-800 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900">Inf.</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-50 to-fuchsia-100/50 text-purple-600 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.8)] border border-purple-100 group-hover:scale-110 transition-transform duration-500">
              <Clock size={28} />
            </div>
          </div>
          <div className="mt-7 text-xs font-black text-purple-700/80 bg-purple-500/10 inline-block px-4 py-2.5 rounded-xl border border-purple-500/20 backdrop-blur-md shadow-inner tracking-wide">
            SUBJECT TO APPROVAL
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Salary Trend Chart */}
        <div className="glass-panel p-8 lg:col-span-2 flex flex-col bg-white/60 backdrop-blur-3xl border border-white/60 shadow-xl shadow-slate-200/40 animate-slide-up delay-400 rounded-3xl">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">Financial Trajectory</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">Real-time net compensation history</p>
            </div>
            <button onClick={() => navigate("/employee/payslips")} className="text-sm bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-50 hover:text-indigo-600 transition-all flex items-center gap-2 shadow-sm hover:shadow active:scale-95 group">
              Full Ledger <ArrowRight size={16} className="group-hover:translate-x-1 duration-300" />
            </button>
          </div>
          
          {payslips.length > 0 ? (
            <div className="flex-1 w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSalary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 700}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 700}} tickFormatter={(value) => `₹${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', padding: '16px', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}
                    itemStyle={{ color: '#0f172a', fontWeight: '900', fontSize: '18px' }}
                    labelStyle={{ color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', marginBottom: '8px' }}
                    formatter={(value) => [`₹ ${value.toLocaleString()}`, 'Net Yield']}
                  />
                  <Area type="monotone" dataKey="salary" stroke="#4f46e5" strokeWidth={5} fillOpacity={1} fill="url(#colorSalary)" activeDot={{ r: 8, strokeWidth: 4, stroke: 'white', fill: '#4f46e5' }} animationCurve="ease-out" animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-3xl border-2 border-slate-200 border-dashed m-2">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-slate-100">
                 <IndianRupee size={32} className="text-slate-300" />
              </div>
              <p className="font-bold text-slate-500 text-lg">Timeline Uninitialized</p>
              <p className="text-sm mt-1 font-medium">Your payroll ledger will construct dynamically here</p>
            </div>
          )}
        </div>

        {/* Quick Actions & Recent Payslip */}
        <div className="space-y-8 lg:col-span-1 animate-slide-up delay-500">
          <div className="glass-panel p-8 bg-white/60 backdrop-blur-3xl border border-white/60 shadow-xl shadow-slate-200/40 rounded-3xl hover:-translate-y-1 transition-transform duration-500 group relative overflow-hidden">
            <h3 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center justify-between">
              Latest Invoice
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </h3>
            
            {payslips.length > 0 ? (
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-7 rounded-2xl relative overflow-hidden shadow-2xl shadow-indigo-900/30 text-white transform transition-transform duration-500 cursor-pointer" onClick={() => navigate("/employee/payslips")}>
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-[20px] pointer-events-none group-hover:bg-white/10 transition-colors duration-500"></div>
                <div className="w-12 h-12 bg-white/10 backdrop-blur border border-white/20 rounded-xl flex items-center justify-center mb-6">
                  <IndianRupee size={22} className="text-white drop-shadow" />
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">{payslips[0].month} Cycle {payslips[0].year}</p>
                <h4 className="text-4xl font-black text-white mb-6 tracking-tighter">₹ {payslips[0].net_salary.toLocaleString()}</h4>
                <div className="flex justify-between items-end pt-5 border-t border-white/10">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Deductions</span>
                    <span className="text-sm font-bold text-rose-300 bg-rose-500/10 px-2 py-1 rounded inline-block">LOP: {payslips[0].lop_days} days</span>
                  </div>
                  <ArrowRight size={20} className="text-white/50 group-hover:text-white group-hover:translate-x-2 transition-all" />
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 border-dashed p-10 rounded-2xl text-center">
                <p className="text-slate-500 font-bold">Awaiting first dispatch</p>
              </div>
            )}
          </div>

          <div className="glass-panel p-8 bg-white/60 backdrop-blur-3xl border border-white/60 shadow-xl shadow-slate-200/40 rounded-3xl">
            <h3 className="text-xl font-extrabold text-slate-800 mb-6">Quick Portal</h3>
            <div className="space-y-4">
              <button onClick={() => navigate("/employee/profile")} className="w-full flex items-center justify-between p-5 rounded-2xl bg-white hover:bg-slate-50 hover:shadow-lg hover:shadow-indigo-500/10 border border-slate-100 transition-all text-left group">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-purple-100">
                    <User size={22} />
                  </div>
                  <div>
                     <span className="font-extrabold text-slate-700 block text-lg">My Identity</span>
                     <span className="font-medium text-slate-400 text-xs">Manage passwords & data</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-white border border-transparent group-hover:border-slate-200 transition-colors">
                   <ArrowRight size={16} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
              
              <button onClick={() => navigate("/employee/leaves")} className="w-full flex items-center justify-between p-5 rounded-2xl bg-white hover:bg-slate-50 hover:shadow-lg hover:shadow-indigo-500/10 border border-slate-100 transition-all text-left group">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 shadow-sm border border-orange-100">
                    <FileText size={22} />
                  </div>
                  <div>
                     <span className="font-extrabold text-slate-700 block text-lg">Leave Matrix</span>
                     <span className="font-medium text-slate-400 text-xs">View prior requests & status</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-white border border-transparent group-hover:border-slate-200 transition-colors">
                   <ArrowRight size={16} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}