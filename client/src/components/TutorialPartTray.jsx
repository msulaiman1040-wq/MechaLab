import "./PartTray.css";
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

const allParts = {
  engine,
  body,
  battery,
  radiator,
  "fuel-tank": fuelTank,
  "gear-box": gearBox,
  "steering-wheel": steeringWheel,
  pedals,
  "front-seat": frontSeat,
  "rear-seat": rearSeat,
  fender,
  "exhaust-pipe": exhaustPipe,
  tire,
  "brake-disc-caliper": brakeDisc
};

export default function TutorialPartTray({ targetPartId }) {
  const imageSrc = allParts[targetPartId];

  const takePart = () => {
    BuildManager.takePart(targetPartId);
  };

  return (
    <div className="partTray">
      <div className="carouselWindow tutorial-tray-window">
        <div className="carousel tutorial-tray-carousel">
          {imageSrc && (
            <div
              className="partCircle tutorial-highlight"
              draggable="false"
              onMouseDown={(e) => e.preventDefault()}
              onDoubleClick={(e) => {
                e.preventDefault();
                takePart();
              }}
            >
              <img src={imageSrc} alt={targetPartId} draggable="false" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}