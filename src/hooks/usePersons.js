import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export function usePersons() {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/persons`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setPersons(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching persons:', err);
        setError(err.message);
        setPersons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPersons();
  }, []);

  return { persons, loading, error };
}
