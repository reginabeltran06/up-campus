import { useRef } from 'react';
import { Text } from '@react-three/drei';

export function Spot({ spot, onSelect, isSelected, isHighlighted, personsCount = 0 }) {
  const meshRef = useRef();

  const spotColor = isSelected ? '#ff6b6b' : isHighlighted ? '#ffff00' : '#00ff00';
  const emissiveColor = isSelected ? '#ff6b6b' : isHighlighted ? '#ffff00' : '#00aa00';
  const emissiveIntensity = isSelected || isHighlighted ? 0.8 : 0.3;

  return (
    <group position={spot.position}>
      {/* Cilindro del spot */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(spot);
        }}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.6, 0.6, 0.2, 32]} />
        <meshStandardMaterial
          color={spotColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* Badge de cantidad de personas */}
      {personsCount > 0 && (
        <group position={[0, 0.5, 0]}>
          <mesh>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshBasicMaterial color="#ff6b6b" />
          </mesh>
          <Text
            position={[0, 0, 0.4]}
            fontSize={0.5}
            color="#fff"
            anchorX="center"
            anchorY="middle"
          >
            {personsCount}
          </Text>
        </group>
      )}

      {/* Nombre del spot */}
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.4}
        color="#333"
        anchorX="center"
        anchorY="bottom"
        maxWidth={2}
      >
        {spot.nombre}
      </Text>
    </group>
  );
}
