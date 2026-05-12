// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../../context/AuthContext";

// export default function LeaveHistory() {
//   const { token } = useAuth();
//   const [leaves, setLeaves] = useState([]);
//   const [filter, setFilter] = useState("ALL");
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchLeaves();
//   }, []);

//   const fetchLeaves = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:5000/api/leaves/my",
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );
//       setLeaves(res.data);
//     } catch (err) {
//       console.error("Error fetching leaves", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateDays = (start, end) => {
//     const s = new Date(start);
//     const e = new Date(end);
//     return (e - s) / (1000 * 60 * 60 * 24) + 1;
//   };

//   const formatDate = (date) =>
//     date
//       ? new Date(date).toLocaleDateString("en-IN", {
//           day: "2-digit",
//           month: "short",
//           year: "numeric"
//         })
//       : "-";

//   const statusBadge = (status) => {
//     const base =
//       "px-3 py-1 text-xs font-medium rounded-full";

//     if (status === "PENDING")
//       return `${base} bg-yellow-100 text-yellow-700`;
//     if (status === "APPROVED")
//       return `${base} bg-green-100 text-green-700`;
//     if (status === "REJECTED")
//       return `${base} bg-red-100 text-red-700`;

//     return base;
//   };

//   const filteredLeaves = leaves
//     .filter((leave) =>
//       filter === "ALL" ? true : leave.status === filter
//     )
//     .filter((leave) =>
//       leave.leave_type
//         .toLowerCase()
//         .includes(search.toLowerCase())
//     );

//   return (
//     <div className="max-w-7xl mx-auto space-y-10">

//       <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
//         <h1 className="text-3xl font-semibold text-gray-900">
//           Leave History
//         </h1>

//         <div className="flex gap-3">
//           <input
//             type="text"
//             placeholder="Search by leave type..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="border border-gray-200 rounded-lg px-4 py-2 text-sm"
//           />

//           <select
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//             className="border border-gray-200 rounded-lg px-4 py-2 text-sm"
//           >
//             <option value="ALL">All</option>
//             <option value="PENDING">Pending</option>
//             <option value="APPROVED">Approved</option>
//             <option value="REJECTED">Rejected</option>
//           </select>
//         </div>
//       </div>

//       <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">

//         {loading ? (
//           <div className="p-10 text-center text-gray-500">
//             Loading leave history...
//           </div>
//         ) : filteredLeaves.length === 0 ? (
//           <div className="p-10 text-center text-gray-500">
//             No leave records found.
//           </div>
//         ) : (
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
//               <tr>
//                 <th className="px-6 py-4 text-left">Type</th>
//                 <th className="px-6 py-4 text-left">Date Range</th>
//                 <th className="px-6 py-4 text-left">Days</th>
//                 <th className="px-6 py-4 text-left">Manager</th>
//                 <th className="px-6 py-4 text-left">Status</th>
//                 <th className="px-6 py-4 text-left">Applied</th>
//                 <th className="px-6 py-4 text-left">Reviewed</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-100">
//               {filteredLeaves.map((leave) => (
//                 <tr
//                   key={leave.id}
//                   className="hover:bg-gray-50 transition"
//                 >
//                   <td className="px-6 py-4 font-medium text-gray-900">
//                     {leave.leave_type}
//                   </td>

//                   <td className="px-6 py-4 text-gray-600">
//                     {formatDate(leave.start_date)} –{" "}
//                     {formatDate(leave.end_date)}
//                   </td>

//                   <td className="px-6 py-4 text-gray-600">
//                     {calculateDays(
//                       leave.start_date,
//                       leave.end_date
//                     )}
//                   </td>

//                   <td className="px-6 py-4 text-gray-600">
//                     {leave.manager_name || "-"}
//                   </td>

//                   <td className="px-6 py-4">
//                     <span className={statusBadge(leave.status)}>
//                       {leave.status}
//                     </span>
//                   </td>

