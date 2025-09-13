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

interface CreateNewPasswordScreenProps {
  email: string;
  code: string;
  onBack: () => void;
  onPasswordReset: () => void;
}

export default function CreateNewPasswordScreen({ email, code, onBack, onPasswordReset }: CreateNewPasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Greška', 'Molimo unesite lozinku i potvrdu lozinke');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Greška', 'Lozinka mora imati najmanje 8 karaktera');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Greška', 'Lozinke se ne poklapaju');
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword(email, password, code);
      // Uspešno resetovanje - pozovi callback bez Alert-a
      onPasswordReset();
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
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Kreiraj novu lozinku</Text>
        
        <Text style={styles.description}>
          Vaša nova lozinka mora biti drugačija od prethodno korišćenih lozinki.
        </Text>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Lozinka</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Unesite novu lozinku"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity 
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.passwordHint}>Mora imati najmanje 8 karaktera.</Text>
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Potvrdi lozinku</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Potvrdite novu lozinku"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity 
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.passwordHint}>Obje lozinke se moraju poklapati.</Text>
        </View>

        {/* Reset Password Button */}
        <TouchableOpacity 
          style={[styles.resetButton, loading && styles.resetButtonDisabled]} 
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Text style={styles.resetButtonText}>
            {loading ? 'Resetuje se...' : 'Resetuj lozinku'}
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
  content: {
    flex: 1,
    paddingHorizontal: Sizes.lg,
    paddingTop: Sizes.lg,
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
    marginBottom: Sizes.lg,
  },
  inputLabel: {
    fontSize: Sizes.fontSize.md,
    color: 'white',
    marginBottom: Sizes.sm,
    fontWeight: '500',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Sizes.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  textInput: {
    flex: 1,
    paddingHorizontal: Sizes.lg,
    paddingVertical: Sizes.md,
    fontSize: Sizes.fontSize.md,
    color: 'white',
  },
  eyeButton: {
    padding: Sizes.sm,
    marginRight: Sizes.sm,
  },
  eyeIcon: {
    fontSize: 20,
  },
  passwordHint: {
    fontSize: Sizes.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: Sizes.xs,
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'white',
    paddingVertical: Sizes.lg,
    borderRadius: Sizes.radius.lg,
    alignItems: 'center',
    marginTop: Sizes.lg,
  },
  resetButtonDisabled: {
    opacity: 0.6,
  },
  resetButtonText: {
    color: 'white',
    fontSize: Sizes.fontSize.lg,
    fontWeight: 'bold',
  },
});
