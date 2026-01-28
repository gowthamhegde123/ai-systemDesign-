/**
 * API Service Utility
 * 
 * This module provides functions to communicate with the Express backend API.
 * It handles authentication, error handling, and request formatting.
 */

// Get the backend URL from environment or default to localhost
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

interface ApiError {
  message: string;
  status: number;
}

/**
 * Get the auth token from localStorage (client-side) or return null
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('backend_token');
}

/**
 * Set the auth token in localStorage
 */
export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('backend_token', token);
  }
}

/**
 * Remove the auth token from localStorage
 */
export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('backend_token');
  }
}

/**
 * Make an authenticated request to the backend API
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        message: data.message || 'An error occurred',
        status: response.status,
      } as ApiError;
    }

    return data;
  } catch (error) {
    if ((error as ApiError).status) {
      throw error;
    }
    throw {
      message: 'Network error. Please check your connection.',
      status: 0,
    } as ApiError;
  }
}

// ============================================
// Authentication API
// ============================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export const authApi = {
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await apiRequest<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.success && response.data?.token) {
      setAuthToken(response.data.token);
    }
    
    return response;
  },

  /**
   * Login an existing user
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await apiRequest<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.data?.token) {
      setAuthToken(response.data.token);
    }
    
    return response;
  },

  /**
   * Get current authenticated user
   */
  async getMe(): Promise<ApiResponse<AuthUser>> {
    return apiRequest<AuthUser>('/api/auth/me');
  },

  /**
   * Logout user
   */
  logout(): void {
    removeAuthToken();
  },
};

// ============================================
// Users API
// ============================================

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  password?: string;
}

