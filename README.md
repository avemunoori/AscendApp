# Ascend - Climbing Training App

A modern React Native climbing app designed to help climbers track their progress, manage training plans, and analyze their performance across different climbing disciplines.

## 🏔️ Features

### **Authentication & User Management**
- Secure JWT-based authentication
- User registration and login
- Profile management with user data persistence

### **Session Tracking**
- **Multi-Discipline Support**: Boulder, Lead, and Top Rope climbing
- **Grade Systems**: V-scale for bouldering, YDS for sport climbing
- **Session Details**: Date, grade, discipline, completion status, notes
- **CRUD Operations**: Create, read, update, and delete climbing sessions
- **Filtering**: Filter sessions by discipline, date, and completion status

### **Training Plans**
- **Static Training Plans**: 5 pre-built training programs with different difficulty levels
- **Exercise Library**: Detailed exercises for each training plan
- **Difficulty Levels**: Beginner, Intermediate, and Advanced
- **Focus Areas**: Strength, Endurance, Technique, Mental Game, Lead Climbing, Bouldering
- **Visual Interface**: Beautiful cards with difficulty-based color coding

### **Analytics & Progress Tracking**
- **Session Analytics**: Total sessions, average difficulty, completion rates
- **Discipline Breakdown**: Performance metrics by climbing discipline
- **Grade Progression**: Track highest and average grades achieved
- **Progress Visualization**: Charts and statistics for performance analysis
- **Historical Data**: Session history with detailed notes and progression

### **Modern UI/UX**
- **Glass Morphism Design**: Beautiful glass card components with transparency effects
- **Gradient Backgrounds**: Dynamic gradient backgrounds throughout the app
- **Smooth Animations**: Press animations, modal transitions, and loading states
- **Responsive Design**: Optimized for different screen sizes
- **White Text Theme**: High contrast white text for excellent readability

## 🛠️ Technical Stack

### **Frontend**
- **React Native** with Expo
- **TypeScript** for type safety
- **Redux Toolkit** for state management
- **React Navigation** for navigation
- **Expo Linear Gradient** for visual effects
- **React Native Vector Icons** for icons

### **Backend Integration**
- **RESTful API** integration with Spring Boot backend
- **JWT Authentication** for secure user sessions
- **H2 Database** for data persistence
- **Production Deployment** on Railway

### **Development Tools**
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type checking

## 📱 Screens & Navigation

### **Authentication**
- Login Screen
- Registration Screen

### **Main App**
- **Sessions Tab**: View, create, edit, and delete climbing sessions
- **Training Tab**: Browse training plans and view exercises
- **Analytics Tab**: View performance statistics and progress charts
- **Profile Tab**: User profile and achievements

### **Session Management**
- Sessions List with filtering
- Create Session Screen
- Edit Session Screen
- Session Detail Screen

### **Training**
- Training Plans Overview
- Exercise Detail Modal
- Training Tips and Guidance

## 🎯 Key Achievements

### **Complete Backend Integration**
- ✅ User authentication and session management
- ✅ Session CRUD operations with full API integration
- ✅ Training plan templates and user plans
- ✅ Analytics endpoints for comprehensive data analysis
- ✅ Grade system handling for multiple climbing disciplines

### **Rich Test Data**
- ✅ 14 climbing sessions across 3 disciplines
- ✅ Grade progression from V1 to V5 (bouldering)
- ✅ Lead climbing progression from 5.9 to 5.11a
- ✅ Top rope sessions with technique focus
- ✅ Realistic session notes and progression timeline

### **Modern UI Implementation**
- ✅ Glass morphism design with transparency effects
- ✅ Gradient backgrounds and smooth animations
- ✅ Responsive layout with proper spacing
- ✅ Color-coded difficulty indicators
- ✅ Beautiful modal interfaces for exercise details

### **Robust Error Handling**
- ✅ API error handling with user-friendly messages
- ✅ Network connectivity management
- ✅ Form validation and input sanitization
- ✅ Loading states and error recovery

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd ascend-app

# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Environment Setup
Create a `.env` file in the root directory:
```
EXPO_PUBLIC_BACKEND_API_URL=your_backend_api_url_here
```

## 📊 Testing

For testing purposes, create your own account or use the demo data provided in the app.

## 🏗️ Project Structure

```
AscendApp/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AnimatedButton.tsx
│   │   ├── GlassCard.tsx
│   │   ├── GradientBackground.tsx
│   │   ├── LoadingScreen.tsx
│   │   └── Logo.tsx
│   ├── screens/            # Screen components
│   │   ├── auth/          # Authentication screens
│   │   ├── sessions/      # Session management screens
│   │   ├── analytics/     # Analytics and statistics screens
│   │   ├── training/      # Training plan screens
│   │   └── profile/       # User profile screen
│   ├── store/             # Redux store and slices
│   │   ├── authSlice.ts
│   │   ├── sessionsSlice.ts
│   │   ├── trainingSlice.ts
│   │   └── index.ts
│   ├── services/          # API services and utilities
│   │   ├── api.ts
│   │   └── weatherService.ts
│   ├── types/             # TypeScript type definitions
│   ├── navigation/        # Navigation configuration
│   └── utils/             # Utility functions
├── assets/                # Images and static assets
└── package.json
```

## 🔧 API Integration

The app integrates with a Spring Boot backend and includes:

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

### Training Plans
- `GET /api/training/templates` - Get training plan templates
- `POST /api/training/user-plans` - Start a training plan
- `GET /api/training/user-plans` - Get user's training plans

### Analytics
- `GET /api/sessions/analytics` - Overall session analytics
- `GET /api/sessions/stats/overview` - Stats overview
- `GET /api/sessions/stats/highest` - Highest grades by discipline
- `GET /api/sessions/stats/average` - Average grades by discipline

## 🎨 Design System

### Color Scheme
- **Primary**: Purple gradient (#764ba2 to #667eea)
- **Success**: Green (#4CAF50)
- **Warning**: Orange (#FF9800)
- **Error**: Red (#F44336)
- **Text**: White (#ffffff) with transparency variations

### Components
- **GlassCard**: Transparent cards with backdrop blur
- **GradientBackground**: Dynamic gradient backgrounds
- **AnimatedButton**: Interactive buttons with press animations
- **LoadingScreen**: Consistent loading states

## 📈 Future Enhancements

### Planned Features
- **Social Features**: Share achievements and connect with other climbers
- **Route Database**: Integration with climbing route databases
- **Weather Integration**: Real-time weather data for outdoor climbing
- **Offline Support**: Local data caching for offline use
- **Push Notifications**: Training reminders and achievement notifications
- **Advanced Analytics**: Machine learning insights for training optimization

### Technical Improvements
- **Performance Optimization**: Image optimization and lazy loading
- **Accessibility**: Screen reader support and accessibility features
- **Testing**: Comprehensive unit and integration tests
- **CI/CD**: Automated testing and deployment pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** for the amazing development platform
- **React Native Community** for the excellent ecosystem
- **Climbing Community** for inspiration and feedback
- **Design Inspiration** from modern mobile app trends

---

**Built with ❤️ for the climbing community**
