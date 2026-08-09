import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { showNotification } from "../managers/NotificationManager";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    if (!username.trim() || !password) {
      showNotification("PLEASE ENTER YOUR USERNAME AND PASSWORD.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://mechalab-backend.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Save user information
        localStorage.setItem("fullName", data.fullName || "");
        localStorage.setItem("username", data.username || "");

        // Save JWT token
        if (data.token) {
          const token =
            typeof data.token === "string"
              ? data.token.replace(/^"|"$/g, "")
              : data.token;

          localStorage.setItem("token", token);
        }

        showNotification(
          data.message || "LOGIN SUCCESSFUL"
        );

        navigate("/workshop");
      } else {
        showNotification(
          data.message || "LOGIN FAILED"
        );
      }
    } catch (error) {
      console.error("Login error:", error);

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
      <h2>Lab Login</h2>

      <form onSubmit={handleLogin}>
        <label>Username</label>

        <div className="input-container">
          <input
            type="text"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            autoComplete="username"
            required
          />
        </div>

        <label>Password</label>

        <div className="password-wrapper">
          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            autoComplete="current-password"
            required
          />

          <button
            type="button"
            className="toggle-password-btn"
            onClick={() =>
              setShowPassword(!showPassword)
            }
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        <div
          style={{
            textAlign: "right",
            margin: "8px 0 15px 0",
          }}
        >
          <Link
            to="/forgot-password"
            style={{
              fontSize: "12px",
              color: "#0047AB",
              textDecoration: "none",
            }}
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="spinner"></span>
          ) : (
            "Login"
          )}
        </button>

        <p className="redirect-text">
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;