//                   <td className="px-6 py-4 text-gray-500">
//                     {formatDate(leave.applied_at)}
//                   </td>

//                   <td className="px-6 py-4 text-gray-500">
//                     {formatDate(leave.reviewed_at)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { Search, Filter, Calendar, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function LeaveHistory() {
  const { token } = useAuth();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/leaves/my");
      setLeaves(res.data);
    } catch (err) {
      console.error("Error fetching leaves", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateDays = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    return (e - s) / (1000 * 60 * 60 * 24) + 1;
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric"
        })
      : "-";

  const getStatusIcon = (status) => {
    if (status === "APPROVED") return <CheckCircle2 size={16} className="text-emerald-500" />;
    if (status === "REJECTED") return <XCircle size={16} className="text-red-500" />;
    return <Clock size={16} className="text-amber-500" />;
  };

  const getStatusStyle = (status) => {
    if (status === "APPROVED") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (status === "REJECTED") return "bg-red-50 text-red-700 border-red-200";
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  /* ================= FILTER LOGIC ================= */
  const filteredLeaves = leaves.filter((leave) => {
    const matchesStatus = statusFilter === "ALL" || leave.status === statusFilter;
    const matchesType = typeFilter === "ALL" || leave.leave_type === typeFilter;
    const matchesSearch =
      !search ||
      leave.leave_type?.toLowerCase().includes(search.toLowerCase()) ||
      leave.reason?.toLowerCase().includes(search.toLowerCase()) ||
      leave.manager_name?.toLowerCase().includes(search.toLowerCase());
    const matchesDate =
      (!fromDate || new Date(leave.start_date) >= new Date(fromDate)) &&
      (!toDate || new Date(leave.end_date) <= new Date(toDate));

    return matchesStatus && matchesType && matchesSearch && matchesDate;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] w-full">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-panel p-8 bg-gradient-to-br from-indigo-600/90 to-blue-700/90 text-white relative overflow-hidden border-none shadow-xl shadow-indigo-500/20">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Leave History
          </h1>
          <p className="text-indigo-100 max-w-2xl text-lg opacity-90">
            View your complete record of past and pending leave requests.
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="glass-panel p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 animate-slide-up">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by reason, admin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-medium text-slate-700"
          />
        </div>

        <div className="relative">
          <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-medium text-slate-700 appearance-none cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="relative">
          <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-medium text-slate-700 appearance-none cursor-pointer"
          >
            <option value="ALL">All Types</option>
            <option value="CL">Casual Leave (CL)</option>
            <option value="SL">Sick Leave (SL)</option>
            <option value="LOP">Loss of Pay (LOP)</option>
          </select>
        </div>

        <div className="relative">
          <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-medium text-slate-700"
          />
        </div>

        <div className="relative">
          <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-medium text-slate-700"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel p-0 overflow-hidden animate-slide-up flex flex-col" style={{ animationDelay: '0.1s' }}>
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white/50">
          <h2 className="text-lg font-bold text-slate-800">Records</h2>
          <div className="text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-lg">
            {filteredLeaves.length} {filteredLeaves.length === 1 ? 'Record' : 'Records'}
          </div>
        </div>

        {filteredLeaves.length === 0 ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center">
            <Calendar size={48} className="mb-3 opacity-20" />
            <p className="font-medium text-slate-500">No leave records found matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Leave Type</th>
                  <th className="px-6 py-4">Date Range</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Manager</th>
                  <th className="px-6 py-4">Applied On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(leave.status)}`}>
                        {getStatusIcon(leave.status)}
                        {leave.status}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1.5 rounded-lg">{leave.leave_type}</span>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatDate(leave.start_date)} <span className="text-slate-400 mx-1">→</span> {formatDate(leave.end_date)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-700">{calculateDays(leave.start_date, leave.end_date)} Days</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">
                      {leave.manager_name || "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(leave.applied_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}