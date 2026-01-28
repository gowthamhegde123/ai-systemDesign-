'use client';

import { useState, useEffect, useCallback } from 'react';
import { authApi, AuthUser } from '@/lib/api';

interface UseBackendAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  isAuthenticated: boolean;
}

/**
 * Hook for managing authentication with the Express backend.
 * This works alongside NextAuth for a unified auth experience.
 */
export function useBackendAuth(): UseBackendAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if we have a token stored
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('backend_token') 
        : null;
      
      if (!token) {
        setUser(null);
        return;
      }

      const response = await authApi.getMe();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setUser(null);
        authApi.logout();
      }
    } catch {
      setUser(null);
      authApi.logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.login({ email, password });
      
      if (response.success && response.data) {
        setUser(response.data.user);
        return true;
      }
      
      setError(response.message || 'Login failed');
      return false;
    } catch (err) {
      const message = (err as { message?: string }).message || 'Login failed';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.register({ username, email, password });
      
      if (response.success && response.data) {
        setUser(response.data.user);
        return true;
      }
      
      setError(response.message || 'Registration failed');
      return false;
    } catch (err) {
      const message = (err as { message?: string }).message || 'Registration failed';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setError(null);
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth,
    isAuthenticated: !!user,
  };
}
