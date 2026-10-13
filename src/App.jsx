import { useState, useRef, useCallback, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { usePersons } from "./hooks/usePersons.js";
import { useAssignments } from "./hooks/useAssignments.js";
import { useAvailability } from "./hooks/useAvailability.js";
import { useToast } from "./hooks/useToast.js";

import { Campus } from "./components/Campus/Campus.jsx";
import { PersonList } from "./components/People/PersonList.jsx";
import { PersonDetailsModal } from "./components/People/PersonDetailsModal.jsx";
import { ZoneDetail } from "./components/UI/ZoneDetail.jsx";
import { UnavailablePeople } from "./components/UI/UnavailablePeople.jsx";
import { ToastContainer } from "./components/UI/Toast.jsx";
import { Header } from "./components/UI/Header.jsx";

import { buildings } from "./data/buildings.js";

function CameraController({ draggedPerson, cameraRef }) {
  const { camera } = useThree();

  useEffect(() => {
    cameraRef.current = camera;

    if (!draggedPerson) {
      camera.position.set(0, 40, 60);
      camera.lookAt(0, 0, 0);
    }
  }, [draggedPerson, camera, cameraRef]);

  return null;
}

function normalizeTurno(turno) {
  return String(turno ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function App() {
  const { persons, loading: personsLoading } = usePersons();

  const {
    assignments,
    assignPersonToZone,
    clearAssignments,
    restoreAssignments,
    lastBackupId,
  } = useAssignments();
  useEffect(() => {
    const cached = localStorage.getItem("up_campus_assignments");

    if (cached) {
      console.log("✓ Asignaciones cargadas del cache local");
    }
  }, []);

  const { unavailable, markUnavailable, markAvailable } = useAvailability();

  const { toasts, addToast, removeToast } = useToast();

  const [selectedTurno, setSelectedTurno] = useState("matutino");

  const [draggedPerson, setDraggedPerson] = useState(null);
  const [search, setSearch] = useState("");
  const [draggedPersonPosition, setDraggedPersonPosition] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const [leftPanelWidth, setLeftPanelWidth] = useState(300);
  const [rightPanelWidth, setRightPanelWidth] = useState(300);

  const canvasRef = useRef(null);
  const cameraRef = useRef(null);

  const today = new Date().toISOString().split("T")[0];

  const findBuildingAtPosition = useCallback((position) => {
    if (!position) return null;

    const [x, , z] = position;

    for (const building of buildings) {
      const [bx, , bz] = building.position;
      const [width, , depth] = building.size;
      const rotationY = building.rotation?.[1] || 0;

      const dx = x - bx;
      const dz = z - bz;

      const localX = dx * Math.cos(-rotationY) - dz * Math.sin(-rotationY);

      const localZ = dx * Math.sin(-rotationY) + dz * Math.cos(-rotationY);

      if (Math.abs(localX) <= width / 2 && Math.abs(localZ) <= depth / 2) {
        return building;
      }
    }

    return null;
  }, []);

  const handleResizeStart = useCallback(
    (side, event) => {
      event.preventDefault();

      const startX = event.clientX;

      const startLeftWidth = leftPanelWidth;
      const startRightWidth = rightPanelWidth;

      const handleMouseMove = (e) => {
        if (side === "left") {
          const difference = e.clientX - startX;

          const newWidth = Math.min(
            Math.max(startLeftWidth + difference, 180),
            400,
          );

          setLeftPanelWidth(newWidth);
        }

        if (side === "right") {
          const difference = startX - e.clientX;

          const newWidth = Math.min(
            Math.max(startRightWidth + difference, 220),
            450,
          );

          setRightPanelWidth(newWidth);
        }
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [leftPanelWidth, rightPanelWidth],
  );

  const assignmentMap = assignments.reduce((acc, assignment) => {
    acc[assignment.personaId] = assignment.zonaId;
    return acc;
  }, {});

  const unavailableMap = unavailable.reduce((acc, item) => {
    acc[item.personaId] = item;
    return acc;
  }, {});

  const matchesTurno = (person) => {
    const selected = normalizeTurno(selectedTurno);

    return (
      !selected ||
      selected === "todos" ||
      selected === "todos los turnos" ||
      normalizeTurno(person.turno) === selected
    );
  };

  const matchesSearch = (person) => {
    const query = search.trim().toLowerCase();

    return (
      !query ||
      String(person.nombre ?? "")
        .toLowerCase()
        .includes(query) ||
      String(person.turno ?? "")
        .toLowerCase()
        .includes(query)
    );
  };

  const availablePersons = persons.filter(
    (person) =>
      !assignmentMap[person._id] &&
      !unavailableMap[person._id] &&
      matchesTurno(person) &&
      matchesSearch(person),
  );

  const personsInZone = selectedZone
    ? persons.filter(
        (person) =>
          assignmentMap[person._id] === selectedZone.id &&
          !unavailableMap[person._id] &&
          matchesTurno(person) &&
          matchesSearch(person),
      )
    : [];

  const filteredUnavailablePersons = persons.filter(
    (person) =>
      unavailableMap[person._id] &&
      matchesTurno(person) &&
      matchesSearch(person),
  );

  // Asignaciones visibles según el turno seleccionado.
  // Se conservan las asignaciones originales para guardar cambios.
  const filteredAssignments = assignments.filter((assignment) => {
    const person = persons.find(
      (person) => person._id === assignment.personaId,
    );

    return person && matchesTurno(person);
  });

  const handlePersonDragStart = useCallback((person) => {
    setDraggedPerson(person);
    setDraggedPersonPosition([0, 1, 0]);
  }, []);

  const handlePersonDragMove = useCallback((position) => {
    setDraggedPersonPosition(position);
  }, []);

  const handlePersonDragEnd = useCallback(
    async (position) => {
      if (!draggedPerson || !position) {
        setDraggedPerson(null);
        setDraggedPersonPosition(null);
        return;
      }

      const building = findBuildingAtPosition(position);

      if (building) {
        try {
          await assignPersonToZone(draggedPerson._id, building.id);

          addToast(
            `✓ ${draggedPerson.nombre} asignado a ${building.nombre}`,
            "success",
          );
        } catch (error) {
          addToast("✗ Error al asignar persona", "error");
        }
      } else {
        addToast("✗ Drop fuera de un edificio válido", "warning");
      }

      setDraggedPerson(null);
      setDraggedPersonPosition(null);
    },
    [draggedPerson, findBuildingAtPosition, assignPersonToZone, addToast],
  );

  const handleMarkUnavailable = useCallback(
    async (person, motivo) => {
      try {
        await markUnavailable(person._id, motivo);

        addToast(`✓ ${person.nombre} marcado como no disponible`, "success");

        setSelectedZone((current) => {
          if (!current) return current;

          const stillAssigned = assignments.some(
            (assignment) =>
              assignment.personaId === person._id &&
              assignment.zonaId === current.id,
          );

          return stillAssigned ? null : current;
        });
      } catch (error) {
        addToast("✗ Error al marcar persona como no disponible", "error");
      }
    },
    [markUnavailable, addToast, assignments],
  );

  const handleMarkAvailable = useCallback(
    async (availabilityId) => {
      try {
        await markAvailable(availabilityId);

        addToast("✓ Persona nuevamente disponible", "success");
      } catch (error) {
        addToast("✗ Error al volver a hacer disponible a la persona", "error");
      }
    },
    [markAvailable, addToast],
  );

  const handleClearMap = useCallback(async () => {
    const confirmed = window.confirm(
      "¿Quieres limpiar las asignaciones de hoy? Se guardará un respaldo para poder recuperarlas después.",
    );

    if (!confirmed) return;

    try {
      const result = await clearAssignments();

      setSelectedZone(null);
      setSelectedPerson(null);

      addToast(
        `Mapa limpiado. Se guardaron ${result.cleared} asignaciones en el respaldo.`,
        "success",
      );
    } catch (error) {
      console.error("Error al limpiar el mapa:", error);
      addToast("Error al limpiar el mapa.", "error");
    }
  }, [clearAssignments, addToast]);

  const handleRestoreMap = useCallback(async () => {
    const confirmed = window.confirm(
      "¿Quieres recuperar el último respaldo? Se reemplazarán las asignaciones actuales.",
    );

    if (!confirmed) return;

    try {
      const result = await restoreAssignments(lastBackupId);

      setSelectedZone(null);
      setSelectedPerson(null);

      addToast(`Se restauraron ${result.restored} asignaciones.`, "success");
    } catch (error) {
      console.error("Error al restaurar el mapa:", error);
      addToast("Error al restaurar las asignaciones.", "error");
    }
  }, [restoreAssignments, lastBackupId, addToast]);

  const handleCanvasPointerDown = useCallback((e) => {
    if (!canvasRef.current || e.button !== 0) return;

    const target = e.target;

    if (target.closest(".person-item")) {
      return;
    }
  }, []);

  const handleCanvasDragOver = useCallback(
    (e) => {
      if (!draggedPerson || !canvasRef.current || !cameraRef.current) {
        return;
      }

      e.preventDefault();

      const rect = canvasRef.current.getBoundingClientRect();

      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const mouse = new THREE.Vector2(x, y);
      const raycaster = new THREE.Raycaster();

      raycaster.setFromCamera(mouse, cameraRef.current);

      const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.5);

      const intersection = new THREE.Vector3();

      if (raycaster.ray.intersectPlane(groundPlane, intersection)) {
        setDraggedPersonPosition([intersection.x, 0.5, intersection.z]);
      }
    },
    [draggedPerson],
  );

  const handleCanvasPointerUp = useCallback(() => {
    if (draggedPerson) {
      handlePersonDragEnd(draggedPersonPosition);
    }
  }, [draggedPerson, draggedPersonPosition, handlePersonDragEnd]);

  const handleDragOver = useCallback(
    (e) => {
      e.preventDefault();

      e.dataTransfer.dropEffect = "move";

      handleCanvasDragOver(e);
    },
    [handleCanvasDragOver],
  );

  const handleDrop = useCallback((e) => {
    e.preventDefault();
  }, []);

  if (personsLoading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="app">
      <Header
        search={search}
        onSearchChange={setSearch}
        selectedTurno={selectedTurno}
        onTurnoChange={setSelectedTurno}
        onClearMap={handleClearMap}
        onRestoreMap={handleRestoreMap}
        hasBackup={Boolean(lastBackupId)}
      />

      <div
        className="map-layout"
        style={{
          "--left-panel-width": `${leftPanelWidth}px`,
          "--right-panel-width": `${rightPanelWidth}px`,
        }}
      >
        {selectedPerson && (
          <PersonDetailsModal
            person={selectedPerson}
            onClose={() => setSelectedPerson(null)}
            assignment={assignments.find(
              (assignment) => assignment.personaId === selectedPerson._id,
            )}
            buildings={buildings}
          />
        )}

        <div className="left-panel">
          <PersonList
            persons={availablePersons}
            onPersonDragStart={handlePersonDragStart}
            onMarkUnavailable={handleMarkUnavailable}
            onPersonSelect={setSelectedPerson}
          />
        </div>

        <div
          className="resize-handle left-resize"
          onMouseDown={(e) => handleResizeStart("left", e)}
        />

        <div
          className="center-panel"
          ref={canvasRef}
          onPointerDown={handleCanvasPointerDown}
          onPointerUp={handleCanvasPointerUp}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Canvas
            camera={{
              position: [0, 45, 55],
              fov: 55,
              near: 0.1,
              far: 500,
            }}
            shadows
            gl={{
              antialias: true,
              powerPreference: "high-performance",
            }}
          >
            <CameraController
              draggedPerson={draggedPerson}
              cameraRef={cameraRef}
            />

            <Campus
              persons={persons}
              assignments={filteredAssignments}
              draggedPerson={draggedPerson}
              draggedPersonPosition={draggedPersonPosition}
              onPersonDragStart={handlePersonDragStart}
              onPersonDragMove={handlePersonDragMove}
              onPersonDragEnd={handlePersonDragEnd}
              onBuildingSelect={setSelectedZone}
              selectedZoneId={selectedZone?.id}
            />

            <ambientLight intensity={0.8} />

            <directionalLight
              position={[30, 50, 20]}
              intensity={2.5}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-left={-100}
              shadow-camera-right={100}
              shadow-camera-top={100}
              shadow-camera-bottom={-100}
            />
          </Canvas>

          <UnavailablePeople
            persons={filteredUnavailablePersons}
            unavailable={unavailable}
            onMarkAvailable={handleMarkAvailable}
            onPersonSelect={setSelectedPerson}
          />
        </div>

        <div
          className="resize-handle right-resize"
          onMouseDown={(e) => handleResizeStart("right", e)}
        />

        <div className="right-panel">
          <ZoneDetail
            selectedZone={selectedZone}
            personsInZone={personsInZone}
            onPersonDragStart={handlePersonDragStart}
            onMarkUnavailable={handleMarkUnavailable}
            onPersonSelect={setSelectedPerson}
          />
        </div>

        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </div>
  );
}
