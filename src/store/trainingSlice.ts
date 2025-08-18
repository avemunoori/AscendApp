import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  TrainingState, 
  TrainingPlan, 
  TrainingDifficulty, 
  TrainingFocus, 
  TrainingWeek, 
  TrainingSession, 
  TrainingExercise, 
  ExerciseType,
  TrainingPlanTemplate,
  UserTrainingPlan,
  TrainingPlanStatus,
  UserTrainingWeek,
  UserTrainingSession,
  UserTrainingExercise,
  StartTrainingPlanRequest
} from '../types';
import { apiService } from '../services/api';

const initialState: TrainingState = {
  activePlan: null,
  availablePlans: [],
  templates: [],
  userPlans: [],
  currentWeek: null,
  isLoading: false,
  error: null,
};

// Async thunks for training plans
export const fetchTrainingTemplates = createAsyncThunk(
  'training/fetchTrainingTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const templates = await apiService.getTrainingTemplates();
      return templates;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch training templates');
    }
  }
);

export const fetchUserTrainingPlans = createAsyncThunk(
  'training/fetchUserTrainingPlans',
  async (_, { rejectWithValue }) => {
    try {
      const plans = await apiService.getUserTrainingPlans();
      return plans;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user training plans');
    }
  }
);

export const fetchUserTrainingPlan = createAsyncThunk(
  'training/fetchUserTrainingPlan',
  async (planId: string, { rejectWithValue }) => {
    try {
      const plan = await apiService.getUserTrainingPlan(planId);
      return plan;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch training plan');
    }
  }
);

export const fetchActiveTrainingPlan = createAsyncThunk(
  'training/fetchActiveTrainingPlan',
  async (_, { rejectWithValue }) => {
    try {
      const activePlan = await apiService.getActiveTrainingPlan();
      return activePlan;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch active training plan');
    }
  }
);

export const startTrainingPlan = createAsyncThunk(
  'training/startTrainingPlan',
  async (templateId: string, { rejectWithValue }) => {
    try {
      const request: StartTrainingPlanRequest = { templateId: String(templateId) };
      const userPlan = await apiService.startTrainingPlan(request);
      return userPlan;
    } catch (error: any) {
      console.error('❌ Failed to start training plan:', error);
      return rejectWithValue(error.message || 'Failed to start training plan');
    }
  }
);

export const completeTrainingSession = createAsyncThunk(
  'training/completeTrainingSession',
  async ({ planId, sessionId, duration, notes }: { 
    planId: string; 
    sessionId: string; 
    duration?: number; 
    notes?: string; 
  }, { rejectWithValue, getState }) => {
    try {
      await apiService.completeTrainingSession(planId, sessionId, duration, notes);
      
      // Fetch updated plan data
      const updatedPlan = await apiService.getUserTrainingPlan(planId);
      return { updatedPlan, sessionId };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to complete training session');
    }
  }
);

export const pauseTrainingPlan = createAsyncThunk(
  'training/pauseTrainingPlan',
  async (planId: string, { rejectWithValue }) => {
    try {
      await apiService.pauseTrainingPlan(planId);
      
      // Fetch updated plan data
      const updatedPlan = await apiService.getUserTrainingPlan(planId);
      return updatedPlan;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to pause training plan');
    }
  }
);

export const resumeTrainingPlan = createAsyncThunk(
  'training/resumeTrainingPlan',
  async (planId: string, { rejectWithValue }) => {
    try {
      await apiService.resumeTrainingPlan(planId);
      
      // Fetch updated plan data
      const updatedPlan = await apiService.getUserTrainingPlan(planId);
      return updatedPlan;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to resume training plan');
    }
  }
);

