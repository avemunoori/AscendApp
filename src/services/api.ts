import AsyncStorage from '@react-native-async-storage/async-storage';
import { SecureStorage } from '../utils/secureStorage';
import {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  VerifyResetCodeRequest,
  ResetPasswordRequest,
  AuthResponse,
  User,
  ClimbingSession,
  CreateSessionRequest,
  UpdateSessionRequest,
  SessionFilters,
  SessionAnalytics,
  StatsOverview,
  ProgressAnalytics,
  HighestGradeStats,
  AverageGradeStats,
  ClimbingDiscipline,
  Grade,
  ApiResponse,
  PaginatedResponse,
  TrainingPlanTemplate,
  UserTrainingPlan,
  TrainingProgress,
  StartTrainingPlanRequest,
  CompleteSessionRequest,
  TrainingTemplatesResponse,
  UserTrainingPlansResponse,
  UserTrainingPlanResponse,
  TrainingProgressResponse,
  TrainingPlanFilters
} from '../types';
import { EXPO_PUBLIC_BACKEND_API_URL } from '@env';

// API Configuration
const API_BASE_URL = EXPO_PUBLIC_BACKEND_API_URL;

console.log('🔧 API Configuration:');
console.log('🔧 EXPO_PUBLIC_BACKEND_API_URL:', EXPO_PUBLIC_BACKEND_API_URL);
console.log('🔧 API_BASE_URL:', API_BASE_URL);

if (!API_BASE_URL) {
  throw new Error('EXPO_PUBLIC_BACKEND_API_URL environment variable is required');
}

class ApiService {
  private token: string | null = null;
  private dispatch: any = null;

  // Set dispatch function for handling auth state updates
  setDispatch(dispatch: any) {
    this.dispatch = dispatch;
  }

  // Initialize token from storage
  async initialize() {
    console.log('🔧 Initializing API service...');
    this.token = await SecureStorage.getToken();
    console.log('🔧 Token from secure storage:', this.token ? 'Found' : 'Not found');
  }

  // Get current token
  async getToken(): Promise<string | null> {
    if (!this.token) {
      this.token = await SecureStorage.getToken();
    }
    return this.token;
  }

  // Set token and save to storage
  async setToken(token: string) {
    this.token = token;
    await SecureStorage.storeToken(token);
  }

  // Clear token and remove from storage
  async clearToken() {
    this.token = null;
    await SecureStorage.clearAuthData();
    
    // Dispatch logout action if dispatch is available
    if (this.dispatch) {
      this.dispatch({ type: 'auth/logout' });
    }
  }

  // Clear token without dispatching (used by logout thunk)
  async clearTokenOnly() {
    this.token = null;
    await SecureStorage.clearAuthData();
  }

