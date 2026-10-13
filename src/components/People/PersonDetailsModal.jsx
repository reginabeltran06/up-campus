export function PersonDetailsModal({
  person,
  onClose,
  assignment = null,
  buildings = [],
}) {
  if (!person) return null;

  const formatDate = (date) => {
    if (!date) return "No disponible";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "No disponible";

    return parsedDate.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  const getAge = (date) => {
    if (!date) return "";

    const birthDate = new Date(date);
    const today = new Date();

    if (Number.isNaN(birthDate.getTime()) || birthDate > today) return "";

    let years = today.getFullYear() - birthDate.getFullYear();

    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      years--;
    }

    return `(${years} años)`;
  };

  const getSeniority = (date) => {
    if (!date) return "";

    const start = new Date(date);
    const today = new Date();

    if (Number.isNaN(start.getTime()) || start > today) return "";

    let years = today.getFullYear() - start.getFullYear();
    let months = today.getMonth() - start.getMonth();

    if (today.getDate() < start.getDate()) {
      months--;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return `(${years} años ${months} meses)`;
  };

  const showValue = (value) => {
    if (value === undefined || value === null || value === "") {
      return "No disponible";
    }

    return value;
  };

  const assignedBuilding = assignment
    ? buildings.find((building) => building.id === assignment.zonaId)
    : null;

  return (
    <div className="person-modal-overlay" onClick={onClose}>
      <section
        className="person-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="person-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="person-modal-close"
          onClick={onClose}
          aria-label="Cerrar ventana"
        >
          ×
        </button>

        <div className="person-modal-header">
          {person.foto && (
            <img
              src={person.foto}
              alt={`Foto de ${person.nombre}`}
              className="person-modal-photo"
            />
          )}

          <div>
            <h2 id="person-modal-title">{person.nombre}</h2>

            <p>
              <strong>Turno:</strong> {showValue(person.turno)}
            </p>

            <div style={{ fontSize: "0.8rem", color: "#666" }}>
              {assignedBuilding ? (
                <>
                  <p style={{ margin: "3px 0" }}>
                    <strong>Área:</strong>{" "}
                    {showValue(assignedBuilding.supervision)}
                  </p>

                  <p style={{ margin: "3px 0" }}>
                    <strong>Edificio:</strong>{" "}
                    {showValue(assignedBuilding.nombre)}
                  </p>
                </>
              ) : (
                <p style={{ margin: "3px 0" }}>
                  <strong>Asignación:</strong> Por asignar
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="person-modal-scroll">
          <div className="person-modal-section">
            <h3>Información personal</h3>

            <p>
              <strong>Fecha de nacimiento:</strong>{" "}
              {formatDate(person.fechaNacimiento)}{" "}
              {getAge(person.fechaNacimiento)}
            </p>

            <p>
              <strong>Teléfono:</strong> {showValue(person.telefono)}
            </p>

            <p>
              <strong>Correo:</strong> {showValue(person.correo)}
            </p>

            <p>
              <strong>Fecha de ingreso:</strong>{" "}
              {formatDate(person.fechaIngreso)}{" "}
              {getSeniority(person.fechaIngreso)}
            </p>

            <p>
              <strong>Tipo de sangre:</strong> {showValue(person.sangre)}
            </p>

            <p>
              <strong>Pasatiempos:</strong> {showValue(person.hobby)}
            </p>

            <p>
              <strong>Estado civil:</strong>{" "}
              {person.casado === true
                ? "Casado/a"
                : person.casado === false
                  ? "Soltero/a"
                  : "No disponible"}
            </p>
          </div>

          <div className="person-modal-section">
            <h3>
              Hijos ({Array.isArray(person.hijos) ? person.hijos.length : 0})
            </h3>

            {Array.isArray(person.hijos) && person.hijos.length > 0 ? (
              <ul className="person-modal-children">
                {person.hijos.map((hijo, index) => (
                  <li key={`${hijo.nombre}-${index}`}>
                    <strong>{hijo.nombre}</strong>

                    <span>
                      Fecha de nacimiento: {formatDate(hijo.fechaNH)}{" "}
                      {getAge(hijo.fechaNH)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay hijos registrados.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
