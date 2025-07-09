import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SessionsState, ClimbingSession, CreateSessionRequest, UpdateSessionRequest, SessionFilters } from '../types';
import { apiService } from '../services/api';

const initialState: SessionsState = {
  sessions: [],
  isLoading: false,
  error: null,
  filters: {},
};

// Async thunks
export const fetchSessions = createAsyncThunk(
  'sessions/fetchSessions',
  async (filters?: SessionFilters) => {
    const sessions = await apiService.getSessions(filters);
    return sessions;
  }
);

export const createSession = createAsyncThunk(
  'sessions/createSession',
  async (sessionData: CreateSessionRequest) => {
    const session = await apiService.createSession(sessionData);
    return session;
  }
);

export const updateSession = createAsyncThunk(
  'sessions/updateSession',
  async ({ id, sessionData }: { id: string; sessionData: UpdateSessionRequest }) => {
    const session = await apiService.updateSession(id, sessionData);
    return session;
  }
);

export const deleteSession = createAsyncThunk(
  'sessions/deleteSession',
  async (id: string) => {
    await apiService.deleteSession(id);
    return id;
  }
);

export const getSession = createAsyncThunk(
  'sessions/getSession',
  async (id: string) => {
    const session = await apiService.getSession(id);
    return session;
  }
);

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<SessionFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    addSession: (state, action: PayloadAction<ClimbingSession>) => {
      state.sessions.unshift(action.payload);
    },
    updateSessionInStore: (state, action: PayloadAction<ClimbingSession>) => {
      const index = state.sessions.findIndex(session => session.id === action.payload.id);
      if (index !== -1) {
        state.sessions[index] = action.payload;
      }
    },
    removeSession: (state, action: PayloadAction<string>) => {
      state.sessions = state.sessions.filter(session => session.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // Fetch Sessions
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch sessions';
      });

    // Create Session
    builder
      .addCase(createSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions.unshift(action.payload);
      })
      .addCase(createSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create session';
      });

    // Update Session
    builder
      .addCase(updateSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSession.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.sessions.findIndex(session => session.id === action.payload.id);
        if (index !== -1) {
          state.sessions[index] = action.payload;
        }
      })
      .addCase(updateSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update session';
      });

    // Delete Session
    builder
      .addCase(deleteSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions = state.sessions.filter(session => session.id !== action.payload);
      })
      .addCase(deleteSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete session';
      });

    // Get Session
    builder
      .addCase(getSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSession.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.sessions.findIndex(session => session.id === action.payload.id);
        if (index !== -1) {
          state.sessions[index] = action.payload;
        } else {
          state.sessions.unshift(action.payload);
        }
      })
      .addCase(getSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to get session';
      });
  },
});

export const {
  setFilters,
  clearFilters,
  clearError,
  addSession,
  updateSessionInStore,
  removeSession,
} = sessionsSlice.actions;

export default sessionsSlice.reducer; 