import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchSessions, deleteSession } from '../../store/sessionsSlice';
import { ClimbingSession, ClimbingDiscipline } from '../../types';
import { gradeUtils } from '../../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';
import GradientBackground from '../../components/GradientBackground';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

type SessionsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;
};

const SessionsScreen: React.FC<SessionsScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { sessions, isLoading } = useAppSelector((state) => state.sessions);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState<ClimbingDiscipline | 'ALL'>('ALL');

  useEffect(() => {
    if (isAuthenticated) {
      loadSessions();
    }
  }, [isAuthenticated]);

  const loadSessions = async () => {
    try {
      await dispatch(fetchSessions(undefined)).unwrap();
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load sessions');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSessions();
    setRefreshing(false);
  };

  const handleDeleteSession = (sessionId: string) => {
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteSession(sessionId)).unwrap();
            } catch (error: any) {
              Alert.alert('Error', 'Failed to delete session');
            }
          },
        },
      ]
    );
  };

  const filteredSessions = selectedDiscipline === 'ALL' 
    ? sessions 
    : sessions.filter(session => session.discipline === selectedDiscipline);

  const renderSessionItem = ({ item, index }: { item: ClimbingSession; index: number }) => {
    return (
      <View style={styles.sessionCardContainer}>
        <GlassCard style={styles.sessionCard}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SessionDetail', { sessionId: item.id })}
            style={styles.sessionContent}
          >
            <View style={styles.sessionHeader}>
              <View style={styles.gradeContainer}>
                <LinearGradient
                  colors={item.sent ? ['#10b981', '#059669'] : ['#6366f1', '#4f46e5']}
                  style={styles.gradeGradient}
                >
                  <Text style={styles.grade}>
                    {item.grade}
                  </Text>
                </LinearGradient>
                <Text style={styles.discipline}>{item.discipline}</Text>
              </View>
              <View style={styles.statusContainer}>
                <View style={[styles.statusBadge, item.sent ? styles.completedBadge : styles.incompleteBadge]}>
                  <Icon 
                    name={item.sent ? 'check' : 'radio-button-unchecked'} 
                    size={18} 
                    color={item.sent ? '#ffffff' : '#6b7280'} 
                  />
                </View>
              </View>
            </View>
            
            <View style={styles.sessionDetails}>
              <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
              <Text style={styles.attempts}>1 attempt</Text>
              {item.notes && (
                <Text style={styles.notes} numberOfLines={2}>
                  {item.notes}
                </Text>
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.actions}>
            <AnimatedButton
              title="Edit"
              onPress={() => navigation.navigate('EditSession', { sessionId: item.id })}
              variant="secondary"
              style={styles.actionButton}
            />
            <AnimatedButton
              title="Delete"
              onPress={() => handleDeleteSession(item.id)}
              variant="danger"
              style={styles.actionButton}
            />
          </View>
        </GlassCard>
      </View>
    );
  };

  const renderFilterButton = (discipline: ClimbingDiscipline | 'ALL', label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedDiscipline === discipline && styles.filterButtonActive
      ]}
      onPress={() => setSelectedDiscipline(discipline)}
    >
      <LinearGradient
        colors={selectedDiscipline === discipline ? ['#6366f1', '#4f46e5'] : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.filterGradient}
      >
        <Text style={[
          styles.filterButtonText,
          selectedDiscipline === discipline && styles.filterButtonTextActive
        ]}>
          {label}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <GradientBackground>
      <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Climbing Sessions</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateSession')}
          style={styles.addButton}
        >
          <Icon name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        {renderFilterButton('ALL', 'All')}
        {renderFilterButton(ClimbingDiscipline.BOULDER, 'Boulder')}
        {renderFilterButton(ClimbingDiscipline.LEAD, 'Lead')}
        {renderFilterButton(ClimbingDiscipline.TOP_ROPE, 'Top Rope')}
      </View>

      <FlatList
        data={filteredSessions}
        renderItem={renderSessionItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No sessions found</Text>
            <Text style={styles.emptySubtext}>Start by adding your first climbing session!</Text>
          </View>
        }
      />
    </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 32,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22223b',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(102, 126, 234, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  addButton: {
    backgroundColor: '#764ba2',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#764ba2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: 0,
    marginLeft: 0,
    shadowColor: '#764ba2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  filterButtonActive: {
    shadowColor: '#6366f1',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  filterGradient: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 24,
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonText: {
    color: '#22223b',
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: 0.2,
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 32,
    paddingHorizontal: 8,
  },
  sessionCardContainer: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  sessionCard: {
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.18)',
    shadowColor: '#764ba2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    marginBottom: 0,
  },
  sessionContent: {
    flexDirection: 'column',
    gap: 8,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  gradeContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 2,
  },
  gradeGradient: {
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 6,
    marginBottom: 2,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  grade: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.12)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  discipline: {
    color: '#a3aed6',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  statusContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  statusBadge: {
    borderRadius: 16,
    padding: 6,
    backgroundColor: '#f3f4f6',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  completedBadge: {
    backgroundColor: '#10b981',
  },
  incompleteBadge: {
    backgroundColor: '#f3f4f6',
  },
  sessionDetails: {
    marginTop: 2,
    marginBottom: 2,
    gap: 2,
  },
  date: {
    color: '#22223b',
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 1,
  },
  attempts: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 1,
  },
  notes: {
    color: '#7c3aed',
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 24,
    marginHorizontal: 2,
    shadowColor: '#764ba2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22223b',
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#6b7280',
  },
});

export default SessionsScreen; 