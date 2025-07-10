import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getSession, deleteSession } from '../../store/sessionsSlice';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';
import GradientBackground from '../../components/GradientBackground';
import GlassCard from '../../components/GlassCard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AnimatedButton from '../../components/AnimatedButton';

const SessionDetailScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'SessionDetail'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const { sessions, isLoading, error } = useAppSelector((state) => state.sessions);
  const sessionId = route.params?.sessionId;
  const session = sessions.find((s) => s.id === sessionId);

  useEffect(() => {
    if (!session && sessionId) {
      dispatch(getSession(sessionId));
    }
  }, [sessionId, session, dispatch]);

  const handleDelete = () => {
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
              navigation.goBack();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete session');
            }
          },
        },
      ]
    );
  };

  if (isLoading && !session) {
    return (
      <GradientBackground>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#764ba2" />
        </View>
      </GradientBackground>
    );
  }

  if (!session) {
    return (
      <GradientBackground>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Session not found.</Text>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <View style={styles.container}>
        <GlassCard style={styles.card}>
          <View style={styles.headerRow}>
            <LinearGradient
              colors={session.sent ? ['#10b981', '#059669'] : ['#6366f1', '#4f46e5']}
              style={styles.gradeBadge}
            >
              <Text style={styles.gradeText}>{session.grade}</Text>
            </LinearGradient>
            <View style={styles.statusBadgeWrapper}>
              <View style={[styles.statusBadge, session.sent ? styles.completedBadge : styles.incompleteBadge]}>
                <Icon
                  name={session.sent ? 'check' : 'radio-button-unchecked'}
                  size={22}
                  color={session.sent ? '#fff' : '#6b7280'}
                />
              </View>
              <Text style={styles.statusText}>{session.sent ? 'Sent' : 'Not Sent'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="calendar-today" size={20} color="#764ba2" style={styles.infoIcon} />
            <Text style={styles.infoText}>{new Date(session.date).toLocaleDateString()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="category" size={20} color="#764ba2" style={styles.infoIcon} />
            <Text style={styles.infoText}>{session.discipline}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="repeat" size={20} color="#764ba2" style={styles.infoIcon} />
            <Text style={styles.infoText}>{session.attempts ? `${session.attempts} attempts` : '1 attempt'}</Text>
          </View>

          {session.notes ? (
            <View style={styles.notesSection}>
              <Text style={styles.notesTitle}>Notes</Text>
              <Text style={styles.notesText}>{session.notes}</Text>
            </View>
          ) : null}

          <View style={styles.actionsRow}>
            <AnimatedButton
              title="Edit"
              onPress={() => navigation.navigate('EditSession', { sessionId: sessionId as string })}
              variant="secondary"
              style={styles.actionButton}
            />
            <AnimatedButton
              title="Delete"
              onPress={handleDelete}
              variant="danger"
              style={styles.actionButton}
            />
          </View>
        </GlassCard>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    padding: 28,
    borderRadius: 32,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 18,
  },
  gradeBadge: {
    borderRadius: 16,
    paddingHorizontal: 28,
    paddingVertical: 10,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  gradeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 28,
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.12)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statusBadgeWrapper: {
    alignItems: 'center',
    marginLeft: 18,
  },
  statusBadge: {
    borderRadius: 16,
    padding: 8,
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
  statusText: {
    marginTop: 4,
    color: '#764ba2',
    fontWeight: '600',
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 17,
    color: '#22223b',
    fontWeight: '500',
  },
  notesSection: {
    width: '100%',
    backgroundColor: 'rgba(118, 75, 162, 0.08)',
    borderRadius: 16,
    padding: 16,
    marginTop: 18,
    marginBottom: 10,
  },
  notesTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#764ba2',
    marginBottom: 6,
  },
  notesText: {
    fontSize: 15,
    color: '#22223b',
    fontStyle: 'italic',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 24,
    gap: 16,
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SessionDetailScreen; 