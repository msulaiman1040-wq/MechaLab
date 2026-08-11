import VehicleAnimator from "../components/VehicleAnimator";
import { Suspense, useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Stage } from "@react-three/drei";
import * as THREE from "three";
import Vehicle from "../components/Vehicle";
import ContextMenu from "../components/ContextMenu";
import RaycasterManager from "../managers/RaycasterManager";
import VehicleContextMenuManager from "../managers/VehicleContextMenuManager";
import BuildManager from "../managers/BuildManager";

function SceneInitializer() {
    const { camera, scene } = useThree();

    useEffect(() => {
        RaycasterManager.setCamera(camera);
        RaycasterManager.setScene(scene);
    }, [camera, scene]);

    return null;
}

function ControlsLock({ controlsRef }) {
    useFrame(() => {
        if (controlsRef.current) {
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
        }
    });
    return null;
}

export default function Scene({ buildMode, onSceneReady }) {
    const controls = useRef();
    const [isInteracted, setIsInteracted] = useState(false);

    const initialCameraPosition = useMemo(() => new THREE.Vector3(8, 5, 8), []);
    const initialDistance = useMemo(() => initialCameraPosition.length(), [initialCameraPosition]);

    const removeInstalledPart = () => {
        const mesh = VehicleContextMenuManager.mesh;

        if (!mesh) {
            VehicleContextMenuManager.close();
            return;
        }

        BuildManager.uninstall(mesh.userData.id);
        VehicleContextMenuManager.close();
    };

    return (
        <>
            <div
                id="vehicle-canvas"
                style={{
                    width: "100%",
                    height: "100%",
                    touchAction: "none" // Ensures mobile pinch gestures target the canvas instead of scrolling the window
                }}
            >
                <Canvas
                    onCreated={() => {
                        if (onSceneReady)
                            onSceneReady();
                    }}
                    camera={{
                        position: [initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z],
                        fov: 50
                    }}
                    style={{
                        position: "relative",
                        zIndex: 1
                    }}
                >
                    <SceneInitializer />

                    <ambientLight intensity={2} />

                    <directionalLight
                        position={[10, 10, 10]}
                        intensity={3}
                    />

                    <Suspense fallback={null}>
                        <Stage
                            environment="city"
                            intensity={0.6}
                        >
                            <Vehicle buildMode={buildMode} />
                        </Stage>
                    </Suspense>

                    <VehicleAnimator />

                    <Environment preset="city" />

                    <OrbitControls
                        ref={controls}
                        enableRotate={true}
                        enablePan={false}
                        screenSpacePanning={false}
                        rotateSpeed={2.5}
                        enableZoom={true}
                        zoomSpeed={1.2}        // Enhances mobile pinch sensitivity
                        minDistance={2}
                        maxDistance={initialDistance}
                        autoRotate={!isInteracted}
                        autoRotateSpeed={1.0}
                        touches={{
                            ONE: THREE.TOUCH.ROTATE,
                            TWO: THREE.TOUCH.DOLLY
                        }}
                        onStart={() => {
                            setIsInteracted(true);
                        }}
                    />

                    <ControlsLock controlsRef={controls} />
                </Canvas>
            </div>
            <ContextMenu
                visible={VehicleContextMenuManager.visible}
                x={VehicleContextMenuManager.x}
                y={VehicleContextMenuManager.y}
                onYes={removeInstalledPart}
                onNo={() => VehicleContextMenuManager.close()}
            />
        </>
    );
}