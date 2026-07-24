import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import installManager from "../managers/InstallManager";
import { showNotification } from "../managers/NotificationManager"; // Ensure this path matches your folder structure
import "./SaveModal.css";

export default function SaveModal({ isOpen, onClose }) {
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleSave = async () => {
    let token = localStorage.getItem('token');
    if (token) token = token.replace(/^"|"$/g, '');

    // Convert InstallManager data to a plain object
    const partsData = JSON.parse(JSON.stringify(installManager.installed));
    
    if (!token) {
      showNotification("PLEASE LOGIN TO SAVE YOUR CONFIGURATION!");
      return;
    }

    try {
      const response = await fetch('https://mechalab-backend.onrender.com/api/config/save', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'x-auth-token': token 
        },
        body: JSON.stringify({ name, parts: partsData })
      });

      if (response.ok) {
        showNotification("CONFIGURATION SAVED SUCCESSFULLY!");
        setName(""); 
        onClose();   
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || "FAILED TO SAVE");
      }
    } catch (error) {
      console.error("Error saving configuration:", error);
      showNotification("SERVER ERROR, PLEASE TRY AGAIN LATER.");
    }
  };

  const handleCancel = () => { 
    setName(""); 
    onClose(); 
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="modalOverlay" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="modalContent"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            <h3>Save Build</h3>
            <input 
              type="text" 
              placeholder="Name your configuration" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
            <button className="save-btn" onClick={handleSave}>Confirm Save</button>
            <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}