import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/hooks';
import { RootState } from '../store';
import { getCurrentUser, validateToken, logout } from '../store/authSlice';
import { apiService } from '../services/api';

// Import screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import SessionsScreen from '../screens/sessions/SessionsScreen';
import SessionDetailScreen from '../screens/sessions/SessionDetailScreen';
import CreateSessionScreen from '../screens/sessions/CreateSessionScreen';
import EditSessionScreen from '../screens/sessions/EditSessionScreen';
import { AnalyticsScreen } from '../screens/analytics/AnalyticsScreen';
import WeatherScreen from '../screens/weather/WeatherScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import AchievementsScreen from '../screens/profile/AchievementsScreen';
import TrainingScreen from '../screens/training/TrainingScreen';
import TrainingPlanDetailScreen from '../screens/training/TrainingPlanDetailScreen';
import PrivacyPolicy from '../components/PrivacyPolicy';
import TermsOfService from '../components/TermsOfService';

// Import components
import LoadingScreen from '../components/LoadingScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator for authenticated users
const TabNavigator = () => {
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={{
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#6366f1',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Sessions"
        component={SessionsScreen}
        options={{
          tabBarLabel: 'Sessions',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="list" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Weather"
        component={WeatherScreen}
        options={{
          tabBarLabel: 'Weather',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="weather" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Training"
        component={TrainingScreen}
        options={{
          tabBarLabel: 'Training',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="fitness-center" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Achievements"
        component={AchievementsScreen}
        options={{
          tabBarLabel: 'Awards',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="emoji-events" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Tab Icon component using Material Icons
const TabIcon = ({ name, color, size }: { name: string; color: string; size: number }) => {
  const getIconName = (iconName: string) => {
    switch (iconName) {
      case 'list': return 'list';
      case 'weather': return 'wb-sunny';
      case 'bar-chart': return 'bar-chart';
      case 'person': return 'person';
      case 'fitness-center': return 'fitness-center';
      case 'emoji-events': return 'emoji-events';
      default: return 'help';
    }
  };

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={getIconName(name)} size={size} color={color} />
    </View>
  );
};

// Main App Navigator
const AppNavigator = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Starting app initialization...');
        // Set dispatch function in API service
        apiService.setDispatch(dispatch);
        await apiService.initialize();
        
        // Only try to validate token if we have one
        const token = await apiService.getToken();
        console.log('🔑 Token check result:', token ? 'Token found' : 'No token');
        
        if (token) {
          try {
            console.log('🔍 Validating existing token...');
            // Use validateToken instead of getCurrentUser for initial check
        dispatch(validateToken());
          } catch (error) {
            console.log('❌ Token validation failed, user needs to login again');
            // Clear any stale token
            dispatch(logout());
          }
        } else {
          console.log('ℹ️ No token found, user needs to login');
        }
      } catch (error) {
        console.error('❌ Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, [dispatch]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        id={undefined}
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          // Authenticated stack
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen
              name="SessionDetail"
              component={SessionDetailScreen}
              options={{
                headerShown: true,
                title: 'Session Details',
                headerStyle: {
                  backgroundColor: '#6366f1',
                },
                headerTintColor: '#ffffff',
              }}
            />
            <Stack.Screen
              name="CreateSession"
              component={CreateSessionScreen}
              options={{
                headerShown: true,
                title: 'New Session',
                headerStyle: {
                  backgroundColor: '#6366f1',
                },
                headerTintColor: '#ffffff',
              }}
            />
            <Stack.Screen
              name="EditSession"
              component={EditSessionScreen}
              options={{
                headerShown: true,
                title: 'Edit Session',
                headerStyle: {
                  backgroundColor: '#6366f1',
                },
                headerTintColor: '#ffffff',
              }}
            />
            <Stack.Screen
              name="Analytics"
              component={AnalyticsScreen}
              options={{
                headerShown: true,
                title: 'Analytics',
                headerStyle: {
                  backgroundColor: '#6366f1',
                },
                headerTintColor: '#ffffff',
              }}
            />
            <Stack.Screen
              name="TrainingPlanDetail"
              component={TrainingPlanDetailScreen}
              options={{
                headerShown: true,
                title: 'Plan Details',
                headerStyle: {
                  backgroundColor: '#6366f1',
                },
                headerTintColor: '#ffffff',
              }}
            />
            <Stack.Screen
              name="PrivacyPolicy"
              component={PrivacyPolicy}
              options={{
                headerShown: true,
                title: 'Privacy Policy',
                headerStyle: {
                  backgroundColor: '#6366f1',
                },
                headerTintColor: '#ffffff',
              }}
            />
            <Stack.Screen
              name="TermsOfService"
              component={TermsOfService}
              options={{
                headerShown: true,
                title: 'Terms of Service',
                headerStyle: {
                  backgroundColor: '#6366f1',
                },
                headerTintColor: '#ffffff',
              }}
            />
          </>
        ) : (
          // Authentication stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen
              name="PrivacyPolicy"
              component={PrivacyPolicy}
              options={{
                headerShown: true,
                title: 'Privacy Policy',
                headerStyle: {
                  backgroundColor: '#6366f1',
                },
                headerTintColor: '#ffffff',
              }}
            />
            <Stack.Screen
              name="TermsOfService"
              component={TermsOfService}
              options={{
                headerShown: true,
                title: 'Terms of Service',
                headerStyle: {
                  backgroundColor: '#6366f1',
                },
                headerTintColor: '#ffffff',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 