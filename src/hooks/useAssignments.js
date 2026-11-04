import { useState, useEffect, useCallback, useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const STORAGE_KEY = "up_campus_assignments";

function readCache() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Error leyendo asignaciones locales:", error);
    return [];
  }
}

export function useAssignments(fecha = null) {
  const [assignments, setAssignments] = useState([]);
  // Empieza en true para que el efecto de persistencia no escriba
  // antes de que termine la carga inicial.
  const [loading, setLoading] = useState(true);
  const [lastBackupId, setLastBackupId] = useState(null);

  const today = fecha || new Date().toISOString().split("T")[0];

  // Siempre apunta al estado más reciente (útil para revertir cambios)
  const assignmentsRef = useRef(assignments);
  assignmentsRef.current = assignments;

  // Persiste en localStorage fuera del camino crítico
  useEffect(() => {
    if (loading) return;

    try {
      const otherDates = readCache().filter((a) => a.fecha !== today);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...otherDates, ...assignments]),
      );
    } catch (error) {
      console.warn("Error guardando asignaciones locales:", error);
    }
  }, [assignments, loading, today]);

  const fetchAssignments = useCallback(async () => {
    setLoading(true);

    // Muestra primero lo que haya en cache para que la UI no espere
    setAssignments(readCache().filter((a) => a.fecha === today));

    const loadAssignments = async () => {
      try {
        const response = await fetch(
          `${API_URL}/assignments?fecha=${encodeURIComponent(today)}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setAssignments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando asignaciones:", error);
      }
    };

    const loadLastBackup = async () => {
      try {
        const response = await fetch(
          `${API_URL}/assignments/backups/latest?fecha=${encodeURIComponent(today)}`,
        );

        if (response.ok) {
          const backup = await response.json();
          setLastBackupId(backup?._id || null);
        }
      } catch (error) {
        console.error("Error consultando respaldo:", error);
      }
    };

    // Ambas peticiones en paralelo
    await Promise.all([loadAssignments(), loadLastBackup()]);

    setLoading(false);
  }, [today]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const assignPersonToZone = useCallback(
    async (personaId, zonaId) => {
      const previous =
        assignmentsRef.current.find((a) => a.personaId === personaId) ?? null;

      // 1. UI inmediata
      const optimistic = {
        _id: `temp-${personaId}`,
        personaId,
        zonaId,
        fecha: today,
      };

      setAssignments((prev) => [
        ...prev.filter((a) => a.personaId !== personaId),
        optimistic,
      ]);

      try {
        // 2. Sincroniza con el servidor
        const response = await fetch(`${API_URL}/assignments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ personaId, zonaId, fecha: today }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const saved = await response.json();

        // 3. Cambia la asignación temporal por la real
        setAssignments((prev) =>
          prev.map((a) => (a._id === optimistic._id ? saved : a)),
        );

        return saved;
      } catch (error) {
        // 4. Revierte al estado anterior
        setAssignments((prev) => {
          const without = prev.filter((a) => a.personaId !== personaId);
          return previous ? [...without, previous] : without;
        });

        throw error;
      }
    },
    [today],
  );

  const removeAssignment = useCallback(async (assignmentId) => {
    const previous = assignmentsRef.current.find((a) => a._id === assignmentId);

    // Quita de la UI inmediatamente
    setAssignments((prev) => prev.filter((a) => a._id !== assignmentId));

    try {
      const response = await fetch(`${API_URL}/assignments/${assignmentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // Revierte si falló
      if (previous) {
        setAssignments((prev) => [...prev, previous]);
      }

      throw error;
    }
  }, []);

  const clearAssignments = useCallback(async () => {
    const response = await fetch(`${API_URL}/assignments/clear`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fecha: today }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    setAssignments([]);
    setLastBackupId(result.backupId);

    return result;
  }, [today]);

  const restoreAssignments = useCallback(
    async (backupId) => {
      if (!backupId) {
        throw new Error("No hay un respaldo seleccionado.");
      }

      const response = await fetch(
        `${API_URL}/assignments/restore/${backupId}`,
        { method: "POST" },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      await fetchAssignments();

      return result;
    },
    [fetchAssignments],
  );

  return {
    assignments,
    loading,
    assignPersonToZone,
    removeAssignment,
    clearAssignments,
    restoreAssignments,
    lastBackupId,
    fetchAssignments,
  };
}
