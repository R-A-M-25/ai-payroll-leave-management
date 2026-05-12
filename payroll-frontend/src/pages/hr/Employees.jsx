import React, { useEffect, useState, useMemo } from "react";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { 
  Users, UserPlus, Shield, Briefcase, Filter, X, 
  Edit2, Search, Download, ChevronDown, MoreVertical, Building2,
  Key, Copy, CheckCircle2
} from "lucide-react";

export default function Employees() {
  const { token } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); 
  const [currentMemberId, setCurrentMemberId] = useState(null);

  const [credentialsModal, setCredentialsModal] = useState({ isOpen: false, email: "", password: "" });
  const [copied, setCopied] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
    base_salary: "",
    role: "EMPLOYEE",
    manager_id: ""
  });

  // View Team State
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamManagerName, setTeamManagerName] = useState("");

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch both all employees and managers to merge team_size insights
      const [allRes, mgrRes] = await Promise.all([
        api.get("/employee/all"),
        api.get("/employee/managers")
      ]);

      const allData = Array.isArray(allRes.data) ? allRes.data : [];
      const mgrData = Array.isArray(mgrRes.data) ? mgrRes.data : [];

      // Merge team size into the main employee list for managers
      const mergedData = allData.map(emp => {
        if (emp.role_name === "MANAGER") {
          const matchedMgr = mgrData.find(m => m.id === emp.id);
          return { ...emp, team_size: matchedMgr ? matchedMgr.team_size : 0 };
        }
        return emp;
      });

      setEmployees(mergedData);
    } catch (err) {
      console.error("Fetch Data Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeam = async (managerId, managerName) => {
    try {
      const res = await api.get(`/employee/manager/${managerId}/team`);
      setTeamMembers(res.data);
      setTeamManagerName(managerName);
      setIsTeamModalOpen(true);
    } catch (err) {
      console.error("Fetch Team Error:", err);
    }
  };

  /* =============== DERIVED DATA & FILTERS =============== */
  
  const managersList = useMemo(() => employees.filter(e => e.role_name === "MANAGER"), [employees]);
  const departments = useMemo(() => {
    const depts = new Set(employees.map(e => e.department).filter(Boolean));
    return Array.from(depts);
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      // 1. Search Query
      const query = searchQuery.toLowerCase();
      const nameMatch = (emp.name || "").toLowerCase().includes(query);
      const emailMatch = (emp.email || "").toLowerCase().includes(query);
      const desigMatch = (emp.designation || "").toLowerCase().includes(query);
      const matchesSearch = nameMatch || emailMatch || desigMatch;
      
      // 2. Role Filter
      const matchesRole = roleFilter === "ALL" || emp.role_name === roleFilter;

      // 3. Dept Filter
      const matchesDept = deptFilter === "ALL" || emp.department === deptFilter;

      return matchesSearch && matchesRole && matchesDept;
    });
  }, [employees, searchQuery, roleFilter, deptFilter]);


  /* =============== MODAL HANDLERS =============== */

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "role" && value === "MANAGER" ? { manager_id: "" } : {})
    }));
  };

  const openCreateModal = () => {
    setModalMode("create");
    setFormData({
      name: "", email: "", department: "", designation: "", base_salary: "", role: "EMPLOYEE", manager_id: ""
    });
    setIsModalOpen(true);
  };

  const openEditModal = (emp) => {
    setModalMode("edit");
    setCurrentMemberId(emp.id);
    setFormData({
      name: emp.name,
      email: emp.email,
      department: emp.department || "",
      designation: emp.designation || "",
      base_salary: emp.base_salary || "",
      role: emp.role_name === "MANAGER" ? "MANAGER" : "EMPLOYEE",
      manager_id: emp.manager_id || ""
    });
    setIsModalOpen(true);
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "create") {
        const res = await api.post("/employee/create", formData);
        setIsModalOpen(false);
        setCredentialsModal({ isOpen: true, email: formData.email, password: res.data.default_password });
      } else {
        await api.put(`/employee/update/${currentMemberId}`, formData);
        setIsModalOpen(false);
      }
      
      fetchData();
    } catch (err) {
      console.error("Save Error:", err);
      alert(err.response?.data?.message || "An error occurred");
    }
  };

  /* =============== RENDER HELPERS =============== */

  const getRoleBadge = (roleName) => {
    if (roleName === "MANAGER") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 tracking-wide">
          <Shield size={12} />
          MANAGER
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 tracking-wide">
        <Briefcase size={12} />
        EMPLOYEE
      </span>
    );
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n && n[0]).join("").substring(0, 2).toUpperCase();
  };

  // Extract a stable avatar color based on the name length to make it look realistic
  const getAvatarColor = (name) => {
    if (!name) return "bg-slate-600";
    const colors = ["bg-blue-600", "bg-indigo-600", "bg-purple-600", "bg-emerald-600", "bg-teal-600", "bg-rose-600"];
    return colors[name.length % colors.length];
  };

  return (
    <div className="space-y-6 animate-slide-up pb-12">
      
      {/* Premium Hero Section */}
      <div className="glass-panel p-8 md:p-10 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden border-none shadow-2xl shadow-indigo-900/20">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4 scale-150">
          <Building2 size={300} />
        </div>
        <div className="absolute -left-20 bottom-0 w-80 h-80 bg-indigo-600/30 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md mb-6 border border-white/10 text-xs font-bold text-indigo-200 uppercase tracking-widest shadow-sm">
              Corporate Directory
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-sm mb-4">
              Organization Hub
            </h1>
            <p className="text-indigo-200 text-lg font-medium leading-relaxed">
              Centrally manage your entire workforce. Apply robust filters, oversee management hierarchies, and streamline personnel onboarding gracefully.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all backdrop-blur-md">
              <Download size={18} />
              Export Directory
            </button>
            <button 
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all active:scale-95 border border-indigo-400/50"
            >
              <UserPlus size={20} />
              Add Member
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="glass-panel p-4 bg-white/80 backdrop-blur-xl border border-slate-200/60 sticky top-4 z-20 shadow-sm shadow-slate-200/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, email, or designation..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
            
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500 shrink-0 mr-1">
              <Filter size={16} /> Filters:
            </div>

            {/* Role Filter */}
            <div className="relative shrink-0">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-bold text-slate-700 cursor-pointer text-sm"
              >
                <option value="ALL">All Roles</option>
                <option value="MANAGER">Managers Only</option>
                <option value="EMPLOYEE">Employees Only</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Department Filter */}
            <div className="relative shrink-0">
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-bold text-slate-700 cursor-pointer text-sm max-w-[160px] truncate"
              >
                <option value="ALL">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="glass-panel overflow-hidden bg-white shadow-xl shadow-slate-200/40 border border-slate-200/60">
        {loading ? (
          <div className="p-20 flex flex-col justify-center items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-bold animate-pulse">Synchronizing Directory...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/80 text-slate-800 border-b border-slate-200 text-xs uppercase tracking-widest font-extrabold">
                  <th className="p-5 w-12 text-center text-slate-400">#</th>
                  <th className="p-5">Employee</th>
                  <th className="p-5">Role Identity</th>
                  <th className="p-5">Department & Title</th>
                  <th className="p-5">Reporting Structure</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp, index) => {
                  const manager = managersList.find(m => m.id === emp.manager_id);
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="p-5 text-center text-slate-400 font-bold text-sm">
                        {index + 1}
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full ${getAvatarColor(emp.name)} text-white font-bold flex justify-center items-center shadow-md ring-2 ring-white`}>
                            {getInitials(emp.name)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-base">{emp.name}</div>
                            <div className="text-sm text-slate-500 mt-0.5 font-medium">{emp.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        {getRoleBadge(emp.role_name)}
                      </td>
                      <td className="p-5">
                         <div className="font-bold text-slate-700">{emp.department}</div>
                         <div className="text-sm text-slate-500 mt-1">{emp.designation || "N/A"}</div>
                      </td>
                      <td className="p-5">
                        {emp.role_name === "MANAGER" ? (
                          <div className="flex flex-col items-start gap-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Leadership Node</span>
                            <button 
                              onClick={() => fetchTeam(emp.id, emp.name)}
                              className="text-sm font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-1 rounded transition-colors -ml-2"
                            >
                              Team: {emp.team_size || 0} Directs
                            </button>
                          </div>
                        ) : manager ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                               {getInitials(manager.name)}
                            </div>
                            <span className="text-sm font-bold text-slate-700">
                              {manager.name}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-block px-2 py-1 bg-red-50 text-red-500 font-bold text-xs rounded border border-red-100 uppercase">Unassigned</span>
                        )}
                      </td>
                      <td className="p-5 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(emp)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-lg transition-all"
                          title="Edit Member"
                        >
                          <Edit2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-16 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
                        <Search size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-700">No personnel found</h3>
                      <p className="text-slate-500 mt-1">Try adjusting your filters or search query.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination Mock Area */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between text-sm font-bold text-slate-500">
          <div>
            Showing {filteredEmployees.length} of {employees.length} records
          </div>
          <div className="flex gap-2">
             <button className="px-3 py-1 bg-white border border-slate-200 rounded text-slate-400 cursor-not-allowed">Previous</button>
             <button className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-700 transition-colors">Next</button>
          </div>
        </div>
      </div>

      {/* Main Members Modal (Create/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
            <div className="bg-white p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10 shadow-sm">
              <h2 className="text-2xl font-extrabold flex items-center gap-3 text-slate-800 tracking-tight">
                {modalMode === "create" ? (
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex justify-center items-center shadow-inner"><UserPlus size={20} /></div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex justify-center items-center shadow-inner"><Edit2 size={20} /></div>
                )}
                {modalMode === "create" ? "Add New Personnel" : "Update Profile"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex justify-center items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto">
              <form id="member-form" onSubmit={handleSaveMember} className="space-y-6">
                
                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50 mb-6 flex items-start gap-4">
                   <div className="mt-0.5 text-indigo-500"><Building2 size={20} /></div>
                   <div>
                     <h4 className="text-sm font-bold text-indigo-900">Enterprise Access Management</h4>
                     <p className="text-xs font-medium text-indigo-700/70 mt-1">Creating an employee automatically provisions a system account with baseline privileges.</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-bold text-slate-700 shadow-sm" placeholder="e.g. Jane Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required disabled={modalMode === "edit"} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-bold text-slate-700 shadow-sm disabled:opacity-50 disabled:bg-slate-50" placeholder="jane.doe@company.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">System Role</label>
                    <div className="relative">
                      <select name="role" value={formData.role} onChange={handleInputChange} className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-bold text-slate-700 shadow-sm cursor-pointer">
                        <option value="EMPLOYEE">Standard Employee</option>
                        <option value="MANAGER">Management / Leader Phase</option>
                      </select>
                      <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {formData.role === "EMPLOYEE" && (
                     <div className="space-y-2 animate-slide-up">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Assign Manager</label>
                      <div className="relative">
                        <select name="manager_id" value={formData.manager_id} onChange={handleInputChange} required className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-bold text-slate-700 shadow-sm cursor-pointer">
                          <option value="" disabled>-- Must Select a Manager --</option>
                          {managersList.map(mgr => (
                            <option key={mgr.id} value={mgr.id}>{mgr.name} ({mgr.department})</option>
                          ))}
                        </select>
                        <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Department Unit</label>
                    <input type="text" name="department" value={formData.department} onChange={handleInputChange} required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-bold text-slate-700 shadow-sm" placeholder="e.g. Engineering" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Designation Title</label>
                    <input type="text" name="designation" value={formData.designation} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-bold text-slate-700 shadow-sm" placeholder="e.g. Senior Developer" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Base Compensation (Annual/Monthly Scale)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input type="number" name="base_salary" value={formData.base_salary} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-bold text-slate-700 shadow-sm" placeholder="e.g. 75000" />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-6 py-3 font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm"
              >
                Discard
              </button>
              <button 
                type="submit" 
                form="member-form" 
                className="px-8 py-3 font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center gap-2"
              >
                {modalMode === "create" ? "Provision Account" : "Save Integrations"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Modal Overlay */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           {/* Frosty backdrop */}
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsTeamModalOpen(false)}></div>
          
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-slide-up flex flex-col max-h-[85vh] border border-slate-200/50">
            <div className="bg-gradient-to-r from-slate-900 to-indigo-900 p-8 flex flex-col gap-2 relative overflow-hidden">
               <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-[60px] pointer-events-none transform translate-x-1/4 -translate-y-1/4"></div>
               <div className="flex justify-between items-start z-10">
                 <div>
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 text-xs font-bold text-indigo-200 uppercase tracking-widest mb-4">
                     Team Hierarchy View
                   </div>
                   <h2 className="text-3xl font-extrabold text-white flex items-center gap-3 tracking-tight">
                     {teamManagerName}
                   </h2>
                   <p className="text-indigo-200/80 mt-2 font-medium flex items-center gap-2">
                     <Users size={16} /> Overseeing {teamMembers.length} active personnel
                   </p>
                 </div>
                 <button onClick={() => setIsTeamModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all backdrop-blur-sm">
                   <X size={20} />
                 </button>
               </div>
            </div>
            
            <div className="p-0 overflow-y-auto bg-slate-50/50">
              {teamMembers.length > 0 ? (
                <ul className="divide-y divide-slate-100">
                  {teamMembers.map(member => (
                    <li key={member.id} className="p-6 flex items-center justify-between hover:bg-white transition-colors group cursor-default">
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-full ${getAvatarColor(member.name)} text-white font-bold flex justify-center items-center shadow-md text-lg ring-4 ring-white`}>
                          {getInitials(member.name)}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{member.name}</p>
                          <p className="text-sm text-slate-500 font-medium mt-0.5 flex items-center gap-2">
                            {member.designation} <span className="w-1 h-1 rounded-full bg-slate-300"></span> {member.department}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end">
                         <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full uppercase tracking-wider">
                           Direct Report
                         </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-16 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-6">
                    <Users size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700">No Direct Reports</h3>
                  <p className="text-slate-500 font-medium mt-2 max-w-sm">
                    This leadership node currently has no assigned squad members. You can assign personnel by editing their profiles.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Credentials Modal Overlay */}
      {credentialsModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setCredentialsModal({ isOpen: false, email: "", password: "" })}></div>
           <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up flex flex-col border border-slate-200/50">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 flex flex-col items-center text-center relative overflow-hidden">
                 <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-[30px] pointer-events-none"></div>
                 <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 text-white mb-4 shadow-lg">
                    <Key size={32} />
                 </div>
                 <h2 className="text-2xl font-extrabold text-white tracking-tight">Account Provisioned!</h2>
                 <p className="text-emerald-50 font-medium mt-2 text-sm">Please securely share these temporary login credentials with the new team member.</p>
              </div>
              <div className="p-8 space-y-6">
                 <div className="space-y-4">
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">System Email</label>
                       <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 select-all cursor-text">
                         {credentialsModal.email}
                       </div>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Temporary Password</label>
                       <div className="relative">
                         <div className="w-full bg-indigo-50 border border-indigo-100/50 rounded-xl pl-4 pr-12 py-3 font-mono font-bold text-indigo-700 tracking-wider select-all cursor-text shadow-inner">
                           {credentialsModal.password}
                         </div>
                         <button 
                           onClick={() => {
                             navigator.clipboard.writeText(`Email: ${credentialsModal.email}\nPassword: ${credentialsModal.password}`);
                             setCopied(true);
                             setTimeout(() => setCopied(false), 2000);
                           }}
                           className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex justify-center items-center bg-white border border-indigo-100 rounded-lg text-indigo-500 hover:text-indigo-700 hover:shadow-sm transition-all shadow-sm"
                           title="Copy full credentials"
                         >
                           {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                         </button>
                       </div>
                    </div>
                 </div>
                 <button 
                   onClick={() => setCredentialsModal({ isOpen: false, email: "", password: "" })} 
                   className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 transition-all active:scale-95"
                 >
                   I've Saved These Credentials
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}