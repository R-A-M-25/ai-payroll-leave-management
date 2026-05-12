import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, ArrowRight, ShieldCheck, Activity, AlertCircle, Fingerprint, Sparkles } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, role, user } = res.data;

      // Secure Login Injection
      login(token, role, user);

      // Role-Based Router Handoff
      if (role === "EMPLOYEE") navigate("/employee");
      else if (role === "MANAGER") navigate("/manager");
      else if (role === "HR") navigate("/hr");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Dynamic Ambient Background */}
      <div
        className="absolute inset-0 z-0 transition-transform duration-1000 ease-out"
        style={{ transform: `translate(${(mousePos.x - window.innerWidth / 2) * -0.02}px, ${(mousePos.y - window.innerHeight / 2) * -0.02}px)` }}
      >
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-indigo-900/20 mix-blend-screen filter blur-[100px] opacity-50 animate-blob pointer-events-none"></div>
        <div className="absolute top-[20%] right-[-20%] w-[60vw] h-[60vw] rounded-full bg-blue-900/20 mix-blend-screen filter blur-[120px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[80vw] h-[80vw] rounded-full bg-violet-900/20 mix-blend-screen filter blur-[150px] opacity-30 animate-blob animation-delay-4000 pointer-events-none"></div>
      </div>

      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay z-0 pointer-events-none"></div>

      {/* Main Glass Container */}
      <div className="relative z-10 w-full max-w-6xl rounded-[3rem] bg-white/[0.02] backdrop-blur-3xl border border-white/[0.05] shadow-2xl shadow-black/50 overflow-hidden flex flex-col lg:flex-row animate-scale-up ring-1 ring-white/10">

        {/* Left Side: Brand Identity */}
        <div className="w-full lg:w-5/12 p-10 lg:p-16 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          <div className="relative z-10 animate-fade-in delay-150">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-12 transform hover:scale-105 transition-transform duration-300">
              <ShieldCheck size={14} className="text-indigo-400" />
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Enterprise Secured</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black tracking-tighter text-white mb-6 leading-[1.1]">
              Payroll <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 animate-gradient-x">
                Management
              </span>
            </h1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
              The next-generation OS for payroll, intelligent leave management, and organizational clarity.
            </p>
          </div>

          <div className="relative z-10 mt-16 p-6 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md hover:bg-white/[0.05] transition-colors duration-300 animate-fade-in delay-300">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <Activity size={18} className="text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 text-sm">System Telemetry</h4>
                  <p className="text-xs font-medium text-emerald-400 mt-0.5 flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    All Systems Nominal
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication */}
        <div className="w-full lg:w-7/12 p-8 sm:p-12 lg:p-20 relative bg-[#0a0a0a]/60 backdrop-blur-xl lg:border-l border-white/[0.05]">
          <div className="max-w-md w-full mx-auto relative z-10">
            <div className="mb-12 animate-fade-in delay-200">
              <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                Welcome Back
                <Sparkles size={24} className="text-indigo-400 animate-pulse" />
              </h2>
              <p className="text-slate-400 font-medium mt-2 text-sm">Authenticate to access your workspace.</p>
            </div>

            {error && (
              <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 backdrop-blur-md animate-shake">
                <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-200">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6 animate-fade-in delay-400">
              <div className="space-y-2 relative group">
                <label className={`text-[10px] font-bold uppercase tracking-widest ml-1 transition-colors duration-300 ${focusedField === 'email' ? 'text-indigo-400' : 'text-slate-500'}`}>Corporate Email</label>
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl blur opacity-0 transition-opacity duration-300 ${focusedField === 'email' ? 'opacity-20' : ''}`}></div>
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 z-20 ${focusedField === 'email' ? 'text-indigo-400' : 'text-slate-500'}`} size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="name@company.com"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white font-medium focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all relative z-10 placeholder:text-slate-600 shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-2 relative group mt-6">
                <label className={`text-[10px] font-bold uppercase tracking-widest ml-1 transition-colors duration-300 ${focusedField === 'password' ? 'text-indigo-400' : 'text-slate-500'}`}>Password</label>
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl blur opacity-0 transition-opacity duration-300 ${focusedField === 'password' ? 'opacity-20' : ''}`}></div>
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 z-20 ${focusedField === 'password' ? 'text-indigo-400' : 'text-slate-500'}`} size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white font-medium focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all relative z-10 placeholder:text-slate-600 shadow-inner"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer appearance-none w-5 h-5 rounded border border-white/20 bg-white/5 checked:bg-indigo-500 checked:border-indigo-500 transition-all cursor-pointer" />
                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-400 group-hover:text-slate-200 transition-colors">Remember me</span>
                </label>
                <button type="button" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors hover:underline underline-offset-4">
                  Identify Issues?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl py-4 font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-8 relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_-15px_rgba(99,102,241,0.7)]"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    {/* <Fingerprint size={18} className="text-indigo-200 group-hover:scale-110 transition-transform" /> */}
                    Authorize Access
                    <ArrowRight size={16} className="ml-1 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-white/10 text-center animate-fade-in delay-500">
              <p className="text-xs font-medium text-slate-500 tracking-wide uppercase">
                Protected by PayrollManagement Access &bull; v3.0
              </p>
              {/* <div className="mt-4 inline-flex flex-col gap-1 items-center bg-white/[0.02] border border-white/5 rounded-xl p-3 hover:bg-white/[0.04] transition-colors cursor-default">
                 <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Demo Credentials</span>
                 <code className="text-xs text-indigo-300 font-mono">emp1@payroll.com / password123</code>
               </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

