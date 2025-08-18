import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export class SecureStorage {
  // Store JWT token securely
  static async storeToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error('❌ Failed to store token securely:', error);
      throw new Error('Failed to store authentication token');
    }
  }

  // Retrieve JWT token
  static async getToken(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      return token;
    } catch (error) {
      console.error('❌ Failed to retrieve token:', error);
      return null;
    }
  }

  // Remove JWT token
  static async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('❌ Failed to remove token:', error);
    }
  }

  // Store user data securely
  static async storeUser(user: any): Promise<void> {
    try {
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('❌ Failed to store user data:', error);
    }
  }

  // Retrieve user data
  static async getUser(): Promise<any | null> {
    try {
      const userData = await SecureStore.getItemAsync(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('❌ Failed to retrieve user data:', error);
      return null;
    }
  }

  // Remove user data
  static async removeUser(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (error) {
      console.error('❌ Failed to remove user data:', error);
    }
  }

  // Clear all auth data
  static async clearAuthData(): Promise<void> {
    try {
      await Promise.all([
        this.removeToken(),
        this.removeUser()
      ]);
    } catch (error) {
      console.error('❌ Failed to clear auth data:', error);
    }
  }
} 