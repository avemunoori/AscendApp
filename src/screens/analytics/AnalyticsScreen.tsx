import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllAnalytics } from '../../store/analyticsSlice';
import GradientBackground from '../../components/GradientBackground';
import GlassCard from '../../components/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const AnalyticsScreen = () => {
  const dispatch = useAppDispatch();
  const { analytics, statsOverview, isLoading } = useAppSelector((state) => state.analytics);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchAllAnalytics());
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
    ]).start();
  }, [dispatch, isAuthenticated]);

  const StatCard = ({ title, value, subtitle, colors }: {
    title: string;
    value: string | number;
    subtitle?: string;
    colors: [string, string];
  }) => (
    <GlassCard style={styles.statCard}>
      <LinearGradient colors={colors} style={styles.statGradient}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statValue}>{value}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </LinearGradient>
    </GlassCard>
  );

  const ProgressBar = ({ label, value, maxValue, color }: {
    label: string;
    value: number;
    maxValue: number;
    color: string;
  }) => {
    const progress = (value / maxValue) * 100;
    
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>{label}</Text>
          <Text style={styles.progressValue}>{value}/{maxValue}</Text>
        </View>
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
                backgroundColor: color,
              },
            ]}
          />
        </View>
      </View>
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
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Analytics Dashboard</Text>
            <Text style={styles.subtitle}>Track your climbing progress</Text>
          </View>

          {/* Stats Overview */}
          {statsOverview && (
            <View style={styles.statsGrid}>
              <StatCard
                title="Total Sessions"
                value={statsOverview.totalSessions}
                colors={['#6366f1', '#4f46e5']}
              />
              <StatCard
                title="Sent Rate"
                value={`${statsOverview.sentPercentage.toFixed(1)}%`}
                colors={['#10b981', '#059669']}
              />
              <StatCard
                title="Avg Difficulty"
                value={statsOverview.averageDifficulty.toFixed(1)}
                colors={['#f59e0b', '#d97706']}
              />
              <StatCard
                title="Bouldering"
                value={statsOverview.sessionsByDiscipline?.BOULDER || 0}
                colors={['#ef4444', '#dc2626']}
              />
            </View>
          )}

          {/* Session Analytics */}
          {analytics && (
            <GlassCard style={styles.analyticsCard}>
              <Text style={styles.cardTitle}>Session Overview</Text>
              
              <View style={styles.analyticsGrid}>
                <View style={styles.analyticsItem}>
                  <Text style={styles.analyticsLabel}>Sent Rate</Text>
                  <Text style={styles.analyticsValue}>
                    {analytics.sentPercentage.toFixed(1)}%
                  </Text>
                </View>
                
                <View style={styles.analyticsItem}>
                  <Text style={styles.analyticsLabel}>Avg Difficulty</Text>
                  <Text style={styles.analyticsValue}>
                    {analytics.averageDifficulty.toFixed(1)}
                  </Text>
                </View>
              </View>

              <ProgressBar
                label="Sent Sessions"
                value={Math.round(analytics.totalSessions * analytics.sentPercentage / 100)}
                maxValue={analytics.totalSessions}
                color="#10b981"
              />
              
              <ProgressBar
                label="Bouldering Sessions"
                value={analytics.sessionsByDiscipline?.BOULDER || 0}
                maxValue={analytics.totalSessions}
                color="#6366f1"
              />
            </GlassCard>
          )}

          {/* Quick Stats */}
          <GlassCard style={styles.quickStatsCard}>
            <Text style={styles.cardTitle}>Quick Stats</Text>
            
            <View style={styles.quickStatsGrid}>
              <View style={styles.quickStat}>
                <Icon name="fitness-center" size={24} color="#6366f1" />
                <Text style={styles.quickStatLabel}>Bouldering</Text>
                <Text style={styles.quickStatValue}>12 sessions</Text>
              </View>
              
              <View style={styles.quickStat}>
                <Icon name="trending-up" size={24} color="#10b981" />
                <Text style={styles.quickStatLabel}>Lead</Text>
                <Text style={styles.quickStatValue}>8 sessions</Text>
              </View>
              
              <View style={styles.quickStat}>
                <Icon name="flag" size={24} color="#f59e0b" />
                <Text style={styles.quickStatLabel}>Top Rope</Text>
                <Text style={styles.quickStatValue}>5 sessions</Text>
              </View>
            </View>
          </GlassCard>

          {/* Motivation Card */}
          <GlassCard style={styles.motivationCard}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.motivationGradient}
            >
              <Text style={styles.motivationTitle}>Keep Climbing!</Text>
              <Text style={styles.motivationText}>
                Every session brings you closer to your goals. Stay consistent and watch your progress soar!
              </Text>
            </LinearGradient>
          </GlassCard>
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
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
  },
  statGradient: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  analyticsCard: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  analyticsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  analyticsItem: {
    alignItems: 'center',
  },
  analyticsLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    marginBottom: 4,
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  progressValue: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  quickStatsCard: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  quickStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickStat: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  quickStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickStatValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
  },
  motivationCard: {
    marginBottom: 20,
  },
  motivationGradient: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  motivationTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  motivationText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default AnalyticsScreen; 