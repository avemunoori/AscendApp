import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: { resetCode?: string } | undefined;
  MainTabs: undefined;
  SessionDetail: { sessionId: string };
  CreateSession: undefined;
  EditSession: { sessionId: string };
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
};

export type TabParamList = {
  Sessions: undefined;
  Analytics: undefined;
  Profile: undefined;
};

export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
export type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;
export type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;
export type ForgotPasswordScreenRouteProp = RouteProp<RootStackParamList, 'ForgotPassword'>;
export type SessionDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SessionDetail'>;
export type SessionDetailScreenRouteProp = RouteProp<RootStackParamList, 'SessionDetail'>;
export type EditSessionScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditSession'>;
export type EditSessionScreenRouteProp = RouteProp<RootStackParamList, 'EditSession'>; 
export type PrivacyPolicyScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PrivacyPolicy'>;
export type TermsOfServiceScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TermsOfService'>; 