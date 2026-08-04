import { useState } from "react";
import { Link } from "react-router-dom";
import { showNotification } from "../managers/NotificationManager";
import "./Login.css"; // Reusing your login form styles

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleForgotPassword(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("https://mechalab-backend.onrender.com/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      showNotification(data.message || "If that email exists, a reset link has been sent.");
    } catch (error) {
      showNotification("UNABLE TO CONNECT TO THE SERVER.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleForgotPassword}>
        <h1 className="logo-title">
          <span className="mecha">Mecha</span>
          <span className="lab">Lab</span> Reset
        </h1>

        <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "15px", textAlign: "center" }}>
          Enter your account email and we'll send you a link to reset your password.
        </p>

        <label>Email Address</label>
        <div className="input-container">
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? <span className="spinner"></span> : "Send Reset Link"}
        </button>

        <p className="redirect-text">
          Remembered your password? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;