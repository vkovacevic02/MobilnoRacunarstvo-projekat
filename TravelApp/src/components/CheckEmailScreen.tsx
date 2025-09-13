import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Linking,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';

interface CheckEmailScreenProps {
  email: string;
  onBack: () => void;
  onContinue: () => void;
}

export default function CheckEmailScreen({ email, onBack, onContinue }: CheckEmailScreenProps) {
  const handleOpenEmailApp = async () => {
    try {
      await Linking.openURL('mailto:');
    } catch (error) {
      console.log('Could not open email app');
    }
  };

  const handleTryAnotherEmail = () => {
    onBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Content */}
      <View style={styles.content}>
        {/* Email Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.emailIcon}>
            <Text style={styles.envelopeIcon}>✉️</Text>
            <View style={styles.arrowContainer}>
              <Text style={styles.arrowIcon}>→</Text>
            </View>
          </View>
        </View>

        <Text style={styles.title}>Proverite vaš email</Text>
        
        <Text style={styles.description}>
          Poslali smo instrukcije za resetovanje lozinke na vaš email.
        </Text>

        {/* Open Email App Button */}
        <TouchableOpacity style={styles.openEmailButton} onPress={handleOpenEmailApp}>
          <Text style={styles.openEmailButtonText}>Otvori email aplikaciju</Text>
        </TouchableOpacity>

        {/* Skip Link */}
        <TouchableOpacity style={styles.skipContainer} onPress={onContinue}>
          <Text style={styles.skipText}>Preskoči, potvrdiću kasnije</Text>
        </TouchableOpacity>

        {/* Footer Text */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Niste primili email? Proverite spam folder, ili{' '}
            <Text style={styles.linkText} onPress={handleTryAnotherEmail}>
              pokušajte sa drugom email adresom
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: Sizes.lg,
    paddingTop: Sizes.xl,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: Sizes.xl,
    marginTop: Sizes.xl,
  },
  emailIcon: {
    width: 80,
    height: 80,
    backgroundColor: Colors.secondary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  envelopeIcon: {
    fontSize: 40,
  },
  arrowContainer: {
    position: 'absolute',
    right: -10,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  arrowIcon: {
    fontSize: 20,
    color: Colors.secondary,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: Sizes.lg,
  },
  description: {
    fontSize: Sizes.fontSize.md,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Sizes.xl,
    paddingHorizontal: Sizes.md,
  },
  openEmailButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: Sizes.lg,
    paddingHorizontal: Sizes.xl,
    borderRadius: Sizes.radius.lg,
    alignItems: 'center',
    marginBottom: Sizes.lg,
    minWidth: 200,
  },
  openEmailButtonText: {
    color: 'white',
    fontSize: Sizes.fontSize.lg,
    fontWeight: 'bold',
  },
  skipContainer: {
    marginBottom: Sizes.xl,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: Sizes.fontSize.md,
    textAlign: 'center',
  },
  footerContainer: {
    paddingHorizontal: Sizes.lg,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: Sizes.fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  linkText: {
    color: Colors.secondary,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});
