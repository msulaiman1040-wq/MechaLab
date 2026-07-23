import React from "react";
import "./TutorialOverlay.css";

function TutorialGateway({ onStartButtons, onStartAssembly, onLeave }) {
  return (
    <div className="tutorial-locking-backdrop">
      <div className="tutorial-card gateway-card">
        <div className="tutorial-header-badge">
          <span>MECHALAB</span>
        </div>

        <h2>Welcome to MechaLab Tutorial Mode</h2>
        <p>Choose a tutorial path below to learn how to navigate the workshop controls or assemble your vehicle step-by-step.</p>

        <div className="gateway-options">
          <button className="tutorial-btn-primary gateway-btn" onClick={onStartButtons}>
            Buttons Tutorial
          </button>
          <button className="tutorial-btn-primary gateway-btn" onClick={onStartAssembly}>
            Assembly Tutorial
          </button>
        </div>

        <div className="tutorial-actions" style={{ justifyContent: "center", marginTop: "10px" }}>
          <button className="tutorial-btn-secondary" onClick={onLeave}>
            Exit Tutorial Mode
          </button>
        </div>
      </div>
    </div>
  );
}

export default TutorialGateway;