import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import { showNotification } from "../managers/NotificationManager";
import "./ConfigurationGallery.css";

export default function ConfigurationGallery({ isOpen, onClose, configurations, onDelete, onLoad }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="modalOverlay"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
      >
        <motion.div className="modalContent">
          <h3>Your Configurations</h3>
          
          {configurations && configurations.length > 0 ? (
            <div className="configList">
              {configurations.map((config) => (
                <div key={config._id} className="configCard">
                  <span 
                    className="config-item-name"
                    onClick={() => {
                      onLoad(config.parts);
                      showNotification(`LOADED: ${config.name.toUpperCase()}`);
                      onClose();
                    }}
                  >
                    {config.name}
                  </span>
                  
                  <button 
                    className="delete-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(config._id);
                      showNotification("CONFIGURATION DELETED");
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="emptyState">
              <p>No saved configurations found.</p>
            </div>
          )}

          <button onClick={onClose} className="cancel-btn">Close</button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}