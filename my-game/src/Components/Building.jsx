import React from 'react';
import * as THREE from 'three';


function Building(){
    return (
      <mesh scale={[10, 10, 10]} position={[0, -50, 0]} receiveShadow>
        <boxGeometry args={[1, 10, 1]} /> {/* Adjust the size of the building using the args */}
        <meshStandardMaterial color="red" />
      </mesh>
    )
  }

export default Building;