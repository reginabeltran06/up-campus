export function PersonList({ persons = [], onPersonDragStart = null }) {
  if (persons.length === 0) {
    return (
      <div className="person-list empty">
        <p>Sin personas disponibles</p>
      </div>
    );
  }

  return (
    <div className="person-list">
      <h2>Personal Disponible</h2>
      <div className="persons-container">
        {persons.map((person) => (
          <div
            key={person._id}
            className="person-item"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = 'move';
              onPersonDragStart?.(person);
            }}
            onDragEnd={() => {
              // Limpieza si es necesaria
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
          </div>
        ))}
      </div>
    </div>
  );
}
