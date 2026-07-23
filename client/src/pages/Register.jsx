import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { showNotification } from "../managers/NotificationManager";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        showNotification(data.message || "REGISTRATION SUCCESSFUL");
        navigate("/login");
      } else {
        showNotification(data.message || "REGISTRATION FAILED");
      }
    } catch (error) {
      showNotification("UNABLE TO CONNECT TO THE SERVER.");
    }
  }

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h1 className="logo-title">
          <span className="mecha">Mecha</span>
          <span className="lab">Lab</span> Register
        </h1>

        <label>Full Name</label>
        <div className="input-container">
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>

        <label>Username</label>
        <div className="input-container">
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>

        <label>Password</label>
        <div className="password-wrapper">
          <input 
            type={showPassword ? "text" : "password"} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="button" className="toggle-password-btn" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button type="submit" className="submit-btn">Create Account</button>

        <p className="redirect-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;