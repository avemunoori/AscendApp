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
import { useAppDispatch } from '../../store/hooks';
import { createSession } from '../../store/sessionsSlice';
import { ClimbingDiscipline } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import GradientBackground from '../../components/GradientBackground';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type CreateSessionScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateSession'>;
};

const CreateSessionScreen: React.FC<CreateSessionScreenProps> = ({ navigation }) => {
  const [discipline, setDiscipline] = useState<ClimbingDiscipline>(ClimbingDiscipline.BOULDER);
  const [grade, setGrade] = useState('');
  const [notes, setNotes] = useState('');
  const [sent, setSent] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const dispatch = useAppDispatch();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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
    ]).start();
  }, []);

  const handleCreateSession = async () => {
    if (!grade.trim()) {
      Alert.alert('Error', 'Please enter a grade');
      return;
    }

    try {
      await dispatch(createSession({
        discipline,
        grade: grade.trim(),
        notes: notes.trim(),
        date,
        sent,
      })).unwrap();
      
      Alert.alert('Success', 'Session created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create session');
    }
  };

  const getGradeOptions = () => {
    switch (discipline) {
      case ClimbingDiscipline.BOULDER:
        return ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17'];
      case ClimbingDiscipline.LEAD:
      case ClimbingDiscipline.TOP_ROPE:
        return ['5.6', '5.7', '5.8', '5.9', '5.10a', '5.10b', '5.10c', '5.10d', '5.11a', '5.11b', '5.11c', '5.11d', '5.12a', '5.12b', '5.12c', '5.12d', '5.13a', '5.13b', '5.13c', '5.13d', '5.14a', '5.14b', '5.14c', '5.14d', '5.15a', '5.15b', '5.15c', '5.15d'];
      default:
        return [];
    }
  };

  const renderDisciplineButton = (disc: ClimbingDiscipline, label: string) => (
    <TouchableOpacity
      style={[
        styles.disciplineButton,
        discipline === disc && styles.disciplineButtonActive
      ]}
      onPress={() => setDiscipline(disc)}
    >
      <LinearGradient
        colors={discipline === disc ? ['#6366f1', '#4f46e5'] : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.disciplineGradient}
      >
        <Text style={[
          styles.disciplineButtonText,
          discipline === disc && styles.disciplineButtonTextActive
        ]}>
          {label}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderGradeButton = (gradeOption: string) => (
    <TouchableOpacity
      key={gradeOption}
      style={[
        styles.gradeButton,
        grade === gradeOption && styles.gradeButtonActive
      ]}
      onPress={() => setGrade(gradeOption)}
    >
      <LinearGradient
        colors={grade === gradeOption ? ['#10b981', '#059669'] : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.gradeGradient}
      >
        <Text style={[
          styles.gradeButtonText,
          grade === gradeOption && styles.gradeButtonTextActive
        ]}>
          {gradeOption}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <GlassCard style={styles.formCard}>
              <Text style={styles.formTitle}>Create New Session</Text>
              
              {/* Discipline Selection */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Discipline</Text>
                <View style={styles.disciplineContainer}>
                  {renderDisciplineButton(ClimbingDiscipline.BOULDER, 'Bouldering')}
                  {renderDisciplineButton(ClimbingDiscipline.LEAD, 'Lead')}
                  {renderDisciplineButton(ClimbingDiscipline.TOP_ROPE, 'Top Rope')}
                </View>
              </View>

              {/* Grade Selection */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Grade</Text>
                <View style={styles.gradeContainer}>
                  {getGradeOptions().map(renderGradeButton)}
                </View>
              </View>

              {/* Date */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Date</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={date}
                    onChangeText={setDate}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  />
                </View>
              </View>

              {/* Notes */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notes (Optional)</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="How was your session?"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </View>

              {/* Sent Status */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Did you send it?</Text>
                <View style={styles.sentContainer}>
                  <TouchableOpacity
                    style={[
                      styles.sentButton,
                      sent && styles.sentButtonActive
                    ]}
                    onPress={() => setSent(true)}
                  >
                    <LinearGradient
                      colors={sent ? ['#10b981', '#059669'] : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                      style={styles.sentGradient}
                    >
                      <Text style={[
                        styles.sentButtonText,
                        sent && styles.sentButtonTextActive
                      ]}>
                        ✓ Sent
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.sentButton,
                      !sent && styles.sentButtonActive
                    ]}
                    onPress={() => setSent(false)}
                  >
                    <LinearGradient
                      colors={!sent ? ['#ef4444', '#dc2626'] : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                      style={styles.sentGradient}
                    >
                      <Text style={[
                        styles.sentButtonText,
                        !sent && styles.sentButtonTextActive
                      ]}>
                        ○ Not Sent
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>

              <AnimatedButton
                title="Create Session"
                onPress={handleCreateSession}
                style={styles.createButton}
              />
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
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  content: {
    flex: 1,
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 24,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  disciplineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  disciplineButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  disciplineButtonActive: {
    // Active state handled by gradient
  },
  disciplineGradient: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  disciplineButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  disciplineButtonTextActive: {
    color: '#ffffff',
  },
  gradeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gradeButton: {
    width: (width - 80) / 4,
    marginBottom: 8,
  },
  gradeButtonActive: {
    // Active state handled by gradient
  },
  gradeGradient: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  gradeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  gradeButtonTextActive: {
    color: '#ffffff',
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  sentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sentButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  sentButtonActive: {
    // Active state handled by gradient
  },
  sentGradient: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  sentButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  sentButtonTextActive: {
    color: '#ffffff',
  },
  createButton: {
    marginTop: 20,
  },
});

export default CreateSessionScreen; 