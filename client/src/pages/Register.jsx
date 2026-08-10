import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
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
  const [verificationTimedOut, setVerificationTimedOut] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    fetch("https://mechalab-backend.onrender.com/").catch(() => {});
  }, []);

  // Polling and 60-second Timeout logic
  useEffect(() => {
    if (!isRegistered || !username || isVerifiedAndRedirecting || verificationTimedOut) return;

    const startTime = Date.now();
    const timeoutLimit = 60000; // 60 seconds

    const interval = setInterval(async () => {
      // Check if 1 minute has elapsed
      if (Date.now() - startTime > timeoutLimit) {
        clearInterval(interval);
        setVerificationTimedOut(true);
        return;
      }

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
  }, [isRegistered, username, isVerifiedAndRedirecting, verificationTimedOut, navigate]);

  async function handleResendEmail() {
    setIsResending(true);
    try {
      const response = await fetch("https://mechalab-backend.onrender.com/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        showNotification(data.message || "VERIFICATION EMAIL RESENT");
        setVerificationTimedOut(false); // Reset timer state if they want to try polling again
      } else {
        showNotification(data.message || "FAILED TO RESEND EMAIL");
      }
    } catch (error) {
      showNotification("UNABLE TO CONNECT TO THE SERVER.");
    } finally {
      setIsResending(false);
    }
  }

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
        setVerificationTimedOut(false);
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
        <div className="register-form verification-card">
          <h1 className="logo-title">
            <span className="mecha">Mecha</span>
            <span className="lab">Lab</span>
          </h1>
          <p className="register-subtitle">Account Verification</p>

          <div className="verification-body">
            {isVerifiedAndRedirecting ? (
              <div>
                <CheckCircle2 size={56} className="success-icon" />
                <p className="success-title">
                  Email Verified Successfully!
                </p>
                <p className="success-subtitle">
                  Redirecting you to login...
                </p>
              </div>
            ) : verificationTimedOut ? (
              <div>
                <AlertCircle size={56} className="warning-icon" style={{ color: "#f59e0b", margin: "0 auto 16px" }} />
                <p className="success-title" style={{ fontSize: "1.2rem", marginBottom: "8px" }}>
                  Verification Timed Out
                </p>
                <p className="verification-text" style={{ marginBottom: "20px" }}>
                  We haven't detected a verification confirmation yet. Would you like us to send another link or go back?
                </p>
                
                <button 
                  type="button" 
                  className="submit-btn" 
                  onClick={handleResendEmail} 
                  disabled={isResending}
                  style={{ marginBottom: "12px" }}
                >
                  {isResending ? <span className="spinner"></span> : "Resend Verification Link"}
                </button>

                <button 
                  type="button" 
                  className="submit-btn" 
                  style={{ backgroundColor: "#64748b" }}
                  onClick={() => {
                    setIsRegistered(false);
                    setVerificationTimedOut(false);
                  }}
                >
                  Back to Registration
                </button>
              </div>
            ) : (
              <div>
                <div className="spinner large-spinner"></div>
                <p className="verification-text">
                  We sent a verification link to <strong className="email-highlight">{email}</strong>.
                </p>
                <p className="verification-subtext">
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
          <span className="lab">Lab</span>
        </h1>
        <p className="register-subtitle">Create your new account</p>

        <div className="input-group">
          <label>Full Name</label>
          <div className="input-container">
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" autoComplete="name" required />
          </div>
        </div>

        <div className="input-group">
          <label>Username</label>
          <div className="input-container">
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username" autoComplete="username" required />
          </div>
        </div>

        <div className="input-group">
          <label>Email Address</label>
          <div className="input-container">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" autoComplete="email" required />
          </div>
        </div>

        <div className="input-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Create a password"
              autoComplete="new-password"
              required 
            />
            <button type="button" className="toggle-password-btn" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="input-group">
          <label>Confirm Password</label>
          <div className="input-container">
            <input 
              type={showPassword ? "text" : "password"} 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="Confirm your password"
              autoComplete="new-password"
              required 
            />
          </div>
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