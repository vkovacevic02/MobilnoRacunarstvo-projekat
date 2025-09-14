import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import { Images } from '../constants/images';
import { authStyles } from '../styles/authStyles';
import api from '../services/api';

interface SignInScreenProps {
  onBack: () => void;
  onSignInSuccess: (email: string) => void;
}

export default function SignInScreen({ onBack, onSignInSuccess }: SignInScreenProps) {
  const [formData, setFormData] = useState({
    ime: '',
    prezime: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefon: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.ime.trim()) {
      newErrors.ime = 'Ime je obavezno';
    }

    if (!formData.prezime.trim()) {
      newErrors.prezime = 'Prezime je obavezno';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email je obavezan';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email nije validan';
    }

    if (!formData.password) {
      newErrors.password = 'Lozinka je obavezna';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Lozinka mora imati najmanje 6 karaktera';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Lozinke se ne poklapaju';
    }

    if (!formData.telefon.trim()) {
      newErrors.telefon = 'Telefon je obavezan';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      console.log('Pozivam API za registraciju...');
      const response = await api.register({
        ime: formData.ime,
        prezime: formData.prezime,
        email: formData.email,
        password: formData.password,
        telefon: formData.telefon,
        role: 'putnik'
      });

      console.log('API odgovor:', response);
      console.log('Registracija uspešna, prelazimo na verifikaciju za:', formData.email);
      // Odmah prelazimo na verifikaciju
      onSignInSuccess(formData.email);
    } catch (error: any) {
      console.error('Greška pri registraciji:', error);
      Alert.alert(
        'Greška',
        error.response?.data?.message || 'Došlo je do greške pri registraciji. Pokušajte ponovo.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      {/* Background Image */}
      <View style={authStyles.imageContainer}>
        <Image
          source={{ uri: Images.auth.registerBg }}
          style={authStyles.backgroundImage}
          resizeMode="cover"
        />
        
        {/* Back Button */}
        <TouchableOpacity style={authStyles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Content Overlay */}
      <View style={authStyles.contentOverlay}>
        <Text style={authStyles.subtitle}>
          Kreirajte svoj nalog da biste pristupili destinacijama
        </Text>

        {/* Ime */}
        <View style={authStyles.inputContainer}>
          <Ionicons style={authStyles.inputIcon} name="person-outline" size={Sizes.icon.md} color={Colors.textSecondary} />
          <TextInput
            style={[authStyles.textInput, errors.ime && authStyles.textInputError]}
            placeholder="Ime"
            placeholderTextColor="rgba(0, 0, 0, 0.6)"
            value={formData.ime}
            onChangeText={(value) => handleInputChange('ime', value)}
            autoCapitalize="words"
          />
          {errors.ime && <Text style={authStyles.errorText}>{errors.ime}</Text>}
          <View style={authStyles.inputLine} />
        </View>

        {/* Prezime */}
        <View style={authStyles.inputContainer}>
          <Ionicons style={authStyles.inputIcon} name="person-outline" size={Sizes.icon.md} color={Colors.textSecondary} />
          <TextInput
            style={[authStyles.textInput, errors.prezime && authStyles.textInputError]}
            placeholder="Prezime"
            placeholderTextColor="rgba(0, 0, 0, 0.6)"
            value={formData.prezime}
            onChangeText={(value) => handleInputChange('prezime', value)}
            autoCapitalize="words"
          />
          {errors.prezime && <Text style={authStyles.errorText}>{errors.prezime}</Text>}
          <View style={authStyles.inputLine} />
        </View>

        {/* Email */}
        <View style={authStyles.inputContainer}>
          <Ionicons style={authStyles.inputIcon} name="mail-outline" size={Sizes.icon.md} color={Colors.textSecondary} />
          <TextInput
            style={[authStyles.textInput, errors.email && authStyles.textInputError]}
            placeholder="Email"
            placeholderTextColor="rgba(0, 0, 0, 0.6)"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={authStyles.errorText}>{errors.email}</Text>}
          <View style={authStyles.inputLine} />
        </View>

        {/* Telefon */}
        <View style={authStyles.inputContainer}>
          <Ionicons style={authStyles.inputIcon} name="call-outline" size={Sizes.icon.md} color={Colors.textSecondary} />
          <TextInput
            style={[authStyles.textInput, errors.telefon && authStyles.textInputError]}
            placeholder="Telefon"
            placeholderTextColor="rgba(0, 0, 0, 0.6)"
            value={formData.telefon}
            onChangeText={(value) => handleInputChange('telefon', value)}
            keyboardType="phone-pad"
          />
          {errors.telefon && <Text style={authStyles.errorText}>{errors.telefon}</Text>}
          <View style={authStyles.inputLine} />
        </View>

        {/* Lozinka */}
        <View style={authStyles.inputContainer}>
          <Ionicons style={authStyles.inputIcon} name="lock-closed-outline" size={Sizes.icon.md} color={Colors.textSecondary} />
          <TextInput
            style={[authStyles.textInput, errors.password && authStyles.textInputError]}
            placeholder="Lozinka"
            placeholderTextColor="rgba(0, 0, 0, 0.6)"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            secureTextEntry
          />
          {errors.password && <Text style={authStyles.errorText}>{errors.password}</Text>}
          <View style={authStyles.inputLine} />
        </View>

        {/* Potvrda lozinke */}
        <View style={authStyles.inputContainer}>
          <Ionicons style={authStyles.inputIcon} name="lock-closed-outline" size={Sizes.icon.md} color={Colors.textSecondary} />
          <TextInput
            style={[authStyles.textInput, errors.confirmPassword && authStyles.textInputError]}
            placeholder="Potvrdite lozinku"
            placeholderTextColor="rgba(0, 0, 0, 0.6)"
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            secureTextEntry
          />
          {errors.confirmPassword && <Text style={authStyles.errorText}>{errors.confirmPassword}</Text>}
          <View style={authStyles.inputLine} />
        </View>

        {/* Registracija dugme */}
        <TouchableOpacity
          style={[authStyles.loginButton, loading && authStyles.loginButtonDisabled]}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text style={authStyles.loginButtonText}>
            {loading ? 'Registracija...' : 'Registruj se'}
          </Text>
        </TouchableOpacity>

        {/* Već imate nalog */}
        <View style={authStyles.signInContainer}>
          <Text style={authStyles.signInText}>Već imate nalog? </Text>
          <TouchableOpacity onPress={onBack}>
            <Text style={authStyles.signInButtonText}>Prijavite se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}