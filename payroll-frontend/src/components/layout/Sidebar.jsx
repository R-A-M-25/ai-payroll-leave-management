import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { navigationConfig } from "../../config/navigation";
import { Menu } from "lucide-react";

export default function Sidebar({ collapsed, setCollapsed }) {
  const { role } = useAuth();
  const links = navigationConfig[role] || [];

  return (
    <aside
      className={`transition-all duration-300 bg-white border-r border-gray-200 shadow-sm ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Section */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
        {!collapsed && (
          <span className="text-lg font-semibold text-gray-900">
            PayrollPro
          </span>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex flex-col gap-2 px-3">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            {!collapsed && link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}