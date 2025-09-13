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
import { Images } from '../constants/images';
import { authStyles } from '../styles/authStyles';
import Ionicons from '@expo/vector-icons/Ionicons';
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
    <SafeAreaView style={authStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Image */}
      <View style={authStyles.imageContainer}>
        <Image
          source={{ uri: Images.auth.loginBg }}
          style={authStyles.backgroundImage}
          resizeMode="cover"
        />
        
        {/* Back Button */}
        <TouchableOpacity style={authStyles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Content Overlay */}
      <View style={authStyles.contentOverlay}>
        {/* Logo and Branding */}
        <View style={authStyles.logoContainer}>
          <View style={authStyles.logoCircle}>
            <Ionicons name="airplane-outline" size={40} color={Colors.primary} />
          </View>
          <Text style={authStyles.brandName}>Vivir La Vida</Text>
          <Text style={authStyles.brandSubtitle}>Travel Agency</Text>
        </View>

        {/* Login Form */}
        <View style={authStyles.formContainer}>
          {/* Email Input */}
          <View style={authStyles.inputContainer}>
            <Ionicons style={authStyles.inputIcon} name="mail-outline" size={Sizes.icon.md} color={Colors.textSecondary} />
            <TextInput
<<<<<<< HEAD
              style={authStyles.textInput}
              placeholder="Email (danica@gmail.com)"
              placeholderTextColor="rgba(17, 24, 39, 0.5)"
=======
              style={styles.textInput}
              placeholder="Email"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
>>>>>>> 883eaf60c2e78db671a15e773c936f50ee8fc798
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={authStyles.inputLine} />
          </View>

          {/* Password Input */}
          <View style={authStyles.inputContainer}>
            <Ionicons style={authStyles.inputIcon} name="lock-closed-outline" size={Sizes.icon.md} color={Colors.textSecondary} />
            <TextInput
<<<<<<< HEAD
              style={authStyles.textInput}
              placeholder="Password (danica123)"
              placeholderTextColor="rgba(17, 24, 39, 0.5)"
=======
              style={styles.textInput}
              placeholder="Password"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
>>>>>>> 883eaf60c2e78db671a15e773c936f50ee8fc798
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) setError('');
              }}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              style={authStyles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={Sizes.icon.md} color={Colors.textSecondary} />
            </TouchableOpacity>
            <View style={authStyles.inputLine} />
          </View>

          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Forgot Password */}
<<<<<<< HEAD
          <TouchableOpacity style={authStyles.forgotPasswordContainer} onPress={handleTestLogin}>
            <Text style={authStyles.forgotPasswordText}>Test Login (danica@gmail.com)</Text>
=======
          <TouchableOpacity 
            style={styles.forgotPasswordContainer}
            onPress={onForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Zaboravljena lozinka?</Text>
>>>>>>> 883eaf60c2e78db671a15e773c936f50ee8fc798
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity 
            style={[authStyles.loginButton, loading && authStyles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={authStyles.loginButtonText}>LOGIN</Text>
            )}
          </TouchableOpacity>

          {/* OR Divider */}
          <View style={authStyles.orContainer}>
            <View style={authStyles.orLine} />
            <Text style={authStyles.orText}>OR</Text>
            <View style={authStyles.orLine} />
          </View>

<<<<<<< HEAD
          {/* Register Button */}
          <TouchableOpacity style={authStyles.registerButton} onPress={handleRegister}>
            <Text style={authStyles.registerButtonText}>CREATE ACCOUNT</Text>
=======
          {/* Sign In Button */}
          <TouchableOpacity 
            style={styles.signInButton} 
            onPress={onSignIn}
          >
            <Text style={styles.signInButtonText}>SIGN IN</Text>
>>>>>>> 883eaf60c2e78db671a15e773c936f50ee8fc798
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
}
<<<<<<< HEAD
 
=======

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
>>>>>>> 883eaf60c2e78db671a15e773c936f50ee8fc798

