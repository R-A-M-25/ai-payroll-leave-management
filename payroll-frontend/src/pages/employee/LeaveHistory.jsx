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
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

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
      const res = await axios.get(
        "http://localhost:5000/api/leaves/my",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
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
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        })
      : "-";

  const statusBadge = (status) => {
    const base =
      "px-3 py-1 text-xs font-medium rounded-full";

    if (status === "PENDING")
      return `${base} bg-yellow-100 text-yellow-700`;
    if (status === "APPROVED")
      return `${base} bg-green-100 text-green-700`;
    if (status === "REJECTED")
      return `${base} bg-red-100 text-red-700`;

    return base;
  };

  /* ================= FILTER LOGIC ================= */

  const filteredLeaves = leaves.filter((leave) => {
    const matchesStatus =
      statusFilter === "ALL" || leave.status === statusFilter;

    const matchesType =
      typeFilter === "ALL" || leave.leave_type === typeFilter;

    const matchesSearch =
      !search ||
      leave.leave_type?.toLowerCase().includes(search.toLowerCase()) ||
      leave.reason?.toLowerCase().includes(search.toLowerCase()) ||
      leave.manager_name?.toLowerCase().includes(search.toLowerCase());

    const matchesDate =
      (!fromDate || new Date(leave.start_date) >= new Date(fromDate)) &&
      (!toDate || new Date(leave.end_date) <= new Date(toDate));

    return (
      matchesStatus &&
      matchesType &&
      matchesSearch &&
      matchesDate
    );
  });

  return (
    <div className="max-w-7xl mx-auto space-y-10">

      {/* Header */}
      <h1 className="text-3xl font-semibold text-gray-900">
        Leave History
      </h1>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-5 gap-4">

        <input
          type="text"
          placeholder="Search leave, reason, manager..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm"
        >
          <option value="ALL">All Types</option>
          <option value="CL">CL</option>
          <option value="SL">SL</option>
          <option value="LOP">LOP</option>
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm"
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading leave history...
          </div>
        ) : filteredLeaves.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No leave records found.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Date Range</th>
                <th className="px-6 py-4 text-left">Days</th>
                <th className="px-6 py-4 text-left">Manager</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Applied</th>
                <th className="px-6 py-4 text-left">Reviewed</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredLeaves.map((leave) => (
                <tr
                  key={leave.id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {leave.leave_type}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(leave.start_date)} –{" "}
                    {formatDate(leave.end_date)}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {calculateDays(
                      leave.start_date,
                      leave.end_date
                    )}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {leave.manager_name || "-"}
                  </td>

                  <td className="px-6 py-4">
                    <span className={statusBadge(leave.status)}>
                      {leave.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {formatDate(leave.applied_at)}
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {formatDate(leave.reviewed_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}