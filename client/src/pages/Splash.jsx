import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Splash.css";

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/workshop"); // Changed from "/login" to "/workshop"
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <h1 className="splash-title">
        <span className="mecha">MECHA</span><span className="lab">LAB</span>
      </h1>      
      <h2 className="splash-subtitle">
        Modular Vehicle Configuration & <br />
        Interactive Simulation System
      </h2>

      <div className="loading-bar">
        <div className="loading-progress"></div>
      </div>

      <p className="developer-tag">Developed by Sulaiman Muhammad</p>
    </div>
  );
}

export default Splash;