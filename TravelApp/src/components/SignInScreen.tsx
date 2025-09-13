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
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import api from '../services/api';

interface SignInScreenProps {
  onSignInSuccess: () => void;
  onBack: () => void;
}

export default function SignInScreen({ onSignInSuccess, onBack }: SignInScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Molimo unesite sve podatke');
      return;
    }

    if (password !== confirmPassword) {
      setError('Lozinke se ne poklapaju');
      return;
    }

    if (password.length < 8) {
      setError('Lozinka mora imati najmanje 8 karaktera');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await api.register({ name, email, password });
      Alert.alert(
        'Uspešno!', 
        'Uspešno ste se registrovali. Možete se sada prijaviti.',
        [{ text: 'OK', onPress: onSignInSuccess }]
      );
    } catch (error: any) {
      setError(error.response?.data?.message || 'Došlo je do greške. Molimo pokušajte ponovo.');
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
        <Text style={styles.title}>Kreiraj nalog</Text>
        <Text style={styles.subtitle}>Registrujte se da biste pristupili aplikaciji</Text>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>👤</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ime i prezime"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (error) setError('');
              }}
              autoCapitalize="words"
            />
            <View style={styles.inputLine} />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>📧</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Email"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.inputLine} />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Lozinka"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) setError('');
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity 
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
            <View style={styles.inputLine} />
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Potvrdi lozinku"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (error) setError('');
              }}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity 
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
            <View style={styles.inputLine} />
          </View>

          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Sign In Button */}
          <TouchableOpacity 
            style={[styles.signInButton, loading && styles.signInButtonDisabled]} 
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.signInButtonText}>KREIRAJ NALOG</Text>
            )}
          </TouchableOpacity>
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
    marginBottom: Sizes.sm,
  },
  subtitle: {
    fontSize: Sizes.fontSize.md,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: Sizes.xl,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.lg,
    paddingHorizontal: Sizes.md,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: Sizes.md,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  textInput: {
    flex: 1,
    fontSize: Sizes.fontSize.md,
    color: 'white',
    paddingVertical: Sizes.md,
  },
  eyeButton: {
    padding: Sizes.sm,
  },
  eyeIcon: {
    fontSize: 20,
  },
  inputLine: {
    position: 'absolute',
    bottom: 0,
    left: Sizes.md + 20 + Sizes.md,
    right: Sizes.md,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  errorContainer: {
    marginTop: Sizes.sm,
    marginBottom: Sizes.lg,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: Sizes.fontSize.sm,
    textAlign: 'center',
    fontWeight: '500',
  },
  signInButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: Sizes.lg,
    borderRadius: Sizes.radius.lg,
    alignItems: 'center',
    marginTop: Sizes.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signInButtonDisabled: {
    opacity: 0.6,
  },
  signInButtonText: {
    color: 'white',
    fontSize: Sizes.fontSize.lg,
    fontWeight: 'bold',
  },
});
