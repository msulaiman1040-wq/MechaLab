import BuildManager from "../managers/BuildManager";
import InstallManager from "../managers/InstallManager";
import { useAssemblyValidation } from "../Context/AssemblyValidationContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AssemblyGuideButton from "./AssemblyGuideButton";
import "./UninstallPanel.css";

export default function UninstallPanel({ hasErrors, onGuideClick }) {

  const [showList, setShowList] = useState(false);
  const [installedList, setInstalledList] = useState([]);

  const { removePart } = useAssemblyValidation();

  useEffect(() => {
    const update = () => setInstalledList([...BuildManager.installed]);
    BuildManager.subscribe(update);
    update();
  }, []);

  const handleRemove = (part) => {
    InstallManager.uninstall(part.type);
    BuildManager.uninstall(part.id);
    removePart(part.type);
  };

  return (
    <div className="uninstall-container">
      {/* This row forces the two buttons to sit side-by-side and move together */}
      <div className="uninstall-row">
        <motion.button
          className="manage-btn"
          id="manage-button"         
          whileHover={{ scale: 1.05, borderColor: "#0047AB" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowList(!showList)}
        >
          {showList ? "Close Inventory" : "Manage Parts"}
        </motion.button>

        <AssemblyGuideButton 
          hasErrors={hasErrors} 
          onClick={onGuideClick} 
        />
      </div>

      <AnimatePresence>
        {showList && (
          <motion.div
            className="parts-list"
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
          >
            {installedList.length === 0 ? (
              <p className="empty-state">
                No parts installed
              </p>
            ) : (
              installedList.map((part) => (
                <motion.button
                  key={part.id}
                  className="remove-btn"
                  whileHover={{ backgroundColor: "#0047AB" }}
                  onClick={() => handleRemove(part)}
                >
                  Remove {part.type}
                </motion.button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}