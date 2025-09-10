import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from './src/constants/colors';
import { Sizes } from './src/constants/sizes';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Vivir La Vida</Text>
          <Text style={styles.subtitle}>Dobrodošli!</Text>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Funkcionalnosti</Text>
          
          <View style={styles.featuresGrid}>
            <TouchableOpacity style={styles.featureCard}>
              <Text style={styles.featureIcon}>✈️</Text>
              <Text style={styles.featureTitle}>Putovanja</Text>
              <Text style={styles.featureDescription}>Pregled svih dostupnih putovanja</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard}>
              <Text style={styles.featureIcon}>🏨</Text>
              <Text style={styles.featureTitle}>Aranžmani</Text>
              <Text style={styles.featureDescription}>Detaljni planovi putovanja</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard}>
              <Text style={styles.featureIcon}>👥</Text>
              <Text style={styles.featureTitle}>Putnici</Text>
              <Text style={styles.featureDescription}>Upravljanje putnicima</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard}>
              <Text style={styles.featureIcon}>💳</Text>
              <Text style={styles.featureTitle}>Uplate</Text>
              <Text style={styles.featureDescription}>Praćenje finansija</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Prijavite se</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Sizes.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: Sizes.xl,
    paddingTop: Sizes.xxl,
  },
  title: {
    fontSize: Sizes.fontSize.xxxl,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Sizes.sm,
  },
  subtitle: {
    fontSize: Sizes.fontSize.lg,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: Sizes.xl,
  },
  sectionTitle: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Sizes.md,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    padding: Sizes.md,
    borderRadius: Sizes.radius.lg,
    marginBottom: Sizes.md,
    alignItems: 'center',
    shadowColor: Colors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    fontSize: Sizes.icon.xl,
    marginBottom: Sizes.sm,
  },
  featureTitle: {
    fontSize: Sizes.fontSize.md,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Sizes.xs,
  },
  featureDescription: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Sizes.md,
    paddingHorizontal: Sizes.xl,
    borderRadius: Sizes.radius.lg,
    alignItems: 'center',
    marginTop: Sizes.lg,
  },
  loginButtonText: {
    color: Colors.background,
    fontSize: Sizes.fontSize.lg,
    fontWeight: 'bold',
  },
});
