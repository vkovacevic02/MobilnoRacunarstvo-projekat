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
      
      // Uspesna prijava
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
              style={authStyles.textInput}
              placeholder="Email"
              placeholderTextColor="rgba(0, 0, 0, 0.6)"
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
              style={authStyles.textInput}
              placeholder="Password"
              placeholderTextColor="rgba(0, 0, 0, 0.6)"
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
            <View style={authStyles.errorContainer}>
              <Text style={authStyles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Forgot Password */}
          <TouchableOpacity 
            style={authStyles.forgotPasswordContainer}
            onPress={onForgotPassword}
          >
            <Text style={authStyles.forgotPasswordText}>Zaboravljena lozinka?</Text>
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
              <Text style={authStyles.loginButtonText}>PRIJAVI SE</Text>
            )}
          </TouchableOpacity>

          {/* OR Divider */}
          <View style={authStyles.orContainer}>
            <View style={authStyles.orLine} />
            <Text style={authStyles.orText}>ILI</Text>
            <View style={authStyles.orLine} />
          </View>

          {/* Sign In Button */}
          <TouchableOpacity 
            style={authStyles.signInButton} 
            onPress={onSignIn}
          >
            <Text style={authStyles.signInButtonText}>REGISTRUJ SE</Text>
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
}

