import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import { Images } from '../constants/images';
import { authStyles } from '../styles/authStyles';
import Ionicons from '@expo/vector-icons/Ionicons';

const { height } = Dimensions.get('window');

interface SuccessScreenProps {
  title: string;
  message: string;
  buttonText: string;
  onButtonPress: () => void;
}

export default function SuccessScreen({ title, message, buttonText, onButtonPress }: SuccessScreenProps) {
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
      </View>

      {/* Content Overlay */}
      <View style={authStyles.contentOverlay}>
        {/* Logo and Branding */}
        <View style={authStyles.logoContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={60} color={Colors.success} />
          </View>
          <Text style={authStyles.brandName}>{title}</Text>
          <Text style={authStyles.brandSubtitle}>Travel Agency</Text>
        </View>

        {/* Form Container */}
        <View style={authStyles.formContainer}>
          <Text style={authStyles.subtitle}>{message}</Text>

          {/* Continue Button */}
          <TouchableOpacity style={authStyles.loginButton} onPress={onButtonPress}>
            <Text style={authStyles.loginButtonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  successIcon: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Sizes.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