export const usersApi = {
  /**
   * Get all users (admin only)
   */
  async getAll(limit = 100, offset = 0): Promise<ApiResponse<User[]>> {
    return apiRequest<User[]>(`/api/users?limit=${limit}&offset=${offset}`);
  },

  /**
   * Get a user by ID
   */
  async getById(id: number): Promise<ApiResponse<User>> {
    return apiRequest<User>(`/api/users/${id}`);
  },

  /**
   * Update a user
   */
  async update(id: number, data: UpdateUserData): Promise<ApiResponse<User>> {
    return apiRequest<User>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a user
   */
  async delete(id: number): Promise<ApiResponse<{ id: number }>> {
    return apiRequest<{ id: number }>(`/api/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// Problems API
// ============================================

export interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateProblemData {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags?: string[];
}

export const problemsApi = {
  /**
   * Get all problems
   */
  async getAll(params?: {
    difficulty?: string;
    tag?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<Problem[]>> {
    const searchParams = new URLSearchParams();
    if (params?.difficulty) searchParams.set('difficulty', params.difficulty);
    if (params?.tag) searchParams.set('tag', params.tag);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    
    const query = searchParams.toString();
    return apiRequest<Problem[]>(`/api/problems${query ? `?${query}` : ''}`);
  },

  /**
   * Get a problem by ID
   */
  async getById(id: number): Promise<ApiResponse<Problem>> {
    return apiRequest<Problem>(`/api/problems/${id}`);
  },

  /**
   * Create a new problem
   */
  async create(data: CreateProblemData): Promise<ApiResponse<Problem>> {
    return apiRequest<Problem>('/api/problems', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update a problem
   */
  async update(id: number, data: Partial<CreateProblemData>): Promise<ApiResponse<Problem>> {
    return apiRequest<Problem>(`/api/problems/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a problem
   */
  async delete(id: number): Promise<ApiResponse<{ id: number }>> {
    return apiRequest<{ id: number }>(`/api/problems/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// Submissions API
// ============================================

export interface Submission {
  id: number;
  user_id: number;
  problem_id: number;
  solution: string;
  score: number;
  created_at: string;
  updated_at: string;
  username?: string;
  problem_title?: string;
}

export interface CreateSubmissionData {
  problem_id: number;
  solution: string;
  score?: number;
}

export const submissionsApi = {
  /**
   * Get all submissions
   */
  async getAll(limit = 100, offset = 0): Promise<ApiResponse<Submission[]>> {
    return apiRequest<Submission[]>(`/api/submissions?limit=${limit}&offset=${offset}`);
  },

  /**
   * Get a submission by ID
   */
  async getById(id: number): Promise<ApiResponse<Submission>> {
    return apiRequest<Submission>(`/api/submissions/${id}`);
  },

  /**
   * Get submissions by user ID
   */
  async getByUser(userId: number, limit = 100, offset = 0): Promise<ApiResponse<Submission[]>> {
    return apiRequest<Submission[]>(`/api/submissions/user/${userId}?limit=${limit}&offset=${offset}`);
  },

  /**
   * Get submissions by problem ID
   */
  async getByProblem(problemId: number, limit = 100, offset = 0): Promise<ApiResponse<Submission[]>> {
    return apiRequest<Submission[]>(`/api/submissions/problem/${problemId}?limit=${limit}&offset=${offset}`);
  },

  /**
   * Create a new submission
   */
  async create(data: CreateSubmissionData): Promise<ApiResponse<Submission>> {
    return apiRequest<Submission>('/api/submissions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update a submission
   */
  async update(id: number, data: Partial<CreateSubmissionData>): Promise<ApiResponse<Submission>> {
    return apiRequest<Submission>(`/api/submissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a submission
   */
  async delete(id: number): Promise<ApiResponse<{ id: number }>> {
    return apiRequest<{ id: number }>(`/api/submissions/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// Diagrams API
// ============================================

export interface DiagramData {
  nodes: unknown[];
  edges: unknown[];
}

export interface Diagram {
  id: number;
  user_id: number;
  problem_id?: number;
  name?: string;
  diagram_data: DiagramData;
  created_at: string;
  updated_at: string;
}

export interface CreateDiagramData {
  diagram_data: DiagramData;
  problem_id?: number;
  name?: string;
}

export const diagramsApi = {
  /**
   * Get all diagrams
   */
  async getAll(limit = 100, offset = 0): Promise<ApiResponse<Diagram[]>> {
    return apiRequest<Diagram[]>(`/api/diagrams?limit=${limit}&offset=${offset}`);
  },

  /**
   * Get a diagram by ID
   */
  async getById(id: number): Promise<ApiResponse<Diagram>> {
    return apiRequest<Diagram>(`/api/diagrams/${id}`);
  },

  /**
   * Get diagrams by user ID
   */
  async getByUser(userId: number, limit = 100, offset = 0): Promise<ApiResponse<Diagram[]>> {
    return apiRequest<Diagram[]>(`/api/diagrams/user/${userId}?limit=${limit}&offset=${offset}`);
  },

  /**
   * Create a new diagram
   */
  async create(data: CreateDiagramData): Promise<ApiResponse<Diagram>> {
    return apiRequest<Diagram>('/api/diagrams', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update a diagram
   */
  async update(id: number, data: Partial<CreateDiagramData>): Promise<ApiResponse<Diagram>> {
    return apiRequest<Diagram>(`/api/diagrams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a diagram
   */
  async delete(id: number): Promise<ApiResponse<{ id: number }>> {
    return apiRequest<{ id: number }>(`/api/diagrams/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// Leaderboard API
// ============================================

export interface LeaderboardEntry {
  user_id: number;
  username: string;
  total_score: number;
  submission_count: number;
  rank: number;
}

export const leaderboardApi = {
  /**
   * Get the leaderboard
   */
  async get(limit = 10): Promise<ApiResponse<LeaderboardEntry[]>> {
    return apiRequest<LeaderboardEntry[]>(`/api/leaderboard?limit=${limit}`);
  },
};

// ============================================
// Health Check API
// ============================================

export const healthApi = {
  /**
   * Check backend health
   */
  async check(): Promise<ApiResponse<{ message: string; timestamp: string }>> {
    return apiRequest<{ message: string; timestamp: string }>('/health');
  },
};
