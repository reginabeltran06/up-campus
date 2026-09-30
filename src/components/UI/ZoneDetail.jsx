export function ZoneDetail({ selectedZone = null, personsInZone = [] }) {
  if (!selectedZone) {
    return (
      <div className="zone-detail empty">
        <p>Selecciona un edificio o zona</p>
      </div>
    );
  }

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
            <div key={person._id} className="person-card">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
