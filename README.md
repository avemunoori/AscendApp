# 🧗‍♀️ Ascend - Climbing Session Tracker

A beautiful React Native mobile app for tracking climbing sessions, analyzing progress, and checking weather conditions for outdoor climbing.

## ✨ Features

### 🎯 Core Functionality
- **Session Tracking**: Log bouldering, lead, and top rope climbing sessions
- **Grade Management**: Support for V-scale (bouldering) and YDS (lead/top rope) grading systems
- **Progress Analytics**: Visual charts and statistics showing your climbing progress
- **Weather Integration**: Real-time weather data and climbing condition analysis
- **User Authentication**: Secure login/registration with JWT tokens

### 🎨 UI/UX Highlights
- **Modern Design**: Glassmorphism effects, animated gradients, and smooth transitions
- **Material Icons**: Professional iconography throughout the app
- **Responsive Layout**: Optimized for both iOS and Android
- **Dark Theme**: Beautiful gradient backgrounds with excellent contrast

### 📊 Analytics Dashboard
- **Session Statistics**: Total sessions, sent rate, average difficulty
- **Progress Tracking**: Visual progress bars and trend analysis
- **Discipline Breakdown**: Separate analytics for bouldering vs lead climbing
- **Grade Progression**: Track your highest grades and improvements

## 🚀 Tech Stack

### Frontend
- **React Native** with Expo
- **TypeScript** for type safety
- **Redux Toolkit** for state management
- **React Navigation** for routing
- **Expo Linear Gradient** for beautiful gradients
- **React Native Vector Icons** for professional icons

### Backend Integration
- **Spring Boot** REST API
- **JWT Authentication**
- **PostgreSQL** database
- **Railway** deployment

### Key Libraries
- `@reduxjs/toolkit` - State management
- `react-native-reanimated` - Smooth animations
- `expo-linear-gradient` - Gradient backgrounds
- `react-native-vector-icons` - Professional icons

## 📱 Screenshots

### Main Features
- **Sessions Screen**: View and manage climbing sessions with filtering
- **Analytics Dashboard**: Comprehensive progress tracking and statistics
- **Weather Screen**: Real-time weather conditions for outdoor climbing
- **Profile Management**: User settings and session history

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/avemunoori/ascend.git
   cd ascend/AscendApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the `AscendApp` directory:
   ```env
   EXPO_PUBLIC_BACKEND_API_URL=https://ascend-api-production.up.railway.app
   WEATHER_API_KEY=your_weather_api_key
   WEATHER_API_BASE_URL=https://api.weatherapi.com/v1
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on device/simulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on your phone

## 🧪 Testing

### Test Credentials
Use these credentials to test the app:
- **Email**: `testuser@example.com`
- **Password**: `climbing123`

### Sample Data
The app includes 10 sample climbing sessions with realistic data:
- **Bouldering**: V2-V6 grades with mixed sent/unsent status
- **Lead Climbing**: 5.9-5.12a grades with project tracking
- **Analytics**: Real statistics and progress tracking

## 📁 Project Structure

```
AscendApp/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # App screens
│   │   ├── auth/           # Login/Register screens
│   │   ├── sessions/       # Session management
│   │   ├── analytics/      # Progress tracking
│   │   ├── weather/        # Weather conditions
│   │   └── profile/        # User profile
│   ├── store/              # Redux store and slices
│   ├── services/           # API services
│   ├── types/              # TypeScript type definitions
│   └── navigation/         # Navigation configuration
├── assets/                 # Images and static files
└── app.json               # Expo configuration
```

## 🔧 Configuration

### API Endpoints
The app connects to a production Spring Boot backend with the following main endpoints:
- `/auth/*` - Authentication (login, register, token validation)
- `/api/sessions/*` - Session management and analytics
- `/api/sessions/grades/*` - Grade system management

### Weather API
Uses WeatherAPI.com for real-time weather data and climbing condition analysis.

## 🎨 Design System

### Colors
- **Primary**: `#6366f1` (Indigo)
- **Success**: `#10b981` (Emerald)
- **Warning**: `#f59e0b` (Amber)
- **Danger**: `#ef4444` (Red)

### Typography
- **Headers**: Bold, large fonts with proper letter spacing
- **Body**: Clean, readable text with good contrast
- **Icons**: Material Design icons for consistency

## 🚀 Deployment

### Expo Build
```bash
# Build for iOS
npx expo build:ios

# Build for Android
npx expo build:android
```

### App Store Deployment
1. Configure app.json with proper app details
2. Build production version
3. Submit to App Store/Google Play Store

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo** for the amazing React Native development platform
- **Material Design** for the icon system
- **WeatherAPI** for weather data integration
- **React Native community** for excellent libraries and tools

## 📞 Support

For support, email aaryanvemunoori@gmail.com or create an issue in this repository.

---

**Built with ❤️ for the climbing community** 