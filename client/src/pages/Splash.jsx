import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Splash.css";

function Splash() {
  const navigate = useNavigate();

  return (
    <div className="splash-container">
      {/* Background Engineering Grid Accent */}
      <div className="splash-grid-overlay" />

      <motion.div 
        className="splash-content-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="splash-title">
          <span className="mecha">MECHA</span><span className="lab">LAB</span>
        </h1>      
       
        <h2 className="splash-subtitle">
          Interactive Modular Vehicle Configuration & <br />
          Educational Simulation System
        </h2>

        <div className="splash-description-box">
          <p>
            Welcome to <span className="highlight-text1">MECHA</span> <span className="highlight-text22">LAB</span>, an advanced web-based environment engineered for interactive vehicle assembly, real-time simulation, and immersive technical learning. Explore custom part configurations, inspect component dynamics, and master mechanical engineering concepts.
          </p>
        </div>

        {/* Action buttons */}
        <div className="splash-action-container">
          <motion.button
            className="splash-primary-btn"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 20px -5px rgba(0, 71, 171, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/register")}
          >
            Register Account
          </motion.button>
          
          <motion.button
            className="splash-secondary-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
          >
            Login to Workshop
          </motion.button>
        </div>

      </motion.div>

      <p className="developer-tag">Developed by Sulaiman Muhammad</p>
    </div>
  );
}

export default Splash;