import { Link } from "react-router-dom";
import { Users, Receipt, Building, Briefcase, Activity, ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-slide-up">
      {/* Hero Header */}
      <div className="glass-panel p-8 md:p-12 bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 text-white relative overflow-hidden border-none shadow-2xl shadow-indigo-500/20">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -left-10 bottom-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-[60px] pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md mb-6 border border-white/20 text-sm font-bold shadow-sm">
            <ShieldCheck size={16} className="text-cyan-300" />
            <span className="text-cyan-50">Authorized HR Workspace</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-sm mb-4 leading-tight">
            Admin Dashboard
          </h1>
          <p className="text-indigo-100 text-lg md:text-xl font-medium leading-relaxed">
            Centralized control center for your organization's human capital and financial distributions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Organization Hub Card */}
        <Link to="/hr/employees" className="group">
          <div className="glass-panel p-8 h-full bg-white transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 relative overflow-hidden border border-slate-200/50">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 scale-150 transform group-hover:scale-110">
              <Building size={160} />
            </div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <Users size={32} />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">
                Organization Hub
              </h2>
              <p className="text-slate-500 leading-relaxed mb-8 flex-grow">
                Manage your workforce comprehensively. Create new employee accounts, assign leadership roles, update department matrices, and visualize reporting hierarchies.
              </p>
              
              <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-sm tracking-wider group-hover:gap-4 transition-all w-max bg-indigo-50/50 px-4 py-2 rounded-lg">
                Manage Workforce <Briefcase size={16} />
              </div>
            </div>
          </div>
        </Link>

        {/* Payroll Center Card */}
        <Link to="/hr/payroll-management" className="group">
          <div className="glass-panel p-8 h-full bg-white transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 relative overflow-hidden border border-slate-200/50">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 scale-150 transform group-hover:scale-110">
              <Activity size={160} />
            </div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <Receipt size={32} />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-emerald-600 transition-colors">
                Payroll Center
              </h2>
              <p className="text-slate-500 leading-relaxed mb-8 flex-grow">
                End-to-end salary execution. Assign employee compensations, run automated monthly payroll cycles with LOP deductions, and review historical disbursements.
              </p>
              
              <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase text-sm tracking-wider group-hover:gap-4 transition-all w-max bg-emerald-50/50 px-4 py-2 rounded-lg">
                Process Payroll <Receipt size={16} />
              </div>
            </div>
          </div>
        </Link>
        
      </div>
    </div>
  );
}