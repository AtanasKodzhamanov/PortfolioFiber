import React, { useRef, useEffect,useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { PlaneGeometry } from 'three';
import { Leva, useControls } from 'leva';
import { OrbitControls } from '@react-three/drei';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import Airplane from './Components/Airplane.jsx';
import Planet from './Components/Planet.jsx';
import Building from './Components/Building.jsx';
import { RigidBody } from '@react-three/rapier'

function App() {
  const planetRadius = 50;



  const cameraRef = useRef();

  return (
    <>
    <Leva/>
    <Canvas  camera={{ position: [5, 5, 5], fov: 75 }}>
      <Sky
        distance={42000}  // Camera distance (default=450000)
        inclination={0.55} // Sun elevation angle from 0 to 1 (default=0)
        azimuth={0.25}     // Sun rotation around the Y-axis from 0 to 1 (default=0.25)
      />
      <ambientLight intensity={1} />

      <Planet planetRadius={planetRadius} />
      <Building />
      <Airplane planetRadius={planetRadius} />
      <OrbitControls/>

    </Canvas>
    </>
  );
}

export default App;
