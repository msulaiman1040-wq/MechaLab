import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { showNotification } from "../managers/NotificationManager";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false); // <-- Tracks if registration was successful

  useEffect(() => {
    fetch("https://mechalab-backend.onrender.com/").catch(() => {});
  }, []);

  async function handleRegister(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      showNotification("PASSWORDS DO NOT MATCH.");
      return;
    }

    if (password.length < 6) {
      showNotification("PASSWORD MUST BE AT LEAST 6 CHARACTERS LONG.");
      return;
    }

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);

    if (!hasLetter || !hasNumber || !hasSymbol) {
      showNotification("PASSWORD MUST CONTAIN LETTERS, NUMBERS, AND SYMBOLS.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://mechalab-backend.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, username, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        showNotification(data.message || "REGISTRATION SUCCESSFUL");
        setIsRegistered(true); // <-- Switch view to pending verification notice
      } else {
        showNotification(data.message || "REGISTRATION FAILED");
      }
    } catch (error) {
      showNotification("UNABLE TO CONNECT TO THE SERVER.");
    } finally {
      setIsLoading(false);
    }
  }

  // If registered successfully, show the verification waiting screen instead of the form
  if (isRegistered) {
    return (
      <div className="register-container">
        <div className="register-form" style={{ textAlign: "center" }}>
          <h1 className="logo-title">
            <span className="mecha">Mecha</span>
            <span className="lab">Lab</span> Verification
          </h1>
          <p style={{ margin: "20px 0", color: "#ccc", lineHeight: "1.6" }}>
            Registration successful! We have sent a verification link to <strong style={{ color: "#fff" }}>{email}</strong>. 
            Please check your inbox and click the link to activate your account before logging in.
          </p>
          <Link to="/login" style={{ color: "#0047AB", textDecoration: "none", fontWeight: "bold", display: "inline-block", marginTop: "15px" }}>
            Proceed to Login
          </Link>
        </div>
      </div>
    );
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

        <label>Email Address</label>
        <div className="input-container">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
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

        <label>Confirm Password</label>
        <div className="input-container">
          <input 
            type={showPassword ? "text" : "password"} 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? <span className="spinner"></span> : "Create Account"}
        </button>

        <p className="redirect-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;