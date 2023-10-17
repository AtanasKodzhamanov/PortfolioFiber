import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

function Airplane({ planetRadius }) {
    const { nodes, animations } = useGLTF('/plane/scene.gltf');
    const { actions, mixer } = useAnimations(animations);
    const { camera } = useThree();
    const mixerRef = useRef(null);

    const MAX_PITCH = Math.PI / 6; // 45 degrees
    const THRUST = 0.01;       // Minimum forward movement
    const MAX_YAW = Math.PI / 6;   // 30 degrees
    const [PlanePosition, setPlanePosition] = useState(new THREE.Vector3(0, planetRadius+3, 0));

    const [planeState, setPlaneState] = useState({
        yaw: 0,
        pitch: 0,
        moveX: 0,  
        moveZ: 0,
        thrust: THRUST,  
    });
    
    


    useEffect(() => {
        const handleKeyDown = (event) => {
            let newState = { ...planeState };
            switch (event.key) {
                case "s":
                    newState.pitch = 1;
                    newState.moveZ = -1;  // Add this
                    break;
                case "w":
                    newState.pitch = -1;
                    newState.moveZ = 1;  // Add this
                    break;
                case "a":
                    newState.yaw = 1;
                    newState.moveX = -1;  // Add this
                    break;
                case "d":
                    newState.yaw = -1;
                    newState.moveX = 1;  // Add this
                    break;
                default:
                    return;
            }
            setPlaneState(newState);
        };
        
        const handleKeyUp = (event) => {
            let newState = { ...planeState };
            switch (event.key) {
                case "w":
                case "s":
                    newState.pitch = 0;
                    newState.moveZ = 0;  // Add this
                    break;
                case "a":
                case "d":
                    newState.yaw = 0;
                    newState.moveX = 0;  // Add this
                    break;
                default:
                    return;
            }
            setPlaneState(newState);
        };
        

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
    
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [planeState]);

    useFrame(() => {
        const planeObject = nodes.Sketchfab_model;


        PlanePosition.z -= planeState.thrust;
        planeObject.position.z = PlanePosition.z;

            // Update PlanePosition based on moveX and moveZ
        PlanePosition.x += planeState.moveX * planeState.thrust;
        PlanePosition.z += planeState.moveZ * planeState.thrust;
        planeObject.position.copy(PlanePosition);

    
        // Apply and limit yaw
        planeObject.rotation.y = THREE.MathUtils.clamp(
            planeObject.rotation.y + (planeState.yaw * 0.02),
            -MAX_YAW,
            MAX_YAW
        );

        // Apply and limit pitch
        planeObject.rotation.x = THREE.MathUtils.clamp(
            planeObject.rotation.x + (planeState.pitch * 0.02),
            -MAX_PITCH-Math.PI / 2,
            MAX_PITCH -Math.PI / 2
        );

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
