import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  fetchTrainingTemplates
} from '../../store/trainingSlice';
import { 
  TrainingPlanTemplate, 
  TrainingDifficulty, 
  TrainingFocus
} from '../../types';
import GradientBackground from '../../components/GradientBackground';
import GlassCard from '../../components/GlassCard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// Exercise type definition
interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes: string;
}

// Static exercise data for each training plan
const staticExercises: Record<string, Exercise[]> = {
  'c1b83715-d218-4659-be83-54719b6dc897': [ // Beginner Strength Foundation
    { name: 'Pull-ups', sets: 3, reps: '5-8', rest: '2-3 min', notes: 'Focus on controlled movement' },
    { name: 'Push-ups', sets: 3, reps: '8-12', rest: '1-2 min', notes: 'Full range of motion' },
    { name: 'Plank Hold', sets: 3, reps: '30-45 sec', rest: '1 min', notes: 'Keep core engaged' },
    { name: 'Hanging Leg Raises', sets: 3, reps: '5-8', rest: '2 min', notes: 'Control the movement' },
    { name: 'Wall Climbs', sets: 2, reps: '3-5', rest: '3 min', notes: 'Practice technique' },
  ],
  '6b03862a-bf18-44ba-bee5-91496f6da763': [ // Intermediate Endurance Builder
    { name: '4x4s', sets: 4, reps: '4 climbs', rest: '4 min', notes: 'Same route, focus on efficiency' },
    { name: 'ARC Training', sets: 1, reps: '20-30 min', rest: '5 min', notes: 'Stay on wall, easy climbing' },
    { name: 'Traversing', sets: 3, reps: '10-15 min', rest: '3 min', notes: 'Continuous movement' },
    { name: 'Down Climbing', sets: 3, reps: '5-8 routes', rest: '2 min', notes: 'Practice down climbing' },
    { name: 'Rest Intervals', sets: 4, reps: '30 sec on/30 sec off', rest: '2 min', notes: 'Quick transitions' },
  ],
  '0fa003a6-d96e-48a3-bfd2-bc1d06973ce5': [ // Advanced Technique Mastery
    { name: 'Silent Feet', sets: 3, reps: '5 routes', rest: '2 min', notes: 'No sound when placing feet' },
    { name: 'Flagging Practice', sets: 4, reps: '3 routes each', rest: '2 min', notes: 'Practice different flag positions' },
    { name: 'Drop Knees', sets: 3, reps: '4 routes', rest: '3 min', notes: 'Focus on hip movement' },
    { name: 'Heel Hooks', sets: 3, reps: '5 routes', rest: '2 min', notes: 'Practice heel hook technique' },
    { name: 'Mantling', sets: 2, reps: '3 routes', rest: '4 min', notes: 'Practice mantling moves' },
  ],
  '6e5df048-fa5d-4a70-a6d8-586cf5bd04d8': [ // Beginner Technique Basics
    { name: 'Foot Placement', sets: 3, reps: '5 routes', rest: '2 min', notes: 'Look at feet when placing' },
    { name: 'Straight Arms', sets: 3, reps: '4 routes', rest: '2 min', notes: 'Keep arms straight when possible' },
    { name: 'Hip Movement', sets: 3, reps: '5 routes', rest: '2 min', notes: 'Move hips close to wall' },
    { name: 'Route Reading', sets: 2, reps: '3 routes', rest: '3 min', notes: 'Plan route before climbing' },
    { name: 'Basic Holds', sets: 3, reps: '4 routes', rest: '2 min', notes: 'Practice different hold types' },
  ],
  'a077906c-11cf-4fe0-b4c8-f30d7834b67a': [ // Intermediate Power Development
    { name: 'Campus Board', sets: 3, reps: '5-8 moves', rest: '3 min', notes: 'Start with laddering' },
    { name: 'Boulder Problems', sets: 4, reps: '3 problems', rest: '4 min', notes: 'Hard problems, short attempts' },
    { name: 'Dead Hangs', sets: 4, reps: '10-15 sec', rest: '2 min', notes: 'Different hold types' },
    { name: 'Dynos', sets: 3, reps: '5 attempts', rest: '3 min', notes: 'Practice dynamic moves' },
    { name: 'Lock-offs', sets: 3, reps: '5-8 sec each arm', rest: '2 min', notes: 'Hold position at 90 degrees' },
  ],
};

const TrainingScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { templates, isLoading, error } = useAppSelector((state) => state.training);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<TrainingPlanTemplate | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    loadTrainingData();
  }, [dispatch]);

  const loadTrainingData = () => {
    dispatch(fetchTrainingTemplates());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchTrainingTemplates()).unwrap();
    } catch (error) {
      console.error('❌ Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handlePlanPress = (template: TrainingPlanTemplate) => {
    // Add press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setSelectedPlan(template);
    setShowExercises(true);
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

  const getDifficultyGradient = (difficulty: TrainingDifficulty) => {
    switch (difficulty) {
      case TrainingDifficulty.BEGINNER:
        return ['#4CAF50', '#45a049'];
      case TrainingDifficulty.INTERMEDIATE:
        return ['#FF9800', '#F57C00'];
      case TrainingDifficulty.ADVANCED:
        return ['#F44336', '#D32F2F'];
      default:
        return ['#607D8B', '#455A64'];
    }
  };

  const getDifficultyIcon = (difficulty: TrainingDifficulty) => {
    switch (difficulty) {
      case TrainingDifficulty.BEGINNER:
        return 'school';
      case TrainingDifficulty.INTERMEDIATE:
        return 'fitness-center';
      case TrainingDifficulty.ADVANCED:
        return 'whatshot';
      default:
        return 'help';
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

  const renderExerciseModal = () => {
    if (!selectedPlan) return null;

    const exercises = staticExercises[selectedPlan.id] || [];

    return (
      <Modal
        visible={showExercises}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowExercises(false)}
      >
        <GradientBackground>
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={['rgba(0,0,0,0.8)', 'transparent']}
              style={styles.modalHeaderGradient}
            >
              <View style={styles.modalHeader}>
                <TouchableOpacity 
                  onPress={() => setShowExercises(false)}
                  style={styles.closeButton}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                    style={styles.closeButtonGradient}
                  >
                    <Icon name="close" size={24} color="#ffffff" />
                  </LinearGradient>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{selectedPlan.name}</Text>
              </View>
            </LinearGradient>

            <ScrollView style={styles.exercisesContainer} showsVerticalScrollIndicator={false}>
              <GlassCard style={styles.planInfoCard}>
                                 <LinearGradient
                   colors={getDifficultyGradient(selectedPlan.difficulty) as [string, string]}
                   style={styles.planInfoGradient}
                 >
                  <Text style={styles.planDescription}>{selectedPlan.description}</Text>
                  <View style={styles.planMeta}>
                    <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(selectedPlan.difficulty) }]}>
                      <Text style={styles.difficultyText}>{selectedPlan.difficulty}</Text>
                    </View>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{selectedPlan.category}</Text>
                    </View>
                    <View style={styles.durationBadge}>
                      <Text style={styles.durationText}>
                        {selectedPlan.totalWeeks || selectedPlan.duration || 0} weeks
                        {selectedPlan.sessionsPerWeek && ` • ${selectedPlan.sessionsPerWeek}/week`}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </GlassCard>

              <Text style={styles.exercisesTitle}>Training Exercises</Text>
              
              {exercises.map((exercise: Exercise, index: number) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.exerciseCardContainer,
                    {
                      transform: [{ scale: scaleAnim }],
                    },
                  ]}
                >
                  <GlassCard style={styles.exerciseCard}>
                    <LinearGradient
                      colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                      style={styles.exerciseGradient}
                    >
                      <View style={styles.exerciseHeader}>
                        <Text style={styles.exerciseName}>{exercise.name}</Text>
                        <View style={styles.exerciseNumber}>
                          <LinearGradient
                            colors={['#764ba2', '#667eea']}
                            style={styles.exerciseNumberGradient}
                          >
                            <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                          </LinearGradient>
                        </View>
                      </View>
                      
                      <View style={styles.exerciseDetails}>
                        <View style={styles.exerciseDetail}>
                          <View style={styles.exerciseDetailIcon}>
                            <Icon name="repeat" size={16} color="#ffffff" />
                          </View>
                          <Text style={styles.exerciseDetailText}>{exercise.sets} sets</Text>
                        </View>
                        <View style={styles.exerciseDetail}>
                          <View style={styles.exerciseDetailIcon}>
                            <Icon name="fitness-center" size={16} color="#ffffff" />
                          </View>
                          <Text style={styles.exerciseDetailText}>{exercise.reps}</Text>
                        </View>
                        <View style={styles.exerciseDetail}>
                          <View style={styles.exerciseDetailIcon}>
                            <Icon name="timer" size={16} color="#ffffff" />
                          </View>
                          <Text style={styles.exerciseDetailText}>{exercise.rest} rest</Text>
                        </View>
                      </View>
                      
                      {exercise.notes && (
                        <View style={styles.notesContainer}>
                          <Icon name="info" size={16} color="#FFD700" style={styles.notesIcon} />
                          <Text style={styles.exerciseNotes}>{exercise.notes}</Text>
                        </View>
                      )}
                    </LinearGradient>
                  </GlassCard>
                </Animated.View>
              ))}

              <GlassCard style={styles.tipsCard}>
                <LinearGradient
                  colors={['rgba(255,215,0,0.1)', 'rgba(255,215,0,0.05)']}
                  style={styles.tipsGradient}
                >
                  <View style={styles.tipsHeader}>
                    <View style={styles.tipsIconContainer}>
                      <Icon name="lightbulb" size={24} color="#FFD700" />
                    </View>
                    <Text style={styles.tipsTitle}>Training Tips</Text>
                  </View>
                  <Text style={styles.tipText}>
                    • Warm up properly before starting exercises
                  </Text>
                  <Text style={styles.tipText}>
                    • Focus on quality over quantity
                  </Text>
                  <Text style={styles.tipText}>
                    • Listen to your body and rest when needed
                  </Text>
                  <Text style={styles.tipText}>
                    • Stay consistent with your training schedule
                  </Text>
                </LinearGradient>
              </GlassCard>
            </ScrollView>
          </View>
        </GradientBackground>
      </Modal>
    );
  };

  if (isLoading) {
    return (
      <GradientBackground>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#ffffff']}
            tintColor="#ffffff"
          />
        }
      >
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={['rgba(255,255,255,0.1)', 'transparent']}
            style={styles.headerGradient}
          >
            <Text style={styles.title}>Training Plans</Text>
            <Text style={styles.subtitle}>Choose your climbing journey</Text>
          </LinearGradient>
        </View>

        {error && (
          <GlassCard style={styles.errorState}>
            <Icon name="error" size={48} color="#F44336" style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>Error Loading Plans</Text>
            <Text style={styles.emptyText}>
              {error}
            </Text>
          </GlassCard>
        )}
        
        {Array.isArray(templates) && templates.length === 0 && !error ? (
          <GlassCard style={styles.emptyState}>
            <Icon name="fitness-center" size={48} color="#ffffff" style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>No Training Plans</Text>
            <Text style={styles.emptyText}>
              Training plans will be available soon!
            </Text>
          </GlassCard>
        ) : null}

        {Array.isArray(templates) && templates.length > 0 && !error && (
          templates.map((template, index) => (
            <Animated.View
              key={template.id}
              style={[
                styles.planCardContainer,
                {
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => handlePlanPress(template)}
                activeOpacity={0.8}
                style={styles.planTouchable}
              >
                <GlassCard style={styles.planCard}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                    style={styles.planGradient}
                  >
                    <View style={styles.planHeader}>
                      <View style={styles.planIconContainer}>
                                                 <LinearGradient
                           colors={getDifficultyGradient(template.difficulty) as [string, string]}
                           style={styles.planIconGradient}
                         >
                          <Icon
                            name={getDifficultyIcon(template.difficulty)}
                            size={24}
                            color="#ffffff"
                          />
                        </LinearGradient>
                      </View>
                      <View style={styles.planInfo}>
                        <Text style={styles.planName}>{template.name}</Text>
                        <Text style={styles.planDescription}>{template.description}</Text>
                        
                        <View style={styles.planMeta}>
                          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(template.difficulty) }]}> 
                            <Text style={styles.difficultyText}>{template.difficulty}</Text>
                          </View>
                          <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{template.category}</Text>
                          </View>
                          <View style={styles.durationBadge}>
                            <Text style={styles.durationText}>
                              {template.totalWeeks || template.duration || 0} weeks
                              {template.sessionsPerWeek && ` • ${template.sessionsPerWeek}/week`}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View style={styles.focusContainer}>
                      <Text style={styles.focusTitle}>Focus Areas:</Text>
                      <View style={styles.focusIcons}>
                        {Array.isArray(template.focus) && template.focus.map((focus, focusIndex) => (
                          <View key={focusIndex} style={styles.focusIconContainer}>
                                                         <LinearGradient
                               colors={[getFocusColor(focus), getFocusColor(focus) + '80'] as [string, string]}
                               style={styles.focusIconGradient}
                             >
                              <Icon
                                name={getFocusIcon(focus)}
                                size={16}
                                color="#ffffff"
                              />
                            </LinearGradient>
                          </View>
                        ))}
                      </View>
                    </View>

                    <View style={styles.viewButton}>
                      <LinearGradient
                        colors={['#764ba2', '#667eea']}
                        style={styles.viewButtonGradient}
                      >
                        <Icon 
                          name="visibility" 
                          size={20} 
                          color="#ffffff" 
                        />
                        <Text style={styles.viewButtonText}>
                          View Exercises
                        </Text>
                      </LinearGradient>
                    </View>
                  </LinearGradient>
                </GlassCard>
              </TouchableOpacity>
            </Animated.View>
          ))
        )}

        {/* Training Tips */}
        <GlassCard style={styles.tipsCard}>
          <LinearGradient
            colors={['rgba(255,215,0,0.1)', 'rgba(255,215,0,0.05)']}
            style={styles.tipsGradient}
          >
            <View style={styles.tipsHeader}>
              <View style={styles.tipsIconContainer}>
                <Icon name="lightbulb" size={24} color="#FFD700" />
              </View>
              <Text style={styles.tipsTitle}>Training Tips</Text>
            </View>
            <Text style={styles.tipText}>
              • Start with a plan that matches your current skill level
            </Text>
            <Text style={styles.tipText}>
              • Consistency is key - stick to your training schedule
            </Text>
            <Text style={styles.tipText}>
              • Listen to your body and rest when needed
            </Text>
            <Text style={styles.tipText}>
              • Focus on technique before pushing grades
            </Text>
          </LinearGradient>
        </GlassCard>
      </ScrollView>

      {renderExerciseModal()}
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    marginTop: 50,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginTop: 20,
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
    color: '#ffffff',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.8,
  },
  planCardContainer: {
    marginBottom: 20,
  },
  planTouchable: {
    borderRadius: 20,
  },
  planCard: {
    padding: 0,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  planGradient: {
    padding: 20,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  planIconGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  planDescription: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 12,
    lineHeight: 20,
  },
  planMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  durationBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  durationText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  focusContainer: {
    marginBottom: 16,
  },
  focusTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  focusIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  focusIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  focusIconGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  viewButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  viewButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  tipsCard: {
    marginTop: 20,
    marginBottom: 20,
    padding: 0,
    borderRadius: 20,
    overflow: 'hidden',
  },
  tipsGradient: {
    padding: 20,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tipsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  tipText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 8,
    lineHeight: 20,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    paddingTop: 0,
  },
  modalHeaderGradient: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  closeButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
    marginTop: 10,
  },
  closeButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  exercisesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  planInfoCard: {
    marginBottom: 30,
    padding: 0,
    borderRadius: 20,
    overflow: 'hidden',
  },
  planInfoGradient: {
    padding: 20,
  },
  exercisesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  exerciseCardContainer: {
    marginBottom: 16,
  },
  exerciseCard: {
    padding: 0,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  exerciseGradient: {
    padding: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  exerciseNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
  },
  exerciseNumberGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  exerciseDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  exerciseDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  exerciseDetailIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseDetailText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    fontWeight: '500',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  notesIcon: {
    marginRight: 8,
    marginTop: 1,
  },
  exerciseNotes: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    fontStyle: 'italic',
    lineHeight: 20,
    flex: 1,
  },
});

export default TrainingScreen; 