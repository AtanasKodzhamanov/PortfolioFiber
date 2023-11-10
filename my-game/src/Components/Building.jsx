import React from 'react';
import { RigidBody } from '@react-three/rapier'

function Building(){
    return (
      <mesh position={[0, 5, 0]} receiveShadow>  {/* Here, 5 is half of the building's height. Adjust accordingly */}
        <boxGeometry args={[2, 10, 2]} />  {/* Here, 10 is the building's height. Adjust accordingly */}
        <meshStandardMaterial color="red" />
      </mesh>
    )
  }

export default Building;