// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: string | number;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt?: string;
}

// Session Types
export interface ClimbingSession {
  id: string;
  discipline: ClimbingDiscipline;
  grade: string;
  date: string;
  notes?: string;
  sent: boolean;
  // Frontend-only fields for compatibility
  userId?: string | number;
  attempts?: number;
  completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSessionRequest {
  discipline: ClimbingDiscipline;
  grade: string;
  notes?: string;
  date: string;
  sent: boolean;
}

export interface UpdateSessionRequest {
  discipline?: ClimbingDiscipline;
  grade?: string;
  notes?: string;
  date?: string;
  sent?: boolean;
}

// Climbing Disciplines
export enum ClimbingDiscipline {
  BOULDER = 'BOULDER',
  LEAD = 'LEAD',
  TOP_ROPE = 'TOP_ROPE'
}

// Grade Types
export interface Grade {
  value: number;
  display: string;
}

// Analytics Types
export interface SessionAnalytics {
  totalSessions: number;
  averageDifficulty: number;
  sentPercentage: number;
  sessionsByDiscipline: Record<string, number>;
  averageDifficultyByDiscipline: Record<string, number>;
  sentPercentageByDiscipline: Record<string, number>;
}

export interface StatsOverview {
  totalSessions: number;
  averageDifficulty: number;
  sentPercentage: number;
  sessionsByDiscipline: Record<string, number>;
  averageDifficultyByDiscipline: Record<string, number>;
  sentPercentageByDiscipline: Record<string, number>;
}

export interface ProgressAnalytics {
  date: string;
  sessions: number;
  completed: number;
  averageGrade: number;
}

export interface HighestGradeStats {
  discipline: ClimbingDiscipline;
  grade: string;
  count: number;
}

export interface AverageGradeStats {
  discipline: ClimbingDiscipline;
  averageGrade: string;
  totalSessions: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

// Filter Types
export interface SessionFilters {
  discipline?: ClimbingDiscipline;
  date?: string;
  completed?: boolean;
}

// App State Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface SessionsState {
  sessions: ClimbingSession[];
  isLoading: boolean;
  error: string | null;
  filters: SessionFilters;
}

export interface AnalyticsState {
  analytics: SessionAnalytics | null;
  statsOverview: StatsOverview | null;
  progressAnalytics: ProgressAnalytics[];
  highestGrades: HighestGradeStats[];
  averageGrades: AverageGradeStats[];
  isLoading: boolean;
  error: string | null;
}

// Weather Types
export * from './weather'; 