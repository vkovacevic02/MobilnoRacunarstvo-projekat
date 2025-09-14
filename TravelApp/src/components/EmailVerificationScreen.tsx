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
} from 'react-native';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import { authStyles } from '../styles/authStyles';
import api from '../services/api';

interface EmailVerificationScreenProps {
  email: string;
  onBack: () => void;
  onVerificationSuccess: () => void;
}

export default function EmailVerificationScreen({ 
  email, 
  onBack, 
  onVerificationSuccess 
}: EmailVerificationScreenProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setError('Unesite verifikacioni kod');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await api.verifyEmail(email, verificationCode.trim());

      console.log('Verifikacija uspešna');
      Alert.alert(
        'Uspešno!',
        'Vaš email je verifikovan. Možete se sada prijaviti.',
        [
          {
            text: 'OK',
            onPress: onVerificationSuccess
          }
        ]
      );
    } catch (error: any) {
      console.error('Greška pri verifikaciji:', error);
      setError(error.response?.data?.message || 'Neispravan verifikacioni kod');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setError('');
    
    try {
      await api.resendVerificationCode(email);

      console.log('Kod ponovo poslat');
      Alert.alert(
        'Kod poslat',
        'Novi verifikacioni kod je poslat na vaš email.'
      );
    } catch (error: any) {
      console.error('Greška pri slanju koda:', error);
      setError('Greška pri slanju koda. Pokušajte ponovo.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={authStyles.header}>
        <TouchableOpacity style={authStyles.backButton} onPress={onBack}>
          <Text style={authStyles.backButtonText}>← Nazad</Text>
        </TouchableOpacity>
        <Text style={authStyles.headerTitle}>Verifikacija email-a</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={authStyles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📧</Text>
        </View>

        <Text style={authStyles.title}>Proverite vaš email</Text>
        
        <Text style={authStyles.subtitle}>
          Poslali smo verifikacioni kod na:
        </Text>
        
        <Text style={styles.emailText}>{email}</Text>
        
        <Text style={authStyles.subtitle}>
          Unesite 6-cifreni kod koji ste primili:
        </Text>

        {/* Verifikacioni kod */}
        <View style={authStyles.inputContainer}>
          <Text style={authStyles.label}>Verifikacioni kod</Text>
          <TextInput
            style={[authStyles.textInput, error && authStyles.textInputError]}
            placeholder="Unesite kod"
            value={verificationCode}
            onChangeText={(value) => {
              setVerificationCode(value);
              if (error) setError('');
            }}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
          />
          {error && <Text style={authStyles.errorText}>{error}</Text>}
        </View>

        {/* Verifikuj dugme */}
        <TouchableOpacity
          style={[authStyles.loginButton, loading && authStyles.loginButtonDisabled]}
          onPress={handleVerifyCode}
          disabled={loading}
        >
          <Text style={authStyles.loginButtonText}>
            {loading ? 'Verifikacija...' : 'Verifikuj'}
          </Text>
        </TouchableOpacity>

        {/* Resend kod */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Niste primili kod? </Text>
          <TouchableOpacity 
            onPress={handleResendCode}
            disabled={resendLoading}
          >
            <Text style={[styles.resendButtonText, resendLoading && styles.resendButtonDisabled]}>
              {resendLoading ? 'Slanje...' : 'Pošaljite ponovo'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Promena email-a */}
        <TouchableOpacity style={styles.changeEmailButton} onPress={onBack}>
          <Text style={styles.changeEmailText}>Promenite email adresu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    marginBottom: Sizes.lg,
  },
  icon: {
    fontSize: 64,
  },
  emailText: {
    fontSize: Sizes.fontSize.md,
    fontWeight: '600',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Sizes.lg,
    backgroundColor: Colors.background,
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.sm,
    borderRadius: Sizes.radius.sm,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Sizes.lg,
  },
  resendText: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
  },
  resendButtonText: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  resendButtonDisabled: {
    color: Colors.textSecondary,
  },
  changeEmailButton: {
    marginTop: Sizes.lg,
    alignItems: 'center',
  },
  changeEmailText: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
