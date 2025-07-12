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

interface TermsOfServiceProps {
  onClose?: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onClose }) => {
  const handleEmailContact = () => {
    Linking.openURL('mailto:legal@ascendclimbing.xyz');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Terms of Service</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</Text>
        
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.text}>
          By downloading, installing, or using the Ascend climbing app, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the app.
        </Text>
        
        <Text style={styles.sectionTitle}>2. Description of Service</Text>
        <Text style={styles.text}>
          Ascend is a mobile application that allows users to track their climbing sessions, monitor progress, and access climbing-related analytics. The app is provided for personal, non-commercial use only.
        </Text>
        
        <Text style={styles.sectionTitle}>3. User Accounts</Text>
        <Text style={styles.text}>
          To use certain features of the app, you must create an account. You are responsible for:
        </Text>
        <Text style={styles.bulletPoint}>• Maintaining the confidentiality of your account credentials</Text>
        <Text style={styles.bulletPoint}>• All activities that occur under your account</Text>
        <Text style={styles.bulletPoint}>• Providing accurate and complete information</Text>
        <Text style={styles.bulletPoint}>• Notifying us immediately of any unauthorized use</Text>
        
        <Text style={styles.sectionTitle}>4. Acceptable Use</Text>
        <Text style={styles.text}>
          You agree not to:
        </Text>
        <Text style={styles.bulletPoint}>• Use the app for any illegal or unauthorized purpose</Text>
        <Text style={styles.bulletPoint}>• Attempt to gain unauthorized access to our systems</Text>
        <Text style={styles.bulletPoint}>• Interfere with or disrupt the app's functionality</Text>
        <Text style={styles.bulletPoint}>• Share your account credentials with others</Text>
        <Text style={styles.bulletPoint}>• Upload malicious code or content</Text>
        
        <Text style={styles.sectionTitle}>5. User Content</Text>
        <Text style={styles.text}>
          You retain ownership of any content you submit to the app. By submitting content, you grant us a license to use, store, and display that content in connection with providing the service.
        </Text>
        
        <Text style={styles.sectionTitle}>6. Privacy</Text>
        <Text style={styles.text}>
          Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the app and is incorporated into these Terms of Service.
        </Text>
        
        <Text style={styles.sectionTitle}>7. Disclaimers</Text>
        <Text style={styles.text}>
          THE APP IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </Text>
        
        <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
        <Text style={styles.text}>
          IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR RELATING TO YOUR USE OF THE APP.
        </Text>
        
        <Text style={styles.sectionTitle}>9. Safety Disclaimer</Text>
        <Text style={styles.text}>
          Climbing is an inherently dangerous activity. The Ascend app is designed to track your climbing sessions but does not provide safety advice or climbing instruction. Always:
        </Text>
        <Text style={styles.bulletPoint}>• Climb within your abilities</Text>
        <Text style={styles.bulletPoint}>• Use proper safety equipment</Text>
        <Text style={styles.bulletPoint}>• Follow local climbing regulations</Text>
        <Text style={styles.bulletPoint}>• Consider taking lessons from qualified instructors</Text>
        <Text style={styles.text}>
          We are not responsible for any injuries or accidents that may occur while climbing.
        </Text>
        
        <Text style={styles.sectionTitle}>10. Termination</Text>
        <Text style={styles.text}>
          We may terminate or suspend your account at any time for violation of these terms. You may also terminate your account at any time by contacting us.
        </Text>
        
        <Text style={styles.sectionTitle}>11. Changes to Terms</Text>
        <Text style={styles.text}>
          We may update these Terms of Service from time to time. We will notify you of any material changes by posting the new terms in the app or by email.
        </Text>
        
        <Text style={styles.sectionTitle}>12. Contact Information</Text>
        <Text style={styles.text}>
          If you have any questions about these Terms of Service, please contact us:
        </Text>
        <TouchableOpacity onPress={handleEmailContact}>
          <Text style={styles.emailLink}>legal@ascendclimbing.xyz</Text>
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

export default TermsOfService; 