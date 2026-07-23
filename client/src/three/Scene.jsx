//Scene.jsx
import VehicleAnimator from "../components/VehicleAnimator";
import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Stage } from "@react-three/drei";
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

export default function Scene({ buildMode, onSceneReady }) {

    const controls = useRef();
    const [isInteracted, setIsInteracted] = useState(false);

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
        height: "100%"
    }}
>
    <Canvas
        onCreated={() => {

            if (onSceneReady)
                onSceneReady();

        }}
        camera={{
            position: [8, 5, 8],
            fov: 50
        }}
        style={{
            position: "relative",
            zIndex: 1,
            touchAction: "none"
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
    enableRotate
    enablePan
    enableZoom={true}
    minDistance={4}   // Prevents zooming in closer than this limit (adjust value as needed)
    maxDistance={15}  // Prevents zooming out further than this limit (adjust value as needed)
    rotateSpeed={2.5}
    panSpeed={2}
    autoRotate={!isInteracted}
    autoRotateSpeed={1.0}
    onStart={() => {
        setIsInteracted(true);
    }}
/>
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