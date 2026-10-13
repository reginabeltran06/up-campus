import { useState } from "react";

const reasonLabels = {
  vacaciones: "Vacaciones",
  enfermedad: "Enfermedad",
  permiso: "Permiso",
  otro: "Otro",
};

export function UnavailablePeople({
  persons = [],
  unavailable = [],
  onMarkAvailable = null,
  onPersonSelect,
}) {
  const [expanded, setExpanded] = useState(false);

  const unavailablePeople = unavailable
    .map((item) => {
      const person = persons.find((person) => person._id === item.personaId);

      if (!person) return null;

      return {
        ...item,
        person,
      };
    })
    .filter(Boolean);

  if (unavailablePeople.length === 0) {
    return null;
  }

  return (
    <div className="unavailable-window">
      <button
        className="unavailable-header"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <span className="unavailable-title"> No disponibles</span>

        <span className="unavailable-count">{unavailablePeople.length}</span>

        <span className="unavailable-arrow">{expanded ? "▼" : "▲"}</span>
      </button>

      {expanded && (
        <div className="unavailable-list">
          {unavailablePeople.map((item) => (
            <div
              key={item._id}
              className="unavailable-person"
              onClick={() => onPersonSelect?.(item.person)}
              style={{ cursor: "pointer" }}
            >
              {" "}
              {item.person.foto && (
                <img
                  src={item.person.foto}
                  alt={item.person.nombre}
                  className="unavailable-avatar"
                />
              )}
              <div className="unavailable-person-info">
                <p className="unavailable-person-name">{item.person.nombre}</p>

                <p className="unavailable-reason">
                  {reasonLabels[item.motivo] || "Otro"}
                </p>
              </div>
              <button
                className="available-button"
                title="Volver a hacer disponible"
                onClick={async (e) => {
                  e.stopPropagation();

                  try {
                    await onMarkAvailable?.(item._id);
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                ✓
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
