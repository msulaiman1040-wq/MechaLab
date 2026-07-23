import InstallManager from "./InstallManager";

import carStart from "../sounds/simulation/carstart.mp3";
import carIdle from "../sounds/simulation/caridling.mp3";
import roar from "../sounds/simulation/roar.mp3";
import braking from "../sounds/simulation/braking.mp3";

class SimulationManager {

    constructor() {

        //=========================================
        // STATES
        //=========================================

        this.state = "OFF";

        this.engineRunning = false;
        this.engineStarting = false;

        this.isAccelerating = false;
        this.isBraking = false;

        this.wheelsRotating = false;

        //=========================================
        // WHEEL SPEED
        //=========================================

        this.rotationIntensity = 0;

        this.targetRotationIntensity = 0;

        this.maxRotationIntensity = 0.45;
        //=========================================
// SHIFTER
//=========================================

this.currentGear = "P";

this.brakeAuthorized = false;

this.driveDirection = 1;

        //=========================================
        // EVENTS
        //=========================================

        this.listeners = [];

        //=========================================
        // AUDIO
        //=========================================

        this.startAudio = new Audio(carStart);

        this.idleAudio = new Audio(carIdle);

        this.roarAudio = new Audio(roar);

        this.brakeAudio = new Audio(braking);

        this.idleAudio.loop = true;

        //=========================================
        // START SOUND FINISHED
        //=========================================

        this.startAudio.onended = () => {

            if (!this.engineRunning)
                return;

            this.engineStarting = false;

            this.state = "IDLING";

            this.idleAudio.currentTime = 0;

            this.idleAudio.play();

            this.notify();

        };

        //=========================================
        // ROAR FINISHED
        //=========================================

        this.roarAudio.onended = () => {

            if (!this.engineRunning)
                return;

            this.isAccelerating = false;

            this.state = "CRUISING";

            this.notify();

        };

        //=========================================
        // BRAKE FINISHED
        //=========================================

        this.brakeAudio.onended = () => {

            this.isBraking = false;

            this.notify();

        };

        //=========================================
        // INSTALL WATCHER
        //=========================================

        InstallManager.subscribe(() => {

            this.validateVehicle();

        });

        //=========================================
        // START ANIMATION LOOP
        //=========================================

        this.animate();

    }
        //=========================================
    // SUBSCRIBERS
    //=========================================

    subscribe(cb) {

        this.listeners.push(cb);

    }

    notify() {

        this.listeners.forEach(cb => cb());

    }

    //=========================================
    // MAIN ANIMATION LOOP
    //=========================================

    animate() {

        const update = () => {

            //---------------------------------
            // Smooth acceleration
            //---------------------------------

            if (this.rotationIntensity < this.targetRotationIntensity) {

                this.rotationIntensity += 0.015;

                if (this.rotationIntensity > this.targetRotationIntensity) {

                    this.rotationIntensity = this.targetRotationIntensity;

                }

            }

            //---------------------------------
            // Smooth braking
            //---------------------------------

            else if (this.rotationIntensity > this.targetRotationIntensity) {

                this.rotationIntensity -= 0.004;

                if (this.rotationIntensity < this.targetRotationIntensity) {

                    this.rotationIntensity = this.targetRotationIntensity;

                }

            }

            //---------------------------------
            // Wheels moving?
            //---------------------------------

            this.wheelsRotating = this.rotationIntensity > 0.02;

            //---------------------------------
            // Brake finished?
            //---------------------------------

            if (

                this.state === "BRAKING" &&

                !this.wheelsRotating

            ) {

                this.returnToIdle();

            }

            requestAnimationFrame(update);

        };

        update();

    }

    //=========================================
    // RETURN TO IDLE
    //=========================================

    returnToIdle() {

        if (!this.engineRunning)
            return;

        this.state = "IDLING";

        this.isBraking = false;

        this.isAccelerating = false;

        this.targetRotationIntensity = 0;

        if (this.idleAudio.paused) {

            this.idleAudio.currentTime = 0;

            this.idleAudio.play();

        }

        this.notify();

    }
        //=========================================
    // START / STOP ENGINE
    //=========================================

