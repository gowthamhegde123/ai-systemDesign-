'use client';

import { useState, useCallback } from 'react';
import { diagramsApi, Diagram, CreateDiagramData, DiagramData } from '@/lib/api';

interface UseDiagramsReturn {
  diagrams: Diagram[];
  currentDiagram: Diagram | null;
  loading: boolean;
  error: string | null;
  fetchDiagrams: (userId?: number) => Promise<void>;
  fetchDiagram: (id: number) => Promise<void>;
  saveDiagram: (data: CreateDiagramData) => Promise<Diagram | null>;
  updateDiagram: (id: number, data: Partial<CreateDiagramData>) => Promise<boolean>;
  deleteDiagram: (id: number) => Promise<boolean>;
  clearError: () => void;
}

/**
 * Hook for managing diagrams with the Express backend.
 */
export function useDiagrams(): UseDiagramsReturn {
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [currentDiagram, setCurrentDiagram] = useState<Diagram | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDiagrams = useCallback(async (userId?: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = userId 
        ? await diagramsApi.getByUser(userId)
        : await diagramsApi.getAll();
      
      if (response.success && response.data) {
        setDiagrams(response.data);
      } else {
        setError(response.message || 'Failed to fetch diagrams');
      }
    } catch (err) {
      const message = (err as { message?: string }).message || 'Failed to fetch diagrams';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDiagram = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await diagramsApi.getById(id);
      
      if (response.success && response.data) {
        setCurrentDiagram(response.data);
      } else {
        setError(response.message || 'Failed to fetch diagram');
      }
    } catch (err) {
      const message = (err as { message?: string }).message || 'Failed to fetch diagram';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveDiagram = async (data: CreateDiagramData): Promise<Diagram | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await diagramsApi.create(data);
      
      if (response.success && response.data) {
        setDiagrams(prev => [...prev, response.data!]);
        setCurrentDiagram(response.data);
        return response.data;
      }
      
      setError(response.message || 'Failed to save diagram');
      return null;
    } catch (err) {
      const message = (err as { message?: string }).message || 'Failed to save diagram';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateDiagram = async (id: number, data: Partial<CreateDiagramData>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await diagramsApi.update(id, data);
      
      if (response.success && response.data) {
        setDiagrams(prev => prev.map(d => d.id === id ? response.data! : d));
        if (currentDiagram?.id === id) {
          setCurrentDiagram(response.data);
        }
        return true;
      }
      
      setError(response.message || 'Failed to update diagram');
      return false;
    } catch (err) {
      const message = (err as { message?: string }).message || 'Failed to update diagram';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteDiagram = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await diagramsApi.delete(id);
      
      if (response.success) {
        setDiagrams(prev => prev.filter(d => d.id !== id));
        if (currentDiagram?.id === id) {
          setCurrentDiagram(null);
        }
        return true;
      }
      
      setError(response.message || 'Failed to delete diagram');
      return false;
    } catch (err) {
      const message = (err as { message?: string }).message || 'Failed to delete diagram';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    diagrams,
    currentDiagram,
    loading,
    error,
    fetchDiagrams,
    fetchDiagram,
    saveDiagram,
    updateDiagram,
    deleteDiagram,
    clearError,
  };
}

// Convenience function to convert canvas state to diagram data
export function canvasToDiagramData(nodes: unknown[], edges: unknown[]): DiagramData {
  return { nodes, edges };
}
