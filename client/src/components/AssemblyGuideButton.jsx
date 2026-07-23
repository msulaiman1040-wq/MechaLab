import { useState } from "react";
import ReactDOM from "react-dom"; // Import ReactDOM for Portals
import { motion, AnimatePresence } from "framer-motion";
import { useAssemblyValidation } from "../Context/AssemblyValidationContext";
import "./AssemblyGuide.css";

export default function AssemblyGuideButton() {
  const { mistakesLog, isDrawerOpen, setIsDrawerOpen } = useAssemblyValidation();
  const hasErrors = mistakesLog && mistakesLog.length > 0;

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleCard = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleOpenDrawer = (e) => {
    e.stopPropagation();
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setExpandedIndex(null); 
  };

  return (
    <div style={{ zIndex: 999, display: "flex", alignItems: "center" }}>
      {/* Floating Question Mark Button */}
      <motion.div 
        className={`guideButtonWrapper ${hasErrors ? "has-error" : ""}`}
        id="help-button"
        onClick={handleOpenDrawer}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{ cursor: "pointer" }}
      >
        <span className="questionMarkIcon">?</span>
        {hasErrors && <span className="errorBadge">{mistakesLog.length}</span>}
      </motion.div>

      {/* Wrap the Slide-In Side Context Drawer inside ReactDOM.createPortal */}
      {ReactDOM.createPortal(
        <AnimatePresence>
          {isDrawerOpen && (
            <motion.div 
              className="assemblyDrawerOverlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDrawer}
              style={{ zIndex: 99999, position: "fixed", inset: 0 }}
            >
              <motion.div 
                className="assemblyDrawerContent"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="drawerHeader">
                  <h2>MechaLab Diagnostic Log</h2>
                  <button className="closeDrawerBtn" onClick={handleCloseDrawer}>×</button>
                </div>

                <div className="drawerBody">
                  {!mistakesLog || mistakesLog.length === 0 ? (
                    <div className="noErrorsState">
                      <p>🟢 Assembly sequence is optimal. No structural sequencing errors detected.</p>
                    </div>
                  ) : (
                    mistakesLog.map((mistake, index) => {
                      const isExpanded = expandedIndex === index;
                      return (
                        <div 
                          key={index} 
                          className="errorCardItem"
                          onClick={() => toggleCard(index)}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="errorCardHeader" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3>⚠️ Sequence Error: {mistake.partName}</h3>
                            <span>{isExpanded ? "▲" : "▼"}</span>
                          </div>
                          
                          {isExpanded && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="errorCardDetails"
                            >
                              <p className="errorTimestamp">Logged at: {mistake.timestamp}</p>
                              <p className="errorDescription">{mistake.explanation}</p>
                            </motion.div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body // Renders straight onto the body root element, bypassing layout clipping
      )}
    </div>
  );
}