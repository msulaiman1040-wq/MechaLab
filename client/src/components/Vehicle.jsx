import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { getVehicleParts } from "../managers/VehicleManager";
import InstallManager from "../managers/InstallManager";
import SnapPointManager from "../managers/SnapPointManager";
import VehicleContextMenuManager from "../managers/VehicleContextMenuManager";
import BuildManager from "../managers/BuildManager";
import HighlightManager from "../managers/HighlightManager";
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

        // Initialize all parts mapping list with unique individual IDs
        const partMappings = [
            [parts.engine, "engine"], 
            [parts.body, "body"], 
            [parts.battery, "battery"],
            [parts.radiator, "radiator"], 
            [parts.fuelTank, "fuel-tank"], 
            [parts.gearBox, "gear-box"],
            [parts.steering, "steering-wheel"], 
            [parts.pedals, "pedals"], 
            [parts.exhaust, "exhaust-pipe"],
            
            // Individual Seats
            [parts.leftSeat, "left-seat"], 
            [parts.rightSeat, "right-seat"],
            [parts.rearSeat, "rear-seat"],

            // Individual Fenders
            [parts.leftFender, "left-fender"], 
            [parts.rightFender, "right-fender"],
            
            // Individual Tires
            [parts.frontLeftWheel, "front-left-wheel"], 
            [parts.frontRightWheel, "front-right-wheel"],
            [parts.rearLeftWheel, "rear-left-wheel"], 
            [parts.rearRightWheel, "rear-right-wheel"],
            
            // Individual Brakes & Calipers
            [parts.brakeFL, "brake-fl"], 
            [parts.brakeFR, "brake-fr"],
            [parts.brakeRL, "brake-rl"], 
            [parts.brakeRR, "brake-rr"]
        ];
        
        partMappings.forEach(([obj, id]) => setPartID(obj, id));

        // Keep track of original materials for highlight restoration across ALL parts
        const originalMaterials = new Map();
        Object.values(parts).forEach(part => {
            if (part) {
                part.traverse(child => {
                    if (child.isMesh) originalMaterials.set(child, child.material);
                });
            }
        });

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

        animateHighlight();

        // 3. Visibility & Highlight Logic
        const updateVisibility = (highlightedPartType = null, menuHighlightedPartId = null) => {
            if (buildMode) {
                Object.values(parts).forEach(p => p && (p.visible = false));
                if (parts.chassis) parts.chassis.visible = true;

                // Sync visibility with InstallManager exact individual checks
                const count = (id) => InstallManager.getCount(id);
                
                if (parts.engine) parts.engine.visible = count("engine") >= 1;
                if (parts.body) parts.body.visible = count("body") >= 1;
                if (parts.battery) parts.battery.visible = count("battery") >= 1;
                if (parts.radiator) parts.radiator.visible = count("radiator") >= 1;
                if (parts.fuelTank) parts.fuelTank.visible = count("fuel-tank") >= 1;
                if (parts.gearBox) parts.gearBox.visible = count("gear-box") >= 1;
                if (parts.steering) parts.steering.visible = count("steering-wheel") >= 1;
                if (parts.pedals) parts.pedals.visible = count("pedals") >= 1;
                if (parts.exhaust) parts.exhaust.visible = count("exhaust-pipe") >= 1;
                
                // Individual Seats
                if (parts.leftSeat) parts.leftSeat.visible = count("left-seat") >= 1;
                if (parts.rightSeat) parts.rightSeat.visible = count("right-seat") >= 1;
                if (parts.rearSeat) parts.rearSeat.visible = count("rear-seat") >= 1;

                // Individual Fenders
                if (parts.leftFender) parts.leftFender.visible = count("left-fender") >= 1;
                if (parts.rightFender) parts.rightFender.visible = count("right-fender") >= 1;

                // Individual Tires
                if (parts.frontLeftWheel) parts.frontLeftWheel.visible = count("front-left-wheel") >= 1;
                if (parts.frontRightWheel) parts.frontRightWheel.visible = count("front-right-wheel") >= 1;
                if (parts.rearLeftWheel) parts.rearLeftWheel.visible = count("rear-left-wheel") >= 1;
                if (parts.rearRightWheel) parts.rearRightWheel.visible = count("rear-right-wheel") >= 1;

                // Individual Brakes & Calipers
                if (parts.brakeFL) parts.brakeFL.visible = count("brake-fl") >= 1;
                if (parts.brakeFR) parts.brakeFR.visible = count("brake-fr") >= 1;
                if (parts.brakeRL) parts.brakeRL.visible = count("brake-rl") >= 1;
                if (parts.brakeRR) parts.brakeRR.visible = count("brake-rr") >= 1;

                // Reset all materials to original first
                originalMaterials.forEach((mat, mesh) => {
                    mesh.material = mat;
                });

// A. UNSTOPPABLE TUTORIAL PULSE: Kept intact for BuildManager
const isBrakeInstalled = count("brake-fl") > 0;
const isBrakeTutorial = highlightedPartType === "brake-fl" || 
                          highlightedPartType === "brake-disc-caliper" || 
                          (highlightedPartType && highlightedPartType.includes("brake"));

if (isBrakeTutorial && parts.brakeFL && !isBrakeInstalled) {
    parts.brakeFL.visible = true;
    parts.brakeFL.traverse(child => {
        if (child.isMesh) {
            child.material = highlightMaterial;
        }
    });
} else if (parts.brakeFL && isBrakeInstalled && !isBrakeTutorial) {
    parts.brakeFL.traverse(child => {
        if (child.isMesh && originalMaterials.has(child)) {
            child.material = originalMaterials.get(child);
        }
    });
}
                // B. FLOATING MENU HIGHLIGHT: Handles single or multi-part highlighting correctly via filter
                const activeMenuId = menuHighlightedPartId !== null ? menuHighlightedPartId : HighlightManager.getHighlightedPart();
                if (activeMenuId) {
                    const matchingPairs = partMappings.filter(([_, id]) => id === activeMenuId);
                    matchingPairs.forEach(([targetPart]) => {
                        if (targetPart) {
                            targetPart.visible = true; // Force visible so it's viewable
                            targetPart.traverse(child => {
                                if (child.isMesh) {
                                    child.material = highlightMaterial;
                                }
                            });
                        }
                    });
                }

            } else {
                Object.values(parts).forEach(p => p && (p.visible = true));
            }
        };

        updateVisibility(BuildManager.tutorialHighlightPart, HighlightManager.getHighlightedPart());

        // Subscribe to InstallManager updates
        const unsubInstall = InstallManager.subscribe(() => {
            updateVisibility(BuildManager.tutorialHighlightPart, HighlightManager.getHighlightedPart());
        });

        // Subscribe to BuildManager tutorial highlights
        const unsubHighlight = BuildManager.subscribeHighlight((partType) => {
            updateVisibility(partType, HighlightManager.getHighlightedPart());
        });

        // Subscribe to Floating Menu HighlightManager updates
        const unsubMenuHighlight = HighlightManager.subscribe((partId) => {
            updateVisibility(BuildManager.tutorialHighlightPart, partId);
        });

        return () => {
            unsubInstall();
            unsubHighlight();
            unsubMenuHighlight();
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [scene, buildMode]);

    return (
        <primitive object={scene} scale={1} position={[0,0,0]} rotation={[0,0,0]} />
    );
}

useGLTF.preload("/models/Vehicle.glb");