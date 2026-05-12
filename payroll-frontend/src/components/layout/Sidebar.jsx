import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { navigationConfig } from "../../config/navigation";
import { 
  Menu, LogOut, LayoutDashboard, Calendar, FileText, 
  User, BarChart2, Users, Receipt, Briefcase, Activity
} from "lucide-react";

export default function Sidebar({ collapsed, setCollapsed }) {
  const { role, logout } = useAuth();
  const links = navigationConfig[role] || [];

  const getIcon = (name) => {
    switch (name.toLowerCase()) {
      case 'dashboard':
      case 'overview': return <LayoutDashboard size={20} />;
      case 'analytics': return <BarChart2 size={20} />;
      case 'leaves':
      case 'leave requests':
      case 'apply leave': return <Calendar size={20} />;
      case 'payslips':
      case 'payroll': return <Receipt size={20} />;
      case 'profile': return <User size={20} />;
      case 'employees':
      case 'team members': return <Users size={20} />;
      default: return <FileText size={20} />;
    }
  };

  return (
    <aside
      className={`relative z-20 flex flex-col transition-all duration-300 bg-white border-r border-slate-200/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] shrink-0 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-8 relative group">
        {!collapsed ? (
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 overflow-hidden">
              <div className="absolute inset-0 bg-white/20 hover:bg-white/0 transition-colors pointer-events-none"></div>
              <Activity className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-slate-800 tracking-tight leading-tight">
                Payroll<span className="text-indigo-600">Management</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">System</span>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-fade-in">
             <Activity className="text-white" size={24} />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`absolute -right-3 top-10 transform -translate-y-1/2 w-7 h-7 bg-white border border-slate-200 shadow-sm rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:scale-110 hover:shadow-md transition-all z-30 opacity-0 group-hover:opacity-100 hidden sm:flex`}
        >
          <Menu size={14} className={collapsed ? "" : "rotate-180 transition-transform"} />
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-2 px-4 mt-2 overflow-y-auto hide-scrollbar">
        {!collapsed && <div className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 mt-4">Main Navigation</div>}
        
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all group relative overflow-hidden ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-indigo-100/50"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-transparent"
              } ${collapsed ? 'justify-center' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full shadow-[0_0_10px_rgba(79,70,229,0.8)]"></div>
                )}
                
                <div className={`${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500 transition-colors"}`}>
                  {getIcon(link.name)}
                </div>
                
                {!collapsed && <span className="tracking-wide z-10">{link.name}</span>}
                
                {!collapsed && isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 opacity-50 relative before:absolute before:inset-0 before:bg-indigo-400 before:animate-ping before:rounded-full"></div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={logout}
          className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all group ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={20} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
          {!collapsed && <span className="tracking-wide">Secure Logout</span>}
        </button>
      </div>
    </aside>
  );
}