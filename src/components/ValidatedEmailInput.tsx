import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
} from 'react-native';
import { getEmailValidationState } from '../utils/emailValidation';

interface ValidatedEmailInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  onValidationChange?: (isValid: boolean, message?: string) => void;
  showValidationMessage?: boolean;
  style?: any;
  inputStyle?: any;
}

const ValidatedEmailInput: React.FC<ValidatedEmailInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Enter your email',
  label = 'Email',
  onValidationChange,
  showValidationMessage = true,
  style,
  inputStyle,
}) => {
  const [validationState, setValidationState] = useState<{
    isValid: boolean;
    isCommonDomain: boolean;
    message?: string;
  }>({
    isValid: false,
    isCommonDomain: false,
    message: '',
  });
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const fadeAnim = new Animated.Value(0);
  const borderColorAnim = new Animated.Value(0);

  useEffect(() => {
    const newValidationState = getEmailValidationState(value);
    setValidationState(newValidationState);

    if (onValidationChange) {
      onValidationChange(newValidationState.isValid, newValidationState.message);
    }
  }, [value, onValidationChange]);

  useEffect(() => {
    // Animate border color based on validation state
    const targetValue = validationState.isValid ? 1 : 0;
    Animated.timing(borderColorAnim, {
      toValue: targetValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [validationState.isValid]);

  useEffect(() => {
    // Animate validation message
    if (showValidationMessage && hasInteracted && value) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [validationState.message, hasInteracted, value, showValidationMessage]);

  const handleTextChange = (text: string) => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    onChangeText(text);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const getBorderColor = () => {
    if (!hasInteracted || !value) {
      return isFocused ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.2)';
    }
    
    if (validationState.isValid) {
      return 'rgba(34, 197, 94, 0.6)'; // Green
    } else {
      return 'rgba(239, 68, 68, 0.6)'; // Red
    }
  };

  const getInputBackgroundColor = () => {
    if (!hasInteracted || !value) {
      return 'rgba(255, 255, 255, 0.1)';
    }
    
    if (validationState.isValid) {
      return 'rgba(34, 197, 94, 0.1)'; // Light green
    } else {
      return 'rgba(239, 68, 68, 0.1)'; // Light red
    }
  };

  const shouldShowValidationMessage = showValidationMessage && 
    hasInteracted && 
    value && 
    validationState.message;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={[
        styles.inputWrapper,
        {
          borderColor: getBorderColor(),
          backgroundColor: getInputBackgroundColor(),
        }
      ]}>
        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={handleTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
        />
        
        {/* Validation indicator */}
        {hasInteracted && value && (
          <View style={styles.validationIndicator}>
            {validationState.isValid ? (
              <Text style={styles.validIcon}>✓</Text>
            ) : (
              <Text style={styles.invalidIcon}>✗</Text>
            )}
          </View>
        )}
      </View>

      {/* Domain info for common domains */}
      {validationState.isValid && validationState.isCommonDomain && (
        <Animated.View style={[styles.domainInfo, { opacity: fadeAnim }]}>
          <Text style={styles.domainInfoText}>
            ✓ Recognized email provider
          </Text>
        </Animated.View>
      )}

      {/* Validation message */}
      {shouldShowValidationMessage && (
        <Animated.View style={[styles.validationMessage, { opacity: fadeAnim }]}>
          <Text style={styles.validationMessageText}>
            {validationState.message}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  validationIndicator: {
    position: 'absolute',
    right: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
  },
  validIcon: {
    color: '#22c55e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  invalidIcon: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
  domainInfo: {
    marginTop: 4,
    paddingHorizontal: 4,
  },
  domainInfoText: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: '500',
  },
  validationMessage: {
    marginTop: 4,
    paddingHorizontal: 4,
  },
  validationMessageText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '500',
  },
});

export default ValidatedEmailInput; 