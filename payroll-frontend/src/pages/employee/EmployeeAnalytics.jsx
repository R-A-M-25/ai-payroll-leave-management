import { useEffect, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";

const COLORS = ["#8b5cf6", "#10B981", "#f43f5e"];

export default function EmployeeAnalytics() {
  const { token } = useAuth();

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/leaves/my");
      setLeaves(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  /* ===== Monthly Leave Calculation ===== */
  const monthlyMap = {};

  leaves.forEach(l => {
    const year = new Date(l.start_date).getFullYear();
    if (year.toString() !== selectedYear) return;

    const month = new Date(l.start_date).toLocaleString("en-US", { month: "short" });
    const days = (new Date(l.end_date) - new Date(l.start_date)) / (1000 * 60 * 60 * 24) + 1;

    monthlyMap[month] = (monthlyMap[month] || 0) + days;
  });

  const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyData = allMonths.map(m => ({
    month: m,
    days: monthlyMap[m] || 0
  }));

  /* ===== Leave Type Distribution ===== */
  const typeMap = {
    CL: 0,
    SL: 0,
    LOP: 0
  };

  leaves.forEach(l => {
    const year = new Date(l.start_date).getFullYear();
    if (year.toString() !== selectedYear) return;

    const days = (new Date(l.end_date) - new Date(l.start_date)) / (1000 * 60 * 60 * 24) + 1;
    typeMap[l.leave_type] += days;
  });

  const distributionData = [
    { name: "Casual Leave (CL)", value: typeMap.CL },
    { name: "Sick Leave (SL)", value: typeMap.SL },
    { name: "Loss of Pay (LOP)", value: typeMap.LOP }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] w-full">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in relative">
      
      {/* Premium Ambient Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-fuchsia-500/10 rounded-full blur-[120px] animate-float-reverse delay-300"></div>
      </div>

      {/* Hero Section */}
      <div className="glass-panel p-10 bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-950 text-white relative overflow-hidden border border-white/10 shadow-[0_20px_40px_-15px_rgba(88,28,135,0.5)] rounded-3xl animate-slide-up">
        {/* Dynamic Inner Glows */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-fuchsia-400/20 rounded-full blur-[80px] pointer-events-none animate-float"></div>
        <div className="absolute -left-10 bottom-0 w-60 h-60 bg-blue-400/20 rounded-full blur-[60px] pointer-events-none animate-float-reverse delay-500"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md mb-6 border border-white/10 shadow-inner">
               <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
               <p className="text-white font-bold tracking-widest text-xs uppercase">Telemetry Center</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-fuchsia-200">
              Analytics Overview
            </h1>
            <p className="mt-4 text-purple-100/90 max-w-2xl text-lg font-medium leading-relaxed drop-shadow">
              A comprehensive deep-dive into your historical leave consumption metrics and workforce availability.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-3xl p-2 rounded-xl border border-white/20 shadow-[inset_0_2px_15px_rgba(255,255,255,0.1)] group hover:bg-white/20 transition-all duration-300">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent text-white font-black tracking-wider text-xl py-3 px-8 focus:outline-none rounded-lg appearance-none cursor-pointer text-center w-full min-w-[140px]"
            >
              <option value="2024" className="text-slate-800 font-bold">2024</option>
              <option value="2025" className="text-slate-800 font-bold">2025</option>
              <option value="2026" className="text-slate-800 font-bold">2026</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Chart (Area Chart) */}
        <div className="glass-panel p-10 animate-slide-up delay-200 bg-white/60 backdrop-blur-3xl border-white/60 shadow-xl shadow-slate-200/40 rounded-3xl hover:-translate-y-1 transition-transform duration-500 group">
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-200/60">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.8)] border border-indigo-100 group-hover:scale-110 transition-transform duration-500">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">Leave Trend Curve</h3>
            </div>
            <div className="px-4 py-1.5 bg-slate-100/80 text-slate-600 text-sm font-black rounded-lg uppercase tracking-widest shadow-inner border border-slate-200">
              {selectedYear}
            </div>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDays" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', fontWeight: 'bold' }}
                  cursor={{ stroke: '#818cf8', strokeWidth: 2, strokeDasharray: '4 4' }}
                />
                <Area
                  type="monotone"
                  dataKey="days"
                  stroke="#4f46e5"
                  strokeWidth={5}
                  fillOpacity={1}
                  fill="url(#colorDays)"
                  activeDot={{ r: 8, strokeWidth: 4, stroke: 'white', fill: '#4f46e5' }}
                  animationCurve="ease-out"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Chart (Pie Chart) */}
        <div className="glass-panel p-10 animate-slide-up delay-400 bg-white/60 backdrop-blur-3xl border-white/60 shadow-xl shadow-slate-200/40 rounded-3xl hover:-translate-y-1 transition-transform duration-500 group">
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-200/60">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.8)] border border-purple-100 group-hover:scale-110 transition-transform duration-500">
              <PieChartIcon size={28} />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">Leave Distribution</h3>
          </div>

          <div className="h-[320px] w-full mt-4 flex items-center justify-center">
            {distributionData.every(d => d.value === 0) ? (
              <div className="text-center text-slate-400">
                <PieChartIcon size={64} className="mx-auto mb-4 opacity-20" />
                <p className="font-semibold text-lg">No leave data available for {selectedYear}</p>
                <p className="text-sm mt-1">Data will populate here once leave is consumed.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={8}
                    labelLine={false}
                    stroke="none"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontWeight: 600, fontSize: '13px', color: '#475569' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}