import { useState, useEffect } from "react";
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

  useEffect(() => {
    fetch("https://mechalab-backend.onrender.com/").catch(() => {});
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("https://mechalab-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("fullName", data.fullName);
        localStorage.setItem("username", data.username);
        const token = typeof data.token === 'string' ? data.token.replace(/^"|"$/g, '') : data.token;
        localStorage.setItem("token", token); 
        
        showNotification(data.message || "LOGIN SUCCESSFUL");
        navigate("/workshop");
      } else {
        showNotification(data.message || "LOGIN FAILED");
      }
    } catch (error) {
      showNotification("UNABLE TO CONNECT TO THE SERVER.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h1 className="logo-title">
          <span className="mecha">Mecha</span>
          <span className="lab">Lab</span>
        </h1>
        <p className="login-subtitle">Sign in to your account</p>
        
        <div className="input-group">
          <label>Username</label>
          <div className="input-container">
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Enter your username"
              autoComplete="username"
              required 
            />
          </div>
        </div>
        
        <div className="input-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter your password"
              autoComplete="current-password"
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

        <div className="forgot-password-container">
          <Link to="/forgot-password">
            Forgot Password?
          </Link>
        </div>
        
        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? <span className="spinner"></span> : "Login"}
        </button>
        
        <p className="redirect-text">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;