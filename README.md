# 🧗‍♀️ Ascend - Climbing Session Tracker

A React Native mobile application for tracking climbing sessions, analyzing progress, and checking weather conditions for outdoor climbing.

## ✨ Key Features

- **Session Management**: Log bouldering, lead, and top rope climbing sessions
- **Grade Tracking**: Support for V-scale (bouldering) and YDS (lead/top rope) grading systems
- **Progress Analytics**: Visual charts and statistics showing climbing progress
- **Weather Integration**: Real-time weather data for outdoor climbing conditions
- **User Authentication**: Secure login/registration with JWT tokens
- **Modern UI/UX**: Glassmorphism effects, animated gradients, and smooth transitions

## 🚀 Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Redux Toolkit** for state management
- **React Navigation** for routing
- **Expo Linear Gradient** for visual effects
- **React Native Vector Icons** for iconography

## 🛠️ Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
│   ├── auth/          # Authentication screens
│   ├── sessions/      # Session management screens
│   ├── analytics/     # Analytics and statistics screens
│   ├── profile/       # User profile screen
│   ├── training/      # Training plan screens
│   └── weather/       # Weather information screens
├── store/             # Redux store and slices
├── services/          # API services and utilities
├── types/             # TypeScript type definitions
├── navigation/        # Navigation configuration
└── utils/             # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI

### Installation

1. **Clone and navigate to the project**
   ```bash
   git clone <repository-url>
   cd ascend-app/AscendApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app

## 📱 Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser

## 🔧 Development

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Redux Toolkit** for state management
- **React Navigation** for routing

## 📱 Platform Support

- **iOS**: Native iOS build with App Store submission ready
- **Android**: Native Android build support
- **Web**: Web browser compatibility

## 📄 License

This project is licensed under the MIT License.
