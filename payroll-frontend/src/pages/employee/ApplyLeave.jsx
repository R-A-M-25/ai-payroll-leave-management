import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

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
      const res = await axios.get(
        "http://localhost:5000/api/leaves/balance",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setBalance(res.data.balance);

      // Auto-switch to LOP if CL and SL exhausted
      if (
        res.data.balance.CL <= 0 &&
        res.data.balance.SL <= 0
      ) {
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

      const res = await axios.post(
        "http://localhost:5000/api/leaves/apply",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

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
        err.response?.data?.message || "Failed to submit leave."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10">

      <h1 className="text-3xl font-semibold text-gray-900">
        Apply for Leave
      </h1>

      {/* Balance Display */}
      {balance && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700">
          <div className="flex gap-6">
            <span><strong>CL:</strong> {balance.CL}</span>
            <span><strong>SL:</strong> {balance.SL}</span>
            <span><strong>LOP:</strong> Unlimited</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-10 space-y-6">

        {/* Leave Type */}
        <div>
          <label className="text-sm text-gray-500">Leave Type</label>

          <select
            name="leave_type"
            value={formData.leave_type}
            onChange={handleChange}
            className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3"
          >
            <option value="CL" disabled={balance && balance.CL <= 0}>
              Casual Leave (CL)
            </option>

            <option value="SL" disabled={balance && balance.SL <= 0}>
              Sick Leave (SL)
            </option>

            <option value="LOP">
              Loss of Pay (LOP)
            </option>
          </select>
        </div>

        {/* Dates */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-500">From Date</label>
            <input
              type="date"
              name="start_date"
              min={today}
              value={formData.start_date}
              onChange={handleChange}
              className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">To Date</label>
            <input
              type="date"
              name="end_date"
              min={formData.start_date || today}
              value={formData.end_date}
              onChange={handleChange}
              className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3"
            />
          </div>
        </div>

        {/* Auto Days */}
        {calculateDays() > 0 && (
          <div className="bg-blue-50 text-blue-600 px-4 py-3 rounded-xl text-sm">
            Total Leave Days: {calculateDays()}
          </div>
        )}

        {/* Reason */}
        <div>
          <label className="text-sm text-gray-500">
            Reason ({formData.reason.length}/200)
          </label>

          <textarea
            name="reason"
            maxLength={200}
            value={formData.reason}
            onChange={handleChange}
            rows="4"
            className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-green-50 text-green-600 px-4 py-3 rounded-xl text-sm">
            {success}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-6 py-3 rounded-xl text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Submitting..." : "Submit Leave Request"}
        </button>

      </div>
    </div>
  );
}