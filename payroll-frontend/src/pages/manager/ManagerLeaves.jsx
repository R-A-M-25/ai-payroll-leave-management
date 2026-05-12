import { useEffect, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { ClipboardList, CheckCircle, XCircle, Search, Filter } from "lucide-react";

export default function ManagerLeaves() {
  const { token } = useAuth();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/leaves/manager");
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/leaves/${id}/status`, { status });
      fetchLeaves();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const statusBadge = (status) => {
    const base = "px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide border inline-flex items-center gap-1.5 shadow-sm";

    if (status === "PENDING")
      return `${base} bg-amber-50 text-amber-700 border-amber-200`;

    if (status === "APPROVED")
      return `${base} bg-emerald-50 text-emerald-700 border-emerald-200`;

    if (status === "REJECTED")
      return `${base} bg-rose-50 text-rose-700 border-rose-200`;
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
      {/* Header */}
      <div className="glass-panel p-8 bg-gradient-to-br from-indigo-700 via-blue-800 to-cyan-900 text-white relative overflow-hidden border-none shadow-xl shadow-blue-500/20 shrink-0">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -left-10 bottom-0 w-60 h-60 bg-blue-400/20 rounded-full blur-[60px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 drop-shadow-sm flex items-center gap-3">
              <ClipboardList className="text-blue-300" size={32} />
              Leave Requests
            </h1>
            <p className="text-blue-100/90 text-lg max-w-2xl font-medium">
              Review and manage team leave applications efficiently.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 p-2 rounded-xl border border-white/20 backdrop-blur-md">
            <div className="bg-white/10 p-2 rounded-lg cursor-pointer hover:bg-white/20 transition-colors">
               <Search size={20} className="text-white" />
            </div>
            <div className="bg-white/10 p-2 rounded-lg cursor-pointer hover:bg-white/20 transition-colors">
               <Filter size={20} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-0 overflow-hidden flex flex-col animate-slide-up flex-1">
        <div className="overflow-x-auto">
          {leaves.length === 0 ? (
            <div className="p-16 text-center text-slate-400 flex flex-col items-center">
              <ClipboardList size={48} className="mb-4 opacity-20" />
              <p className="font-medium text-slate-500 text-lg">No leave requests found</p>
              <p className="text-sm mt-1">When team members apply for leave, requests will appear here.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase text-xs tracking-wider border-b border-slate-200 backdrop-blur-sm sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4 w-1/4">Reason</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {leaves.map(leave => (
                  <tr key={leave.id} className="hover:bg-blue-50/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                           {leave.employee_email.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-800">{leave.employee_email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-bold text-xs border border-slate-200 shadow-sm">
                        {leave.leave_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{formatDate(leave.start_date)}</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                           to {formatDate(leave.end_date)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 whitespace-normal min-w-[200px]">
                      <p className="line-clamp-2 text-sm">{leave.reason}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={statusBadge(leave.status)}>
                        {leave.status === 'PENDING' && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>}
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {leave.status === "PENDING" ? (
                        <div className="flex justify-center gap-2 opacity-100 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => updateStatus(leave.id, "APPROVED")}
                            className="bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-500 px-3 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1 shadow-sm hover:shadow-emerald-500/25"
                            title="Approve"
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                          <button
                            onClick={() => updateStatus(leave.id, "REJECTED")}
                            className="bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-200 hover:border-rose-500 px-3 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1 shadow-sm hover:shadow-rose-500/25"
                            title="Reject"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      ) : (
                        <div className="text-center text-slate-400 text-sm font-medium italic">
                          Processed
                        </div>
                      )}
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