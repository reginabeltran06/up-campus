import { useState, useEffect, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export function useAvailability(fecha = null) {
  const [unavailable, setUnavailable] = useState([]);
  const [loading, setLoading] = useState(false);

  const today = fecha || new Date().toISOString().split("T")[0];

  const fetchAvailability = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/availability/by-date/${today}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUnavailable(data);
    } catch (error) {
      console.error("Error fetching availability:", error);
      setUnavailable([]);
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const markUnavailable = useCallback(
    async (personaId, motivo, nota = "") => {
      try {
        const response = await fetch(`${API_URL}/availability`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            personaId,
            fecha: today,
            motivo,
            nota,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const availability = await response.json();

        setUnavailable((prev) => {
          const filtered = prev.filter((item) => item.personaId !== personaId);

          return [...filtered, availability];
        });

        return availability;
      } catch (error) {
        console.error("Error marking person unavailable:", error);
        throw error;
      }
    },
    [today],
  );

  const markAvailable = useCallback(async (availabilityId) => {
    try {
      const response = await fetch(
        `${API_URL}/availability/${availabilityId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setUnavailable((prev) =>
        prev.filter((item) => item._id !== availabilityId),
      );
    } catch (error) {
      console.error("Error marking person available:", error);
      throw error;
    }
  }, []);

  return {
    unavailable,
    loading,
    markUnavailable,
    markAvailable,
  };
}
