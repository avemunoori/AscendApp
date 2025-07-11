import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAllAnalytics } from "../../store/analyticsSlice";
import GlassCard from "../../components/GlassCard";
import GradientBackground from "../../components/GradientBackground";
import LoadingScreen from "../../components/LoadingScreen";
import { LinearGradient } from "expo-linear-gradient";
import { Animated } from "react-native";
import { isSameISOWeek, isSameMonth, isSameYear } from "date-fns";
import { parseISO } from "date-fns/parseISO";
import type { ClimbingSession } from "../../types";
import { gradeUtils } from '../../services/api';
import { ClimbingDiscipline } from '../../types';

const { width } = Dimensions.get("window");

type PeriodType = 'week' | 'month' | 'year' | undefined;

const periodOptions = [
  { label: 'All Time', value: undefined },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'This Year', value: 'year' },
];

export const AnalyticsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    statsOverview,
    progressAnalytics,
    highestGrades,
    isLoading,
    error,
  } = useAppSelector((state) => state.analytics);
  const { user } = useAppSelector((state) => state.auth);
  const { sessions } = useAppSelector((state) => state.sessions);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>(undefined); // undefined = all time
  const [loading, setLoading] = useState(false);

  // Calculate longest climbing streak (frontend only)
  function getLongestStreak(sessions: { date: string }[]): number {
    if (!sessions || sessions.length === 0) return 0;
    const uniqueDates: string[] = Array.from(new Set(sessions.map((s: { date: string }) => s.date.split("T")[0])));
    uniqueDates.sort();
    let longest: number = 1;
    let current: number = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const prev: Date = new Date(uniqueDates[i - 1]);
      const curr: Date = new Date(uniqueDates[i]);
      const diff: number = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 1;
      }
    }
    return longest;
  }
  const longestStreak: number = getLongestStreak(sessions);

  // Fetch analytics with period param
  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      if (selectedPeriod === 'week' || selectedPeriod === 'month' || selectedPeriod === 'year') {
        dispatch(fetchAllAnalytics({ period: selectedPeriod }))
          .finally(() => setLoading(false));
      } else {
        dispatch(fetchAllAnalytics())
          .finally(() => setLoading(false));
      }
    }
  }, [dispatch, user?.id, selectedPeriod]);

  const handlePeriodChange = (period: PeriodType) => {
    setSelectedPeriod(period);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  const getGradeColor = (grade: string): string => {
    const gradeColors: { [key: string]: string } = {
      "5.6": "#4CAF50",
      "5.7": "#8BC34A",
      "5.8": "#CDDC39",
      "5.9": "#FFEB3B",
      "5.10a": "#FF9800",
      "5.10b": "#FF9800",
      "5.10c": "#FF9800",
      "5.10d": "#FF9800",
      "5.11a": "#F44336",
      "5.11b": "#F44336",
      "5.11c": "#F44336",
      "5.11d": "#F44336",
      "5.12a": "#9C27B0",
      "5.12b": "#9C27B0",
      "5.12c": "#9C27B0",
      "5.12d": "#9C27B0",
      "5.13a": "#3F51B5",
      "5.13b": "#3F51B5",
      "5.13c": "#3F51B5",
      "5.13d": "#3F51B5",
      "5.14a": "#000000",
      "5.14b": "#000000",
      "5.14c": "#000000",
      "5.14d": "#000000",
    };
    return gradeColors[grade] || "#666666";
  };

  const stats = statsOverview;

  if (loading || isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <GlassCard style={styles.errorCard}>
            <Text style={styles.errorText}>
              Error loading analytics: {error}
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => user?.id && handlePeriodChange(selectedPeriod)}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </GlassCard>
        </View>
      </GradientBackground>
    );
  }

  if (!stats) {
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
          <View style={[styles.periodSelector, { justifyContent: 'space-between' }]}> 
            {periodOptions.map((option) => (
              <TouchableOpacity
                key={option.label}
                activeOpacity={0.85}
                style={{
                  marginRight: 10,
                  borderRadius: 18,
                  backgroundColor: selectedPeriod === option.value || (!selectedPeriod && !option.value) ? '#6366f1' : 'rgba(255,255,255,0.08)',
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => handlePeriodChange(option.value as PeriodType)}
              >
                <Text style={{
                  color: selectedPeriod === option.value || (!selectedPeriod && !option.value) ? '#fff' : '#CCCCCC',
                  fontWeight: selectedPeriod === option.value || (!selectedPeriod && !option.value) ? 'bold' : '600',
                  fontSize: 13,
                  letterSpacing: 0.5,
                }}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {/* Key Stats */}
        <View style={styles.statsGrid}>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statValue}>{formatNumber(stats?.totalSessions ?? 0)}</Text>
            <Text style={styles.statLabel}>Total Sessions</Text>
          </GlassCard>

          <GlassCard style={styles.statCard}>
            <Text style={styles.statValue}>{stats ? gradeUtils.getGradeString(stats.averageDifficulty, ClimbingDiscipline.BOULDER) : '-'}</Text>
            <Text style={styles.statLabel}>Avg Difficulty</Text>
          </GlassCard>

          <GlassCard style={styles.statCard}>
            <Text style={styles.statValue}>{(stats?.sentPercentage ?? 0).toFixed(1)}%</Text>
            <Text style={styles.statLabel}>Sent %</Text>
          </GlassCard>
        </View>

        {/* Longest Climbing Streak (still frontend) */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Longest Climbing Streak</Text>
          <View style={{ alignItems: 'center', paddingVertical: 8 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#fff' }}>{longestStreak} {longestStreak === 1 ? 'day' : 'days'}</Text>
            <Text style={{ color: '#ccc', fontSize: 14 }}>Most consecutive days with a session</Text>
          </View>
        </GlassCard>

        {/* Discipline Breakdown */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Discipline Breakdown</Text>
          <View style={styles.disciplineList}>
            {stats && stats.sessionsByDiscipline && Object.keys(stats.sessionsByDiscipline).length > 0 ? (
              Object.entries(stats.sessionsByDiscipline).map(([discipline, count], index) => {
                const disciplineColors: Record<string, string> = {
                  BOULDER: '#4CAF50',
                  LEAD: '#2196F3',
                  'TOP ROPE': '#FF9800',
                  SPEED: '#9C27B0',
                  OTHER: '#607D8B',
                };
                const barColor = disciplineColors[discipline.toUpperCase()] || '#4CAF50';
                const maxCount = Math.max(...Object.values(stats.sessionsByDiscipline).map(v => v as number));
                return (
                  <View key={index} style={[styles.disciplineItem, { flexDirection: 'column', alignItems: 'flex-start', marginBottom: 12 }]}> 
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                      <Text style={[styles.disciplineName, { flexShrink: 1 }]}>{discipline}</Text>
                      <Text style={styles.disciplineCount}>{count} {count === 1 ? 'session' : 'sessions'}</Text>
                    </View>
                    <View style={[styles.disciplineBar, { width: '100%', marginTop: 6 }]}> 
                      <View
                        style={[
                          styles.disciplineBarFill,
                          {
                            width: `${((count as number) / maxCount) * 100}%`,
                            backgroundColor: barColor,
                          },
                        ]}
                      />
                    </View>
                  </View>
                );
              })
            ) : (
              <Text style={styles.emptyText}>No discipline data available</Text>
            )}
          </View>
        </GlassCard>

        {/* Highest Grades (still backend) */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Highest Grades by Discipline</Text>
          <View style={styles.personalBests}>
            {highestGrades && highestGrades.length > 0 ? (
              highestGrades.map((grade: any, index: number) => (
                <View key={index} style={styles.bestItem}>
                  <Text style={styles.bestLabel}>{grade.discipline}</Text>
                  <Text style={[styles.bestValue, { color: getGradeColor(grade.grade) }]}>{grade.grade}</Text>
                  <Text style={styles.bestDate}>{grade.count} routes</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No grade data available</Text>
            )}
          </View>
        </GlassCard>

        {/* Average Grades by Discipline (backend) */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Average Grades by Discipline</Text>
          <View style={styles.sessionStats}>
            {stats && stats.averageDifficultyByDiscipline && Object.keys(stats.averageDifficultyByDiscipline).length > 0 ? (
              Object.entries(stats.averageDifficultyByDiscipline).map(([discipline, avgGrade], index) => (
                <View key={index} style={styles.sessionStat}>
                  <Text style={styles.sessionStatValue}>{gradeUtils.getGradeString(avgGrade as number, discipline as any)}</Text>
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
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#CCCCCC",
  },
  periodCard: {
    marginBottom: 20,
  },
  periodSelector: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  periodButtonWrapper: {
    marginRight: 10,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  periodButtonActiveGradient: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 18,
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  periodButtonText: {
    color: "#CCCCCC",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  periodButtonTextActive: {
    color: "#fff",
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.12)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    width: (width - 48) / 2,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#CCCCCC",
    textAlign: "center",
  },
  sectionCard: {
    marginBottom: 20,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  disciplineList: {
    gap: 12,
  },
  disciplineItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  disciplineInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  disciplineName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginRight: 12,
    minWidth: 80,
  },
  disciplineCount: {
    fontSize: 14,
    color: "#CCCCCC",
  },
  disciplineBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    flex: 1,
    marginLeft: 12,
  },
  disciplineBarFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
  personalBests: {
    gap: 12,
  },
  bestItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  bestLabel: {
    fontSize: 14,
    color: "#CCCCCC",
    flex: 1,
  },
  bestValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 12,
  },
  bestDate: {
    fontSize: 12,
    color: "#999999",
  },
  weeklyActivity: {
    gap: 8,
  },
  weekItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  weekLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  weekCount: {
    fontSize: 14,
    color: "#CCCCCC",
  },
  weekRoutes: {
    fontSize: 14,
    color: "#999999",
  },
  sessionStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  sessionStat: {
    alignItems: "center",
  },
  sessionStatValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  sessionStatLabel: {
    fontSize: 12,
    color: "#CCCCCC",
    textAlign: "center",
  },
  errorCard: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyCard: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#CCCCCC",
    fontSize: 16,
    textAlign: "center",
  },
});
