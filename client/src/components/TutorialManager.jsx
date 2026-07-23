import React, { useState } from "react";
import TutorialGateway from "./TutorialGateway";
import ButtonsTutorial from "./ButtonsTutorial";

function TutorialManager({ onClose, onViewChange, onStartAssemblyTutorial }) {
  const [view, setView] = useState("gateway"); // 'gateway' or 'buttons'

  const handleViewChange = (newView) => {
    setView(newView);
    if (onViewChange) onViewChange(newView);
  };

  return (
    <>
      {view === "gateway" && (
        <TutorialGateway
          onStartButtons={() => handleViewChange("buttons")}
          onStartAssembly={onStartAssemblyTutorial}
          onLeave={onClose}
        />
      )}

      {view === "buttons" && (
        <ButtonsTutorial
          onComplete={onClose}
          onLeave={() => handleViewChange("gateway")}
        />
      )}
    </>
  );
}

export default TutorialManager;