    startStopEngine() {

        //---------------------------------
        // Already running?
        //---------------------------------

        if (this.engineRunning) {

            this.stopEngine();

            return;

        }

        //---------------------------------
        // Required parts
        //---------------------------------

        if (InstallManager.getCount("engine") < 1) return;

        if (InstallManager.getCount("battery") < 1) return;

        if (InstallManager.getCount("fuel-tank") < 1) return;

        if (InstallManager.getCount("radiator") < 1) return;

        //---------------------------------
        // Start engine
        //---------------------------------

        this.engineRunning = true;

        this.engineStarting = true;

        this.state = "STARTING";

        this.startAudio.currentTime = 0;

        this.startAudio.play();

        this.notify();

    }

    //=========================================
    // STOP ENGINE
    //=========================================

    stopEngine() {

        this.engineRunning = false;

        this.engineStarting = false;

        this.isAccelerating = false;

        this.isBraking = false;

        this.wheelsRotating = false;

        this.state = "OFF";

        this.rotationIntensity = 0;

        this.targetRotationIntensity = 0;
        this.currentGear = "P";
this.brakeAuthorized = false;
this.driveDirection = 1;

        //---------------------------------
        // Stop all sounds
        //---------------------------------

        this.startAudio.pause();
        this.startAudio.currentTime = 0;

        this.idleAudio.pause();
        this.idleAudio.currentTime = 0;

        this.roarAudio.pause();
        this.roarAudio.currentTime = 0;

        this.brakeAudio.pause();
        this.brakeAudio.currentTime = 0;

        this.notify();

    }
        //=========================================
    // GAS PEDAL
    //=========================================

    pressGas() {

        //---------------------------------
        // Engine must be running
        //---------------------------------
console.log("Gas pressed");
console.log("Current gear =", this.currentGear);
        if (!this.engineRunning)
            return;

        if (this.engineStarting)
            return;

        //---------------------------------
        // Required parts
        //---------------------------------

        if (InstallManager.getCount("gear-box") < 1)
            return;

        if (InstallManager.getCount("pedals") < 1)
            return;

        if (InstallManager.getCount("tire") < 1)
            return;

        //---------------------------------
        // Stop brake sound if braking
        //---------------------------------

        this.brakeAudio.pause();
        this.brakeAudio.currentTime = 0;

//---------------------------------
// Engine revs in Park / Neutral
//---------------------------------

if (this.currentGear === "P" || this.currentGear === "N") {

    this.state = "REVVING";

    this.isAccelerating = true;

    this.isBraking = false;

    this.targetRotationIntensity = 0;

}

//---------------------------------
// Drive Forward
//---------------------------------

else if (this.currentGear === "D") {

    this.state = "ACCELERATING";

    this.isAccelerating = true;

    this.isBraking = false;

    this.driveDirection = 1;

    this.targetRotationIntensity = this.maxRotationIntensity;

}

//---------------------------------
// Reverse
//---------------------------------

else if (this.currentGear === "R") {

    this.state = "REVERSING";

    this.isAccelerating = true;

    this.isBraking = false;

    this.driveDirection = -1;

    this.targetRotationIntensity = this.maxRotationIntensity;

}

//---------------------------------
        // Play engine roar
        //---------------------------------

        this.roarAudio.pause();
        this.roarAudio.currentTime = 0;

        this.roarAudio.play();

        this.notify();

    }

    //=========================================
    // BRAKE PEDAL
    //=========================================

