import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import api from '../services/api';

const { width, height } = Dimensions.get('window');

interface SignInScreenProps {
  onRegisterSuccess: () => void;
  onBack: () => void;
}

export default function SignInScreen({ onRegisterSuccess, onBack }: SignInScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Greška', 'Molimo unesite ime');
      return false;
    }
    
    if (!email.trim()) {
      Alert.alert('Greška', 'Molimo unesite email adresu');
      return false;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Greška', 'Molimo unesite validnu email adresu');
      return false;
    }
    
    if (!password) {
      Alert.alert('Greška', 'Molimo unesite lozinku');
      return false;
    }
    
    if (password.length < 8) {
      Alert.alert('Greška', 'Lozinka mora imati najmanje 8 karaktera');
      return false;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Greška', 'Lozinke se ne poklapaju');
      return false;
    }
    
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        password_confirmation: confirmPassword,
      });
      
      // Uspešna registracija
      Alert.alert(
        'Uspešno!', 
        'Uspešno ste se registrovali! Sada se možete prijaviti.',
        [{ text: 'OK', onPress: onRegisterSuccess }]
      );
    } catch (error: any) {
      console.error('Register error:', error);
      
      // Handle specific validation errors
      if (error.response?.data?.data) {
        const errors = error.response.data.data;
        let errorMessage = '';
        
        if (errors.email) {
          errorMessage += errors.email[0] + '\n';
        }
        if (errors.password) {
          errorMessage += errors.password[0] + '\n';
        }
        if (errors.name) {
          errorMessage += errors.name[0] + '\n';
        }
        
        Alert.alert('Greška', errorMessage.trim() || 'Greška pri registraciji');
      } else {
        Alert.alert('Greška', error.message || 'Greška pri registraciji. Molimo pokušajte ponovo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ 
            uri: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1080&h=1920&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
      </View>

      {/* Content Overlay */}
      <View style={styles.contentOverlay}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Logo and Branding */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoIcon}>✈️</Text>
            </View>
            <Text style={styles.brandName}>
              <Text style={styles.brandNameGo}>Go</Text>
              <Text style={styles.brandNameTravel}>Travel</Text>
            </Text>
            <Text style={styles.brandSubtitle}>CREATE ACCOUNT</Text>
          </View>

          {/* Register Form */}
          <View style={styles.formContainer}>
            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Full Name"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
              <View style={styles.inputLine} />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>📧</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Email Address"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={email}
                onChangeText={setEmail}
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
                placeholder="Password (min 8 characters)"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
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
                placeholder="Confirm Password"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
              <View style={styles.inputLine} />
            </View>

            {/* Register Button */}
            <TouchableOpacity 
              style={[styles.registerButton, loading && styles.registerButtonDisabled]} 
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.registerButtonText}>CREATE ACCOUNT</Text>
              )}
            </TouchableOpacity>

            {/* OR Divider */}
            <View style={styles.orContainer}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.orLine} />
            </View>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={onBack}>
              <Text style={styles.loginButtonText}>ALREADY HAVE ACCOUNT? LOGIN</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  contentOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: Sizes.lg,
    paddingTop: Sizes.xl,
    paddingBottom: Sizes.xxl,
    maxHeight: height * 0.8,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Sizes.lg,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizes.sm,
  },
  logoIcon: {
    fontSize: 30,
  },
  brandName: {
    fontSize: Sizes.fontSize.xxl,
    fontWeight: 'bold',
    marginBottom: Sizes.xs,
  },
  brandNameGo: {
    color: '#D2691E', // Terracotta color
  },
  brandNameTravel: {
    color: 'white',
  },
  brandSubtitle: {
    fontSize: Sizes.fontSize.sm,
    color: 'white',
    letterSpacing: 2,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: Sizes.md,
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
    fontSize: Sizes.fontSize.md,
    zIndex: 1,
  },
  textInput: {
    fontSize: Sizes.fontSize.sm,
    color: 'white',
    paddingLeft: 30,
    paddingVertical: Sizes.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  eyeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: Sizes.sm,
  },
  eyeIcon: {
    fontSize: Sizes.fontSize.md,
  },
  inputLine: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginTop: Sizes.xs,
  },
  registerButton: {
    backgroundColor: '#D2691E', // Terracotta color
    paddingVertical: Sizes.md,
    borderRadius: Sizes.radius.lg,
    alignItems: 'center',
    marginTop: Sizes.lg,
    marginBottom: Sizes.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: 'white',
    fontSize: Sizes.fontSize.md,
    fontWeight: 'bold',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Sizes.md,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  orText: {
    color: 'white',
    fontSize: Sizes.fontSize.sm,
    marginHorizontal: Sizes.md,
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'white',
    paddingVertical: Sizes.md,
    borderRadius: Sizes.radius.lg,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: Sizes.fontSize.sm,
    fontWeight: 'bold',
  },
});
