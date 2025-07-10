import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView } from 'react-native';
import { useAppSelector } from '../../store/hooks';
import { getUserRank, getUserAchievements } from '../../utils/achievements';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '../../components/GlassCard';
import GradientBackground from '../../components/GradientBackground';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AchievementsScreen = () => {
  const sessions = useAppSelector((state) => state.sessions.sessions);
  const rank = getUserRank(sessions);
  const achievements = getUserAchievements(sessions);

  // Animation for rank badge
  const rankAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(rankAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 80,
    }).start();
  }, [rank]);

  // Icon mapping for achievements and ranks
  const achievementIcons: Record<string, string> = {
    'first-session': 'flag',
    'first-send': 'check-circle',
    'sent-V3': 'star',
    'sent-V5': 'star',
    'sent-V7': 'star',
    'sent-V10': 'star',
    'sent-5.10a': 'military-tech',
    'sent-5.12a': 'military-tech',
    'streak-3': 'whatshot',
    'streak-7': 'local-fire-department',
    'streak-30': 'local-fire-department',
    'all-disciplines': 'category',
    'sessions-10': 'looks-one',
    'sessions-25': 'looks-two',
    'sessions-50': 'looks-3',
    'sessions-100': 'looks-4',
  };
  const rankIcons: Record<string, string> = {
    'Beginner': 'emoji-emotions',
    'Bronze': 'emoji-events',
    'Silver': 'military-tech',
    'Gold': 'military-tech',
    'Platinum': 'military-tech',
    'Diamond': 'diamond',
    'Master': 'star',
    'Champion': 'emoji-events',
    'Legend': 'emoji-people',
  };

  return (
    <GradientBackground>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <GlassCard style={styles.rankSectionCard}>
          <Text style={styles.rankLabel}>Rank</Text>
          <View style={styles.rankBadgeWrapper}>
            <Animated.View style={{
              transform: [
                { scale: rankAnim },
              ],
              opacity: rankAnim,
            }}>
              <LinearGradient
                colors={['#764ba2', '#667eea', '#f093fb']}
                style={styles.rankBadge}
              >
                <Icon name={rankIcons[rank] || 'emoji-events'} size={28} color="#fff" style={{ marginBottom: 2 }} />
                <Text style={styles.rankBadgeText}>{rank}</Text>
              </LinearGradient>
            </Animated.View>
          </View>
        </GlassCard>
        <GlassCard style={styles.achievementsSection}>
          <Text style={styles.achievementsTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((ach, idx) => {
              const anim = useRef(new Animated.Value(0)).current;
              useEffect(() => {
                if (ach.unlocked) {
                  Animated.spring(anim, {
                    toValue: 1,
                    useNativeDriver: true,
                    friction: 6,
                    tension: 80,
                    delay: idx * 60,
                  }).start();
                } else {
                  anim.setValue(1);
                }
              }, [ach.unlocked]);
              return (
                <Animated.View
                  key={ach.id}
                  style={{
                    transform: [
                      { scale: anim },
                    ],
                    opacity: anim,
                  }}
                >
                  <View style={[styles.achievementCard, !ach.unlocked && styles.achievementCardLocked]}>
                    <Icon
                      name={achievementIcons[ach.id] || 'star'}
                      size={26}
                      color={ach.unlocked ? '#764ba2' : '#a1a1aa'}
                      style={{ marginBottom: 2 }}
                    />
                    <Text style={[styles.achievementName, !ach.unlocked && styles.achievementNameLocked]}>
                      {ach.name}
                    </Text>
                    <Text style={[styles.achievementDesc, !ach.unlocked && styles.achievementDescLocked]}>
                      {ach.description}
                    </Text>
                  </View>
                </Animated.View>
              );
            })}
          </View>
        </GlassCard>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 18,
    minHeight: '100%',
  },
  rankSectionCard: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 28,
    shadowColor: '#764ba2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  rankLabel: {
    color: '#764ba2',
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  rankBadgeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadge: {
    borderRadius: 20,
    paddingHorizontal: 32,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#764ba2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  rankBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.12)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  achievementsSection: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 24,
    marginBottom: 28,
    shadowColor: '#764ba2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    paddingVertical: 18,
    paddingHorizontal: 12,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#764ba2',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  achievementCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    margin: 6,
    minWidth: 120,
    maxWidth: 140,
    alignItems: 'center',
    shadowColor: '#764ba2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementCardLocked: {
    backgroundColor: '#e5e7eb',
    opacity: 0.5,
  },
  achievementName: {
    fontWeight: 'bold',
    color: '#764ba2',
    fontSize: 15,
    marginBottom: 2,
    textAlign: 'center',
  },
  achievementNameLocked: {
    color: '#a1a1aa',
  },
  achievementDesc: {
    color: '#22223b',
    fontSize: 13,
    textAlign: 'center',
  },
  achievementDescLocked: {
    color: '#6b7280',
  },
});

export default AchievementsScreen; 