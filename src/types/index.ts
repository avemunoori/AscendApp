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

// Password Reset Types
export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetCodeRequest {
  code: string;
}

export interface ResetPasswordRequest {
  code: string;
  newPassword: string;
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



// Training Plan Types
export interface TrainingPlan {
  id: string;
  userId: string;
  name: string;
  description: string;
  difficulty: TrainingDifficulty;
  duration: number; // weeks
  focus: TrainingFocus[];
  isActive: boolean;
  startDate: string;
  endDate: string;
  progress: number; // 0-100
  createdAt: string;
  updatedAt: string;
}

// Backend API Training Types
export interface TrainingPlanTemplate {
  id: string;
  name: string;
  description: string;
  difficulty: TrainingDifficulty;
  duration?: number; // optional for compatibility
  totalWeeks?: number; // backend field
  sessionsPerWeek?: number; // backend field
  focus: TrainingFocus[];
  category: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UserTrainingPlan {
  id: string;
  userId: string;
  templateId: string;
  name: string;
  description: string;
  difficulty: TrainingDifficulty;
  duration: number;
  focus: TrainingFocus[];
  status: TrainingPlanStatus;
  startDate: string;
  endDate: string;
  currentWeek: number;
  currentSession: number;
  progress: number;
  createdAt: string;
  updatedAt: string;
  template?: TrainingPlanTemplate;
  weeks?: UserTrainingWeek[];
}

export enum TrainingPlanStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED'
}

export interface UserTrainingWeek {
  id: string;
  userTrainingPlanId: string;
  weekNumber: number;
  focus: TrainingFocus[];
  isCompleted: boolean;
  sessions: UserTrainingSession[];
}

export interface UserTrainingSession {
  id: string;
  userTrainingWeekId: string;
  sessionNumber: number;
  title: string;
  description: string;
  duration: number;
  isCompleted: boolean;
  exercises: UserTrainingExercise[];
}

export interface UserTrainingExercise {
  id: string;
  userTrainingSessionId: string;
  name: string;
  description: string;
  sets: number;
  reps: number;
  duration: number;
  restTime: number;
  type: ExerciseType;
  isCompleted: boolean;
}

export interface TrainingProgress {
  planId: string;
  totalWeeks: number;
  totalSessions: number;
  completedWeeks: number;
  completedSessions: number;
  currentWeek: number;
  currentSession: number;
  progress: number;
  startDate: string;
  estimatedCompletionDate: string;
}

// API Request/Response Types for Training
export interface StartTrainingPlanRequest {
  templateId: string;
}

export interface CompleteSessionRequest {
  sessionId: string;
}

export interface TrainingTemplatesResponse {
  data: TrainingPlanTemplate[];
  message: string;
  success: boolean;
}

export interface UserTrainingPlansResponse {
  data: UserTrainingPlan[];
  message: string;
  success: boolean;
}

export interface UserTrainingPlanResponse {
  data: UserTrainingPlan;
  message: string;
  success: boolean;
}

export interface TrainingProgressResponse {
  data: TrainingProgress;
  message: string;
  success: boolean;
}

export interface TrainingPlanFilters {
  difficulty?: TrainingDifficulty;
  category?: string;
  status?: TrainingPlanStatus;
}

export enum TrainingDifficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export enum TrainingFocus {
  STRENGTH = 'STRENGTH',
  ENDURANCE = 'ENDURANCE',
  TECHNIQUE = 'TECHNIQUE',
  MENTAL_GAME = 'MENTAL_GAME',
  LEAD_CLIMBING = 'LEAD_CLIMBING',
  BOULDERING = 'BOULDERING'
}

export interface TrainingWeek {
  id: string;
  trainingPlanId: string;
  weekNumber: number;
  focus: TrainingFocus[];
  sessions: TrainingSession[];
  isCompleted: boolean;
}

export interface TrainingSession {
  id: string;
  trainingWeekId: string;
  dayNumber: number;
  title: string;
  description: string;
  duration: number; // minutes
  exercises: TrainingExercise[];
  isCompleted: boolean;
}

export interface TrainingExercise {
  id: string;
  trainingSessionId: string;
  name: string;
  description: string;
  sets: number;
  reps: number;
  duration: number; // seconds
  restTime: number; // seconds
  type: ExerciseType;
}

export enum ExerciseType {
  WARM_UP = 'WARM_UP',
  STRENGTH = 'STRENGTH',
  ENDURANCE = 'ENDURANCE',
  TECHNIQUE = 'TECHNIQUE',
  COOL_DOWN = 'COOL_DOWN'
}

// Gamification Types


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

export interface TrainingState {
  activePlan: UserTrainingPlan | null;
  availablePlans: TrainingPlan[];
  templates: TrainingPlanTemplate[];
  userPlans: UserTrainingPlan[];
  currentWeek: UserTrainingWeek | null;
  isLoading: boolean;
  error: string | null;
}

// Weather Types
export * from './weather'; 