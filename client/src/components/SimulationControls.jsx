//SimulationControls.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./SimulationControls.css";
import SimulationManager from "../managers/SimulationManager";

export default function SimulationControls() {

  const [, forceUpdate] = useState(0);

  useEffect(() => {

    const update = () => forceUpdate(n => n + 1);

    SimulationManager.subscribe(update);

  }, []);

  return (
    <div className="simulationBar">

      <div className="simulationControls">

        {/* ENGINE */}

        <div className="controlItem" id="engine-toggle-btn">

          <motion.button
            className={`ignitionButton  ${
              SimulationManager.engineRunning ? "engineOn" : ""
            }`}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 18px #0047AB"
            }}
            whileTap={{
              scale: 0.92
            }}
            onClick={() => SimulationManager.startStopEngine()}
          >

            <span className="engineText">
              ENGINE
            </span>

            <span className="startStopText">
              START / STOP
            </span>

            <span className="powerIcon">
              ❗
            </span>

          </motion.button>

        </div>

        {/* GAS */}

        <div className="controlItem" id="gas-pedal">

          <span className="pedalLabel">
            GAS
          </span>

          <motion.div
            className="acceleratorPedal"
            whileTap={{
              y: 10,
              scale: 0.95
            }}
            onClick={() => SimulationManager.pressGas()}
          />

        </div>
{/* AUTOMATIC SHIFTER */}

<div className="controlItem" id="transmission-bar">

    <span className="shifterTitle">

        AUTOMATIC

    </span>

    <div className="gearBox">

        {["P","R","N","D"].map(gear => (

            <motion.div

                key={gear}

                whileHover={{scale:1.03}}

                whileTap={{scale:.95}}

                className={`gearSlot ${
                    SimulationManager.currentGear===gear
                    ? "gearActive"
                    : ""
                }`}

                onClick={()=>SimulationManager.shiftGear(gear)}

            >

                {gear}

            </motion.div>

        ))}

    </div>

</div>
        {/* BRAKE */}

        <div className="controlItem" id="brake-pedal">

          <span className="pedalLabel">
            BRAKE
          </span>

          <motion.div
            className="brakePedal"
            whileTap={{
              y: 10,
              scale: 0.95
            }}
            onClick={() => SimulationManager.pressBrake()}
          />

        </div>

      </div>

    </div>
  );
}