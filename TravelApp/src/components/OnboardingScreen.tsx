import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  onGetStarted: () => void;
}

export default function OnboardingScreen({ onGetStarted }: OnboardingScreenProps) {

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ 
            uri: 'https://images.unsplash.com/photo-1578922746465-3a80a228f223?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        
      </View>

      {/* Content Overlay */}
      <View style={styles.contentOverlay}>
        <View style={styles.textContainer}>
          <Text style={styles.brand}>Vivir La Vida</Text>
          <Text style={styles.mainTitle}>
          Otkrij nove horizonte!
          </Text>
          <Text style={styles.subtitle}>
          Destinacija iz snova čeka samo na tebe.
          </Text>
        </View>
        
        <TouchableOpacity style={styles.getStartedButton} onPress={onGetStarted}>
          <Text style={styles.getStartedText}>ZAPOČNI</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  contentOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: Sizes.lg,
    paddingTop: Sizes.xl,
    paddingBottom: Sizes.xxl,
    minHeight: height * 0.45,
  },
  textContainer: {
    marginBottom: Sizes.xl,
  },
  brand: {
    color: Colors.primary,
    fontSize: Sizes.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: Sizes.sm,
  },
  mainTitle: {
    fontSize: Sizes.fontSize.xxxl + 8,
    fontWeight: 'bold',
    color: Colors.text,
    lineHeight: 50,
    marginBottom: Sizes.md,
  },
  subtitle: {
    fontSize: Sizes.fontSize.lg,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  getStartedButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Sizes.lg,
    borderRadius: Sizes.radius.lg,
    alignItems: 'center',
    shadowColor: Colors.shadow.dark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  getStartedText: {
    color: 'white',
    fontSize: Sizes.fontSize.lg,
    fontWeight: 'bold',
  },
});
