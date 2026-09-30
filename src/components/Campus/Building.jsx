import * as THREE from "three";
import { Text } from "@react-three/drei";
import { getBuildingColor } from "../../data/buildings.js";

export function Building({ building, onSelect, isSelected, personsCount = 0 }) {
  const baseColor = getBuildingColor(building.supervision);
  const color = isSelected ? "#ff6b6b" : baseColor;

  return (
    <group position={building.position} rotation={building.rotation}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(building);
        }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={building.size} />
        <meshStandardMaterial
          color={color}
          roughness={0.7}
          metalness={0.2}
          emissive={isSelected ? "#ff6b6b" : "#000000"}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>

      {/* Bordes para mejor visualización */}
      <lineSegments>
        <edgesGeometry
          attach="geometry"
          args={[new THREE.BoxGeometry(...building.size)]}
        />
        <lineBasicMaterial attach="material" color="#333" linewidth={1} />
      </lineSegments>

      {/* Etiqueta */}
      <group position={[0, building.size[1] / 2 + 1, 0]}>
        <mesh>
          <planeGeometry args={[building.size[0], 1]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
        <Text
          position={[0, 0, 0.1]}
          fontSize={1}
          color="#000"
          anchorX="center"
          anchorY="middle"
        >
          {building.nombre}
          {personsCount > 0 && ` (${personsCount})`}
        </Text>
      </group>
    </group>
  );
}
