import { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import Ground from "./Ground.jsx";
import { Building } from "./Building.jsx";
import { PersonMarker } from "../People/PersonMarker.jsx";
import { buildings } from "../../data/buildings.js";

export function Campus({
  persons = [],
  assignments = [],
  draggedPerson = null,
  draggedPersonPosition = null,
  onPersonDragStart = null,
  onPersonDragMove = null,
  onPersonDragEnd = null,
  onBuildingSelect = null,
  selectedZoneId = null,
}) {
  const cameraRef = useRef();
  const canvasRef = useRef();

  // Mapear asignaciones: personaId -> zonaId
  const assignmentMap = assignments.reduce((acc, a) => {
    acc[a.personaId] = a.zonaId;
    return acc;
  }, {});

  // Contar personas por zona
  const personsPerZone = assignments.reduce((acc, a) => {
    acc[a.zonaId] = (acc[a.zonaId] || 0) + 1;
    return acc;
  }, {});

  return (
    <group>
      {/* Luces */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[50, 50, 50]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-50, 30, -50]} intensity={0.4} />

      {/* Terreno */}
      <Ground />

      {/* Edificios */}
      {buildings.map((building) => (
        <Building
          key={building.id}
          building={building}
          onSelect={onBuildingSelect}
          isSelected={selectedZoneId === building.id}
          personsCount={personsPerZone[building.id] || 0}
        />
      ))}

      {/* Marcadores de personas */}
      {persons.map((person) => {
        const zoneId = assignmentMap[person._id];
        if (!zoneId) return null;

        // Encontrar edificio
        const building = buildings.find((b) => b.id === zoneId);
        const position = building?.position || [0, 0, 0];

        return (
          <PersonMarker
            key={person._id}
            person={person}
            position={position}
            isDragging={draggedPerson?._id === person._id}
          />
        );
      })}

      {/* Marcador arrastrado */}
      {draggedPerson && draggedPersonPosition && (
        <PersonMarker
          person={draggedPerson}
          position={draggedPersonPosition}
          isDragging={true}
        />
      )}

      {/* OrbitControls */}
      <OrbitControls
        ref={cameraRef}
        enabled={!draggedPerson}
        autoRotate={false}
        minDistance={10}
        maxDistance={200}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
      />
    </group>
  );
}
