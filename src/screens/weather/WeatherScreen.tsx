import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
  TextInput,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchWeatherData, setLocation } from '../../store/weatherSlice';
import { ClimbingConditions } from '../../types/weather';
import GradientBackground from '../../components/GradientBackground';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const WeatherScreen = () => {
  const dispatch = useAppDispatch();
  const { weatherData, conditions, isLoading, error, currentLocation } = useAppSelector(
    (state) => state.weather
  );
  
  const [locationInput, setLocationInput] = useState(currentLocation);
  const [isSearching, setIsSearching] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Only load weather data if user is authenticated and has a location
    if (currentLocation) {
      loadWeatherData();
    }
    
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
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadWeatherData = async () => {
    try {
      await dispatch(fetchWeatherData({ location: currentLocation, days: 3 })).unwrap();
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load weather data');
    }
  };

  const handleLocationSearch = async () => {
    if (!locationInput.trim()) return;
    
    setIsSearching(true);
    try {
      dispatch(setLocation(locationInput.trim()));
      await dispatch(fetchWeatherData({ location: locationInput.trim(), days: 3 })).unwrap();
    } catch (error: any) {
      Alert.alert('Error', 'Location not found or weather service unavailable');
    } finally {
      setIsSearching(false);
    }
  };

  const getConditionColor = (overall: string): [string, string] => {
    switch (overall) {
      case 'excellent': return ['#10b981', '#059669'];
      case 'good': return ['#3b82f6', '#2563eb'];
      case 'fair': return ['#f59e0b', '#d97706'];
      case 'poor': return ['#ef4444', '#dc2626'];
      case 'dangerous': return ['#7c2d12', '#991b1b'];
      default: return ['#6b7280', '#4b5563'];
    }
  };

  const getConditionEmoji = (overall: string) => {
    switch (overall) {
      case 'excellent': return '🧗‍♀️✨';
      case 'good': return '🧗‍♀️👍';
      case 'fair': return '🧗‍♀️⚠️';
      case 'poor': return '🧗‍♀️❌';
      case 'dangerous': return '🚫⚠️';
      default: return '🌤️';
    }
  };

  const ConditionCard = ({ title, condition, icon }: {
    title: string;
    condition: any;
    icon: string;
  }) => (
    <GlassCard style={styles.conditionCard}>
      <View style={styles.conditionHeader}>
        <Text style={styles.conditionIcon}>{icon}</Text>
        <Text style={styles.conditionTitle}>{title}</Text>
      </View>
      <Text style={styles.conditionDescription}>{condition.description}</Text>
      <Text style={styles.conditionRecommendation}>{condition.recommendation}</Text>
    </GlassCard>
  );

  const RecommendationCard = ({ text, type }: { text: string; type: 'recommendation' | 'warning' }) => {
    return (
      <GlassCard style={type === 'warning' ? styles.warningCard : styles.recommendationCard}>
        <Text style={styles.recommendationIcon}>
          {type === 'warning' ? '⚠️' : '💡'}
        </Text>
        <Text style={type === 'warning' ? styles.warningText : styles.recommendationText}>
          {text}
        </Text>
      </GlassCard>
    );
  };

  return (
    <GradientBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Climbing Weather</Text>
            <Text style={styles.subtitle}>Check conditions before you climb</Text>
          </View>

          {/* Location Search */}
          <GlassCard style={styles.searchCard}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.locationInput}
                value={locationInput}
                onChangeText={setLocationInput}
                placeholder="Enter city or location..."
                placeholderTextColor="#9ca3af"
                onSubmitEditing={handleLocationSearch}
              />
              <AnimatedButton
                title="🔍"
                onPress={handleLocationSearch}
                style={styles.searchButton}
                disabled={isSearching}
              />
            </View>
          </GlassCard>

          {isLoading && (
            <GlassCard style={styles.loadingCard}>
              <Text style={styles.loadingText}>Loading weather data...</Text>
            </GlassCard>
          )}

          {error && (
            <GlassCard style={styles.errorCard}>
              <Text style={styles.errorText}>Error: {error}</Text>
            </GlassCard>
          )}

          {weatherData && conditions && (
            <>
              {/* Current Weather Overview */}
              <GlassCard style={styles.overviewCard}>
                <LinearGradient
                  colors={getConditionColor(conditions.overall)}
                  style={styles.overviewGradient}
                >
                  <View style={styles.overviewHeader}>
                    <Text style={styles.overviewEmoji}>
                      {getConditionEmoji(conditions.overall)}
                    </Text>
                    <View style={styles.overviewText}>
                      <Text style={styles.overviewTitle}>
                        {weatherData.location.name}
                      </Text>
                      <Text style={styles.overviewSubtitle}>
                        {weatherData.current.condition.text}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.overviewStats}>
                    <View style={styles.stat}>
                      <Text style={styles.statValue}>{weatherData.current.temp_c}°C</Text>
                      <Text style={styles.statLabel}>Temperature</Text>
                    </View>
                    <View style={styles.stat}>
                      <Text style={styles.statValue}>{weatherData.current.humidity}%</Text>
                      <Text style={styles.statLabel}>Humidity</Text>
                    </View>
                    <View style={styles.stat}>
                      <Text style={styles.statValue}>{weatherData.current.wind_kph} km/h</Text>
                      <Text style={styles.statLabel}>Wind</Text>
                    </View>
                  </View>
                </LinearGradient>
              </GlassCard>

              {/* Overall Conditions */}
              <GlassCard style={styles.conditionsCard}>
                <Text style={styles.sectionTitle}>Climbing Conditions</Text>
                <View style={styles.overallConditions}>
                  <Text style={styles.overallEmoji}>
                    {getConditionEmoji(conditions.overall)}
                  </Text>
                  <Text style={styles.overallText}>
                    {conditions.overall.charAt(0).toUpperCase() + conditions.overall.slice(1)} Conditions
                  </Text>
                </View>
              </GlassCard>

              {/* Detailed Conditions */}
              <View style={styles.conditionsGrid}>
                <ConditionCard
                  title="Temperature"
                  condition={conditions.temperature}
                  icon="🌡️"
                />
                <ConditionCard
                  title="Wind"
                  condition={conditions.wind}
                  icon="💨"
                />
                <ConditionCard
                  title="Precipitation"
                  condition={conditions.precipitation}
                  icon="🌧️"
                />
                <ConditionCard
                  title="Visibility"
                  condition={conditions.visibility}
                  icon="👁️"
                />
                <ConditionCard
                  title="UV Index"
                  condition={conditions.uv}
                  icon="☀️"
                />
              </View>

              {/* Recommendations */}
              {conditions.recommendations.length > 0 && (
                <View style={styles.recommendationsSection}>
                  <Text style={styles.sectionTitle}>Recommendations</Text>
                  {conditions.recommendations.map((rec, index) => (
                    <RecommendationCard
                      key={index}
                      text={rec}
                      type="recommendation"
                    />
                  ))}
                </View>
              )}

              {/* Warnings */}
              {conditions.warnings.length > 0 && (
                <View style={styles.warningsSection}>
                  <Text style={styles.sectionTitle}>Warnings</Text>
                  {conditions.warnings.map((warning, index) => (
                    <RecommendationCard
                      key={index}
                      text={warning}
                      type="warning"
                    />
                  ))}
                </View>
              )}
            </>
          )}
        </Animated.View>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#e5e7eb',
    textAlign: 'center',
    marginTop: 5,
  },
  searchCard: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#ffffff',
    paddingHorizontal: 15,
  },
  searchButton: {
    width: 50,
    height: 50,
    marginLeft: 10,
  },
  loadingCard: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#ffffff',
  },
  errorCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#fca5a5',
  },
  overviewCard: {
    marginBottom: 20,
  },
  overviewGradient: {
    padding: 20,
    borderRadius: 20,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  overviewEmoji: {
    fontSize: 40,
    marginRight: 15,
  },
  overviewText: {
    flex: 1,
  },
  overviewTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  overviewSubtitle: {
    fontSize: 16,
    color: '#e5e7eb',
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    color: '#e5e7eb',
    marginTop: 2,
  },
  conditionsCard: {
    marginBottom: 20,
    alignItems: 'center',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  overallConditions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overallEmoji: {
    fontSize: 30,
    marginRight: 10,
  },
  overallText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  conditionsGrid: {
    marginBottom: 20,
  },
  conditionCard: {
    marginBottom: 15,
    padding: 15,
  },
  conditionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  conditionIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  conditionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  conditionDescription: {
    fontSize: 14,
    color: '#e5e7eb',
    marginBottom: 5,
  },
  conditionRecommendation: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  recommendationsSection: {
    marginBottom: 20,
  },
  warningsSection: {
    marginBottom: 20,
  },
  recommendationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 15,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 15,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  recommendationIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#e5e7eb',
  },
  warningText: {
    color: '#fca5a5',
  },
});

export default WeatherScreen; 