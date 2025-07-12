import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { apiService } from '../../services/api';
import { ForgotPasswordScreenNavigationProp, ForgotPasswordScreenRouteProp } from '../../types/navigation';
import GradientBackground from '../../components/GradientBackground';
import { ErrorHandler } from '../../utils/errorHandler';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';
import Logo from '../../components/Logo';
import ValidatedEmailInput from '../../components/ValidatedEmailInput';

const { width, height } = Dimensions.get('window');

type ForgotPasswordScreenProps = {
  navigation: ForgotPasswordScreenNavigationProp;
  route: ForgotPasswordScreenRouteProp;
};

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation, route }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);

  // Check for deep link reset code on component mount
  useEffect(() => {
    // Check if we have a reset code from deep link
    if (global.resetPasswordCode) {
      console.log('🔗 Found reset code from deep link:', global.resetPasswordCode);
      setResetCode(global.resetPasswordCode);
      setStep('code');
      // Clear the global code after using it
      global.resetPasswordCode = undefined;
    }
    
    // Check if we have a reset code from route params
    if (route.params?.resetCode) {
      console.log('🔗 Found reset code from route params:', route.params.resetCode);
      setResetCode(route.params.resetCode);
      setStep('code');
    }
  }, [route.params?.resetCode]);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRequestReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!isEmailValid) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await apiService.forgotPassword(email);
      setStep('code');
      ErrorHandler.showSuccessAlert(
        'If an account with this email exists, you will receive a 6-digit reset code. Please check your email.',
        'Reset Code Sent'
      );
    } catch (error: any) {
      const appError = ErrorHandler.handlePasswordResetError(error);
      ErrorHandler.showErrorAlert(appError, 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!resetCode || resetCode.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit code from your email');
      return;
    }

    setIsLoading(true);
    try {
      await apiService.verifyResetCode(resetCode);
      setStep('password');
    } catch (error: any) {
      const appError = ErrorHandler.handlePasswordResetError(error);
      ErrorHandler.showErrorAlert(appError, 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await apiService.resetPassword(resetCode, newPassword);
      ErrorHandler.showSuccessAlert(
        'Your password has been reset successfully. You can now log in with your new password.',
        'Password Reset Successful'
      );
      navigation.navigate('Login');
    } catch (error: any) {
      const appError = ErrorHandler.handlePasswordResetError(error);
      ErrorHandler.showErrorAlert(appError, 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailStep = () => (
    <>
      <Text style={styles.formTitle}>Reset Password</Text>
      <Text style={styles.description}>
        Enter your email address and we'll send you a 6-digit code to reset your password.
      </Text>
      
      <ValidatedEmailInput
        value={email}
        onChangeText={setEmail}
        onValidationChange={setIsEmailValid}
        placeholder="Enter your email"
        label="Email"
      />

      <AnimatedButton
        title={isLoading ? 'Sending Code...' : 'Send Reset Code'}
        onPress={handleRequestReset}
        disabled={isLoading}
        style={styles.actionButton}
      />
    </>
  );

  const renderCodeStep = () => (
    <>
      <Text style={styles.formTitle}>Enter Reset Code</Text>
      <Text style={styles.description}>
        Enter the 6-digit code sent to {email}
      </Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Reset Code</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={resetCode}
            onChangeText={setResetCode}
            placeholder="Enter 6-digit code"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            keyboardType="number-pad"
            maxLength={6}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      <AnimatedButton
        title={isLoading ? 'Verifying...' : 'Verify Code'}
        onPress={handleVerifyCode}
        disabled={isLoading}
        style={styles.actionButton}
      />

      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => setStep('email')}>
          <Text style={styles.backButtonText}>← Back to Email</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderPasswordStep = () => (
    <>
      <Text style={styles.formTitle}>Set New Password</Text>
      <Text style={styles.description}>
        Enter your new password below.
      </Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>New Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            secureTextEntry
            autoCapitalize="none"
            textContentType="newPassword"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            secureTextEntry
            autoCapitalize="none"
            textContentType="newPassword"
          />
        </View>
      </View>

      <AnimatedButton
        title={isLoading ? 'Resetting...' : 'Reset Password'}
        onPress={handleResetPassword}
        disabled={isLoading}
        style={styles.actionButton}
      />

      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => setStep('code')}>
          <Text style={styles.backButtonText}>← Back to Code</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Floating particles effect */}
          <View style={styles.particlesContainer}>
            {[...Array(6)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.particle,
                  {
                    left: Math.random() * width,
                    top: Math.random() * height * 0.6,
                    opacity: fadeAnim,
                    transform: [{ scale: logoScale }],
                  },
                ]}
              />
            ))}
          </View>

          {/* Header Section */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: logoScale }],
              },
            ]}
          >
            <Logo size="large" style={styles.logo} />
            <Text style={styles.title}>ASCEND</Text>
            <Text style={styles.subtitle}>Reset Your Password</Text>
          </Animated.View>

          {/* Form Section */}
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <GlassCard style={styles.formCard}>
              {step === 'email' && renderEmailStep()}
              {step === 'code' && renderCodeStep()}
              {step === 'password' && renderPasswordStep()}

              <View style={styles.footer}>
                <Text style={styles.footerText}>Remember your password? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.linkText}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </GlassCard>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
  },
  formContainer: {
    width: '100%',
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  inputWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  input: {
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  actionButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  backButtonContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  linkText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});

export default ForgotPasswordScreen; 