import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  fetchUserTrainingPlan,
  pauseTrainingPlan,
  resumeTrainingPlan,
  completeTrainingSession
} from '../../store/trainingSlice';
import { 
  UserTrainingPlan,
  TrainingDifficulty, 
  TrainingFocus, 
  UserTrainingWeek, 
  UserTrainingSession,
  TrainingPlanStatus
} from '../../types';
import GradientBackground from '../../components/GradientBackground';
import GlassCard from '../../components/GlassCard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

const TrainingPlanDetailScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { planId } = route.params as { planId: string };
  
  const [plan, setPlan] = useState<UserTrainingPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlanDetails();
  }, [planId]);

  const loadPlanDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const planData = await dispatch(fetchUserTrainingPlan(planId)).unwrap();
      setPlan(planData);
    } catch (error: any) {
      setError(error.message || 'Failed to load plan details');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePausePlan = async () => {
    if (!plan) return;
    
    Alert.alert(
      'Pause Training Plan',
      'Are you sure you want to pause this training plan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pause',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(pauseTrainingPlan(plan.id)).unwrap();
              Alert.alert('Success', 'Training plan paused');
              loadPlanDetails(); // Refresh plan data
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to pause training plan');
            }
          },
        },
      ]
    );
  };

  const handleResumePlan = async () => {
    if (!plan) return;
    
    try {
      await dispatch(resumeTrainingPlan(plan.id)).unwrap();
      Alert.alert('Success', 'Training plan resumed');
      loadPlanDetails(); // Refresh plan data
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resume training plan');
    }
  };

  const handleCompleteSession = async (session: UserTrainingSession) => {
    if (!plan) return;
    
    Alert.alert(
      'Complete Session',
      `Mark "${session.title}" as completed?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            try {
              await dispatch(completeTrainingSession({ 
                planId: plan.id, 
                sessionId: session.id 
              })).unwrap();
              Alert.alert('Success', 'Session completed!');
              loadPlanDetails(); // Refresh plan data
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to complete session');
            }
          },
        },
      ]
    );
  };

  const getDifficultyColor = (difficulty: TrainingDifficulty) => {
    switch (difficulty) {
      case TrainingDifficulty.BEGINNER:
        return '#4CAF50';
      case TrainingDifficulty.INTERMEDIATE:
        return '#FF9800';
      case TrainingDifficulty.ADVANCED:
        return '#F44336';
      default:
        return '#607D8B';
    }
  };

  const getStatusColor = (status: TrainingPlanStatus) => {
    switch (status) {
      case TrainingPlanStatus.ACTIVE:
        return '#4CAF50';
      case TrainingPlanStatus.PAUSED:
        return '#FF9800';
      case TrainingPlanStatus.COMPLETED:
        return '#2196F3';
      case TrainingPlanStatus.ABANDONED:
        return '#F44336';
      default:
        return '#607D8B';
    }
  };

  const getFocusIcon = (focus: TrainingFocus) => {
    switch (focus) {
      case TrainingFocus.STRENGTH:
        return 'fitness-center';
      case TrainingFocus.ENDURANCE:
        return 'timer';
      case TrainingFocus.TECHNIQUE:
        return 'gesture';
      case TrainingFocus.MENTAL_GAME:
        return 'psychology';
      case TrainingFocus.LEAD_CLIMBING:
        return 'vertical-align-top';
      case TrainingFocus.BOULDERING:
        return 'crop-square';
      default:
        return 'star';
    }
  };

  const getFocusColor = (focus: TrainingFocus) => {
    switch (focus) {
      case TrainingFocus.STRENGTH:
        return '#FF5722';
      case TrainingFocus.ENDURANCE:
        return '#2196F3';
      case TrainingFocus.TECHNIQUE:
        return '#4CAF50';
      case TrainingFocus.MENTAL_GAME:
        return '#9C27B0';
      case TrainingFocus.LEAD_CLIMBING:
        return '#3F51B5';
      case TrainingFocus.BOULDERING:
        return '#FF9800';
      default:
        return '#607D8B';
    }
  };

  if (isLoading) {
    return (
      <GradientBackground>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#764ba2" />
        </View>
      </GradientBackground>
    );
  }

  if (error || !plan) {
    return (
      <GradientBackground>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color="#22223b" />
            </TouchableOpacity>
            <Text style={styles.title}>Plan Details</Text>
          </View>
          
          <GlassCard style={styles.errorState}>
            <Icon name="error" size={48} color="#F44336" style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>Error Loading Plan</Text>
            <Text style={styles.emptyText}>
              {error || 'Plan not found'}
            </Text>
          </GlassCard>
        </ScrollView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#22223b" />
          </TouchableOpacity>
          <Text style={styles.title}>{plan.name}</Text>
        </View>

        {/* Plan Overview */}
        <GlassCard style={styles.planOverview}>
          <Text style={styles.planDescription}>{plan.description}</Text>
          
          <View style={styles.planMeta}>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(plan.difficulty) }]}>
              <Text style={styles.difficultyText}>{plan.difficulty}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(plan.status) }]}>
              <Text style={styles.statusText}>{plan.status}</Text>
            </View>
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{plan.duration} weeks</Text>
            </View>
          </View>

          {/* Progress Section */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>Progress</Text>
              <Text style={styles.progressPercentage}>{plan.progress}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${plan.progress}%` },
                ]}
              />
            </View>
            <Text style={styles.progressDetails}>
              Week {plan.currentWeek} of {plan.duration} • Session {plan.currentSession}
            </Text>
          </View>

          {/* Plan Actions */}
          <View style={styles.planActions}>
            {plan.status === TrainingPlanStatus.ACTIVE && (
              <TouchableOpacity style={styles.pauseButton} onPress={handlePausePlan}>
                <Icon name="pause" size={20} color="#fff" />
                <Text style={styles.pauseButtonText}>Pause Plan</Text>
              </TouchableOpacity>
            )}
            {plan.status === TrainingPlanStatus.PAUSED && (
              <TouchableOpacity style={styles.resumeButton} onPress={handleResumePlan}>
                <Icon name="play-arrow" size={20} color="#fff" />
                <Text style={styles.resumeButtonText}>Resume Plan</Text>
              </TouchableOpacity>
            )}
          </View>
        </GlassCard>

        {/* Focus Areas */}
        <GlassCard style={styles.focusCard}>
          <Text style={styles.sectionTitle}>Focus Areas</Text>
          <View style={styles.focusIcons}>
            {Array.isArray(plan.focus) && plan.focus.map((focus, index) => (
              <View key={index} style={styles.focusIconContainer}>
                <Icon
                  name={getFocusIcon(focus)}
                  size={20}
                  color={getFocusColor(focus)}
                />
                <Text style={styles.focusText}>{focus}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Training Weeks */}
        {plan.weeks && plan.weeks.length > 0 && (
          <Text style={styles.sectionTitle}>Training Schedule</Text>
        )}
        
        {plan.weeks && plan.weeks.map((week) => (
          <GlassCard key={week.id} style={styles.weekCard}>
            <View style={styles.weekHeader}>
              <Text style={styles.weekTitle}>Week {week.weekNumber}</Text>
              <View style={styles.weekStatus}>
                {week.isCompleted ? (
                  <Icon name="check-circle" size={20} color="#4CAF50" />
                ) : (
                  <Icon name="schedule" size={20} color="#FF9800" />
                )}
              </View>
            </View>

            {week.sessions.map((session) => (
              <View key={session.id} style={styles.sessionCard}>
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionTitle}>{session.title}</Text>
                    <Text style={styles.sessionDescription}>{session.description}</Text>
                    <Text style={styles.sessionDuration}>{session.duration} minutes</Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.completeButton,
                      session.isCompleted && styles.completedButton,
                    ]}
                    onPress={() => handleCompleteSession(session)}
                    disabled={session.isCompleted || plan.status !== TrainingPlanStatus.ACTIVE}
                  >
                    <Icon 
                      name={session.isCompleted ? "check-circle" : "play-arrow"} 
                      size={20} 
                      color="#fff" 
                    />
                    <Text style={styles.completeButtonText}>
                      {session.isCompleted ? 'Completed' : 'Complete'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </GlassCard>
        ))}

        {/* Plan Info */}
        <GlassCard style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Plan Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Start Date:</Text>
            <Text style={styles.infoValue}>{new Date(plan.startDate).toLocaleDateString()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>End Date:</Text>
            <Text style={styles.infoValue}>{new Date(plan.endDate).toLocaleDateString()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Created:</Text>
            <Text style={styles.infoValue}>{new Date(plan.createdAt).toLocaleDateString()}</Text>
          </View>
        </GlassCard>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22223b',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#22223b',
    marginBottom: 12,
  },
  planOverview: {
    marginBottom: 20,
    padding: 20,
  },
  planDescription: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 12,
  },
  planMeta: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  durationBadge: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#22223b',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressDetails: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  planActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  pauseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9800',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pauseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  resumeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  resumeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  focusCard: {
    marginBottom: 20,
    padding: 20,
  },
  focusIcons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  focusIconContainer: {
    alignItems: 'center',
    minWidth: 60,
  },
  focusText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  weekCard: {
    marginBottom: 16,
    padding: 20,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22223b',
  },
  weekStatus: {
    // Icon styling handled inline
  },
  sessionCard: {
    marginBottom: 8,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22223b',
    marginBottom: 2,
  },
  sessionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  sessionDuration: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#764ba2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  completedButton: {
    backgroundColor: '#4CAF50',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  infoCard: {
    marginBottom: 20,
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#22223b',
  },
  errorState: {
    alignItems: 'center',
    padding: 40,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#22223b',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TrainingPlanDetailScreen; 