import { useState, useEffect, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export function useAssignments(fecha = null) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  const today = fecha || new Date().toISOString().split('T')[0];

  // Obtener asignaciones
  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/assignments/by-date/${today}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setAssignments(data);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // Crear o actualizar asignación
  const assignPersonToZone = useCallback(async (personaId, zonaId) => {
    try {
      const response = await fetch(`${API_URL}/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      
      // Actualizar lista local
      setAssignments((prev) => {
        const filtered = prev.filter((a) => a.personaId !== personaId);
        return [...filtered, newAssignment];
      });

      return newAssignment;
    } catch (err) {
      console.error('Error assigning person:', err);
      throw err;
    }
  }, [today]);

  // Eliminar asignación
  const removeAssignment = useCallback(async (assignmentId) => {
    try {
      const response = await fetch(`${API_URL}/assignments/${assignmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setAssignments((prev) => prev.filter((a) => a._id !== assignmentId));
    } catch (err) {
      console.error('Error removing assignment:', err);
      throw err;
    }
  }, []);

  return {
    assignments,
    loading,
    assignPersonToZone,
    removeAssignment,
  };
}