    pressBrake() {

        //---------------------------------
        // Engine must be running
        //---------------------------------

        if (!this.engineRunning)
            return;

        //---------------------------------
        // Need brake discs
        //---------------------------------

        if (InstallManager.getCount("brake-disc-caliper") < 1)
            return;

        //---------------------------------
        // Need at least one tire
        //---------------------------------

        if (InstallManager.getCount("tire") < 1)
            return;

        //---------------------------------
        // Wheels already stopped?
        //---------------------------------

if (!this.wheelsRotating) {

    this.brakeAuthorized = true;

    this.notify();

    return;

}
        //---------------------------------
        // Stop roar
        //---------------------------------

        this.roarAudio.pause();
        this.roarAudio.currentTime = 0;

        //---------------------------------
        // Begin braking
        //---------------------------------

        this.state = "BRAKING";

        this.isAccelerating = false;

        this.isBraking = true;

        //---------------------------------
        // Smooth stop
        //---------------------------------

        this.targetRotationIntensity = 0;
        //---------------------------------
// Allow one gear change
//---------------------------------

this.brakeAuthorized = true;

        //---------------------------------
        // Play brake sound once
        //---------------------------------

        this.brakeAudio.pause();
        this.brakeAudio.currentTime = 0;

        this.brakeAudio.play();

        this.notify();

    }
    //=========================================
// SHIFTER
//=========================================

shiftGear(newGear) {

    //---------------------------------
    // Engine must be running
    //---------------------------------

    if (!this.engineRunning)
        return false;

    //---------------------------------
    // Gearbox must exist
    //---------------------------------

    if (InstallManager.getCount("gear-box") < 1)
        return false;


    //---------------------------------
    // Vehicle must be stopped
    //---------------------------------

    if (this.wheelsRotating)
        return false;

    //---------------------------------
    // Brake must have been clicked
    //---------------------------------

    if (!this.brakeAuthorized)
        return false;

    //---------------------------------
    // Change gear
    //---------------------------------

    this.currentGear = newGear;
    console.log("Gear:", this.currentGear);

    //---------------------------------
    // Reverse wheel direction
    //---------------------------------

    if (newGear === "R") {

        this.driveDirection = -1;

    }
    else {

        this.driveDirection = 1;

    }

    //---------------------------------
    // Brake permission consumed
    //---------------------------------

    this.brakeAuthorized = false;

    this.notify();

    return true;

}
        //=========================================
    // VEHICLE VALIDATION
    //=========================================

    validateVehicle() {

        //---------------------------------
        // Engine dependencies
        //---------------------------------

        if (
            InstallManager.getCount("engine") < 1 ||
            InstallManager.getCount("battery") < 1 ||
            InstallManager.getCount("fuel-tank") < 1 ||
            InstallManager.getCount("radiator") < 1
        ) {

            if (this.engineRunning) {

                this.stopEngine();

            }

            return;

        }

        //---------------------------------
        // Gearbox removed while driving
        //---------------------------------

        if (InstallManager.getCount("gear-box") < 1) {

            this.isAccelerating = false;

            this.targetRotationIntensity = 0;

            this.roarAudio.pause();
            this.roarAudio.currentTime = 0;

        }

        //---------------------------------
        // Pedals removed
        //---------------------------------

        if (InstallManager.getCount("pedals") < 1) {

            this.isAccelerating = false;

            this.targetRotationIntensity = 0;

        }

        //---------------------------------
        // Tires removed
        //---------------------------------

        if (InstallManager.getCount("tire") < 1) {

            this.targetRotationIntensity = 0;

        }

        //---------------------------------
        // Brake discs removed
        //---------------------------------

        if (InstallManager.getCount("brake-disc-caliper") < 1) {

            this.isBraking = false;

            this.brakeAudio.pause();
            this.brakeAudio.currentTime = 0;

        }

        //---------------------------------
        // Steering removed
        //---------------------------------

        if (InstallManager.getCount("steering-wheel") < 1) {

            // Reserved for steering animation later

        }

        this.notify();

    }
        //=========================================
    // HELPERS
    //=========================================

    isEngineRunning() {

        return this.engineRunning;

    }

    isWheelRotating() {

        return this.wheelsRotating;

    }

    getWheelSpeed() {

        return this.rotationIntensity;

    }

    getState() {

        return this.state;

    }

    //=========================================
    // FULL SIMULATION RESET
    //=========================================

    reset() {

        this.stopEngine();

        this.state = "OFF";

        this.rotationIntensity = 0;

        this.targetRotationIntensity = 0;

        this.engineRunning = false;

        this.engineStarting = false;

        this.isAccelerating = false;

        this.isBraking = false;

        this.wheelsRotating = false;

        this.notify();

    }

}

export default new SimulationManager();