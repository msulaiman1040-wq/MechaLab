import { motion, AnimatePresence } from "framer-motion";
import ReactDOM from "react-dom";
import "./SettingsMenu.css"; // We will create this next

export default function SettingsMenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  const modalContent = (
    <div className="settingsOverlay">
      <motion.div 
        className="settingsContent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <h3>System Settings</h3>
        
        <div className="settingItem">
          <span>Master Volume</span>
          <input type="range" min="0" max="100" />
        </div>
        
        <div className="settingItem">
          <span>Graphics Quality</span>
          <select>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

        <button className="close-btn" onClick={onClose}>Close</button>
      </motion.div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}