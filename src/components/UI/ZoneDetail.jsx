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

export function ZoneDetail({
  selectedZone = null,
  personsInZone = [],
  onPersonDragStart = null,
  onMarkUnavailable = null,
  onPersonSelect = null,
}) {
  const [openMenu, setOpenMenu] = useState(null);

  if (!selectedZone) {
    return (
      <div className="zone-detail empty">
        <p>Selecciona un edificio o zona</p>
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
    <div className="zone-detail">
      <h2>{selectedZone.nombre}</h2>

      {selectedZone.supervision && (
        <p className="zone-supervision">
          <span className="label">Supervisión:</span>
          {selectedZone.supervision}
        </p>
      )}

      {personsInZone.length === 0 ? (
        <p className="empty-persons">Sin personas asignadas</p>
      ) : (
        <div className="persons-in-zone">
          <h3>Personas ({personsInZone.length})</h3>

          {personsInZone.map((person) => (
            <div
              key={person._id}
              className="person-card"
              draggable
              onClick={() => onPersonSelect?.(person)}
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", person._id);

                onPersonDragStart?.(person);
              }}
            >
              {person.foto && (
                <img
                  src={person.foto}
                  alt={person.nombre}
                  className="person-photo"
                />
              )}

              <div className="person-details">
                <p className="person-name">{person.nombre}</p>

                <p className="person-turn">
                  <span className="label">Turno:</span>
                  {person.turno}
                </p>

                <p className="person-email">
                  <span className="label">Correo:</span>
                  {person.correo}
                </p>
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
      )}
    </div>
  );
}
