import { useState } from "react";
import { Html } from "@react-three/drei";

const reasons = [
  { value: "vacaciones", label: "Vacaciones" },
  { value: "enfermedad", label: "Enfermedad" },
  { value: "permiso", label: "Permiso" },
  { value: "otro", label: "Otro" },
];

export function ZonePopover({
  building,
  personsInZone = [],
  onClose,
  onPersonDragStart,
  onMarkUnavailable,
  onPersonSelect,
}) {
  const [openMenu, setOpenMenu] = useState(null);

  if (!building) return null;

  const [bx, by, bz] = building.position;
  const hasShape = Array.isArray(building.shape);

  // Parte superior del edificio (la etiqueta flota ~1 unidad arriba)
  const top = hasShape
    ? by + (building.height ?? 3)
    : by + building.size[1] / 2;

  const handleMark = async (person, motivo) => {
    setOpenMenu(null);
    try {
      await onMarkUnavailable?.(person, motivo);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Html
      position={[bx, top + 2.5, bz]}
      center
      zIndexRange={[20, 0]}
      style={{ pointerEvents: "auto" }}
    >
      <div
        className="zone-popover"
        onPointerDown={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        <div className="zone-popover-header">
          <div>
            <h3>{building.nombre}</h3>
            {building.supervision && (
              <span className="zone-popover-supervision">
                {building.supervision}
              </span>
            )}
          </div>
          <button className="zone-popover-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {personsInZone.length === 0 ? (
          <p className="zone-popover-empty">Sin personas asignadas</p>
        ) : (
          <div className="zone-popover-list">
            <p className="zone-popover-count">
              Personas ({personsInZone.length})
            </p>

            {personsInZone.map((person) => (
              <div
                key={person._id}
                className="zone-popover-person"
                draggable
                onClick={() => onPersonSelect?.(person)}
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", person._id);
                  onPersonDragStart?.(person);
                }}
              >
                {person.foto && <img src={person.foto} alt={person.nombre} />}

                <div className="zone-popover-info">
                  <p className="name">{person.nombre}</p>
                  <p className="turn">{person.turno}</p>
                </div>

                <button
                  className="person-menu-button"
                  title="Marcar como no disponible"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenu((c) => (c === person._id ? null : person._id));
                  }}
                >
                  ⋮
                </button>

                {openMenu === person._id && (
                  <div
                    className="zone-popover-menu"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {reasons.map((r) => (
                      <button
                        key={r.value}
                        onClick={() => handleMark(person, r.value)}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Html>
  );
}
