import { useEffect, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { User, Mail, Briefcase, Calendar, Save, X, Edit2, Lock, EyeOff, Eye, CheckCircle2, Key, AlertCircle } from "lucide-react";

export default function EmployeeProfile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: "" });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Password Security State
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/employee/profile");
        setProfile(res.data);
        setFormData({ name: res.data.name });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async () => {
    setError(null);
    if (!formData.name || formData.name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    setSaving(true);
    try {
      const res = await api.put("/employee/profile", formData);
      setProfile(res.data);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New passwords do not match!");
      return;
    }
    setPasswordSaving(true);
    setPasswordSuccess(false);
    try {
      await api.put("/employee/password", { 
        currentPassword: passwords.currentPassword, 
        newPassword: passwords.newPassword 
      });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to seamlessly update password");
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] w-full">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>
      </div>
    );
  }

  const initials = profile.name
    ? profile.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
    : "U";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in relative z-10">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] animate-float-reverse delay-300"></div>
      </div>

      {/* Header Identity Card */}
      <div className="glass-panel p-10 bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-white relative overflow-hidden shadow-[0_20px_40px_-15px_rgba(49,46,129,0.5)] rounded-3xl animate-slide-up border border-indigo-500/20">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none animate-float"></div>
        <div className="absolute -left-10 bottom-0 w-60 h-60 bg-indigo-500/20 rounded-full blur-[60px] pointer-events-none animate-float-reverse delay-500"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-white/10 to-indigo-500/20 flex items-center justify-center text-5xl font-black backdrop-blur-xl shadow-[inset_0_2px_20px_rgba(255,255,255,0.2)] border border-white/20 text-white select-none relative z-10 transition-transform duration-500 group-hover:scale-105 group-hover:shadow-[0_0_40px_rgba(99,102,241,0.4)]">
                {initials}
              </div>
              <div className="absolute inset-0 bg-indigo-400/30 rounded-full blur-2xl scale-125 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            <div className="text-center md:text-left mt-2 md:mt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 backdrop-blur-md border border-indigo-400/30 mb-4 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span>
                <span className="text-indigo-100 font-bold tracking-widest text-[10px] uppercase">Verified Identity</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 drop-shadow-xl text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-slate-300">
                {profile.name}
              </h1>
              <div className="inline-flex items-center gap-2 text-indigo-200 font-semibold bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10 shadow-sm">
                <Briefcase size={16} className="text-indigo-400" />
                {profile.department || "Organization Member"}
              </div>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-white text-indigo-900 border border-slate-200 hover:bg-slate-50 hover:text-indigo-700 px-6 py-3.5 rounded-2xl font-black transition-all duration-300 flex items-center gap-3 shadow-[0_10px_20px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_15px_30px_-10px_rgba(255,255,255,0.4)] hover:-translate-y-0.5 active:scale-95"
            >
              <Edit2 size={18} className="text-indigo-600" />
              Configure Profile
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-8 border-b-2 border-slate-100/50 px-4 animate-slide-up delay-100 relative">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-4 px-2 font-black text-sm transition-all relative group uppercase tracking-widest ${
            activeTab === "overview" ? "text-indigo-600" : "text-slate-400 hover:text-indigo-400"
          }`}
        >
          <div className="flex items-center gap-2">
            <User size={18} className="transition-transform group-hover:scale-110" /> Profile Context
          </div>
          {activeTab === "overview" && (
            <div className="absolute bottom-[-2px] left-0 w-full h-1 bg-indigo-600 rounded-t-full shadow-[0_-3px_12px_rgba(79,70,229,0.5)] z-10"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`pb-4 px-2 font-black text-sm transition-all relative group uppercase tracking-widest ${
            activeTab === "security" ? "text-indigo-600" : "text-slate-400 hover:text-indigo-400"
          }`}
        >
          <div className="flex items-center gap-2">
            <Lock size={18} className="transition-transform group-hover:scale-110" /> Credentials
          </div>
          {activeTab === "security" && (
            <div className="absolute bottom-[-2px] left-0 w-full h-1 bg-indigo-600 rounded-t-full shadow-[0_-3px_12px_rgba(79,70,229,0.5)] z-10"></div>
          )}
        </button>
      </div>

      {activeTab === "overview" && (
      <div className="glass-panel p-10 bg-white/60 backdrop-blur-3xl border border-white/60 shadow-xl shadow-slate-200/40 rounded-3xl animate-slide-up delay-200 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-indigo-50/50 rounded-full blur-[100px] pointer-events-none"></div>

        <h2 className="text-2xl font-extrabold text-slate-800 mb-8 border-b border-slate-200 pb-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner border border-indigo-100">
             <User size={20} />
          </div>
          Identity Registry
        </h2>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-center gap-3 animate-fade-in shadow-sm">
            <AlertCircle size={20} className="text-red-500 shrink-0" />
            <p className="font-bold text-sm">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-10">
          {/* Name */}
          <div className="space-y-3 group/field">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 group-hover/field:text-indigo-500 transition-colors">
              Legal Focus
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white border-2 border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-extrabold focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-sm hover:border-slate-300"
              />
            ) : (
              <p className="text-lg font-bold text-slate-800 bg-slate-50/80 px-5 py-4 rounded-2xl border border-slate-100/50 group-hover/field:bg-white group-hover/field:border-indigo-100 group-hover/field:shadow-md transition-all">
                {profile.name || "Awaiting Setup"}
              </p>
            )}
          </div>

          {/* Department */}
          <div className="space-y-3 group/field">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 group-hover/field:text-indigo-500 transition-colors">
              Organizational Unit
            </label>
            <p className="text-lg font-bold text-slate-500 bg-slate-100/50 px-5 py-4 rounded-2xl border border-slate-200/50 cursor-not-allowed">
              {profile.department || "N/A"}
              {isEditing && <span className="block text-[10px] text-slate-400 mt-1">HR strictly manages department designations.</span>}
            </p>
          </div>

          {/* Email */}
          <div className="space-y-3 group/field">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 group-hover/field:text-indigo-500 transition-colors">
              Primary Connectivity
            </label>
            <p className="text-lg font-bold text-slate-500 bg-slate-100/50 px-5 py-4 rounded-2xl border border-slate-200/50 group-hover/field:text-slate-800 transition-colors cursor-not-allowed">
              {profile.email}
            </p>
          </div>

          {/* DOJ */}
          <div className="space-y-3 group/field">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 group-hover/field:text-indigo-500 transition-colors">
              Induction Timestamp
            </label>
            <p className="text-lg font-bold text-slate-500 bg-slate-100/50 px-5 py-4 rounded-2xl border border-slate-200/50 group-hover/field:text-slate-800 transition-colors cursor-not-allowed flex items-center gap-2">
              <Calendar size={18} className="text-indigo-400" />
              {profile.doj ? new Date(profile.doj).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "Not initialized"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-slate-200 animate-slide-up">
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <><Save size={18} /> Push Configuration</>
              )}
            </button>

            <button
              onClick={() => setIsEditing(false)}
              disabled={saving}
              className="bg-white text-slate-500 px-10 py-4 rounded-2xl font-black border-2 border-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
            >
              <X size={18} /> Abort
            </button>
          </div>
        )}
      </div>
      )}

      {activeTab === "security" && (
      <div className="glass-panel p-0 overflow-hidden animate-slide-up delay-200 bg-white/60 backdrop-blur-3xl border border-white/60 shadow-xl shadow-slate-200/40 rounded-3xl group">
        {/* Security Details Section */}
        <div className="flex flex-col md:flex-row h-full">
          
          {/* Left Context Pane */}
          <div className="w-full md:w-2/5 bg-slate-50/80 border-r border-slate-200/60 p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
               <div className="w-16 h-16 bg-white text-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-[0_10px_20px_-10px_rgba(79,70,229,0.3)] border border-indigo-100 group-hover:scale-110 transition-transform duration-500">
                 <Lock size={32} />
               </div>
               <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">Authentication<br/>Protocol</h2>
               <p className="mt-5 text-[15px] font-semibold text-slate-500 leading-relaxed max-w-sm">
                 Update your enterprise cryptographic credentials here. 
                 Ensure your new password uses a complex combination of upper and lowercase characters.
               </p>
            </div>
               
            <div className="mt-12 bg-rose-50 border border-rose-100 p-5 rounded-2xl flex gap-4 text-rose-800 text-sm font-bold shadow-inner relative z-10 hover:bg-rose-100 transition-colors">
               <div className="shrink-0 mt-1"><EyeOff size={20} className="text-rose-500" /></div>
               <p className="leading-relaxed">This workspace utilizes one-way bcrypt hashing. Administrators cannot view or recover your raw credentials.</p>
            </div>
          </div>

          {/* Right Form Pane */}
          <div className="w-full md:w-3/5 p-10 bg-white">
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-5 mb-8">
              <h3 className="text-xl font-extrabold text-slate-800">Secure Modification</h3>
              {passwordSuccess && (
                 <span className="flex items-center gap-2 text-xs font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 animate-slide-up shadow-sm uppercase tracking-widest">
                   <CheckCircle2 size={16} /> Keys Rotated
                 </span>
              )}
            </div>

            {error && (
              <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-center gap-3 animate-fade-in shadow-sm max-w-md ml-auto mr-auto lg:ml-0 lg:mr-0">
                <AlertCircle size={20} className="text-red-500 shrink-0" />
                <p className="font-bold text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handlePasswordUpdate} className="space-y-7 max-w-md ml-auto mr-auto lg:ml-0 lg:mr-0">
               <div className="space-y-3 relative group/pass">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 group-hover/pass:text-indigo-500 transition-colors">
                   Extant Passphrase
                 </label>
                 <div className="relative">
                   <input
                     type={showPassword ? "text" : "password"}
                     name="currentPassword"
                     required
                     value={passwords.currentPassword}
                     onChange={handlePasswordChange}
                     placeholder="••••••••••••"
                     className="w-full bg-white border-2 border-slate-200 rounded-2xl pl-5 pr-14 py-4 text-slate-800 font-extrabold focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-sm hover:border-slate-300 tracking-widest"
                   />
                   <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 p-2 rounded-xl">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                   </button>
                 </div>
               </div>
               
               <div className="space-y-3 relative group/pass">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 group-hover/pass:text-indigo-500 transition-colors">
                   Next-Gen Passphrase
                 </label>
                 <input
                   type={showPassword ? "text" : "password"}
                   name="newPassword"
                   required
                   minLength={6}
                   value={passwords.newPassword}
                   onChange={handlePasswordChange}
                   placeholder="Create a sophisticated key"
                   className="w-full bg-white border-2 border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-extrabold focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-sm hover:border-slate-300"
                 />
               </div>

               <div className="space-y-3 relative group/pass">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 group-hover/pass:text-indigo-500 transition-colors">
                   Validate Key
                 </label>
                 <input
                   type={showPassword ? "text" : "password"}
                   name="confirmPassword"
                   required
                   minLength={6}
                   value={passwords.confirmPassword}
                   onChange={handlePasswordChange}
                   placeholder="Mirror the next-gen key"
                   className="w-full bg-white border-2 border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-extrabold focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-sm hover:border-slate-300"
                 />
               </div>

               <button
                 type="submit"
                 disabled={passwordSaving || !passwords.currentPassword || !passwords.newPassword}
                 className="w-full bg-indigo-600 text-white px-8 py-4.5 rounded-2xl font-black shadow-[0_10px_20px_-10px_rgba(79,70,229,0.5)] hover:bg-indigo-700 hover:shadow-[0_15px_30px_-10px_rgba(79,70,229,0.6)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-8 active:scale-[0.98]"
               >
                 {passwordSaving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 ) : (
                    <><Key size={20} /> Deploy Security Protocol</>
                 )}
               </button>
            </form>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}