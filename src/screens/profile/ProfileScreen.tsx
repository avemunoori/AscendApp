import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal, Pressable } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/authSlice';
import GradientBackground from '../../components/GradientBackground';
import GlassCard from '../../components/GlassCard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated } from 'react-native';

const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  // Remove sessions, rank, achievements logic

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => dispatch(logout()),
        },
      ]
    );
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<'settings' | 'help' | 'about' | null>(null);

  const handleMenuPress = (content: 'settings' | 'help' | 'about') => {
    setModalContent(content);
    setModalVisible(true);
  };

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
      <View style={styles.container}>
        <GlassCard style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarShadow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.firstName?.charAt(0) || 'U'}
                </Text>
              </View>
            </View>
          </View>
          <Text style={styles.name}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.email}>{user?.email}</Text>
        </GlassCard>

        {/* Achievements Section */}
        {/* Remove achievements/rank imports */}
        {/* Remove sessions, rank, achievements logic */}

        <GlassCard style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress('settings')}>
            <Icon name="settings" size={22} color="#764ba2" style={styles.menuIcon} />
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress('help')}>
            <Icon name="help-outline" size={22} color="#764ba2" style={styles.menuIcon} />
            <Text style={styles.menuText}>Help & Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress('about')}>
            <Icon name="info-outline" size={22} color="#764ba2" style={styles.menuIcon} />
            <Text style={styles.menuText}>About</Text>
          </TouchableOpacity>
        </GlassCard>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Info Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 28, width: '85%', alignItems: 'center' }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#764ba2' }}>
              {modalContent === 'settings' && 'Settings'}
              {modalContent === 'help' && 'Help & Support'}
              {modalContent === 'about' && 'About'}
            </Text>
            <Text style={{ fontSize: 16, color: '#22223b', marginBottom: 18, textAlign: 'center' }}>
              {modalContent === 'settings' && 'Settings are coming soon! You will be able to customize your experience here.'}
              {modalContent === 'help' && 'For help and support, contact us at support@ascendapp.com or visit our FAQ section in the next update.'}
              {modalContent === 'about' && 'Ascend is a modern climbing tracker app built with React Native. Track your sessions, analyze your progress, and check weather conditions for your next climb!'}
            </Text>
            <Pressable
              style={{ backgroundColor: '#764ba2', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 28 }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 36,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 28,
    marginBottom: 28,
    shadowColor: '#764ba2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  avatarWrapper: {
    marginBottom: 16,
  },
  avatarShadow: {
    shadowColor: '#764ba2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
    borderRadius: 50,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#764ba2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarText: {
    color: '#fff',
    fontSize: 38,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#22223b',
    marginBottom: 2,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(102, 126, 234, 0.10)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  email: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 2,
  },
  menuSection: {
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
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  menuIcon: {
    marginRight: 14,
  },
  menuText: {
    fontSize: 17,
    color: '#22223b',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#dc2626',
    borderRadius: 24,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
    marginTop: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  rankSection: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 2,
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

export default ProfileScreen; 