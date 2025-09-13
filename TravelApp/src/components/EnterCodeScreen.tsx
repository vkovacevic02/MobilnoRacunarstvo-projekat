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
} from 'react-native';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import api from '../services/api';

interface EnterCodeScreenProps {
  email: string;
  onBack: () => void;
  onCodeVerified: (code: string) => void;
}

export default function EnterCodeScreen({ email, onBack, onCodeVerified }: EnterCodeScreenProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<TextInput[]>([]);

  const handleCodeChange = (value: string, index: number) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-focus next input
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
      setError(error.response?.data?.message || 'Neispravan kod. Molimo pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      await api.sendPasswordResetEmail(email);
      Alert.alert('Uspešno', 'Novi kod je poslat na vaš email');
    } catch (error: any) {
      Alert.alert('Greška', error.response?.data?.message || 'Došlo je do greške. Molimo pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Nazad</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Unesite kod</Text>
        
        <Text style={styles.description}>
          Poslali smo 6-cifreni kod na vaš email adresu:
        </Text>
        
        <Text style={styles.emailText}>{email}</Text>

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
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Verify Button */}
        <TouchableOpacity 
          style={[styles.verifyButton, loading && styles.verifyButtonDisabled]} 
          onPress={handleVerifyCode}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.verifyButtonText}>Potvrdi kod</Text>
          )}
        </TouchableOpacity>

        {/* Resend Code */}
        <TouchableOpacity style={styles.resendContainer} onPress={handleResendCode}>
          <Text style={styles.resendText}>Niste primili kod? Pošaljite ponovo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizes.lg,
    paddingTop: 50,
    paddingBottom: Sizes.lg,
  },
  backButton: {
    padding: Sizes.sm,
  },
  backButtonText: {
    color: 'white',
    fontSize: Sizes.fontSize.md,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: Sizes.lg,
    paddingTop: Sizes.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Sizes.lg,
    textAlign: 'center',
  },
  description: {
    fontSize: Sizes.fontSize.md,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Sizes.sm,
    paddingHorizontal: Sizes.lg,
  },
  emailText: {
    fontSize: Sizes.fontSize.md,
    color: Colors.secondary,
    fontWeight: 'bold',
    marginBottom: Sizes.xl,
    textAlign: 'center',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Sizes.radius.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  codeInputError: {
    borderColor: '#ff6b6b',
  },
  errorContainer: {
    marginBottom: Sizes.lg,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: Sizes.fontSize.sm,
    textAlign: 'center',
    fontWeight: '500',
  },
  verifyButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'white',
    paddingVertical: Sizes.lg,
    paddingHorizontal: Sizes.xl,
    borderRadius: Sizes.radius.lg,
    alignItems: 'center',
    marginBottom: Sizes.lg,
    minWidth: 200,
  },
  verifyButtonDisabled: {
    opacity: 0.6,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: Sizes.fontSize.lg,
    fontWeight: 'bold',
  },
  resendContainer: {
    marginTop: Sizes.lg,
  },
  resendText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: Sizes.fontSize.sm,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
