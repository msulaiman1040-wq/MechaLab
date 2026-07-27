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
  { id: "engine", name: "Engine", image: engine },
  { id: "body", name: "Chassis Body", image: body },
  { id: "battery", name: "Battery", image: battery },
  { id: "radiator", name: "Radiator", image: radiator },
  { id: "fuel-tank", name: "Fuel Tank", image: fuelTank },
  { id: "gear-box", name: "Gear Box", image: gearBox },
  { id: "steering-wheel", name: "Steering Wheel", image: steeringWheel },
  { id: "pedals", name: "Pedals", image: pedals },
  
  // Unique Seats
  { id: "left-seat", name: "Left Front Seat", image: frontSeat },
  { id: "right-seat", name: "Right Front Seat", image: frontSeat },
  { id: "rear-seat", name: "Rear Seat", image: rearSeat },

  // Unique Fenders
  { id: "left-fender", name: "Left Fender", image: fender },
  { id: "right-fender", name: "Right Fender", image: fender },

  { id: "exhaust-pipe", name: "Exhaust Pipe", image: exhaustPipe },

  // Unique Wheels / Tires
  { id: "front-left-wheel", name: "Front Left Wheel", image: tire },
  { id: "front-right-wheel", name: "Front Right Wheel", image: tire },
  { id: "rear-left-wheel", name: "Rear Right Wheel", image: tire },
  { id: "rear-right-wheel", name: "Rear Wheel", image: tire },

  // Unique Brakes & Calipers
  { id: "brake-fl", name: "Front-Left Brake", image: brakeDisc },
  { id: "brake-fr", name: "Front-Right Brake", image: brakeDisc },
  { id: "brake-rl", name: "Rear-Left Brake", image: brakeDisc },
  { id: "brake-rr", name: "Rear-Right Brake", image: brakeDisc }
];

export default function PartTray({ onPartDoubleClick }) {
  const [, forceUpdate] = useState(0);
  const lastTapRef = useRef({});
  const holdTimerRef = useRef({});

  useEffect(() => {
    const unsubscribe = BuildManager.subscribe(() => {
      forceUpdate(x => x + 1);
    });

    return () => unsubscribe();
  }, []);

  const takePart = (id) => {
    BuildManager.takePart(id);

    if (onPartDoubleClick) {
      onPartDoubleClick(id);
    }
  };

  // Mobile double tap
  const handleTouchEnd = (id) => {
    const now = Date.now();
    const lastTap = lastTapRef.current[id] || 0;

    if (now - lastTap < 350) {
      takePart(id);
      lastTapRef.current[id] = 0;
    } else {
      lastTapRef.current[id] = now;
    }
  };

  return (
    <div className="partTray">
      <div className="carouselWindow">
        <div className="carousel" id="carocaro">
          {parts.map(part => {
            const qty = BuildManager.inventory ? BuildManager.inventory[part.id] : 0;

            if (qty === undefined || qty <= 0) return null;

            return (
              <div
                key={part.id}
                className="partItemWrapper"
                onDoubleClick={(e) => {
                  e.preventDefault();
                  takePart(part.id);
                }}
              >
                <div
                  className="partCircle"
                  data-part-id={part.id}
                  draggable={false}
                  onMouseDown={(e) => e.preventDefault()}
                  onTouchStart={(e) => {
                    const target = e.currentTarget;
                    // Hold for 400ms to pop open the label
                    holdTimerRef.current[part.id] = setTimeout(() => {
                      target.classList.add("active");
                    }, 400);
                  }}
                  onTouchEnd={(e) => {
                    clearTimeout(holdTimerRef.current[part.id]);
                    e.currentTarget.classList.remove("active");
                    
                    e.preventDefault();
                    handleTouchEnd(part.id);
                  }}
                  onTouchCancel={(e) => {
                    clearTimeout(holdTimerRef.current[part.id]);
                    e.currentTarget.classList.remove("active");
                  }}
                  onTouchMove={(e) => {
                    // If user drags their finger away while holding, cancel the popup
                    clearTimeout(holdTimerRef.current[part.id]);
                    e.currentTarget.classList.remove("active");
                  }}
                >
                  <img
                    src={part.image}
                    alt={part.name}
                    draggable={false}
                  />

                  {/* Inline Expanding Name Text */}
                  <span className="partTooltip">
                    {part.name}
                  </span>

                  {qty > 1 && (
                    <div className="quantityBadge">
                      {qty}×
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}