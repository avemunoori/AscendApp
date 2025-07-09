import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AnalyticsState, SessionAnalytics, StatsOverview, ProgressAnalytics, HighestGradeStats, AverageGradeStats } from '../types';
import { apiService } from '../services/api';

const initialState: AnalyticsState = {
  analytics: null,
  statsOverview: null,
  progressAnalytics: [],
  highestGrades: [],
  averageGrades: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchSessionAnalytics = createAsyncThunk(
  'analytics/fetchSessionAnalytics',
  async () => {
    const analytics = await apiService.getSessionAnalytics();
    return analytics;
  }
);

export const fetchStatsOverview = createAsyncThunk(
  'analytics/fetchStatsOverview',
  async () => {
    const stats = await apiService.getStatsOverview();
    return stats;
  }
);

export const fetchProgressAnalytics = createAsyncThunk(
  'analytics/fetchProgressAnalytics',
  async () => {
    const progress = await apiService.getProgressAnalytics();
    return progress;
  }
);

export const fetchHighestGrades = createAsyncThunk(
  'analytics/fetchHighestGrades',
  async () => {
    const highest = await apiService.getHighestGrades();
    return highest;
  }
);

export const fetchAverageGrades = createAsyncThunk(
  'analytics/fetchAverageGrades',
  async () => {
    const average = await apiService.getAverageGrades();
    return average;
  }
);

export const fetchAllAnalytics = createAsyncThunk(
  'analytics/fetchAllAnalytics',
  async () => {
    const [analytics, stats, progress, highest, average] = await Promise.all([
      apiService.getSessionAnalytics(),
      apiService.getStatsOverview(),
      apiService.getProgressAnalytics(),
      apiService.getHighestGrades(),
      apiService.getAverageGrades(),
    ]);
    
    return {
      analytics,
      stats,
      progress,
      highest,
      average,
    };
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAnalytics: (state) => {
      state.analytics = null;
      state.statsOverview = null;
      state.progressAnalytics = [];
      state.highestGrades = [];
      state.averageGrades = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Session Analytics
    builder
      .addCase(fetchSessionAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSessionAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchSessionAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch session analytics';
      });

    // Fetch Stats Overview
    builder
      .addCase(fetchStatsOverview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStatsOverview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.statsOverview = action.payload;
      })
      .addCase(fetchStatsOverview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch stats overview';
      });

    // Fetch Progress Analytics
    builder
      .addCase(fetchProgressAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProgressAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.progressAnalytics = action.payload;
      })
      .addCase(fetchProgressAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch progress analytics';
      });

    // Fetch Highest Grades
    builder
      .addCase(fetchHighestGrades.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHighestGrades.fulfilled, (state, action) => {
        state.isLoading = false;
        state.highestGrades = action.payload;
      })
      .addCase(fetchHighestGrades.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch highest grades';
      });

    // Fetch Average Grades
    builder
      .addCase(fetchAverageGrades.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAverageGrades.fulfilled, (state, action) => {
        state.isLoading = false;
        state.averageGrades = action.payload;
      })
      .addCase(fetchAverageGrades.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch average grades';
      });

    // Fetch All Analytics
    builder
      .addCase(fetchAllAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.analytics = action.payload.analytics;
        state.statsOverview = action.payload.stats;
        state.progressAnalytics = action.payload.progress;
        state.highestGrades = action.payload.highest;
        state.averageGrades = action.payload.average;
      })
      .addCase(fetchAllAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch analytics';
      });
  },
});

export const { clearError, clearAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer; 