import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import SimulationManager from "../managers/SimulationManager";

const texture = new THREE.TextureLoader().load("/textures/wheelBlur.png");

export default function WheelBlur({ wheel }) {

    const mesh = useRef();

    useFrame((_, delta) => {

        if (!wheel || !mesh.current) return;

        // Follow the wheel
        wheel.getWorldPosition(mesh.current.position);
        wheel.getWorldQuaternion(mesh.current.quaternion);

        // Slightly outside the tyre
        mesh.current.translateZ(0.03);

        // Fade in/out
        const targetOpacity = SimulationManager.wheelsRotating ? 0.65 : 0;

        mesh.current.material.opacity +=
            (targetOpacity - mesh.current.material.opacity) * 6 * delta;

        // Rotate ONLY the blur mesh
        if (SimulationManager.wheelsRotating) {
            mesh.current.rotation.z += 20 * delta;
        }

    });

    return (

        <mesh ref={mesh} visible>

            <planeGeometry args={[0.72, 0.72]} />

            <meshBasicMaterial
                map={texture}
                transparent
                opacity={0}
                depthWrite={false}
            />

        </mesh>

    );

}