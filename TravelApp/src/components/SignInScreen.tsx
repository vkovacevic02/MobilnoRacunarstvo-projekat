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
import { Images } from '../constants/images';
import { authStyles } from '../styles/authStyles';
import Ionicons from '@expo/vector-icons/Ionicons';
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
    <SafeAreaView style={authStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Image */}
      <View style={authStyles.imageContainer}>
        <Image
          source={{ uri: Images.auth.registerBg }}
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
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Logo and Branding */}
          <View style={authStyles.logoContainer}>
            <View style={authStyles.logoCircle}>
              <Ionicons name="airplane-outline" size={40} color={Colors.primary} />
            </View>
            <Text style={authStyles.brandName}>Vivir La Vida</Text>
            <Text style={authStyles.brandSubtitle}>Create Account</Text>
          </View>

          {/* Register Form */}
          <View style={authStyles.formContainer}>
            {/* Name Input */}
            <View style={authStyles.inputContainer}>
              <Ionicons style={authStyles.inputIcon} name="person-outline" size={Sizes.icon.md} color={Colors.textSecondary} />
              <TextInput
                style={authStyles.textInput}
                placeholder="Full Name"
                placeholderTextColor="rgba(17, 24, 39, 0.5)"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
              <View style={authStyles.inputLine} />
            </View>

            {/* Email Input */}
            <View style={authStyles.inputContainer}>
              <Ionicons style={authStyles.inputIcon} name="mail-outline" size={Sizes.icon.md} color={Colors.textSecondary} />
              <TextInput
                style={authStyles.textInput}
                placeholder="Email Address"
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
                placeholder="Password (min 8 characters)"
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

            {/* Confirm Password Input */}
            <View style={authStyles.inputContainer}>
              <Ionicons style={authStyles.inputIcon} name="lock-closed-outline" size={Sizes.icon.md} color={Colors.textSecondary} />
              <TextInput
                style={authStyles.textInput}
                placeholder="Confirm Password"
                placeholderTextColor="rgba(17, 24, 39, 0.5)"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity 
                style={authStyles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons name={showConfirmPassword ? 'eye' : 'eye-off'} size={Sizes.icon.md} color={Colors.textSecondary} />
              </TouchableOpacity>
              <View style={authStyles.inputLine} />
            </View>

            {/* Register Button */}
            <TouchableOpacity 
              style={[authStyles.loginButton, loading && authStyles.loginButtonDisabled]} 
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={authStyles.loginButtonText}>CREATE ACCOUNT</Text>
              )}
            </TouchableOpacity>

            {/* OR Divider */}
            <View style={authStyles.orContainer}>
              <View style={authStyles.orLine} />
              <Text style={authStyles.orText}>OR</Text>
              <View style={authStyles.orLine} />
            </View>

            {/* Login Button */}
            <TouchableOpacity style={authStyles.registerButton} onPress={onBack}>
              <Text style={authStyles.registerButtonText}>ALREADY HAVE ACCOUNT? LOGIN</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
 
