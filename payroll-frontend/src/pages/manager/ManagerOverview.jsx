import { useEffect, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Users, CalendarClock, ArrowRight, UserCircle, CheckCircle } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function ManagerOverview() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [team, setTeam] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [leaveStats, setLeaveStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [teamRes, leaveRes] = await Promise.all([
        api.get("/employee/team").catch(() => ({ data: [] })),
        api.get("/leaves/manager").catch(() => ({ data: [] }))
      ]);

      setTeam(teamRes.data || []);
      
      const allLeaves = leaveRes.data || [];
      const pending = allLeaves.filter(l => l.status === "PENDING");
      const approved = allLeaves.filter(l => l.status === "APPROVED");
      const rejected = allLeaves.filter(l => l.status === "REJECTED");
      
      setPendingLeaves(pending);
      setLeaveStats([
        { name: 'Pending', value: pending.length, color: '#f59e0b' },
        { name: 'Approved', value: approved.length, color: '#10b981' },
        { name: 'Rejected', value: rejected.length, color: '#f43f5e' }
      ]);
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] w-full">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>
      </div>
    );
  }

  const approvedCount = leaveStats.find(s => s.name === "Approved")?.value || 0;

  return (
    <div className="space-y-6">
      
      {/* Hero Welcome */}
      <div className="glass-panel p-8 bg-gradient-to-br from-indigo-700 via-blue-800 to-indigo-900 text-white relative overflow-hidden border-none shadow-xl shadow-blue-500/20">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -left-10 bottom-0 w-60 h-60 bg-teal-400/20 rounded-full blur-[60px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-sm">
              Manager Command Center
            </h1>
            <p className="mt-2 text-blue-100 max-w-xl text-lg font-medium">
              Oversee your team's performance, review pending action items, and analyze leave distribution.
            </p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
        <div className="glass-panel p-6 hover:-translate-y-1 transition-transform duration-300 flex items-center gap-6 group">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Team</p>
            <h3 className="text-4xl font-black text-slate-800">{team.length}</h3>
          </div>
        </div>

        <div className="glass-panel p-6 hover:-translate-y-1 transition-transform duration-300 flex items-center gap-6 group">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
            <CalendarClock size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Action Required</p>
            <h3 className="text-4xl font-black text-slate-800">{pendingLeaves.length}</h3>
          </div>
        </div>
        
        <div className="glass-panel p-6 hover:-translate-y-1 transition-transform duration-300 flex items-center gap-6 group">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            <CheckCircle size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Approved Leaves</p>
            <h3 className="text-4xl font-black text-slate-800">{approvedCount}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        
        {/* Pending Leaves Widget */}
        <div className="glass-panel p-6 flex flex-col bg-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Pending Requests</h2>
            <button
              onClick={() => navigate("/manager/leaves")}
              className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider hover:bg-indigo-100 transition-colors flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            {pendingLeaves.length === 0 ? (
              <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl border border-slate-200 border-dashed p-6 text-center">
                <CalendarClock size={48} className="mb-4 text-slate-300 opacity-50" />
                <p className="font-bold text-slate-500 text-lg">Inbox Zero</p>
                <p className="text-sm mt-1">No pending team requests!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingLeaves.slice(0, 5).map(leave => (
                  <div key={leave.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all group cursor-default">
                    <div>
                      <p className="font-bold text-slate-800 truncate max-w-[140px]" title={leave.employee_email}>{leave.employee_email.split('@')[0]}</p>
                      <p className="text-xs font-bold text-amber-600 bg-amber-50 inline-block px-2 py-1 rounded-md mt-1 border border-amber-100">{leave.leave_type}</p>
                    </div>
                    <div className="text-right text-xs font-bold text-slate-500 bg-white p-2 border border-slate-200 rounded-lg shadow-sm">
                      {formatDate(leave.start_date)}
                      <div className="text-slate-400 mx-auto w-fit">to</div>
                      {formatDate(leave.end_date)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Analytics Distribution */}
        <div className="glass-panel p-6 flex flex-col bg-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Team Leave Status</h2>
          </div>
          
          <div className="flex-1 flex items-center justify-center min-h-[250px]">
             {leaveStats.every(s => s.value === 0) ? (
                 <div className="text-center text-slate-400">
                     <PieChart size={48} className="mx-auto mb-3 opacity-20" />
                     <p className="font-semibold text-sm">No historical leaf data</p>
                 </div>
             ) : (
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leaveStats}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="45%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        stroke="none"
                      >
                        {leaveStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                      />
                      <Legend 
                        verticalAlign="bottom"
                        iconType="circle"
                        wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '20px' }}
                      />
                    </PieChart>
                 </ResponsiveContainer>
             )}
          </div>
        </div>

        {/* Team Snapshot */}
        <div className="glass-panel p-6 flex flex-col bg-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Team Roster</h2>
            <button
              onClick={() => navigate("/manager/team")}
              className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider hover:bg-indigo-100 transition-colors flex items-center gap-1"
            >
              View Roster <ArrowRight size={14} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            {team.length === 0 ? (
              <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl border border-slate-200 border-dashed p-6 text-center">
                <Users size={48} className="mb-4 text-slate-300 opacity-50" />
                <p className="font-bold text-slate-500 text-lg">No Assignment</p>
                <p className="text-sm mt-1">You currently have no direct reports.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {team.slice(0, 5).map((emp, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-100 to-blue-200 flex items-center justify-center text-indigo-700 shrink-0 font-black shadow-sm group-hover:scale-110 transition-transform">
                      {(emp.name || emp.email || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{emp.name || "Unassigned"}</p>
                      <p className="text-xs font-semibold text-slate-400 truncate mt-0.5">{emp.email}</p>
                    </div>
                    <div className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-1 rounded-md uppercase tracking-wider shrink-0">
                      {emp.department || "ENG"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}