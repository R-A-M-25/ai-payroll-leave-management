import { useState, useEffect } from "react";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { CalendarRange, Info, CheckCircle2, AlertCircle, Send } from "lucide-react";

export default function ApplyLeave() {
  const { token } = useAuth();
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    leave_type: "CL",
    start_date: "",
    end_date: "",
    reason: ""
  });

  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ================= FETCH BALANCE ================= */
  useEffect(() => {
    if (token) {
      fetchBalance();
    }
  }, [token]);

  const fetchBalance = async () => {
    try {
      const res = await api.get("/leaves/balance");

      setBalance(res.data);

      // Auto-switch to LOP if CL and SL exhausted
      if (res.data.CL <= 0 && res.data.SL <= 0) {
        setFormData((prev) => ({
          ...prev,
          leave_type: "LOP"
        }));
      }
    } catch (err) {
      console.error("Error fetching balance", err);
    }
  };

  /* ================= HELPERS ================= */
  const calculateDays = () => {
    if (!formData.start_date || !formData.end_date) return 0;

    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);

    if (start > end) return 0;

    return (end - start) / (1000 * 60 * 60 * 24) + 1;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!formData.start_date || !formData.end_date || !formData.reason) {
      return setError("All fields are required.");
    }

    if (new Date(formData.start_date) > new Date(formData.end_date)) {
      return setError("End date cannot be before start date.");
    }

    if (formData.reason.trim().length < 5) {
      return setError("Reason must be at least 5 characters.");
    }

    try {
      setLoading(true);

      const res = await api.post("/leaves/apply", formData);

      setSuccess(res.data.message);

      // Refresh balance after submission
      fetchBalance();

      setFormData({
        leave_type: "CL",
        start_date: "",
        end_date: "",
        reason: ""
      });

    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to submit leave request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="glass-panel p-8 bg-gradient-to-br from-indigo-600/90 to-blue-700/90 text-white relative overflow-hidden border-none shadow-xl shadow-indigo-500/20">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Apply for Leave
          </h1>
          <p className="text-indigo-100 max-w-2xl text-lg opacity-90">
            Submit your leave request for manager approval. Check your balance below.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Panel */}
        <div className="md:col-span-1 space-y-6 animate-slide-up">
          <div className="glass-panel p-6 bg-gradient-to-b from-white to-slate-50 border-t-4 border-t-blue-500 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <CalendarRange size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">Leave Balance</h2>
            <p className="text-sm text-slate-500 mb-6">Available quota for this year</p>
            
            {balance ? (
              <div className="w-full space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <span className="font-semibold text-slate-600">Casual (CL)</span>
                  <span className={`text-lg font-black ${balance.CL > 0 ? 'text-blue-600' : 'text-red-500'}`}>{balance.CL}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <span className="font-semibold text-slate-600">Sick (SL)</span>
                  <span className={`text-lg font-black ${balance.SL > 0 ? 'text-amber-500' : 'text-red-500'}`}>{balance.SL}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <span className="font-semibold text-slate-600">LOP</span>
                  <span className="text-lg font-black text-slate-400">∞</span>
                </div>
              </div>
            ) : (
              <div className="w-full h-32 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          <div className="glass-panel p-5 bg-blue-50/50 border border-blue-100 hidden md:flex items-start gap-3">
            <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800 leading-relaxed font-medium">
              Leave requests are subject to approval. Sick leaves of more than 2 consecutive days may require a medical certificate.
            </p>
          </div>
        </div>

        {/* Application Form */}
        <div className="glass-panel p-6 md:p-8 md:col-span-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Leave Details</h2>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 animate-fade-in">
              <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-3 animate-fade-in">
              <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-emerald-700">{success}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Leave Type</label>
              <select
                name="leave_type"
                value={formData.leave_type}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-medium appearance-none cursor-pointer"
              >
                <option value="CL" disabled={balance && balance.CL <= 0}>Casual Leave (CL)</option>
                <option value="SL" disabled={balance && balance.SL <= 0}>Sick Leave (SL)</option>
                <option value="LOP">Loss of Pay (LOP)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  min={today}
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  min={formData.start_date || today}
                  value={formData.end_date}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-medium"
                />
              </div>
            </div>

            {calculateDays() > 0 && (
              <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-fade-in">
                <CalendarRange size={18} />
                Calculated Duration: {calculateDays()} {calculateDays() === 1 ? 'Day' : 'Days'}
              </div>
            )}

            <div>
              <div className="flex justify-between items-end mb-2 ml-1">
                <label className="block text-sm font-semibold text-slate-700">Reason for Leave</label>
                <span className={`text-xs font-medium ${formData.reason.length > 180 ? 'text-orange-500' : 'text-slate-400'}`}>
                  {formData.reason.length}/200
                </span>
              </div>
              <textarea
                name="reason"
                maxLength={200}
                value={formData.reason}
                onChange={handleChange}
                rows="4"
                placeholder="Briefly describe the reason for your leave request..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-medium resize-none placeholder:text-slate-400"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 font-bold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-4!"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Submit Leave Request <Send size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}