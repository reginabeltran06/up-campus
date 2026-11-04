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
  const unavailablePeople = unavailable
    .map((item) => {
      const person = persons.find((p) => p._id === item.personaId);
      return person ? { ...item, person } : null;
    })
    .filter(Boolean);

  return (
    <div className="unavailable-panel">
      <div className="unavailable-panel-header">
        <h2>No disponibles</h2>
        <span className="unavailable-count">{unavailablePeople.length}</span>
      </div>

      {unavailablePeople.length === 0 ? (
        <p className="unavailable-empty">
          Nadie está marcado como no disponible
        </p>
      ) : (
        <div className="unavailable-list">
          {unavailablePeople.map((item) => (
            <div
              key={item._id}
              className="unavailable-person"
              onClick={() => onPersonSelect?.(item.person)}
              style={{ cursor: "pointer" }}
            >
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
