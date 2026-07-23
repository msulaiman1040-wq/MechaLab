import { createContext, useContext, useState } from "react";
// 1. Import your Sound Manager
import { playInstallSound } from "../managers/SoundManager";

const WorkshopContext = createContext();

export function WorkshopProvider({ children }) {
  const [draggedPart, setDraggedPart] = useState(null);

  const [inventory, setInventory] = useState({
    engine: 1,
    body: 1,
    battery: 1,
    radiator: 1,
    "fuel-tank": 1,
    "gear-box": 1,
    "steering-wheel": 1,
    pedals: 1,
    "front-seat": 2,
    "rear-seat": 1,
    fender: 2,
    "exhaust-pipe": 1,
    tire: 4,
    "brake-disc-caliper": 4,
  });

  function pickPart(id) {
    if (inventory[id] <= 0) return;

    setInventory((prev) => ({
      ...prev,
      [id]: prev[id] - 1,
    }));

    setDraggedPart(id);
  }

  function cancelDrag() {
    if (!draggedPart) return;

    setInventory((prev) => ({
      ...prev,
      [draggedPart]: prev[draggedPart] + 1,
    }));

    setDraggedPart(null);
  }

// Change this function in WorkShopContext.jsx
  function finishInstall(id) {
    if (id) {
      playInstallSound(id); 
    }
    setDraggedPart(null);
  }
  function returnPartToInventory(id) {
    setInventory((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  }

  return (
    <WorkshopContext.Provider
      value={{
        inventory,
        draggedPart,
        pickPart,
        cancelDrag,
        finishInstall,
        returnPartToInventory,
      }}
    >
      {children}
    </WorkshopContext.Provider>
  );
}

export function useWorkshop() {
  return useContext(WorkshopContext);
}