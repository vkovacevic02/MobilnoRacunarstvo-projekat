import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import api from '../services/api';

const { width, height } = Dimensions.get('window');

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onBack: () => void;
  onForgotPassword?: () => void;
  onSignIn?: () => void;
}

export default function LoginScreen({ onLoginSuccess, onBack, onForgotPassword, onSignIn }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const handleLogin = async () => {
    if (!email || !password) {
      setError('Molimo unesite email i lozinku');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const response = await api.login({ email, password });
      
      // Uspješna prijava
      onLoginSuccess();
    } catch (error: any) {
      setError('Hm, ne možemo da pronađemo nalog za ovaj email');
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
            uri: 'https://images.unsplash.com/photo-1578922746465-3a80a228f223?q=80&w=1080&h=1920&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
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
        {/* Logo and Branding */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>✈️</Text>
          </View>
          <Text style={styles.brandName}>
            <Text style={styles.brandNameGo}>Go</Text>
            <Text style={styles.brandNameTravel}>Travel</Text>
          </Text>
          <Text style={styles.brandSubtitle}>TRAVEL AGENCY</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>👤</Text>
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
              placeholder="Password"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) setError('');
              }}
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

          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Forgot Password */}
          <TouchableOpacity 
            style={styles.forgotPasswordContainer}
            onPress={onForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Zaboravljena lozinka?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>LOGIN</Text>
            )}
          </TouchableOpacity>

          {/* OR Divider */}
          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          {/* Sign In Button */}
          <TouchableOpacity 
            style={styles.signInButton} 
            onPress={onSignIn}
          >
            <Text style={styles.signInButtonText}>SIGN IN</Text>
          </TouchableOpacity>

        </View>
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
    minHeight: height * 0.6,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Sizes.xl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizes.md,
  },
  logoIcon: {
    fontSize: 40,
  },
  brandName: {
    fontSize: Sizes.fontSize.xxxl,
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
    marginBottom: Sizes.lg,
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
    fontSize: Sizes.fontSize.lg,
    zIndex: 1,
  },
  textInput: {
    fontSize: Sizes.fontSize.md,
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
    fontSize: Sizes.fontSize.lg,
  },
  inputLine: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginTop: Sizes.xs,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: Sizes.xl,
  },
  forgotPasswordText: {
    color: 'white',
    fontSize: Sizes.fontSize.sm,
  },
  loginButton: {
    backgroundColor: '#D2691E', // Terracotta color
    paddingVertical: Sizes.lg,
    borderRadius: Sizes.radius.lg,
    alignItems: 'center',
    marginBottom: Sizes.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: 'white',
    fontSize: Sizes.fontSize.lg,
    fontWeight: 'bold',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Sizes.lg,
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
  signInButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'white',
    paddingVertical: Sizes.lg,
    borderRadius: Sizes.radius.lg,
    alignItems: 'center',
  },
  signInButtonText: {
    color: 'white',
    fontSize: Sizes.fontSize.lg,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'white',
    paddingVertical: Sizes.lg,
    borderRadius: Sizes.radius.lg,
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'white',
    fontSize: Sizes.fontSize.lg,
    fontWeight: 'bold',
  },
  errorContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});

