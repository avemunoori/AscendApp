import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import { Alert } from 'react-native';

// Declare global type for reset password code
declare global {
  var resetPasswordCode: string | undefined;
}

export default function App() {
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      try {
        const url = event.url;
        const { path, queryParams } = Linking.parse(url);
        
        if (path === 'reset-password' && queryParams?.code) {
          // Navigate to password reset screen with the code
          // We'll handle this in the navigation
          
          // Store the reset code temporarily for the navigation to pick up
          global.resetPasswordCode = queryParams.code as string;
          
          // Show a helpful message to the user
          Alert.alert(
            'Password Reset',
            'Opening password reset screen...',
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        console.error('❌ Error handling deep link:', error);
      }
    };

    // Handle deep links when app is already running
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Handle app launch from a deep link
    Linking.getInitialURL().then((url: string | null) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  return (
    <Provider store={store}>
      <StatusBar style="light" />
      <AppNavigator />
    </Provider>
  );
}
