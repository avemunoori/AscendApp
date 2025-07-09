# 🧗‍♀️ Ascend - Climbing Session Tracker

A React Native mobile application for tracking climbing sessions, built with TypeScript, Redux Toolkit, and Expo.

## Features

- **Authentication System**: Secure login/register with JWT tokens
- **Session Management**: Create, edit, delete, and view climbing sessions
- **Multiple Disciplines**: Support for Bouldering, Lead, and Top Rope climbing
- **Grade Tracking**: V-scale for bouldering, YDS for lead/sport climbing
- **Analytics Dashboard**: Progress tracking and statistics
- **Modern UI**: Beautiful, intuitive interface with smooth animations
- **Offline Support**: Local caching for offline viewing

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Redux Toolkit** for state management
- **React Navigation** for routing
- **AsyncStorage** for local data persistence
- **React Native Chart Kit** for analytics visualization

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd AscendApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with your environment variables:
   ```env
   WEATHER_API_KEY=your_weather_api_key_here
   WEATHER_API_BASE_URL=https://api.weatherapi.com/v1
   EXPO_PUBLIC_BACKEND_API_URL=your_backend_api_url_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
│   ├── auth/          # Authentication screens
│   ├── sessions/      # Session management screens
│   ├── analytics/     # Analytics and statistics screens
│   └── profile/       # User profile screen
├── store/             # Redux store and slices
├── services/          # API services and utilities
├── types/             # TypeScript type definitions
├── navigation/        # Navigation configuration
└── utils/             # Utility functions
```

## API Integration

The app integrates with your Spring Boot backend and includes:

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/validate` - Token validation

### Session Management
- `POST /api/sessions` - Create new session
- `GET /api/sessions` - Get all sessions (with filtering)
- `GET /api/sessions/{id}` - Get specific session
- `PATCH /api/sessions/{id}` - Update session
- `DELETE /api/sessions/{id}` - Delete session

### Analytics
- `GET /api/sessions/analytics` - Overall session analytics
- `GET /api/sessions/stats/overview` - Stats overview
- `GET /api/sessions/stats/progress` - Progress analytics
- `GET /api/sessions/stats/highest` - Highest grades by discipline
- `GET /api/sessions/stats/average` - Average grades by discipline

## Grade System

The app handles different climbing grade systems:

- **Bouldering**: V-scale (V0-V17) stored as integers
- **Lead/Sport**: YDS (5.6-5.15d) stored as floats with conversion utilities

## Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run build` - Build for production

### Code Style

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Redux Toolkit for state management
- React Navigation for routing

## Deployment

### Expo Build

1. **Configure app.json** with your app details
2. **Build for production**:
   ```bash
   expo build:android  # For Android
   expo build:ios      # For iOS
   ```

### Environment Variables

Make sure to set the correct environment variables for production:
- `EXPO_PUBLIC_BACKEND_API_URL` - Your production backend URL
- `WEATHER_API_KEY` - Weather API key (if using weather features)
- `WEATHER_API_BASE_URL` - Weather API base URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team. 