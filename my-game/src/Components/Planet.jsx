import React from "react";

function Planet({planetRadius}) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[planetRadius * 2, planetRadius * 2]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
}

export default Planet;
