import { useEffect, useRef, useState } from "react";
import logo from "../../assets/logo.png";

const TURNOS = [
  { id: "matutino", label: "Matutino", color: "#fcfcfc" },
  { id: "vespertino", label: "Vespertino", color: "#fcfcfc" },
  { id: "nocturno", label: "Nocturno", color: "#fcfcfc" },
];

export function Header({
  search,
  onSearchChange,
  selectedTurno,
  onTurnoChange,
  onClearMap,
  onRestoreMap,
  hasBackup,
}) {
  const [isExpanded, setIsExpanded] = useState(Boolean(search));
  const searchRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (search) {
      setIsExpanded(true);
    }
  }, [search]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        !search
      ) {
        setIsExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [search]);

  function handleToggleSearch() {
    if (isExpanded && !search) {
      setIsExpanded(false);
      searchRef.current?.blur();
      return;
    }

    setIsExpanded(true);
    requestAnimationFrame(() => {
      searchRef.current?.focus();
    });
  }

  function handleBlur() {
    if (!search) {
      setIsExpanded(false);
    }
  }

  return (
    <header className="header-container">
      <div className="header-left">
        <img src={logo} alt="Logo UP" className="header-logo" />
        <h1 className="header-title">Personal UP GDL</h1>
      </div>

      {/* Selector de Turnos */}
      <div className="header-turnos">
        {TURNOS.map((turno) => (
          <button
            key={turno.id}
            className={`turno-btn ${selectedTurno === turno.id ? "active" : ""}`}
            onClick={() => onTurnoChange(turno.id)}
            title={`Ver ${turno.label}`}
            style={{
              borderColor:
                selectedTurno === turno.id ? turno.color : "rgba(0,0,0,0.1)",
              backgroundColor:
                selectedTurno === turno.id ? turno.color + "15" : "transparent",
              color: selectedTurno === turno.id ? turno.color : "#666",
            }}
          >
            {turno.label}
          </button>
        ))}
      </div>

      {/* Búsqueda */}
      <div
        ref={containerRef}
        className={`header-search-wrapper ${isExpanded ? "is-expanded" : ""}`}
      >
        <input
          ref={searchRef}
          type="text"
          className="header-search"
          placeholder="Buscar nombre..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onBlur={handleBlur}
          tabIndex={isExpanded ? 0 : -1}
        />

        <button
          type="button"
          className="header-search-button"
          onClick={handleToggleSearch}
          aria-label={isExpanded ? "Cerrar buscador" : "Abrir buscador"}
          aria-expanded={isExpanded}
        >
          <svg
            className="header-search-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
        </button>
      </div>

      <div className="header-map-actions">
        <button
          type="button"
          className="header-clear-map-button"
          onClick={onClearMap}
          title="Guardar respaldo y limpiar las asignaciones del día"
        >
          Limpiar mapa
        </button>

        {hasBackup && (
          <button
            type="button"
            className="header-restore-map-button"
            onClick={onRestoreMap}
            title="Recuperar las asignaciones del último respaldo"
          >
            Restaurar mapa
          </button>
        )}
      </div>
    </header>
  );
}
