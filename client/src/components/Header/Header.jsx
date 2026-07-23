import "./Header.css";
import logo from "../../assets/images/mechalab-logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Header({ 
  buildMode, 
  onSave = () => {}, 
  onSettings = () => {}, 
  onStop = () => {},
  onTutorial = () => {} // Add onTutorial prop here
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <motion.header
      className="header"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="logoArea">
        <img src={logo} alt="MechaLab" className="logo" />
      </div>

      <div className="headerButtons">
        {/* Build Mode Buttons */}
        <AnimatePresence>
          {buildMode && (
            <motion.div
              style={{ display: "flex", gap: "15px", alignItems: "center" }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <button className="saveBtn headerBtn" id="save-button" onClick={onSave}>💾 Save</button>
              <button className="tutorialBtn headerBtn" onClick={onTutorial}>🎓 Tutorial Mode</button> {/* Attached onTutorial here */}
              <button className="stopBtn headerBtn" id="stop-button" onClick={onStop}>⛔ Stop Building</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logout Button: Visible ONLY on Workshop Home Screen (!buildMode) */}
        <AnimatePresence>
          {!buildMode && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <button className="logoutBtn headerBtn" onClick={handleLogout}>
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}