import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { getVehicleParts } from "../managers/VehicleManager";
import InstallManager from "../managers/InstallManager";
import SnapPointManager from "../managers/SnapPointManager";
import VehicleContextMenuManager from "../managers/VehicleContextMenuManager";
import BuildManager from "../managers/BuildManager";
import * as THREE from "three";

export default function Vehicle({ buildMode }) {
    const { scene } = useGLTF("/models/Vehicle.glb");

    useEffect(() => {
        if (!scene) return;

        const parts = getVehicleParts(scene);
        window.vehicleParts = parts;

        // 1. Setup SnapPoints
        Object.entries(parts).forEach(([name, object]) => {
            if (object) SnapPointManager.register(name, object);
        });

        // 2. Setup Context Menu / IDs
        const setPartID = (object, id) => {
            if (!object) return;
            object.userData.partId = id;
            object.traverse(child => {
                if (!child.isMesh) return;
                child.userData.partId = id;
                child.onContextMenu = (e) => {
                    e.stopPropagation();
                    VehicleContextMenuManager.open(child, e.clientX, e.clientY);
                };
            });
        };

        // Initialize all parts
        const partMappings = [
            [parts.engine, "engine"], [parts.body, "body"], [parts.battery, "battery"],
            [parts.radiator, "radiator"], [parts.fuelTank, "fuel-tank"], [parts.gearBox, "gear-box"],
            [parts.steering, "steering-wheel"], [parts.pedals, "pedals"], [parts.leftSeat, "front-seat"],
            [parts.rightSeat, "front-seat"], [parts.rearSeat, "rear-seat"], [parts.leftFender, "fender"],
            [parts.rightFender, "fender"], [parts.exhaust, "exhaust-pipe"], [parts.frontLeftWheel, "tire"],
            [parts.frontRightWheel, "tire"], [parts.rearLeftWheel, "tire"], [parts.rearRightWheel, "tire"],
            [parts.brakeFL, "brake-disc-caliper"], [parts.brakeFR, "brake-disc-caliper"],
            [parts.brakeRL, "brake-disc-caliper"], [parts.brakeRR, "brake-disc-caliper"]
        ];
        partMappings.forEach(([obj, id]) => setPartID(obj, id));

        // Keep track of original materials for highlight restoration
        const originalMaterials = new Map();
        if (parts.brakeFL) {
            parts.brakeFL.traverse(child => {
                if (child.isMesh) originalMaterials.set(child, child.material);
            });
        }

        // Highlight material with transparency for pulsing effect
        const highlightMaterial = new THREE.MeshBasicMaterial({
            color: "#0047AB",
            wireframe: false,
            transparent: true,
            opacity: 0.8
        });

        // Animation loop for continuous pulsing glow effect
        let animationFrameId;
        const animateHighlight = () => {
            const elapsedTime = Date.now() * 0.005;
            const pulseOpacity = 0.4 + Math.sin(elapsedTime) * 0.4; 
            highlightMaterial.opacity = pulseOpacity;
            animationFrameId = requestAnimationFrame(animateHighlight);
        };

        // Start animation loop right away so it pulses continuously when active
        animateHighlight();

        // 3. Visibility & Highlight Logic
        const updateVisibility = (highlightedPartType = null) => {
            if (buildMode) {
                Object.values(parts).forEach(p => p && (p.visible = false));
                if (parts.chassis) parts.chassis.visible = true;

                // Sync visibility with InstallManager
                const count = (id) => InstallManager.getCount(id);
                
                if (parts.engine) parts.engine.visible = count("engine") >= 1;
                if (parts.body) parts.body.visible = count("body") >= 1;
                if (parts.battery) parts.battery.visible = count("battery") >= 1;
                if (parts.radiator) parts.radiator.visible = count("radiator") >= 1;
                if (parts.fuelTank) parts.fuelTank.visible = count("fuel-tank") >= 1;
                if (parts.gearBox) parts.gearBox.visible = count("gear-box") >= 1;
                if (parts.steering) parts.steering.visible = count("steering-wheel") >= 1;
                if (parts.pedals) parts.pedals.visible = count("pedals") >= 1;
                if (parts.rearSeat) parts.rearSeat.visible = count("rear-seat") >= 1;
                if (parts.exhaust) parts.exhaust.visible = count("exhaust-pipe") >= 1;
                
                // Multi-count parts
                if (parts.leftSeat) parts.leftSeat.visible = count("front-seat") >= 1;
                if (parts.rightSeat) parts.rightSeat.visible = count("front-seat") >= 2;
                if (parts.leftFender) parts.leftFender.visible = count("fender") >= 1;
                if (parts.rightFender) parts.rightFender.visible = count("fender") >= 2;
                
                if (parts.frontLeftWheel) parts.frontLeftWheel.visible = count("tire") >= 1;
                if (parts.frontRightWheel) parts.frontRightWheel.visible = count("tire") >= 2;
                if (parts.rearLeftWheel) parts.rearLeftWheel.visible = count("tire") >= 3;
                if (parts.rearRightWheel) parts.rearRightWheel.visible = count("tire") >= 4;
                
                if (parts.brakeFL) parts.brakeFL.visible = count("brake-disc-caliper") >= 1;
                if (parts.brakeFR) parts.brakeFR.visible = count("brake-disc-caliper") >= 2;
                if (parts.brakeRL) parts.brakeRL.visible = count("brake-disc-caliper") >= 3;
                if (parts.brakeRR) parts.brakeRR.visible = count("brake-disc-caliper") >= 4;

                // UNSTOPPABLE TUTORIAL PULSE: If highlighted and NOT YET INSTALLED, keep pulsing no matter what step you are on!
                const isBrakeInstalled = count("brake-disc-caliper") > 0;
                if (highlightedPartType === "brake-disc-caliper" && parts.brakeFL && !isBrakeInstalled) {
                    parts.brakeFL.visible = true;
                    parts.brakeFL.traverse(child => {
                        if (child.isMesh) {
                            child.material = highlightMaterial;
                        }
                    });
                } else {
                    // Only restore original materials once it is actually installed or highlight is cleared
                    if (parts.brakeFL && isBrakeInstalled) {
                        parts.brakeFL.traverse(child => {
                            if (child.isMesh && originalMaterials.has(child)) {
                                child.material = originalMaterials.get(child);
                            }
                        });
                    }
                }

            } else {
                Object.values(parts).forEach(p => p && (p.visible = true));
            }
        };

        updateVisibility();

        // Subscribe to InstallManager updates
        const unsubInstall = InstallManager.subscribe(() => {
            updateVisibility(BuildManager.tutorialHighlightPart);
        });

        // Subscribe to BuildManager tutorial highlights
        const unsubHighlight = BuildManager.subscribeHighlight((partType) => {
            updateVisibility(partType);
        });

        return () => {
            unsubInstall();
            unsubHighlight();
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [scene, buildMode]);

    return (
        <primitive object={scene} scale={1} position={[0,0,0]} rotation={[0,0,0]} />
    );
}

useGLTF.preload("/models/Vehicle.glb");