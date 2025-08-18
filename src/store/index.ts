import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import sessionsReducer from './sessionsSlice';
import analyticsReducer from './analyticsSlice';
import weatherReducer from './weatherSlice';
import trainingReducer from './trainingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sessions: sessionsReducer,
    analytics: analyticsReducer,
    weather: weatherReducer,
    training: trainingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 