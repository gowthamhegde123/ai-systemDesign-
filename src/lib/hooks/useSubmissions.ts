'use client';

import { useState, useCallback } from 'react';
import { submissionsApi, Submission, CreateSubmissionData } from '@/lib/api';

interface UseSubmissionsReturn {
  submissions: Submission[];
  currentSubmission: Submission | null;
  loading: boolean;
  error: string | null;
  fetchSubmissions: (userId?: number) => Promise<void>;
  fetchSubmission: (id: number) => Promise<void>;
  fetchByProblem: (problemId: number) => Promise<void>;
  createSubmission: (data: CreateSubmissionData) => Promise<Submission | null>;
  updateSubmission: (id: number, data: Partial<CreateSubmissionData>) => Promise<boolean>;
  deleteSubmission: (id: number) => Promise<boolean>;
  clearError: () => void;
}

/**
 * Hook for managing submissions with the Express backend.
 */
export function useSubmissions(): UseSubmissionsReturn {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async (userId?: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = userId 
        ? await submissionsApi.getByUser(userId)
        : await submissionsApi.getAll();
      
      if (response.success && response.data) {
        setSubmissions(response.data);
      } else {
        setError(response.message || 'Failed to fetch submissions');
      }
    } catch (err) {
      const message = (err as { message?: string }).message || 'Failed to fetch submissions';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSubmission = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await submissionsApi.getById(id);
      
      if (response.success && response.data) {
        setCurrentSubmission(response.data);
      } else {
        setError(response.message || 'Failed to fetch submission');
      }
    } catch (err) {
      const message = (err as { message?: string }).message || 'Failed to fetch submission';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByProblem = useCallback(async (problemId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await submissionsApi.getByProblem(problemId);
      
      if (response.success && response.data) {
        setSubmissions(response.data);
      } else {
        setError(response.message || 'Failed to fetch submissions');
      }
    } catch (err) {
      const message = (err as { message?: string }).message || 'Failed to fetch submissions';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSubmission = async (data: CreateSubmissionData): Promise<Submission | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await submissionsApi.create(data);
      
      if (response.success && response.data) {
        setSubmissions(prev => [...prev, response.data!]);
        setCurrentSubmission(response.data);
        return response.data;
      }
      
      setError(response.message || 'Failed to create submission');
      return null;
    } catch (err) {
      const message = (err as { message?: string }).message || 'Failed to create submission';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSubmission = async (id: number, data: Partial<CreateSubmissionData>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await submissionsApi.update(id, data);
      
      if (response.success && response.data) {
        setSubmissions(prev => prev.map(s => s.id === id ? response.data! : s));
        if (currentSubmission?.id === id) {
          setCurrentSubmission(response.data);
        }
        return true;
      }
      
      setError(response.message || 'Failed to update submission');
      return false;
    } catch (err) {
      const message = (err as { message?: string }).message || 'Failed to update submission';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteSubmission = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await submissionsApi.delete(id);
      
      if (response.success) {
        setSubmissions(prev => prev.filter(s => s.id !== id));
        if (currentSubmission?.id === id) {
          setCurrentSubmission(null);
        }
        return true;
      }
      
      setError(response.message || 'Failed to delete submission');
      return false;
    } catch (err) {
      const message = (err as { message?: string }).message || 'Failed to delete submission';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    submissions,
    currentSubmission,
    loading,
    error,
    fetchSubmissions,
    fetchSubmission,
    fetchByProblem,
    createSubmission,
    updateSubmission,
    deleteSubmission,
    clearError,
  };
}
