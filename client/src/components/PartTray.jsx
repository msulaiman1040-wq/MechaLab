import "./PartTray.css";
import { useEffect, useState, useRef } from "react";
import BuildManager from "../managers/BuildManager";

import engine from "../assets/parts/engine.png";
import body from "../assets/parts/body.png";
import battery from "../assets/parts/battery.png";
import radiator from "../assets/parts/radiator.png";
import fuelTank from "../assets/parts/fuel-tank.png";
import gearBox from "../assets/parts/gear-box.png";
import steeringWheel from "../assets/parts/steering-wheel.png";
import pedals from "../assets/parts/pedals.png";
import frontSeat from "../assets/parts/front-seat.png";
import rearSeat from "../assets/parts/rear-seat.png";
import fender from "../assets/parts/fender.png";
import exhaustPipe from "../assets/parts/exhaust-pipe.png";
import tire from "../assets/parts/tire.png";
import brakeDisc from "../assets/parts/brake-disc-caliper.png";

const parts = [
  { id: "engine", image: engine },
  { id: "body", image: body },
  { id: "battery", image: battery },
  { id: "radiator", image: radiator },
  { id: "fuel-tank", image: fuelTank },
  { id: "gear-box", image: gearBox },
  { id: "steering-wheel", image: steeringWheel },
  { id: "pedals", image: pedals },
  { id: "front-seat", image: frontSeat },
  { id: "rear-seat", image: rearSeat },
  { id: "fender", image: fender },
  { id: "exhaust-pipe", image: exhaustPipe },
  { id: "tire", image: tire },
  { id: "brake-disc-caliper", image: brakeDisc },
];

export default function PartTray({ onPartDoubleClick }) {
  const [, forceUpdate] = useState(0);
  const lastTapTimeRef = useRef({});

  useEffect(() => {
    const unsubscribe = BuildManager.subscribe(() => {
      forceUpdate((x) => x + 1);
    });
    return () => unsubscribe();
  }, []);

  const takePart = (id) => {
    BuildManager.takePart(id);
    if (onPartDoubleClick) {
      onPartDoubleClick(id);
    }
  };

  // Handles both desktop double-click and mobile responsive double-tap/quick taps
  const handleInteraction = (id) => {
    const now = Date.now();
    const lastTime = lastTapTimeRef.current[id] || 0;
    const DOUBLE_TAP_WINDOW = 350; // Milliseconds threshold

    if (now - lastTime < DOUBLE_TAP_WINDOW) {
      takePart(id);
      lastTapTimeRef.current[id] = 0; // Reset
    } else {
      lastTapTimeRef.current[id] = now;
    }
  };

  return (
    <div className="partTray">
      <div className="carouselWindow">
        <div className="carousel" id="carocaro">
          {parts.map((part) => {
            const qty = BuildManager.inventory[part.id];
            if (qty <= 0) return null;

            return (
              <div
                key={part.id}
                data-part-id={part.id}
                className="partCircle"
                draggable="false"
                onMouseDown={(e) => e.preventDefault()}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  takePart(part.id);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleInteraction(part.id);
                }}
              >
                <img src={part.image} alt="" draggable="false" />
                {qty > 1 && <div className="quantityBadge">{qty}×</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}