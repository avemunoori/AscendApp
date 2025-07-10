import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllAnalytics } from '../../store/analyticsSlice';
import GlassCard from '../../components/GlassCard';
import GradientBackground from '../../components/GradientBackground';
import LoadingScreen from '../../components/LoadingScreen';

const { width } = Dimensions.get('window');

export const AnalyticsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { analytics, statsOverview, progressAnalytics, highestGrades, isLoading, error } = useAppSelector((state) => state.analytics);
  const { user } = useAppSelector((state) => state.auth);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAllAnalytics());
    }
  }, [dispatch, user?.id]);

  const handlePeriodChange = (period: 'week' | 'month' | 'year') => {
    setSelectedPeriod(period);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const getGradeColor = (grade: string): string => {
    const gradeColors: { [key: string]: string } = {
      '5.6': '#4CAF50',
      '5.7': '#8BC34A',
      '5.8': '#CDDC39',
      '5.9': '#FFEB3B',
      '5.10a': '#FF9800',
      '5.10b': '#FF9800',
      '5.10c': '#FF9800',
      '5.10d': '#FF9800',
      '5.11a': '#F44336',
      '5.11b': '#F44336',
      '5.11c': '#F44336',
      '5.11d': '#F44336',
      '5.12a': '#9C27B0',
      '5.12b': '#9C27B0',
      '5.12c': '#9C27B0',
      '5.12d': '#9C27B0',
      '5.13a': '#3F51B5',
      '5.13b': '#3F51B5',
      '5.13c': '#3F51B5',
      '5.13d': '#3F51B5',
      '5.14a': '#000000',
      '5.14b': '#000000',
      '5.14c': '#000000',
      '5.14d': '#000000',
    };
    return gradeColors[grade] || '#666666';
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <GlassCard style={styles.errorCard}>
            <Text style={styles.errorText}>Error loading analytics: {error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => user?.id && dispatch(fetchAllAnalytics())}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </GlassCard>
        </View>
      </GradientBackground>
    );
  }

  if (!analytics && !statsOverview) {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <GlassCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>No analytics data available</Text>
          </GlassCard>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Track your climbing progress</Text>
        </View>

        {/* Period Selector */}
        <GlassCard style={styles.periodCard}>
          <View style={styles.periodSelector}>
            {(['week', 'month', 'year'] as const).map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive,
                ]}
                onPress={() => handlePeriodChange(period)}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    selectedPeriod === period && styles.periodButtonTextActive,
                  ]}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {/* Key Stats */}
        <View style={styles.statsGrid}>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statValue}>{formatNumber(statsOverview?.totalSessions || analytics?.totalSessions || 0)}</Text>
            <Text style={styles.statLabel}>Total Sessions</Text>
          </GlassCard>
          
          <GlassCard style={styles.statCard}>
            <Text style={styles.statValue}>{(statsOverview?.averageDifficulty || analytics?.averageDifficulty || 0).toFixed(1)}</Text>
            <Text style={styles.statLabel}>Avg Difficulty</Text>
          </GlassCard>
          
          <GlassCard style={styles.statCard}>
            <Text style={styles.statValue}>{(statsOverview?.sentPercentage || analytics?.sentPercentage || 0).toFixed(1)}%</Text>
            <Text style={styles.statLabel}>Sent %</Text>
          </GlassCard>
          
          <GlassCard style={styles.statCard}>
            <Text style={styles.statValue}>{progressAnalytics.length > 0 ? progressAnalytics[progressAnalytics.length - 1].averageGrade.toFixed(1) : '-'}</Text>
            <Text style={styles.statLabel}>Latest Avg Grade</Text>
          </GlassCard>
        </View>

        {/* Discipline Breakdown */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Discipline Breakdown</Text>
          <View style={styles.disciplineList}>
            {statsOverview?.sessionsByDiscipline && Object.keys(statsOverview.sessionsByDiscipline).length > 0 ? (
              Object.entries(statsOverview.sessionsByDiscipline).map(([discipline, count], index) => (
                <View key={index} style={styles.disciplineItem}>
                  <View style={styles.disciplineInfo}>
                    <Text style={styles.disciplineName}>{discipline}</Text>
                    <Text style={styles.disciplineCount}>{count as number} sessions</Text>
                  </View>
                  <View style={styles.disciplineBar}>
                    <View
                      style={[
                        styles.disciplineBarFill,
                        {
                          width: `${((count as number) / Math.max(...Object.values(statsOverview.sessionsByDiscipline).map(v => v as number))) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No discipline data available</Text>
            )}
          </View>
        </GlassCard>

        {/* Highest Grades */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Highest Grades by Discipline</Text>
          <View style={styles.personalBests}>
            {highestGrades && highestGrades.length > 0 ? (
              highestGrades.map((grade: any, index: number) => (
                <View key={index} style={styles.bestItem}>
                  <Text style={styles.bestLabel}>{grade.discipline}</Text>
                  <Text style={[styles.bestValue, { color: getGradeColor(grade.grade) }]}>
                    {grade.grade}
                  </Text>
                  <Text style={styles.bestDate}>{grade.count} routes</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No grade data available</Text>
            )}
          </View>
        </GlassCard>

        {/* Weekly Activity */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.weeklyActivity}>
            {progressAnalytics && progressAnalytics.length > 0 ? (
              progressAnalytics.slice(-8).map((week, index) => (
                <View key={index} style={styles.weekItem}>
                  <Text style={styles.weekLabel}>{new Date(week.date).toLocaleDateString()}</Text>
                  <Text style={styles.weekCount}>{week.sessions} sessions</Text>
                  <Text style={styles.weekRoutes}>{week.completed} completed</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No activity data available</Text>
            )}
          </View>
        </GlassCard>

        {/* Average Grades by Discipline */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Average Grades by Discipline</Text>
          <View style={styles.sessionStats}>
            {statsOverview?.averageDifficultyByDiscipline && Object.keys(statsOverview.averageDifficultyByDiscipline).length > 0 ? (
              Object.entries(statsOverview.averageDifficultyByDiscipline).map(([discipline, avgGrade], index) => (
                <View key={index} style={styles.sessionStat}>
                  <Text style={styles.sessionStatValue}>{avgGrade.toFixed(1)}</Text>
                  <Text style={styles.sessionStatLabel}>{discipline}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No average grade data available</Text>
            )}
          </View>
        </GlassCard>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  periodCard: {
    marginBottom: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  periodButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  periodButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  periodButtonText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontWeight: '600',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: (width - 48) / 2,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  sectionCard: {
    marginBottom: 20,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  disciplineList: {
    gap: 12,
  },
  disciplineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disciplineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  disciplineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 12,
    minWidth: 80,
  },
  disciplineCount: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  disciplineBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    flex: 1,
    marginLeft: 12,
  },
  disciplineBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  personalBests: {
    gap: 12,
  },
  bestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  bestLabel: {
    fontSize: 14,
    color: '#CCCCCC',
    flex: 1,
  },
  bestValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 12,
  },
  bestDate: {
    fontSize: 12,
    color: '#999999',
  },
  weeklyActivity: {
    gap: 8,
  },
  weekItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  weekLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  weekCount: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  weekRoutes: {
    fontSize: 14,
    color: '#999999',
  },
  sessionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sessionStat: {
    alignItems: 'center',
  },
  sessionStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sessionStatLabel: {
    fontSize: 12,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  errorCard: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyCard: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#CCCCCC',
    fontSize: 16,
    textAlign: 'center',
  },
}); 