const trainingSlice = createSlice({
  name: 'training',
  initialState: {
    ...initialState,
    templates: [] as TrainingPlanTemplate[],
    userPlans: [] as UserTrainingPlan[],
  },
  reducers: {
    setActivePlan: (state, action: PayloadAction<UserTrainingPlan>) => {
      state.activePlan = action.payload;
    },
    updatePlanProgress: (state, action: PayloadAction<{ planId: string; progress: number }>) => {
      if (state.activePlan && state.activePlan.id === action.payload.planId) {
        state.activePlan.progress = action.payload.progress;
      }
    },
    clearTraining: (state) => {
      state.activePlan = null;
      state.currentWeek = null;
      state.error = null;
    },
    setCurrentWeek: (state, action: PayloadAction<UserTrainingWeek>) => {
      state.currentWeek = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch training templates
    builder
      .addCase(fetchTrainingTemplates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTrainingTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates = action.payload;
        // Convert templates to available plans format for backward compatibility
        state.availablePlans = action.payload.map((template: TrainingPlanTemplate) => ({
          id: template.id,
          userId: '',
          name: template.name,
          description: template.description,
          difficulty: template.difficulty,
          duration: template.duration ?? template.totalWeeks ?? 0,
          focus: Array.isArray(template.focus) ? template.focus : [],
          isActive: false,
          startDate: '',
          endDate: '',
          progress: 0,
          createdAt: template.createdAt,
          updatedAt: template.updatedAt ?? '',
        }));
      })
      .addCase(fetchTrainingTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch user training plans
    builder
      .addCase(fetchUserTrainingPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserTrainingPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userPlans = action.payload;
      })
      .addCase(fetchUserTrainingPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch active training plan
    builder
      .addCase(fetchActiveTrainingPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveTrainingPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activePlan = action.payload;
        if (action.payload?.weeks && action.payload.weeks.length > 0) {
          // Set current week to the first incomplete week or the current week
          const currentWeek = action.payload.weeks.find((week: UserTrainingWeek) => 
            week.weekNumber === action.payload!.currentWeek && !week.isCompleted
          ) || action.payload.weeks.find((week: UserTrainingWeek) => !week.isCompleted) || action.payload.weeks[0];
          
          if (currentWeek) {
            state.currentWeek = currentWeek;
          }
        }
      })
      .addCase(fetchActiveTrainingPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Start training plan
    builder
      .addCase(startTrainingPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startTrainingPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activePlan = action.payload;
        
        // Add to user plans
        const existingIndex = state.userPlans.findIndex(plan => plan.id === action.payload.id);
        if (existingIndex >= 0) {
          state.userPlans[existingIndex] = action.payload;
        } else {
          state.userPlans.push(action.payload);
        }
        
        // Set current week
        if (action.payload.weeks && action.payload.weeks.length > 0) {
          const currentWeek = action.payload.weeks.find(week => 
            week.weekNumber === action.payload.currentWeek
          ) || action.payload.weeks[0];
          
          if (currentWeek) {
            state.currentWeek = currentWeek;
          }
        }
      })
      .addCase(startTrainingPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Complete training session
    builder
      .addCase(completeTrainingSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeTrainingSession.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Update active plan with new data
        if (action.payload.updatedPlan) {
          state.activePlan = action.payload.updatedPlan;
          
          // Update current week if it changed
          if (action.payload.updatedPlan.weeks && action.payload.updatedPlan.weeks.length > 0) {
            const currentWeek = action.payload.updatedPlan.weeks.find(week => 
              week.weekNumber === action.payload.updatedPlan.currentWeek
            );
            
            if (currentWeek) {
              state.currentWeek = currentWeek;
            }
          }
        }
        
        // Update user plans
        if (action.payload.updatedPlan) {
          const existingIndex = state.userPlans.findIndex(plan => plan.id === action.payload.updatedPlan.id);
          if (existingIndex >= 0) {
            state.userPlans[existingIndex] = action.payload.updatedPlan;
          }
        }
      })
      .addCase(completeTrainingSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Pause training plan
    builder
      .addCase(pauseTrainingPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(pauseTrainingPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activePlan = action.payload;
        
        // Update user plans
        const existingIndex = state.userPlans.findIndex(plan => plan.id === action.payload.id);
        if (existingIndex >= 0) {
          state.userPlans[existingIndex] = action.payload;
        }
      })
      .addCase(pauseTrainingPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Resume training plan
    builder
      .addCase(resumeTrainingPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resumeTrainingPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activePlan = action.payload;
        
        // Update user plans
        const existingIndex = state.userPlans.findIndex(plan => plan.id === action.payload.id);
        if (existingIndex >= 0) {
          state.userPlans[existingIndex] = action.payload;
        }
      })
      .addCase(resumeTrainingPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setActivePlan, updatePlanProgress, clearTraining, setCurrentWeek } = trainingSlice.actions;
export default trainingSlice.reducer; 