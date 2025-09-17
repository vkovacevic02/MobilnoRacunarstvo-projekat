import React, { useState, useRef } from 'react';
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

interface EnterCodeScreenProps {
  email: string;
  sentCode: string;
  onBack: () => void;
  onCodeVerified: (code: string) => void;
}

export default function EnterCodeScreen({ email, sentCode, onBack, onCodeVerified }: EnterCodeScreenProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<TextInput[]>([]);

  const handleCodeChange = (value: string, index: number) => {
    if (value.length > 1) return; 
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async () => {
    const fullCode = code.join('');
    
    if (fullCode.length !== 6) {
      setError('Molimo unesite kompletan kod');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await api.verifyResetCode(email, fullCode);
      onCodeVerified(fullCode);
    } catch (error: any) {
      setError('Uneli ste pogrešan kod. Molimo pokušajte ponovo.');
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
            <Ionicons name="key-outline" size={40} color={Colors.primary} />
          </View>
          <Text style={authStyles.brandName}>Unesite kod</Text>
          <Text style={authStyles.brandSubtitle}>Travel Agency</Text>
        </View>

        {/* Form Container */}
        <View style={authStyles.formContainer}>
          <Text style={authStyles.subtitle}>
            Poslali smo 6-cifreni kod na vaš email adresu:
          </Text>
          
          <Text style={styles.emailText}>{email}</Text>

          {/* Show the sent code */}
          <View style={styles.codeDisplayContainer}>
            <Text style={styles.codeDisplayLabel}>Poslani kod:</Text>
            <Text style={styles.codeDisplayText}>{sentCode}</Text>
          </View>

          {/* Code Input */}
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                style={[styles.codeInput, error && styles.codeInputError]}
                value={digit}
                onChangeText={(value) => handleCodeChange(value, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Error Message */}
          {error ? (
            <View style={authStyles.errorContainer}>
              <Text style={authStyles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Verify Button */}
          <TouchableOpacity 
            style={[authStyles.loginButton, loading && authStyles.loginButtonDisabled]} 
            onPress={handleVerifyCode}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={authStyles.loginButtonText}>Potvrdi kod</Text>
            )}
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  emailText: {
    fontSize: Sizes.fontSize.md,
    color: Colors.secondary,
    fontWeight: 'bold',
    marginBottom: Sizes.lg,
    textAlign: 'center',
  },
  codeDisplayContainer: {
    backgroundColor: Colors.surface,
    padding: Sizes.lg,
    borderRadius: Sizes.radius.md,
    marginBottom: Sizes.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  codeDisplayLabel: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Sizes.sm,
  },
  codeDisplayText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    letterSpacing: 4,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Sizes.xl,
    paddingHorizontal: Sizes.lg,
  },
  codeInput: {
    width: 45,
    height: 55,
    backgroundColor: Colors.surface,
    borderRadius: Sizes.radius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  codeInputError: {
    borderColor: '#ff6b6b',
  },
});
