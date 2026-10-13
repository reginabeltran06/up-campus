import { useState } from "react";

const reasons = [
  {
    value: "vacaciones",
    label: "Vacaciones",
  },
  {
    value: "enfermedad",
    label: "Enfermedad",
  },
  {
    value: "permiso",
    label: "Permiso",
  },
  {
    value: "otro",
    label: "Otro",
  },
];

export function PersonList({
  persons = [],
  onPersonDragStart = null,
  onMarkUnavailable = null,
  onPersonSelect = null,
}) {
  const [openMenu, setOpenMenu] = useState(null);

  if (persons.length === 0) {
    return (
      <div className="person-list empty">
        <p>Sin personas disponibles</p>
      </div>
    );
  }

  const handleMarkUnavailable = async (person, motivo) => {
    setOpenMenu(null);

    try {
      await onMarkUnavailable?.(person, motivo);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="person-list">
      <h2>Personal Disponible</h2>

      <div className="persons-container">
        {persons.map((person) => (
          <div
            key={person._id}
            className="person-item"
            draggable
            onClick={() => onPersonSelect?.(person)}
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = "move";
              onPersonDragStart?.(person);
            }}
          >
            {person.foto && (
              <img
                src={person.foto}
                alt={person.nombre}
                className="person-avatar"
              />
            )}

            <div className="person-info">
              <p className="person-name">{person.nombre}</p>

              <p className="person-turn">{person.turno}</p>
            </div>

            <div className="person-actions">
              <button
                className="person-menu-button"
                title="Marcar como no disponible"
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();

                  setOpenMenu((current) =>
                    current === person._id ? null : person._id,
                  );
                }}
              >
                ⋮
              </button>

              {openMenu === person._id && (
                <div className="person-action-menu">
                  <p>Marcar como:</p>

                  {reasons.map((reason) => (
                    <button
                      key={reason.value}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.stopPropagation();

                        handleMarkUnavailable(person, reason.value);
                      }}
                    >
                      {reason.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
