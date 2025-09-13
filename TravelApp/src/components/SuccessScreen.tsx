import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';

interface SuccessScreenProps {
  title: string;
  message: string;
  buttonText: string;
  onButtonPress: () => void;
}

export default function SuccessScreen({ title, message, buttonText, onButtonPress }: SuccessScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Content */}
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.successIcon}>
            <Text style={styles.checkmarkIcon}>✓</Text>
          </View>
        </View>

        <Text style={styles.title}>{title}</Text>
        
        <Text style={styles.message}>{message}</Text>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton} onPress={onButtonPress}>
          <Text style={styles.continueButtonText}>{buttonText}</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: Sizes.lg,
    paddingTop: Sizes.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: Sizes.xl,
  },
  successIcon: {
    width: 100,
    height: 100,
    backgroundColor: Colors.secondary,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  checkmarkIcon: {
    fontSize: 50,
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: Sizes.lg,
  },
  message: {
    fontSize: Sizes.fontSize.md,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Sizes.xl,
    paddingHorizontal: Sizes.lg,
  },
  continueButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'white',
    paddingVertical: Sizes.lg,
    paddingHorizontal: Sizes.xl,
    borderRadius: Sizes.radius.lg,
    alignItems: 'center',
    minWidth: 200,
  },
  continueButtonText: {
    color: 'white',
    fontSize: Sizes.fontSize.lg,
    fontWeight: 'bold',
  },
});
