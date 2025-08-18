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

// Utility to map backend enum grade to user-friendly grade
function formatBackendGrade(grade: string, discipline: string) {
  if (!grade) return 'N/A';
  // Boulder grades are like 'V5', lead/top rope are like 'YDS_5_10A'
  if (discipline === 'BOULDER') return grade;
  if (grade.startsWith('YDS_')) {
    // Convert 'YDS_5_10A' to '5.10a'
    const match = grade.match(/YDS_(5_\d{1,2}[A-D]?)/);
    if (match) {
      return match[1].replace('_', '.').toLowerCase();
    }
  }
  return grade;
}

// Utility to prettify discipline names
function prettyDisciplineName(discipline: string) {
  switch (discipline) {
    case 'TOP_ROPE': return 'Top Rope';
    case 'BOULDER': return 'Boulder';
    case 'LEAD': return 'Lead';
    default: return discipline.charAt(0).toUpperCase() + discipline.slice(1).toLowerCase();
  }
}

// Utility to get the nearest valid grade string for a discipline
function getNearestValidGrade(avg: number, discipline: string) {
  if (typeof avg !== 'number' || isNaN(avg)) return 'N/A';
  if (discipline === 'BOULDER') {
    const rounded = Math.round(avg);
    if (rounded >= 0 && rounded <= 17) return `V${rounded}`;
    return 'N/A';
  }
  if (discipline === 'LEAD' || discipline === 'TOP_ROPE') {
    // YDS grades: 5.6, 5.7, ..., 5.15d
    const ydsGrades = [
      '5.6','5.7','5.8','5.9',
      '5.10a','5.10b','5.10c','5.10d',
      '5.11a','5.11b','5.11c','5.11d',
      '5.12a','5.12b','5.12c','5.12d',
      '5.13a','5.13b','5.13c','5.13d',
      '5.14a','5.14b','5.14c','5.14d',
      '5.15a','5.15b','5.15c','5.15d',
    ];
    // Map avg to index
    const min = 6; // 5.6
    const max = 15.75; // 5.15d
    const step = 0.25;
    let idx = Math.round((avg - min) / step);
    if (idx < 0) idx = 0;
    if (idx >= ydsGrades.length) idx = ydsGrades.length - 1;
    return ydsGrades[idx];
  }
  return 'N/A';
}

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
        dispatch(fetchAllAnalytics(undefined))
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

  // Determine most common discipline for average difficulty
  const mostCommonDiscipline = stats && stats.sessionsByDiscipline
    ? (Object.entries(stats.sessionsByDiscipline).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] as keyof typeof ClimbingDiscipline)
    : 'LEAD';

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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.periodSelectorBarPolished}
          >
            {periodOptions.map((option, idx) => {
              const isActive = selectedPeriod === option.value || (!selectedPeriod && !option.value);
              return (
              <TouchableOpacity
                key={option.label}
                activeOpacity={0.85}
                  style={[
                    styles.periodButtonPolished,
                    isActive && styles.periodButtonPolishedActive,
                    idx !== periodOptions.length - 1 && { marginRight: 16 },
                  ]}
                onPress={() => handlePeriodChange(option.value as PeriodType)}
              >
                  <Text style={[
                    styles.periodButtonPolishedText,
                    isActive && styles.periodButtonPolishedTextActive,
                  ]}>
                    {option.label}
                  </Text>
              </TouchableOpacity>
              );
            })}
          </ScrollView>
        </GlassCard>

        {/* Key Stats */}
        <View style={styles.statsGridCompact}>
          <GlassCard style={styles.statCardCompact}>
            <Text style={styles.statValueCompact} numberOfLines={1} ellipsizeMode="tail" adjustsFontSizeToFit>{formatNumber(stats?.totalSessions ?? 0)}</Text>
            <Text style={styles.statLabelCompact}>Total Sessions</Text>
          </GlassCard>
          <GlassCard style={styles.statCardCompact}>
            <Text style={styles.statValueCompact} numberOfLines={1} ellipsizeMode="tail" adjustsFontSizeToFit>{
              stats && typeof stats.averageDifficulty === 'number'
                ? getNearestValidGrade(stats.averageDifficulty, mostCommonDiscipline)
                : '-'
            }</Text>
            <Text style={styles.statLabelCompact}>Avg Grade</Text>
          </GlassCard>
          <GlassCard style={styles.statCardCompact}>
            <Text style={styles.statValueCompact} numberOfLines={1} ellipsizeMode="tail" adjustsFontSizeToFit>{(stats?.sentPercentage ?? 0).toFixed(1)}%</Text>
            <Text style={styles.statLabelCompact}>Sent %</Text>
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
                      <Text style={[styles.disciplineName, { flexShrink: 1 }]}>{prettyDisciplineName(discipline)}</Text>
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

        {/* Highest Grades (backend) */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Highest Grades by Discipline</Text>
          <View style={styles.personalBests}>
            {highestGrades && ((Array.isArray(highestGrades) && highestGrades.length > 0) || (typeof highestGrades === 'object' && Object.keys(highestGrades).length > 0)) ? (
              Array.isArray(highestGrades)
                ? highestGrades.map((grade: any, index: number) => (
                    <View key={index} style={styles.bestItem}>
                      <Text style={styles.bestLabel}>{prettyDisciplineName(grade.discipline)}</Text>
                      <Text style={[styles.bestValue, { color: getGradeColor(formatBackendGrade(grade.grade, grade.discipline)) }]}>{formatBackendGrade(grade.grade, grade.discipline)}</Text>
                    </View>
                  ))
                : Object.entries(highestGrades).map(([discipline, grade], index) => (
                <View key={index} style={styles.bestItem}>
                      <Text style={styles.bestLabel}>{prettyDisciplineName(discipline)}</Text>
                      <Text style={[styles.bestValue, { color: getGradeColor(formatBackendGrade(grade as string, discipline)) }]}>{formatBackendGrade(grade as string, discipline)}</Text>
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
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
            {stats && stats.averageDifficultyByDiscipline && Object.keys(stats.averageDifficultyByDiscipline).length > 0 ? (
              Object.entries(stats.averageDifficultyByDiscipline).map(([discipline, avgGrade], index) => (
                <View key={index} style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={[styles.sessionStatValue, { marginBottom: 2 }]}> 
                    {getNearestValidGrade(avgGrade as number, discipline)}
                  </Text>
                  <Text style={styles.sessionStatLabel}>{prettyDisciplineName(discipline)}</Text>
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
  periodSelectorBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
    paddingHorizontal: 2,
  },
  periodButtonModern: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
    minHeight: 36,
  },
  periodButtonModernActive: {
    backgroundColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  periodButtonModernText: {
    color: '#CCCCCC',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  periodButtonModernTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  periodSelectorBarPolished: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // was 'space-between'
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 4,
  },
  periodButtonPolished: {
    paddingVertical: 8, // reduced from 12
    paddingHorizontal: 14, // reduced from 22
    borderRadius: 18, // reduced from 22
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60, // reduced from 80
    minHeight: 32, // reduced from 40
    borderWidth: 1,
    borderColor: 'transparent',
  },
  periodButtonPolishedActive: {
    backgroundColor: '#6366f1',
    borderColor: '#fff',
    borderWidth: 1.5,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ scale: 1.07 }],
  },
  periodButtonPolishedText: {
    color: '#CCCCCC',
    fontSize: 13, // reduced from 16
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  periodButtonPolishedTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statsGridPolished: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 28,
    marginTop: 8,
  },
  statCardPolished: {
    width: '30%',
    minWidth: 100,
    maxWidth: 160,
    paddingVertical: 24,
    paddingHorizontal: 10,
    marginBottom: 18,
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.10)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  statValuePolished: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  statLabelPolished: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  statsGridCompact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 8,
  },
  statCardCompact: {
    flex: 1,
    minWidth: 90,
    maxWidth: 170, // increased from 140
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginHorizontal: 8,
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.10)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statValueCompact: {
    fontSize: 16, // reduced from 20
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
    textAlign: 'center',
  },
  statLabelCompact: {
    fontSize: 10,
    color: '#CCCCCC',
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.1,
    marginTop: 2,
    lineHeight: 13,
  },
});
