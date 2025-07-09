import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  style?: any;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  animated = true, 
  style 
}) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      // Initial animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]).start();

      // Continuous rotation animation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 20000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [animated]);

  const getSize = () => {
    switch (size) {
      case 'small':
        return { width: 60, height: 60, fontSize: 24 };
      case 'large':
        return { width: 120, height: 120, fontSize: 48 };
      default:
        return { width: 80, height: 80, fontSize: 32 };
    }
  };

  const { width: logoWidth, height: logoHeight, fontSize } = getSize();

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: logoWidth,
          height: logoHeight,
          transform: [
            { scale: scaleAnim },
            { rotate: spin },
          ],
        },
        style,
      ]}
    >
      {/* Outer glow effect */}
      <Animated.View
        style={[
          styles.glow,
          {
            width: logoWidth + 20,
            height: logoHeight + 20,
            opacity: glowOpacity,
          },
        ]}
      />
      
      {/* Main logo container */}
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.logoContainer,
          {
            width: logoWidth,
            height: logoHeight,
          },
        ]}
      >
        {/* Inner design elements */}
        <View style={styles.innerElements}>
          {/* Mountain peaks */}
          <View style={styles.mountainContainer}>
            <View style={[styles.mountain, styles.mountain1]} />
            <View style={[styles.mountain, styles.mountain2]} />
            <View style={[styles.mountain, styles.mountain3]} />
          </View>
          
          {/* Climbing figure */}
          <View style={styles.climber}>
            <View style={styles.climberBody} />
            <View style={styles.climberHead} />
            <View style={styles.climberArm1} />
            <View style={styles.climberArm2} />
            <View style={styles.climberLeg1} />
            <View style={styles.climberLeg2} />
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: '#667eea',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  logoContainer: {
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  innerElements: {
    position: 'relative',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mountainContainer: {
    position: 'absolute',
    bottom: 8,
    width: '100%',
    height: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  mountain: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    position: 'absolute',
    bottom: 0,
  },
  mountain1: {
    width: 8,
    height: 12,
    left: '35%',
    transform: [{ skewX: '-20deg' }],
  },
  mountain2: {
    width: 10,
    height: 16,
    left: '45%',
    transform: [{ skewX: '-15deg' }],
  },
  mountain3: {
    width: 8,
    height: 14,
    left: '55%',
    transform: [{ skewX: '-25deg' }],
  },
  climber: {
    position: 'absolute',
    top: 12,
    width: 6,
    height: 12,
  },
  climberHead: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    position: 'absolute',
    top: 0,
    left: 1,
  },
  climberBody: {
    width: 2,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    position: 'absolute',
    top: 4,
    left: 2,
  },
  climberArm1: {
    width: 3,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    position: 'absolute',
    top: 5,
    left: -1,
    transform: [{ rotate: '45deg' }],
  },
  climberArm2: {
    width: 3,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    position: 'absolute',
    top: 5,
    right: -1,
    transform: [{ rotate: '-45deg' }],
  },
  climberLeg1: {
    width: 2,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    position: 'absolute',
    bottom: 0,
    left: 1,
    transform: [{ rotate: '15deg' }],
  },
  climberLeg2: {
    width: 2,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    position: 'absolute',
    bottom: 0,
    right: 1,
    transform: [{ rotate: '-15deg' }],
  },
});

export default Logo; 