import { useState, useRef, useCallback, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { usePersons } from "./hooks/usePersons.js";
import { useAssignments } from "./hooks/useAssignments.js";
import { useToast } from "./hooks/useToast.js";
import { Campus } from "./components/Campus/Campus.jsx";
import { PersonList } from "./components/People/PersonList.jsx";
import { ZoneDetail } from "./components/UI/ZoneDetail.jsx";
import { ToastContainer } from "./components/UI/Toast.jsx";
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

export default function App() {
  const { persons, loading: personsLoading } = usePersons();
  const { assignments, assignPersonToZone, removeAssignment } =
    useAssignments();
  const { toasts, addToast, removeToast } = useToast();

  // Estados
  const [draggedPerson, setDraggedPerson] = useState(null);
  const [draggedPersonPosition, setDraggedPersonPosition] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);

  const [leftPanelWidth, setLeftPanelWidth] = useState(220);
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

      // Convertir la posición del mouse al sistema local del edificio
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
  // Mapear asignaciones
  const assignmentMap = assignments.reduce((acc, a) => {
    acc[a.personaId] = a.zonaId;
    return acc;
  }, {});

  // Personas disponibles (sin asignación)
  const availablePersons = persons.filter((p) => !assignmentMap[p._id]);

  // Personas en zona seleccionada
  const personsInZone = selectedZone
    ? persons.filter((p) => assignmentMap[p._id] === selectedZone.id)
    : [];

  // Iniciar drag de persona
  const handlePersonDragStart = useCallback((person) => {
    setDraggedPerson(person);
    setDraggedPersonPosition([0, 1, 0]);
  }, []);

  // Mover persona durante drag
  const handlePersonDragMove = useCallback((position) => {
    setDraggedPersonPosition(position);
  }, []);

  // Validar y guardar asignación
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
        } catch (err) {
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

  // Detectar clicks en Canvas
  const handleCanvasPointerDown = useCallback((e) => {
    if (!canvasRef.current || e.button !== 0) return;

    // Solo si hay persona disponible seleccionada
    const target = e.target;
    if (target.closest(".person-item")) {
      // El drag lo maneja el evento de lista
      return;
    }
  }, []);
  const handleCanvasDragOver = useCallback(
    (e) => {
      if (!draggedPerson || !canvasRef.current || !cameraRef.current) return;

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

  const handleCanvasPointerUp = useCallback(
    (e) => {
      if (draggedPerson) {
        handlePersonDragEnd(draggedPersonPosition);
      }
    },
    [draggedPerson, draggedPersonPosition, handlePersonDragEnd],
  );
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
    // El drop se maneja en handlePersonDragEnd
  }, []);

  if (personsLoading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div
      className="app"
      style={{
        "--left-panel-width": `${leftPanelWidth}px`,
        "--right-panel-width": `${rightPanelWidth}px`,
      }}
    >
      {/* Panel izquierdo: Lista de personas */}
      <div className="left-panel">
        <PersonList
          persons={availablePersons}
          onPersonDragStart={handlePersonDragStart}
        />
      </div>
      <div
        className="resize-handle left-resize"
        onMouseDown={(e) => handleResizeStart("left", e)}
      />
      {/* Panel central: Mapa 3D */}
      <div
        className="center-panel"
        ref={canvasRef}
        onPointerDown={handleCanvasPointerDown}
        onPointerUp={handleCanvasPointerUp}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Canvas
          camera={{ position: [0, 40, 60], fov: 75 }}
          gl={{ antialias: true }}
        >
          <CameraController
            draggedPerson={draggedPerson}
            cameraRef={cameraRef}
          />{" "}
          <Campus
            persons={persons}
            assignments={assignments}
            draggedPerson={draggedPerson}
            draggedPersonPosition={draggedPersonPosition}
            onPersonDragStart={handlePersonDragStart}
            onPersonDragMove={handlePersonDragMove}
            onPersonDragEnd={handlePersonDragEnd}
            onBuildingSelect={setSelectedZone}
            selectedZoneId={selectedZone?.id}
          />
        </Canvas>
      </div>

      <div
        className="resize-handle right-resize"
        onMouseDown={(e) => handleResizeStart("right", e)}
      />
      {/* Panel derecho: Detalles de zona */}
      <div className="right-panel">
        <ZoneDetail selectedZone={selectedZone} personsInZone={personsInZone} />
      </div>

      {/* Notificaciones */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