  // Get auth headers
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getHeaders(),
      ...options,
    };

    console.log('🌐 Making API request to:', url);
    console.log('📋 Request config:', { method: config.method || 'GET', headers: config.headers });

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Only clear token if this isn't a validation request
          if (!endpoint.includes('/auth/validate')) {
            await this.clearToken();
          }
          throw new Error('Unauthorized - Please login again');
        }
        
        // Parse standardized error response format
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          // Backend now always returns { "message": "error text" }
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Fallback for non-JSON responses
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch {
            // Keep default error message
          }
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ API Request failed for endpoint:', endpoint);
      console.error('❌ Error details:', error);
      console.error('❌ URL attempted:', url);
      throw error;
    }
  }

  // Authentication Endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      await this.setToken(response.token);
      
      // Fetch user data after successful login
      try {
        const user = await this.getCurrentUser();
        return {
          token: response.token,
          user: user,
        };
      } catch (error) {
        // If we can't fetch user data, create a minimal user object
        return {
          token: response.token,
          user: {
            id: '0',
            email: credentials.email,
            firstName: '',
            lastName: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };
      }
    }
    
    throw new Error('Login failed - no token received');
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<{ token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      await this.setToken(response.token);
      
      // Fetch user data after successful registration
      try {
        const user = await this.getCurrentUser();
        return {
          token: response.token,
          user: user,
        };
      } catch (error) {
        // If we can't fetch user data, create a minimal user object
        return {
          token: response.token,
          user: {
            id: '0',
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };
      }
    }
    
    throw new Error('Registration failed - no token received');
  }

  async validateToken(): Promise<User> {
    return this.request<User>('/auth/validate', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/users/me');
  }

  // Password Reset Endpoints
  async forgotPassword(email: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyResetCode(code: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/verify-reset-code', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  async resetPassword(code: string, newPassword: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ code, newPassword }),
    });
  }

  // Session Endpoints
  async createSession(sessionData: CreateSessionRequest): Promise<ClimbingSession> {
    return this.request<ClimbingSession>('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async getSessions(filters?: SessionFilters): Promise<ClimbingSession[]> {
    const params = new URLSearchParams();
    
    if (filters?.discipline) {
      params.append('discipline', filters.discipline);
    }
    if (filters?.date) {
      params.append('date', filters.date);
    }
    if (filters?.completed !== undefined) {
      params.append('completed', filters.completed.toString());
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/sessions?${queryString}` : '/sessions';
    
    return this.request<ClimbingSession[]>(endpoint);
  }

  async getSession(id: string): Promise<ClimbingSession> {
    return this.request<ClimbingSession>(`/sessions/${id}`);
  }

  async updateSession(id: string, sessionData: UpdateSessionRequest): Promise<ClimbingSession> {
    return this.request<ClimbingSession>(`/sessions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(sessionData),
    });
  }

  async deleteSession(id: string): Promise<void> {
    return this.request<void>(`/sessions/${id}`, {
      method: 'DELETE',
    });
  }

  // Grade Endpoints
  async getGrades(discipline: ClimbingDiscipline): Promise<Grade[]> {
    return this.request<Grade[]>(`/sessions/grades/${discipline}`);
  }

  // Analytics Endpoints
  async getSessionAnalytics(period?: 'week' | 'month' | 'year'): Promise<SessionAnalytics> {
    const endpoint = period ? `/sessions/analytics?period=${period}` : '/sessions/analytics';
    return this.request<SessionAnalytics>(endpoint);
  }

  async getStatsOverview(period?: 'week' | 'month' | 'year'): Promise<StatsOverview> {
    const endpoint = period ? `/sessions/stats/overview?period=${period}` : '/sessions/stats/overview';
    return this.request<StatsOverview>(endpoint);
  }

  async getProgressAnalytics(period?: 'week' | 'month' | 'year'): Promise<ProgressAnalytics[]> {
    const endpoint = period ? `/sessions/stats/progress?period=${period}` : '/sessions/stats/progress';
    return this.request<ProgressAnalytics[]>(endpoint);
  }

  async getHighestGrades(period?: 'week' | 'month' | 'year'): Promise<HighestGradeStats[]> {
    const endpoint = period ? `/sessions/stats/highest?period=${period}` : '/sessions/stats/highest';
    return this.request<HighestGradeStats[]>(endpoint);
  }

  async getAverageGrades(period?: 'week' | 'month' | 'year'): Promise<AverageGradeStats[]> {
    const endpoint = period ? `/sessions/stats/average?period=${period}` : '/sessions/stats/average';
    return this.request<AverageGradeStats[]>(endpoint);
  }

  // Training Plan Endpoints
  async getTrainingTemplates(filters?: TrainingPlanFilters): Promise<TrainingPlanTemplate[]> {
    let endpoint = '/training/templates';
    const params = new URLSearchParams();
    
    if (filters?.difficulty) {
      params.append('difficulty', filters.difficulty);
    }
    if (filters?.category) {
      params.append('category', filters.category);
    }
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    const response = await this.request<any>(endpoint);
    // Handle both array and { data: array } formats
    return Array.isArray(response) ? response : (response.data || []);
  }

  async startTrainingPlan(request: StartTrainingPlanRequest): Promise<UserTrainingPlan> {
    // Ensure templateId is sent as a string
    const payload = {
      templateId: String(request.templateId)
    };
    
    console.log('🚀 Starting training plan with payload:', payload);
    
    const response = await this.request<UserTrainingPlanResponse>('/training/user-plans', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    
    // Handle both direct object and { data: object } formats
    return response.data || response;
  }

  async getUserTrainingPlans(): Promise<UserTrainingPlan[]> {
    const response = await this.request<UserTrainingPlansResponse>('/training/user-plans');
    return response.data || response;
  }

  async getActiveTrainingPlan(): Promise<UserTrainingPlan | null> {
    try {
      const response = await this.request<UserTrainingPlanResponse>('/training/user-plans/active');
      return response.data || response;
    } catch (error: any) {
      if (error.message.includes('No active plan') || error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async getUserTrainingPlan(planId: string): Promise<UserTrainingPlan> {
    const response = await this.request<UserTrainingPlanResponse>(`/training/user-plans/${planId}`);
    return response.data || response;
  }

  async completeTrainingSession(planId: string, sessionId: string, duration?: number, notes?: string): Promise<{ message: string }> {
    const payload: any = {};
    if (duration !== undefined) payload.duration = duration;
    if (notes !== undefined) payload.notes = notes;
    
    return this.request<{ message: string }>(`/training/user-plans/${planId}/sessions/${sessionId}/complete`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async pauseTrainingPlan(planId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/training/user-plans/${planId}/pause`, {
      method: 'POST',
    });
  }

  async resumeTrainingPlan(planId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/training/user-plans/${planId}/resume`, {
      method: 'POST',
    });
  }

  async getTrainingProgress(planId: string): Promise<TrainingProgress> {
    const response = await this.request<TrainingProgressResponse>(`/training/user-plans/${planId}/progress`);
    return response.data || response;
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Grade conversion utilities
export const gradeUtils = {
  // Convert string grade to numeric for bouldering
  boulderGradeToNumber(grade: string): number {
    return parseInt(grade.replace('V', ''), 10);
  },

  // Convert string grade to numeric for lead/sport
  leadGradeToNumber(grade: string): number {
    const match = grade.match(/5\.(\d+)([a-d])?/);
    if (!match) return 0;
    
    const whole = parseInt(match[1], 10);
    const letter = match[2];
    
    if (!letter) return whole;
    
    const letterIndex = 'abcd'.indexOf(letter);
    return whole + (letterIndex + 1) * 0.25;
  },

  // Convert numeric grade to string for bouldering
  boulderNumberToGrade(num: number): string {
    return `V${num}`;
  },

  // Convert numeric grade to string for lead/sport
  leadNumberToGrade(num: number): string {
    const whole = Math.floor(num);
    const decimal = num - whole;
    
    if (decimal === 0) {
      return `5.${whole}`;
    }
    
    const letters = ['a', 'b', 'c', 'd'];
    const letterIndex = Math.round(decimal * 4) - 1;
    return `5.${whole}${letters[letterIndex]}`;
  },

  // Get numeric grade from string grade based on discipline
  getGradeNumber(grade: string, discipline: ClimbingDiscipline): number {
    switch (discipline) {
      case ClimbingDiscipline.BOULDER:
        return this.boulderGradeToNumber(grade);
      case ClimbingDiscipline.LEAD:
      case ClimbingDiscipline.TOP_ROPE:
        return this.leadGradeToNumber(grade);
      default:
        return 0;
    }
  },

  // Get string grade from numeric grade based on discipline
  getGradeString(num: number, discipline: ClimbingDiscipline): string {
    switch (discipline) {
      case ClimbingDiscipline.BOULDER:
        return this.boulderNumberToGrade(num);
      case ClimbingDiscipline.LEAD:
      case ClimbingDiscipline.TOP_ROPE:
        return this.leadNumberToGrade(num);
      default:
        return num.toString();
    }
  }
}; 