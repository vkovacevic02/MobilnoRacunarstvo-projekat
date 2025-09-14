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
import Ionicons from '@expo/vector-icons/Ionicons';
import api from '../services/api';

const { height } = Dimensions.get('window');

interface ResetPasswordScreenProps {
  onBack: () => void;
  onEmailSent: (email: string, code: string) => void;
}

export default function ResetPasswordScreen({ onBack, onEmailSent }: ResetPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendInstructions = async () => {
    if (!email) {
      Alert.alert('Greška', 'Molimo unesite email adresu');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Greška', 'Molimo unesite ispravnu email adresu');
      return;
    }

    setLoading(true);
    try {
      const response = await api.sendPasswordResetEmail(email);
      onEmailSent(email, response.code);
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
            <Ionicons name="lock-closed-outline" size={40} color={Colors.primary} />
          </View>
          <Text style={authStyles.brandName}>Resetovanje lozinke</Text>
          <Text style={authStyles.brandSubtitle}>Travel Agency</Text>
        </View>

        {/* Form Container */}
        <View style={authStyles.formContainer}>
          <Text style={authStyles.subtitle}>
            Unesite email povezan sa vašim nalogom i poslaćemo vam kod za resetovanje lozinke.
          </Text>

          {/* Email Input */}
          <View style={authStyles.inputContainer}>
            <Ionicons style={authStyles.inputIcon} name="mail-outline" size={Sizes.icon.md} color={Colors.textSecondary} />
            <TextInput
              style={authStyles.textInput}
              placeholder="Email"
              placeholderTextColor="rgba(0, 0, 0, 0.6)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={authStyles.inputLine} />
          </View>

          {/* Send Instructions Button */}
          <TouchableOpacity 
            style={[authStyles.loginButton, loading && authStyles.loginButtonDisabled]} 
            onPress={handleSendInstructions}
            disabled={loading}
          >
            <Text style={authStyles.loginButtonText}>
              {loading ? 'Šalje se...' : 'Pošalji kod'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

