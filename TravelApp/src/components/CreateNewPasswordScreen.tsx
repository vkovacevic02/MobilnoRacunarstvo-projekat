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
  Image,
  Dimensions,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import { Images } from '../constants/images';
import { authStyles } from '../styles/authStyles';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

const { height } = Dimensions.get('window');

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
            <Ionicons name="shield-checkmark-outline" size={40} color={Colors.primary} />
          </View>
          <Text style={authStyles.brandName}>Kreiraj novu lozinku</Text>
          <Text style={authStyles.brandSubtitle}>Travel Agency</Text>
        </View>

        {/* Form Container */}
        <View style={authStyles.formContainer}>
          <Text style={authStyles.subtitle}>
            Vaša nova lozinka mora biti drugačija od prethodno korišćenih lozinki.
          </Text>

          {/* Password Input */}
          <View style={authStyles.inputContainer}>
            <Ionicons style={authStyles.inputIcon} name="lock-closed-outline" size={Sizes.icon.md} color={Colors.textSecondary} />
            <TextInput
              style={authStyles.textInput}
              placeholder="Lozinka"
              placeholderTextColor="rgba(0, 0, 0, 0.6)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity 
              style={authStyles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={Sizes.icon.md} color={Colors.textSecondary} />
            </TouchableOpacity>
            <View style={authStyles.inputLine} />
          </View>
          <Text style={styles.passwordHint}>Mora imati najmanje 8 karaktera.</Text>

          {/* Confirm Password Input */}
          <View style={authStyles.inputContainer}>
            <Ionicons style={authStyles.inputIcon} name="lock-closed-outline" size={Sizes.icon.md} color={Colors.textSecondary} />
            <TextInput
              style={authStyles.textInput}
              placeholder="Potvrdi lozinku"
              placeholderTextColor="rgba(0, 0, 0, 0.6)"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity 
              style={authStyles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons name={showConfirmPassword ? 'eye' : 'eye-off'} size={Sizes.icon.md} color={Colors.textSecondary} />
            </TouchableOpacity>
            <View style={authStyles.inputLine} />
          </View>
          <Text style={styles.passwordHint}>Obje lozinke se moraju poklapati.</Text>

          {/* Reset Password Button */}
          <TouchableOpacity 
            style={[authStyles.loginButton, loading && authStyles.loginButtonDisabled]} 
            onPress={handleResetPassword}
            disabled={loading}
          >
            <Text style={authStyles.loginButtonText}>
              {loading ? 'Resetuje se...' : 'Resetuj lozinku'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  passwordHint: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Sizes.xs,
    marginBottom: Sizes.md,
  },
});
