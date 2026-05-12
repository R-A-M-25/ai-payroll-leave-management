import { useEffect, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { Users, Mail, Briefcase, Calendar as CalendarIcon, MapPin, Phone } from "lucide-react";

export default function TeamMembers() {
  const { token } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await api.get("/employee/team");
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] w-full">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col h-full">
      {/* Hero Header */}
      <div className="glass-panel p-8 bg-gradient-to-br from-indigo-700 via-blue-800 to-cyan-900 text-white relative overflow-hidden border-none shadow-xl shadow-blue-500/20 shrink-0 rounded-3xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -left-10 bottom-0 w-60 h-60 bg-teal-400/20 rounded-full blur-[60px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
             <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                 <Users size={32} className="text-white drop-shadow-md" />
             </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1 drop-shadow-sm">
                Team Roster
              </h1>
              <p className="text-blue-100/90 text-lg font-medium">
                Comprehensive overview of your direct reports.
              </p>
            </div>
          </div>
          
          <div className="bg-white/10 px-6 py-3 rounded-xl border border-white/20 backdrop-blur-md flex items-center gap-4">
             <div className="text-center">
                <div className="text-2xl font-black">{members.length}</div>
                <div className="text-xs text-blue-200 font-semibold uppercase tracking-wider">Members</div>
             </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-0 overflow-hidden flex flex-col animate-slide-up flex-1">
        <div className="overflow-x-auto">
          {members.length === 0 ? (
            <div className="p-16 text-center text-slate-400 flex flex-col items-center">
              <Users size={48} className="mb-4 opacity-20" />
              <p className="font-medium text-slate-500 text-lg">No team members assigned</p>
              <p className="text-sm mt-1">Direct reports will be listed here.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase text-xs tracking-wider border-b border-slate-200 backdrop-blur-sm sticky top-0 z-10">
                <tr>
                  <th className="px-8 py-5">Employee Info</th>
                  <th className="px-6 py-5">Department</th>
                  <th className="px-6 py-5">Date of Joining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
                           {(m.name || m.email || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                           <span className="font-bold text-slate-800 text-base">{m.name || "Unassigned Name"}</span>
                           <span className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                              <Mail size={12} /> {m.email}
                           </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-bold text-xs border border-slate-200 shadow-sm">
                          <Briefcase size={14} className="text-slate-400" />
                          {m.department}
                       </span>
                    </td>
                    <td className="px-6 py-5 text-slate-600 font-medium">
                       <div className="flex items-center gap-2">
                          <CalendarIcon size={16} className="text-blue-400" />
                          {formatDate(m.doj)}
                       </div>
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