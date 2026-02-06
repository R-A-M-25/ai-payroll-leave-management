import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("EMPLOYEE");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();

    // 🔴 MOCK LOGIN (backend will validate later)
    login(role);

    if (role === "EMPLOYEE") navigate("/employee/dashboard");
    if (role === "MANAGER") navigate("/manager/dashboard");
    if (role === "HR") navigate("/admin/dashboard");
  };

  return (
    <div className="container">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            placeholder="employee@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="EMPLOYEE">Employee</option>
            <option value="MANAGER">Manager</option>
            <option value="HR">HR</option>
          </select>
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
