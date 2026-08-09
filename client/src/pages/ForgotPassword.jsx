import { useState } from "react";
import { Link } from "react-router-dom";
import { showNotification } from "../managers/NotificationManager";
import "./Login.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleForgotPassword(e) {
    e.preventDefault();

    if (!email.trim()) {
      showNotification("PLEASE ENTER YOUR EMAIL ADDRESS.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://mechalab-backend.onrender.com/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        showNotification(
          data.message ||
            "IF AN ACCOUNT EXISTS WITH THIS EMAIL, A RESET LINK HAS BEEN SENT."
        );
      } else {
        showNotification(
          data.message ||
            "UNABLE TO PROCESS PASSWORD RESET REQUEST."
        );
      }
    } catch (error) {
      console.error("Forgot password error:", error);

      showNotification(
        "UNABLE TO CONNECT TO THE SERVER."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-form">
      <h1>Mecha</h1>
      <h2>Lab Reset</h2>

      <form onSubmit={handleForgotPassword}>
        <p
          style={{
            color: "#aaa",
            fontSize: "14px",
            marginBottom: "15px",
            textAlign: "center",
            lineHeight: "1.5",
          }}
        >
          Enter your account email and we'll send you a
          link to reset your password.
        </p>

        <label>Email Address</label>

        <div className="input-container">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="spinner"></span>
          ) : (
            "Send Reset Link"
          )}
        </button>

        <p className="redirect-text">
          Remembered your password?{" "}
          <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;