import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { WeatherData, ClimbingConditions, WeatherRequest } from '../types/weather';
import { weatherService } from '../services/weatherService';

interface WeatherState {
  weatherData: WeatherData | null;
  conditions: ClimbingConditions | null;
  isLoading: boolean;
  error: string | null;
  currentLocation: string;
}

const initialState: WeatherState = {
  weatherData: null,
  conditions: null,
  isLoading: false,
  error: null,
  currentLocation: 'San Francisco, CA', // Default location
};

export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (request: WeatherRequest, { rejectWithValue }) => {
    try {
      const weatherData = await weatherService.getWeatherData(request);
      const conditions = weatherService.analyzeClimbingConditions(weatherData);
      return { weatherData, conditions };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch weather data');
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<string>) => {
      state.currentLocation = action.payload;
    },
    clearWeatherData: (state) => {
      state.weatherData = null;
      state.conditions = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.weatherData = action.payload.weatherData;
        state.conditions = action.payload.conditions;
        state.error = null;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setLocation, clearWeatherData, clearError } = weatherSlice.actions;
export default weatherSlice.reducer; 