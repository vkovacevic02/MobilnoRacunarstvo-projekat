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
  onRegister?: () => void;
}

export default function LoginScreen({ onLoginSuccess, onBack, onRegister }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Greška', 'Molimo unesite email i lozinku');
      return;
    }

    try {
      setLoading(true);
      const response = await api.login({ email, password });
      
      // Uspješna prijava
      onLoginSuccess();
    } catch (error: any) {
      let errorMessage = 'Greška pri prijavi. Molimo pokušajte ponovo.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Greška', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    // Navigate to registration screen - this will be handled by parent component
    onRegister?.();
  };

  const handleTestLogin = () => {
    setEmail('danica@gmail.com');
    setPassword('danica123');
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
              placeholder="Email (danica@gmail.com)"
              placeholderTextColor="rgba(17, 24, 39, 0.5)"
              value={email}
              onChangeText={setEmail}
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
              placeholder="Password (danica123)"
              placeholderTextColor="rgba(17, 24, 39, 0.5)"
              value={password}
              onChangeText={setPassword}
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

          {/* Forgot Password */}
          <TouchableOpacity style={authStyles.forgotPasswordContainer} onPress={handleTestLogin}>
            <Text style={authStyles.forgotPasswordText}>Test Login (danica@gmail.com)</Text>
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

          {/* Register Button */}
          <TouchableOpacity style={authStyles.registerButton} onPress={handleRegister}>
            <Text style={authStyles.registerButtonText}>CREATE ACCOUNT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
 

