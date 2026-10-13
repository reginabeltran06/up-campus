import * as THREE from "three";

const campusShape = new THREE.Shape();

campusShape.moveTo(-7, -22.5);

campusShape.lineTo(7, -22.5);

campusShape.lineTo(7, -19);

campusShape.lineTo(10, -19);

campusShape.lineTo(12, 3);

campusShape.lineTo(8, 3);

campusShape.lineTo(11, 20.5);

campusShape.lineTo(6, 21.5);

campusShape.lineTo(-21, 9);

campusShape.quadraticCurveTo(-19, 6, -22, 4);

campusShape.quadraticCurveTo(-9, -6, -9, -19);

campusShape.lineTo(-7, -19);

campusShape.closePath();

export default function Ground() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      scale={[1.8, 2, 1]}
      receiveShadow
    >
      <shapeGeometry args={[campusShape]} />

      <meshStandardMaterial
        color="#9FA49F"
        roughness={0.9}
        metalness={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
