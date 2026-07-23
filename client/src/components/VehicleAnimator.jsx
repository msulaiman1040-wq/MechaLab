import { useFrame } from "@react-three/fiber";
import SimulationManager from "../managers/SimulationManager";

export default function VehicleAnimator() {

    useFrame(() => {

        const parts = window.vehicleParts;

        if (!parts) return;

        if (!SimulationManager.wheelsRotating) return;

        const speed = -SimulationManager.rotationIntensity;

        const wheels = [
            parts.frontLeftWheel,
            parts.frontRightWheel,
            parts.rearLeftWheel,
            parts.rearRightWheel
        ];

        wheels.forEach((wheel) => {

            if (!wheel) return;

wheel.rotateX(

    -SimulationManager.rotationIntensity *

    SimulationManager.driveDirection *

    0.25

);
});

    });

    return null;

}