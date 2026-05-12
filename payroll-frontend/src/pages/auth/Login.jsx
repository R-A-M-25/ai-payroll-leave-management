import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";
import { Mail, Lock, ArrowRight, ShieldCheck, Activity, AlertCircle, Sparkles } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      // Secure Login Injection
      login({
        token: res.data.token,
        role: res.data.role,
      });

      // Role-Based Router Handoff
      if (res.data.role === "EMPLOYEE") navigate("/employee/dashboard");
      if (res.data.role === "MANAGER") navigate("/manager/dashboard");
      if (res.data.role === "HR") navigate("/admin/dashboard");
    } catch (err) {
      if (err.response && err.response.status >= 400 && err.response.status < 500) {
        setError(err.response.data.message || "Invalid credentials. Please attempt authentication again.");
      } else {
        setError("Authorization matrix is currently unreachable. Please contact IT architecture.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-slate-900 bg-[#0a0a0a] relative overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* Massive, slow-moving, cinematic background lights */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-indigo-900/40 blur-[150px] mix-blend-screen animate-float opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-900/30 blur-[120px] mix-blend-screen animate-float-reverse opacity-50 delay-1000"></div>
        <div className="absolute top-[40%] left-[60%] w-[40vw] h-[40vw] rounded-full bg-violet-800/20 blur-[100px] mix-blend-screen animate-pulse opacity-40 delay-700"></div>
        {/* Deep, subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]"></div>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center p-4 sm:p-8">
        
        {/* Centered Brand Presence */}
        <div className="mb-10 text-center animate-slide-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-[0_0_40px_rgba(79,70,229,0.4)] mb-6 border border-white/10 ring-4 ring-white/5">
             <ShieldCheck size={32} className="text-white drop-shadow-lg" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white drop-shadow-xl mb-3">
            PayrollManagement
          </h1>
          <p className="text-indigo-200/80 font-medium text-sm md:text-base tracking-wide uppercase">
            Workforce Command Center
          </p>
        </div>

        {/* Central Floating Authentication Card */}
        <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,1)] p-8 sm:p-12 animate-slide-up" style={{ animationDelay: "150ms" }}>
          
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Sign In</h2>
            <p className="text-slate-400 text-sm font-medium">Authenticate to access your workspace</p>
          </div>

          {error && (
            <div className="mb-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 backdrop-blur-md">
              <AlertCircle size={18} className="text-rose-400 shrink-0" />
              <p className="text-sm font-semibold text-rose-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="space-y-2 relative group/input">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-white transition-colors" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@company.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white text-[15px] font-medium focus:outline-none focus:bg-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/20 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-2 relative group/input">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-white transition-colors" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white text-[15px] tracking-widest font-medium focus:outline-none focus:bg-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/20 transition-all placeholder:text-slate-600 placeholder:tracking-normal"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-3 cursor-pointer group hover:opacity-100 opacity-80 transition-opacity">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" className="w-4 h-4 rounded appearance-none border border-white/30 checked:bg-indigo-500 checked:border-indigo-500 transition-colors cursor-pointer bg-white/5" />
                  <svg className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className="text-sm font-medium text-slate-300">Remember me</span>
              </label>
              
              <button type="button" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black hover:bg-slate-200 rounded-2xl py-4 font-bold text-[15px] shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8 overflow-hidden group relative"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              ) : (
                <>Sign into Workspace <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

        </div>

        {/* Minimal Footer */}
        <div className="mt-12 text-slate-500/80 text-xs font-medium tracking-wide animate-slide-up" style={{ animationDelay: "300ms" }}>
          <p>PROTECTED BY PAYROLLMANAGEMENT ENTERPRISE ENCRYPTION</p>
        </div>

      </div>
    </div>
  );
}
