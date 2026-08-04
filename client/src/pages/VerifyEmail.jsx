import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { showNotification } from "../managers/NotificationManager";
import "./Login.css"; // Reuse your styling or create a dedicated CSS file

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Verifying your email...");
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("No verification token found.");
      return;
    }

    async function verify() {
      try {
        const response = await fetch(`https://mechalab-backend.onrender.com/api/auth/verify-email?token=${token}`);
        const data = await response.json();
        
        if (response.ok) {
          setStatus(data.message);
          showNotification("EMAIL VERIFIED!");
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setStatus(data.message || "Verification failed.");
          showNotification(data.message || "VERIFICATION FAILED");
        }
      } catch (error) {
        setStatus("Unable to connect to server.");
        showNotification("UNABLE TO CONNECT TO THE SERVER.");
      }
    }

    verify();
  }, [token, navigate]);

  return (
    <div className="login-container">
      <div className="login-form" style={{ textAlign: "center" }}>
        <h1 className="logo-title">
          <span className="mecha">Mecha</span>
          <span className="lab">Lab</span> Verification
        </h1>
        <p style={{ margin: "20px 0", color: "#ccc" }}>{status}</p>
        <Link to="/login" style={{ color: "#0047AB", textDecoration: "none", fontWeight: "bold" }}>
          Proceed to Login
        </Link>
      </div>
    </div>
  );
}

export default VerifyEmail;