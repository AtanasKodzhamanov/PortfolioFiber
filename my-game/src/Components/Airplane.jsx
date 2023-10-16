import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

function Airplane({ planetRadius }) {
    const { nodes, animations } = useGLTF('/plane/scene.gltf');
    const { actions, mixer } = useAnimations(animations);
    const { camera } = useThree();
    let PlanePosition = new THREE.Vector3(0, planetRadius+3, 0);
    const mixerRef = useRef(null);

    const MAX_PITCH = Math.PI / 4; // 45 degrees
    const MAX_ROLL = Math.PI / 3;  // 60 degrees
    const MIN_THRUST = 0.01;       // Minimum forward movement
    const MAX_THRUST = 0.3;       // Maximum forward movement

    const [planeState, setPlaneState] = useState({
        yaw: 0,
        pitch: 0,
        roll: 0,
        thrust: MIN_THRUST,
    });

    useEffect(() => {
        const handleKeyDown = (event) => {
            let newState = { ...planeState };
            switch (event.key) {
                case "a":
                    newState.yaw = 0.01;
                    break;
                case "d":
                    newState.yaw = -0.01;
                    break;
                case "w":
                    newState.pitch = Math.min(newState.pitch + 0.01, MAX_PITCH);
                    newState.thrust = Math.min(newState.thrust + 0.01, MAX_THRUST);
                    break;
                case "s":
                    newState.pitch = Math.max(newState.pitch - 0.01, -MAX_PITCH);
                    newState.thrust = Math.max(newState.thrust - 0.01, MIN_THRUST);
                    break;
                case "q":
                    newState.roll = Math.min(newState.roll + 0.01, MAX_ROLL);
                    break;
                case "e":
                    newState.roll = Math.max(newState.roll - 0.01, -MAX_ROLL);
                    break;
            }
            setPlaneState(newState);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [planeState]);

    useFrame(() => {
        const planeObject = nodes.Sketchfab_model;
    
        // Apply plane controls
        planeObject.rotation.y += planeState.yaw;
        planeObject.rotation.x += planeState.pitch;
        planeObject.rotation.z += planeState.roll;
        PlanePosition.z -= planeState.thrust;
        
        planeObject.position.set(PlanePosition.x, PlanePosition.y, PlanePosition.z);

        // Reset yaw after applying (to prevent indefinite accumulation)
        planeState.yaw = 0;
    
        // Move the camera along with the plane
        camera.position.x = PlanePosition.x + 0; // Adjust this if you want the camera to lag/lead a bit.
        camera.position.y = PlanePosition.y + 3;
        camera.position.z = PlanePosition.z + 3;
    
        // Adjust the orientation of the camera to look forward from the plane's POV
        camera.lookAt(PlanePosition.x, PlanePosition.y, PlanePosition.z - 5);
    });
    

    useEffect(() => {
        if (animations && animations.length) {
            mixerRef.current = new THREE.AnimationMixer(nodes.Sketchfab_model);
            mixerRef.current.clipAction(animations[0]).play();
        }
    }, [animations, nodes]);
    

    useFrame((state, delta) => {
        mixerRef.current && mixerRef.current.update(delta);
    });

    

    return (
      <primitive 
        castShadow
        object={nodes.Sketchfab_model}
        position={PlanePosition.toArray()}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
    );
}

export default Airplane;
