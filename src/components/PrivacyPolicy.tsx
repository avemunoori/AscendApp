import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PrivacyPolicyProps {
  onClose?: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose }) => {
  const handleEmailContact = () => {
    Linking.openURL('mailto:privacy@ascendclimbing.xyz');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Privacy Policy</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</Text>
        
        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.text}>
          We collect information you provide directly to us, including:
        </Text>
        <Text style={styles.bulletPoint}>• Email address and password for account creation</Text>
        <Text style={styles.bulletPoint}>• First and last name</Text>
        <Text style={styles.bulletPoint}>• Climbing session data (discipline, grade, date, notes)</Text>
        <Text style={styles.bulletPoint}>• Analytics and progress tracking data</Text>
        
        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.text}>
          We use the information we collect to:
        </Text>
        <Text style={styles.bulletPoint}>• Provide and maintain the Ascend climbing app</Text>
        <Text style={styles.bulletPoint}>• Track your climbing progress and sessions</Text>
        <Text style={styles.bulletPoint}>• Send password reset emails when requested</Text>
        <Text style={styles.bulletPoint}>• Provide customer support</Text>
        <Text style={styles.bulletPoint}>• Improve our services and user experience</Text>
        
        <Text style={styles.sectionTitle}>3. Data Storage and Security</Text>
        <Text style={styles.text}>
          Your data is stored securely using industry-standard encryption. We use:
        </Text>
        <Text style={styles.bulletPoint}>• Secure HTTPS connections for all data transmission</Text>
        <Text style={styles.bulletPoint}>• Encrypted storage for sensitive information</Text>
        <Text style={styles.bulletPoint}>• Secure authentication tokens</Text>
        <Text style={styles.bulletPoint}>• Regular security updates and monitoring</Text>
        
        <Text style={styles.sectionTitle}>4. Data Sharing</Text>
        <Text style={styles.text}>
          We do not sell, trade, or otherwise transfer your personal information to third parties, except:
        </Text>
        <Text style={styles.bulletPoint}>• With your explicit consent</Text>
        <Text style={styles.bulletPoint}>• To comply with legal obligations</Text>
        <Text style={styles.bulletPoint}>• To protect our rights and safety</Text>
        
        <Text style={styles.sectionTitle}>5. Your Rights</Text>
        <Text style={styles.text}>
          You have the right to:
        </Text>
        <Text style={styles.bulletPoint}>• Access your personal data</Text>
        <Text style={styles.bulletPoint}>• Update or correct your information</Text>
        <Text style={styles.bulletPoint}>• Delete your account and all associated data</Text>
        <Text style={styles.bulletPoint}>• Export your climbing data</Text>
        
        <Text style={styles.sectionTitle}>6. Data Retention</Text>
        <Text style={styles.text}>
          We retain your data for as long as your account is active. When you delete your account, we will remove all your personal data within 30 days.
        </Text>
        
        <Text style={styles.sectionTitle}>7. Contact Us</Text>
        <Text style={styles.text}>
          If you have any questions about this Privacy Policy or would like to exercise your rights, please contact us:
        </Text>
        <TouchableOpacity onPress={handleEmailContact}>
          <Text style={styles.emailLink}>privacy@ascendclimbing.xyz</Text>
        </TouchableOpacity>
        
        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
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
    padding: 20,
    backgroundColor: '#6366f1',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginLeft: 20,
    marginBottom: 5,
  },
  emailLink: {
    fontSize: 16,
    color: '#6366f1',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  spacer: {
    height: 40,
  },
});

export default PrivacyPolicy; 