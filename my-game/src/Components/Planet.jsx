import React from "react";
import * as THREE from "three";


function Planet({planetRadius}) {
    return (
      <mesh position={[0, 0, 0]} receiveShadow>
        <sphereGeometry args={[planetRadius]} /> {/* 5 is the radius, adjust as needed */}
        <meshStandardMaterial/>
      </mesh>
    );
  }

export default Planet;