import React, { useState } from "react";
import "./TutorialOverlay.css";

function AssemblyTutorial({ onLeave }) {
  const [assemblyStep, setAssemblyStep] = useState(1);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Simulated action for Step 1: Double click part from tray
  const handleSimulateDoubleClick = () => {
    setFeedbackMessage("System confirms action: Good!");
    setTimeout(() => {
      setAssemblyStep(2); // Move to drag and drop step
      setFeedbackMessage("");
    }, 1500);
  };

  // Simulated action for Step 2: Drag and drop to highlighted area
  const handleSimulateDragDrop = () => {
    setFeedbackMessage("Component successfully mounted to chassis node!");
    setTimeout(() => {
      setAssemblyStep(3); // Completed state
    }, 1800);
  };

  return (
    <div className="tutorial-backdrop assembly-tutorial-backdrop">
      {/* Visual spotlight hole focusing purely on the center 3D chassis area */}
      <div className="chassis-spotlight-cutout"></div>

      <div className="tutorial-card assembly-tutorial-card">
        <div className="tutorial-header-badge">
          <span>ASSEMBLY TUTORIAL</span>
          <span className="tutorial-counter">Step {assemblyStep} of 2</span>
        </div>

        {assemblyStep === 1 && (
          <>
            <h2>1. Component Extraction</h2>
            <p>
              Double-click any part inside the bottom tray to bring it out of storage.
            </p>
            {feedbackMessage && <div className="tutorial-feedback-success">{feedbackMessage}</div>}
            
            <div className="tutorial-actions">
              <button className="tutorial-btn-secondary" onClick={onLeave}>
                Leave Tutorial Mode
              </button>
              <button className="tutorial-btn-primary" onClick={handleSimulateDoubleClick}>
                Simulate Part Selection
              </button>
            </div>
          </>
        )}

        {assemblyStep === 2 && (
          <>
            <h2>2. Placement & Snapping</h2>
            <p>
              Click and drag or tap and drag your mouse on the selected part to the highlighted snap area on the chassis screen.
            </p>
            {feedbackMessage && <div className="tutorial-feedback-success">{feedbackMessage}</div>}

            <div className="tutorial-actions">
              <button className="tutorial-btn-secondary" onClick={onLeave}>
                Leave Tutorial Mode
              </button>
              <button className="tutorial-btn-primary" onClick={handleSimulateDragDrop}>
                Simulate Drag & Drop
              </button>
            </div>
          </>
        )}

        {assemblyStep === 3 && (
          <>
            <h2>Assembly Walkthrough Complete!</h2>
            <p>
              You have successfully learned how to extract and install components onto the chassis workspace.
            </p>

            <div className="tutorial-actions">
              <button className="tutorial-btn-primary" onClick={onLeave}>
                Return to Workshop
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AssemblyTutorial;