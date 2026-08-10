import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { showNotification } from "../managers/NotificationManager";
import "./Login.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleResetPassword(e) {
    e.preventDefault();

    if (!token) {
      showNotification("MISSING OR INVALID RESET TOKEN.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification("PASSWORDS DO NOT MATCH.");
      return;
    }

    if (newPassword.length < 6) {
      showNotification("PASSWORD MUST BE AT LEAST 6 CHARACTERS LONG.");
      return;
    }

    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSymbol = /[^a-zA-Z0-9]/.test(newPassword);

    if (!hasLetter || !hasNumber || !hasSymbol) {
      showNotification("PASSWORD MUST CONTAIN LETTERS, NUMBERS, AND SYMBOLS.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://mechalab-backend.onrender.com/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        showNotification(data.message || "PASSWORD RESET SUCCESSFUL");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        showNotification(data.message || "PASSWORD RESET FAILED");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      showNotification("UNABLE TO CONNECT TO THE SERVER.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleResetPassword}>
        <h1 className="logo-title">
          <span className="mecha">Mecha</span>
          <span className="lab">Lab</span>
        </h1>
        <p className="login-subtitle">Set new password</p>

        <div className="input-group">
          <label>New Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="input-group">
          <label>Confirm New Password</label>
          <div className="input-container">
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              autoComplete="new-password"
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? <span className="spinner"></span> : "Update Password"}
        </button>

        <p className="redirect-text">
          Remembered your password? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default ResetPassword;