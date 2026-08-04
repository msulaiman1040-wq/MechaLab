import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
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
  const [isRegistered, setIsRegistered] = useState(false);
  const [isVerifiedAndRedirecting, setIsVerifiedAndRedirecting] = useState(false);

  useEffect(() => {
    fetch("https://mechalab-backend.onrender.com/").catch(() => {});
  }, []);

  // Live polling effect to detect when the user verifies their email in another tab/window
  useEffect(() => {
    if (!isRegistered || !username || isVerifiedAndRedirecting) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`https://mechalab-backend.onrender.com/api/auth/check-status?username=${encodeURIComponent(username)}`);
        const data = await response.json();

        if (response.ok && data.isVerified) {
          clearInterval(interval);
          setIsVerifiedAndRedirecting(true);
          showNotification("EMAIL VERIFIED SUCCESSFULLY!");
          setTimeout(() => {
            navigate("/login");
          }, 2000); 
        }
      } catch (error) {
        // Silently retry on minor network hiccups
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isRegistered, username, isVerifiedAndRedirecting, navigate]);

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
        setIsRegistered(true);
      } else {
        showNotification(data.message || "REGISTRATION FAILED");
      }
    } catch (error) {
      showNotification("UNABLE TO CONNECT TO THE SERVER.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isRegistered) {
    return (
      <div className="register-container">
        <div className="register-form" style={{ textAlign: "center" }}>
          <h1 className="logo-title">
            <span className="mecha">Mecha</span>
            <span className="lab">Lab</span> Verification
          </h1>

          <div style={{ margin: "40px 0" }}>
            {isVerifiedAndRedirecting ? (
              <div>
                <CheckCircle2 size={56} color="#00ff66" style={{ margin: "0 auto 20px auto", animation: "popIn 0.3s ease-in-out" }} />
                <p style={{ color: "#00ff66", fontWeight: "bold", fontSize: "16px" }}>
                  Email Verified Successfully!
                </p>
                <p style={{ color: "#ccc", fontSize: "13px", marginTop: "8px" }}>
                  Redirecting you to login...
                </p>
              </div>
            ) : (
              <div>
                <div className="spinner" style={{ width: "45px", height: "45px", borderWidth: "4px", margin: "0 auto 20px auto" }}></div>
                <p style={{ color: "#ccc", lineHeight: "1.6" }}>
                  We sent a verification link to <strong style={{ color: "#fff" }}>{email}</strong>.
                </p>
                <p style={{ color: "#888", fontSize: "13px", marginTop: "12px" }}>
                  Waiting for verification... This screen will automatically log you through once confirmed.
                </p>
              </div>
            )}
          </div>
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
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" required />
        </div>

        <label>Username</label>
        <div className="input-container">
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
        </div>

        <label>Email Address</label>
        <div className="input-container">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </div>

        <label>Password</label>
        <div className="password-wrapper">
          <input 
            type={showPassword ? "text" : "password"} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            autoComplete="new-password"
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
            autoComplete="new-password"
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