import { useState, useEffect, useCallback } from 'react';
import { fetchGrievances, convertToUIGrievance, DBGrievance } from '@/services/grievanceService';
import { Grievance } from '@/types/grievance';
import { mockGrievances } from '@/data/mockData';

export function useGrievances() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGrievances = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const dbGrievances = await fetchGrievances();
      
      if (dbGrievances.length > 0) {
        // Convert DB format to UI format
        const uiGrievances = dbGrievances.map(convertToUIGrievance);
        setGrievances(uiGrievances);
      } else {
        // Fall back to mock data if no DB grievances
        setGrievances(mockGrievances);
      }
    } catch (err) {
      console.error('Error loading grievances:', err);
      setError('Failed to load grievances');
      // Fall back to mock data on error
      setGrievances(mockGrievances);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGrievances();
  }, [loadGrievances]);

  return {
    grievances,
    isLoading,
    error,
    refresh: loadGrievances,
  };
}
