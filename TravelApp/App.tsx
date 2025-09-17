import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { Colors } from './src/constants/colors';
import { Sizes } from './src/constants/sizes';
import OnboardingScreen from './src/components/OnboardingScreen';
import LoginScreen from './src/components/LoginScreen';
import ResetPasswordScreen from './src/components/ResetPasswordScreen';
import EnterCodeScreen from './src/components/EnterCodeScreen';
import CreateNewPasswordScreen from './src/components/CreateNewPasswordScreen';
import SuccessScreen from './src/components/SuccessScreen';
import DestinationDetail from './src/components/DestinationDetail';
import SignInScreen from './src/components/SignInScreen';
import MainTabs from './src/components/MainTabs';
import { Putovanje } from './src/types';
import api from './src/services/api';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showEnterCode, setShowEnterCode] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDestinationDetail, setShowDestinationDetail] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<Putovanje | null>(null);

  const handleGetStarted = () => {
    setShowOnboarding(false);
    setShowLogin(true);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    setIsAuthenticated(true);
  };

  const handleBackToOnboarding = () => {
    setShowLogin(false);
    setShowOnboarding(true);
  };

  // Password Reset Handlers
  const handleForgotPassword = () => {
    setShowLogin(false);
    setShowResetPassword(true);
  };

  const handleEmailSent = (email: string, code: string) => {
    setResetEmail(email);
    setSentCode(code);
    setShowResetPassword(false);
    setShowEnterCode(true);
  };

  const handleBackToLoginFromReset = () => {
    setShowResetPassword(false);
    setShowLogin(true);
  };

  const handleBackToEmailFromCode = () => {
    setShowEnterCode(false);
    setShowResetPassword(true);
  };

  const handleCodeVerified = (code: string) => {
    setResetCode(code);
    setShowEnterCode(false);
    setShowCreatePassword(true);
  };

  const handleBackToEmailFromPassword = () => {
    setShowCreatePassword(false);
    setShowResetPassword(true);
  };

  const handlePasswordResetComplete = () => {
    setShowCreatePassword(false);
    setShowSuccess(true);
  };

  const handleSuccessContinue = async () => {
    try {
      await api.logout();
    } catch (error) {
      // Ignorisi greške pri logout-u
    } finally {
      setShowSuccess(false);
      setShowLogin(true);
      setResetEmail('');
      setResetCode('');
      setIsAuthenticated(false);
    }
  };

  // Destinations handlers
  const handleDestinationSelect = (destination: Putovanje) => {
    setSelectedDestination(destination);
    setShowDestinationDetail(true);
  };

  const handleBackToDestinations = () => {
    setShowDestinationDetail(false);
    setSelectedDestination(null);
  };

  const handleLogout = async () => {
    console.log('handleLogout called in App.tsx - going to onboarding');
    
    try {
      // Obrisi sve podatke iz storage-a
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      console.log('Cleared storage data');
    } catch (error) {
      console.log('Error clearing storage:', error);
    }
    
    // Resetuj sve state-ove na pocetno stanje
    setShowOnboarding(true);
    setShowLogin(false);
    setShowResetPassword(false);
    setShowEnterCode(false);
    setShowCreatePassword(false);
    setShowSuccess(false);
    setShowDestinationDetail(false);
    setShowSignIn(false);
    setIsAuthenticated(false);
    setResetEmail('');
    setResetCode('');
    setSentCode('');
    setSelectedDestination(null);
    
    console.log('All states reset - should show onboarding now');
  };

  // Sign In handlers
  const handleShowSignIn = () => {
    setShowLogin(false);
    setShowSignIn(true);
  };

  const handleBackToLogin = () => {
    setShowSignIn(false);
    setShowLogin(true);
  };

  const handleSignInSuccess = () => {
    setShowSignIn(false);
    setShowLogin(true);
  };


  if (showOnboarding) {
    return <OnboardingScreen onGetStarted={handleGetStarted} />;
  }

  if (showDestinationDetail && selectedDestination) {
    return (
      <DestinationDetail 
        destination={selectedDestination}
        onBack={handleBackToDestinations}
      />
    );
  }

  if (isAuthenticated && !showDestinationDetail) {
    return (
      <NavigationContainer>
        <MainTabs onLogout={handleLogout} />
      </NavigationContainer>
    );
  }

  if (showSuccess) {
    return (
      <SuccessScreen 
        title="Uspešno!"
        message="Vaša lozinka je uspešno resetovana. Možete se sada prijaviti sa novom lozinkom."
        buttonText="Prijavi se"
        onButtonPress={handleSuccessContinue}
      />
    );
  }

  if (showResetPassword) {
    return (
      <ResetPasswordScreen 
        onBack={handleBackToLoginFromReset}
        onEmailSent={handleEmailSent}
      />
    );
  }

  if (showEnterCode) {
    return (
      <EnterCodeScreen 
        email={resetEmail}
        sentCode={sentCode}
        onBack={handleBackToEmailFromCode}
        onCodeVerified={handleCodeVerified}
      />
    );
  }

  if (showCreatePassword) {
    return (
      <CreateNewPasswordScreen 
        email={resetEmail}
        code={resetCode}
        onBack={handleBackToEmailFromPassword}
        onPasswordReset={handlePasswordResetComplete}
      />
    );
  }


  if (showSignIn) {
    return (
      <SignInScreen 
        onBack={handleBackToLogin}
        onSignInSuccess={handleSignInSuccess}
      />
    );
  }

  if (showLogin) {
    return (
      <LoginScreen 
        onLoginSuccess={handleLoginSuccess}
        onBack={handleBackToOnboarding}
        onForgotPassword={handleForgotPassword}
        onSignIn={handleShowSignIn}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Uspešno ste se prijavili! 🎉</Text>
      <TouchableOpacity style={styles.button} onPress={() => setShowOnboarding(true)}>
        <Text style={styles.buttonText}>Nazad na početak</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Sizes.lg,
  },
  title: {
    fontSize: Sizes.fontSize.xxxl,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Sizes.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Sizes.fontSize.lg,
    color: Colors.textSecondary,
    marginBottom: Sizes.xl,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Sizes.md,
    paddingHorizontal: Sizes.lg,
    borderRadius: Sizes.radius.md,
  },
  buttonText: {
    color: 'white',
    fontSize: Sizes.fontSize.md,
    fontWeight: 'bold',
  },
});