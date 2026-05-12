import { useState } from "react";
import ManagerSidebar from "./ManagerSidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function ManagerLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Decorative ambient background blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-fade-in pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-fade-in pointer-events-none" style={{ animationDelay: '1s' }}></div>

      <ManagerSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 flex flex-col transition-all duration-300 relative z-10 w-full min-w-0">
        <Header collapsed={collapsed} />

        <main className="flex-1 px-4 sm:px-8 py-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full animate-slide-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}


