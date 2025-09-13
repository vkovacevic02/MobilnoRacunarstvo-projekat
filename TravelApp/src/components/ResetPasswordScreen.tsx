import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import api from '../services/api';

interface ResetPasswordScreenProps {
  onBack: () => void;
  onEmailSent: (email: string) => void;
}

export default function ResetPasswordScreen({ onBack, onEmailSent }: ResetPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendInstructions = async () => {
    if (!email) {
      Alert.alert('Greška', 'Molimo unesite email adresu');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Greška', 'Molimo unesite ispravnu email adresu');
      return;
    }

    setLoading(true);
    try {
      await api.sendPasswordResetEmail(email);
      onEmailSent(email);
    } catch (error: any) {
      Alert.alert('Greška', error.response?.data?.message || 'Došlo je do greške. Molimo pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Nazad</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.helpButton}>
          <Text style={styles.helpButtonText}>?</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Resetovanje lozinke</Text>
        
        <Text style={styles.description}>
          Unesite email povezan sa vašim nalogom i poslaćemo vam instrukcije za resetovanje lozinke.
        </Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email adresa</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Unesite vaš email"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Send Instructions Button */}
        <TouchableOpacity 
          style={[styles.sendButton, loading && styles.sendButtonDisabled]} 
          onPress={handleSendInstructions}
          disabled={loading}
        >
          <Text style={styles.sendButtonText}>
            {loading ? 'Šalje se...' : 'Pošalji instrukcije'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Sizes.lg,
    paddingTop: 50,
    paddingBottom: Sizes.lg,
  },
  backButton: {
    padding: Sizes.sm,
  },
  backButtonText: {
    color: 'white',
    fontSize: Sizes.fontSize.md,
    fontWeight: '500',
  },
  helpButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpButtonText: {
    color: 'white',
    fontSize: Sizes.fontSize.lg,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: Sizes.lg,
    paddingTop: Sizes.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Sizes.lg,
  },
  description: {
    fontSize: Sizes.fontSize.md,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
    marginBottom: Sizes.xl,
  },
  inputContainer: {
    marginBottom: Sizes.xl,
  },
  inputLabel: {
    fontSize: Sizes.fontSize.md,
    color: 'white',
    marginBottom: Sizes.sm,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Sizes.radius.md,
    paddingHorizontal: Sizes.lg,
    paddingVertical: Sizes.md,
    fontSize: Sizes.fontSize.md,
    color: 'white',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  sendButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: Sizes.lg,
    borderRadius: Sizes.radius.lg,
    alignItems: 'center',
    marginTop: Sizes.lg,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: 'white',
    fontSize: Sizes.fontSize.lg,
    fontWeight: 'bold',
  },
});
