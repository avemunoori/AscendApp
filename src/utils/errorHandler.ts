import { Alert } from 'react-native';

export interface AppError {
  message: string;
  code?: string;
  details?: any;
}

export class ErrorHandler {
  // Handle API errors with user-friendly messages
  static handleApiError(error: any): AppError {
    console.error('❌ API Error:', error);

    // If it's already an AppError, return it
    if (error && typeof error === 'object' && error.message) {
      return {
        message: error.message,
        code: error.code,
        details: error.details,
      };
    }

    // Handle network errors
    if (error && error.message && error.message.includes('Network request failed')) {
      return {
        message: 'Network connection error. Please check your internet connection and try again.',
        code: 'NETWORK_ERROR',
      };
    }

    // Handle timeout errors
    if (error && error.message && error.message.includes('timeout')) {
      return {
        message: 'Request timed out. Please try again.',
        code: 'TIMEOUT_ERROR',
      };
    }

    // Handle authentication errors
    if (error && error.message && error.message.includes('Unauthorized')) {
      return {
        message: 'Your session has expired. Please log in again.',
        code: 'AUTH_ERROR',
      };
    }

    // Handle validation errors
    if (error && error.message && error.message.includes('validation')) {
      return {
        message: 'Please check your input and try again.',
        code: 'VALIDATION_ERROR',
      };
    }

    // Default error message
    return {
      message: 'Something went wrong. Please try again.',
      code: 'UNKNOWN_ERROR',
      details: error,
    };
  }

  // Show error alert to user
  static showErrorAlert(error: AppError, title: string = 'Error') {
    Alert.alert(title, error.message, [{ text: 'OK' }]);
  }

  // Show success alert to user
  static showSuccessAlert(message: string, title: string = 'Success') {
    Alert.alert(title, message, [{ text: 'OK' }]);
  }

  // Show confirmation dialog
  static showConfirmationAlert(
    message: string,
    title: string = 'Confirm',
    onConfirm: () => void,
    onCancel?: () => void
  ) {
    Alert.alert(
      title,
      message,
      [
        { text: 'Cancel', style: 'cancel', onPress: onCancel },
        { text: 'OK', onPress: onConfirm },
      ]
    );
  }

  // Handle password reset specific errors
  static handlePasswordResetError(error: any): AppError {
    const appError = this.handleApiError(error);

    // Override specific password reset error messages
    if (appError.message.includes('Invalid or expired reset code')) {
      return {
        message: 'The reset code is invalid or has expired. Please request a new one.',
        code: 'INVALID_RESET_CODE',
      };
    }

    if (appError.message.includes('Rate limit')) {
      return {
        message: 'Too many attempts. Please wait a while before trying again.',
        code: 'RATE_LIMIT',
      };
    }

    return appError;
  }

  // Handle authentication specific errors
  static handleAuthError(error: any): AppError {
    const appError = this.handleApiError(error);

    // Override specific authentication error messages
    if (appError.message.includes('Invalid credentials')) {
      return {
        message: 'Invalid email or password. Please try again.',
        code: 'INVALID_CREDENTIALS',
      };
    }

    if (appError.message.includes('Email already exists')) {
      return {
        message: 'An account with this email already exists. Please log in instead.',
        code: 'EMAIL_EXISTS',
      };
    }

    if (appError.message.includes('Password too weak')) {
      return {
        message: 'Password must be at least 8 characters long.',
        code: 'WEAK_PASSWORD',
      };
    }

    return appError;
  }

  // Handle session management errors
  static handleSessionError(error: any): AppError {
    const appError = this.handleApiError(error);

    // Override specific session error messages
    if (appError.message.includes('Session not found')) {
      return {
        message: 'Session not found. It may have been deleted.',
        code: 'SESSION_NOT_FOUND',
      };
    }

    if (appError.message.includes('Invalid grade')) {
      return {
        message: 'Please select a valid grade for your climbing discipline.',
        code: 'INVALID_GRADE',
      };
    }

    return appError;
  }

  // Log error for debugging
  static logError(error: AppError, context?: string) {
    console.error(`❌ Error${context ? ` in ${context}` : ''}:`, {
      message: error.message,
      code: error.code,
      details: error.details,
      timestamp: new Date().toISOString(),
    });
  }
} 