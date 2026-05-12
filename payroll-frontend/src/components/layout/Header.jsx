import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";
import { Bell, Search, Hexagon, User, LogOut, Settings, CheckCircle2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const { role, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Dropdown States
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Dynamic Notifications
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();
    // Optional: Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id, isRead) => {
    if (isRead) return;
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  // Click-away listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format page title based on path
  const getPageTitle = () => {
    const segments = location.pathname.split('/').filter(Boolean);
    if (segments.length === 0) return "Dashboard";
    if (segments.length === 1) return "Workspace Overview";
    return segments[1].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const currentTitle = getPageTitle();

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate("/");
  };

  const goToProfile = () => {
    setProfileOpen(false);
    navigate(`/${role.toLowerCase()}/profile`);
  };

  return (
    <header className="mx-4 sm:mx-8 mt-4 px-6 py-4 flex flex-col sm:flex-row justify-between items-center z-50 transition-all duration-300 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm relative">
      <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
        <div className="hidden lg:flex items-center gap-3 border-r border-slate-200 pr-6 mr-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <Hexagon size={16} className="fill-indigo-100" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none mb-0.5">
              {currentTitle}
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              Active Section
            </p>
          </div>
        </div>


      </div>

      <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className={`p-2.5 rounded-xl border transition-all relative group ${notifOpen ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
          >
            <Bell size={18} className={unreadCount > 0 ? "group-hover:animate-bounce origin-top" : ""} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[9px] font-bold text-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute top-14 right-0 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden z-50 animate-slide-up origin-top-right">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wide">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-sm font-medium">No alerts right now</div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id, n.is_read)}
                      className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${!n.is_read ? 'bg-indigo-50/30' : ''}`}
                    >
                      <div className={`mt-0.5 shrink-0 ${!n.is_read ? 'text-indigo-500' : 'text-slate-400'}`}>
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        <p className={`text-sm ${!n.is_read ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1.5 tracking-wider">
                          {new Date(n.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                <button className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">View All History</button>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setProfileOpen(!profileOpen)}
            className={`flex items-center gap-3 cursor-pointer pl-1 pr-4 py-1.5 rounded-full transition-all border ${profileOpen ? 'bg-indigo-50 border-indigo-100 shadow-inner' : 'border-transparent hover:bg-slate-50 hover:border-slate-200'} group`}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center border-2 border-white shadow-sm ring-2 ring-transparent group-hover:ring-indigo-100 transition-all text-white font-bold text-sm select-none">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="text-left hidden sm:block select-none">
              <p className="text-sm font-bold text-slate-800 leading-tight">
                {user?.name || "System Admin"}
              </p>
              <p className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest leading-none mt-0.5">
                {role ? role : "WORKSPACE"}
              </p>
            </div>
          </div>

          {profileOpen && (
            <div className="absolute top-14 right-0 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden z-50 animate-slide-up origin-top-right">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <p className="text-sm font-bold text-slate-800 truncate">{user?.name || "System Admin"}</p>
                <p className="text-xs font-medium text-slate-500 truncate mt-0.5">{user?.email || "workspace@payrollmanagement.com"}</p>
              </div>
              <div className="p-2 space-y-1">
                <button
                  onClick={goToProfile}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-2 group"
                >
                  <User size={16} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  My Profile
                </button>
                <button
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-semibold text-slate-600 transition-colors flex items-center gap-2 group"
                >
                  {/* <Settings size={16} className="text-slate-400" />
                  Preferences */}
                </button>
              </div>
              <div className="p-2 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-rose-50 text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors flex items-center gap-2 group"
                >
                  <LogOut size={16} className="text-rose-400 group-hover:text-rose-500 transition-colors" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}