import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox, Text } from "@react-three/drei";
import { getBuildingColor } from "../../data/buildings.js";

// Construye la geometría extruida a partir de un contorno [[x, z], ...]
function useExtrudedShape(shapePoints, height) {
  return useMemo(() => {
    if (!shapePoints) return null;

    // La shape vive en el plano 2D (x, y). Al rotarla -PI/2 en X,
    // el eje Y 2D equivale a -Z en 3D, por eso se usa (x, -z).
    const shape = new THREE.Shape();
    shapePoints.forEach(([x, z], i) => {
      if (i === 0) shape.moveTo(x, -z);
      else shape.lineTo(x, -z);
    });
    shape.closePath();

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: height,
      bevelEnabled: false,
    });
    // Tras rotar el mesh -PI/2 en X, la extrusión (eje Z) queda hacia +Y
    return geometry;
  }, [shapePoints, height]);
}

export function Building({ building, onSelect, isSelected, personsCount = 0 }) {
  const baseColor = getBuildingColor(building.supervision);
  const color = isSelected ? "#ff6b6b" : baseColor;

  const hasShape = Array.isArray(building.shape);
  const buildingHeight = hasShape ? (building.height ?? 3) : building.size[1];

  const extrudedGeometry = useExtrudedShape(
    hasShape ? building.shape : null,
    buildingHeight,
  );

  // Texto completo de la etiqueta
  const fullText = `${building.nombre}${
    personsCount > 0 ? ` (${personsCount})` : ""
  }`;

  // Tamaño de la etiqueta
  const fontSize = 0.9;
  const estimatedWidth = Math.max(fullText.length * fontSize * 0.7, 3);

  // Para edificios con shape, la base está en y = 0 (position[1] = 0),
  // así que la etiqueta va justo encima de la altura total.
  const labelY = hasShape ? buildingHeight + 1 : buildingHeight / 2 + 1;

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect?.(building);
  };

  return (
    <group
      position={building.position}
      rotation={building.rotation || [0, 0, 0]}
    >
      {/* Edificio */}
      {hasShape ? (
        <mesh
          geometry={extrudedGeometry}
          rotation={[-Math.PI / 2, 0, 0]}
          onClick={handleClick}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={color}
            roughness={0.7}
            metalness={0.05}
          />
        </mesh>
      ) : (
        <RoundedBox
          args={building.size}
          radius={0.15}
          smoothness={4}
          onClick={handleClick}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={color}
            roughness={0.7}
            metalness={0.05}
          />
        </RoundedBox>
      )}

      {/* Etiquetas en ambos lados */}
      <group
        position={[0, labelY, 0]}
        rotation={[0, -(building.rotation?.[1] || 0) - Math.PI / 2, 0]}
      >
        {/* Lado 1 */}
        <group>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[estimatedWidth, 1]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.85}
              side={THREE.DoubleSide}
            />
          </mesh>

          <Text
            position={[0, 0, 0.02]}
            fontSize={fontSize}
            color="#000000"
            anchorX="center"
            anchorY="middle"
          >
            {fullText}
          </Text>
        </group>

        {/* Lado 2 */}
        <group rotation={[0, Math.PI, 0]}>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[estimatedWidth, 1]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.85}
              side={THREE.DoubleSide}
            />
          </mesh>

          <Text
            position={[0, 0, 0.02]}
            fontSize={fontSize}
            color="#000000"
            anchorX="center"
            anchorY="middle"
          >
            {fullText}
          </Text>
        </group>
      </group>
    </group>
  );
}
