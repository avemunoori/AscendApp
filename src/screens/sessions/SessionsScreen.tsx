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
      await dispatch(fetchSessions()).unwrap();
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
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f2937',
    letterSpacing: -0.5,
  },
  addButton: {
    backgroundColor: '#6366f1',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterButton: {
    marginRight: 12,
    borderRadius: 24,
    overflow: 'hidden',
  },
  filterGradient: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
  },
  filterButtonActive: {
    backgroundColor: '#6366f1',
  },
  filterButtonText: {
    color: '#6b7280',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sessionCardContainer: {
    marginBottom: 20,
  },
  sessionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  sessionContent: {
    flex: 1,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  gradeContainer: {
    alignItems: 'flex-start',
  },
  grade: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  gradeGradient: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  discipline: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  completedBadge: {
    backgroundColor: '#10b981',
  },
  incompleteBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  sessionDetails: {
    marginBottom: 16,
  },
  date: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 6,
    fontWeight: '600',
  },
  attempts: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    marginBottom: 6,
  },
  notes: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  editButtonText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
  },
  deleteButtonText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default SessionsScreen; 