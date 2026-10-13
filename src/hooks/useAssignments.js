import { useState, useEffect, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export function useAssignments(fecha = null) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastBackupId, setLastBackupId] = useState(null);

  const today = fecha || new Date().toISOString().split("T")[0];

  const saveAssignments = (data) => {
    setAssignments(data);
    localStorage.setItem("up_campus_assignments", JSON.stringify(data));
  };

  const fetchAssignments = useCallback(async () => {
    setLoading(true);

    try {
      const cached = localStorage.getItem("up_campus_assignments");

      if (cached) {
        try {
          const cachedData = JSON.parse(cached);
          setAssignments(
            cachedData.filter((assignment) => assignment.fecha === today),
          );
        } catch (error) {
          console.warn("Error leyendo asignaciones locales:", error);
        }
      }

      const response = await fetch(
        `${API_URL}/assignments?fecha=${encodeURIComponent(today)}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const currentAssignments = Array.isArray(data) ? data : [];

      setAssignments(currentAssignments);

      const allCached = cached ? JSON.parse(cached) : [];
      const otherDates = Array.isArray(allCached)
        ? allCached.filter((assignment) => assignment.fecha !== today)
        : [];

      localStorage.setItem(
        "up_campus_assignments",
        JSON.stringify([...otherDates, ...currentAssignments]),
      );
    } catch (error) {
      console.error("Error cargando asignaciones:", error);
    } finally {
      setLoading(false);
    }

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
  }, [today]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const assignPersonToZone = useCallback(
    async (personaId, zonaId) => {
      const response = await fetch(`${API_URL}/assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personaId,
          zonaId,
          fecha: today,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newAssignment = await response.json();

      setAssignments((prev) => {
        const updated = [
          ...prev.filter((a) => a.personaId !== personaId),
          newAssignment,
        ];

        const cached = localStorage.getItem("up_campus_assignments");
        let allCached = [];

        try {
          allCached = cached ? JSON.parse(cached) : [];
        } catch {
          allCached = [];
        }

        const otherDates = allCached.filter(
          (a) => a.fecha !== today && a.personaId !== personaId,
        );

        localStorage.setItem(
          "up_campus_assignments",
          JSON.stringify([...otherDates, ...updated]),
        );

        return updated;
      });

      return newAssignment;
    },
    [today],
  );

  const removeAssignment = useCallback(async (assignmentId) => {
    const response = await fetch(`${API_URL}/assignments/${assignmentId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    setAssignments((prev) => {
      const updated = prev.filter((a) => a._id !== assignmentId);
      saveAssignments(updated);
      return updated;
    });
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

    setAssignments((prev) => {
      const updated = prev.filter((assignment) => assignment.fecha !== today);
      localStorage.setItem("up_campus_assignments", JSON.stringify(updated));
      return [];
    });

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
