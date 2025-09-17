import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import { User } from '../types';
import api from '../services/api';

interface ProfileScreenProps {
  onLogout: () => void;
}

export default function ProfileScreen({ onLogout }: ProfileScreenProps) {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserInfo();
    console.log('ProfileScreen mounted, onLogout prop:', typeof onLogout);
  }, []);

  const loadUserInfo = async () => {
    try {
      // Prvo pokusaj da učitaš iz AsyncStorage-a
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        const user = JSON.parse(userData);
        setUserInfo(user);
      }
      
      // Zatim pokusaj da ucitas najnovije informacije sa servera
      try {
        const response = await api.getUserInfo();
        if (response.success) {
          setUserInfo(response.data);
          // Azuriraj AsyncStorage sa najnovijim podacima
          await AsyncStorage.setItem('user_data', JSON.stringify(response.data));
        }
      } catch (apiError) {
        // Ako API poziv ne uspe, samo koristi lokalne podatke
        console.log('Could not fetch user info from server, using cached data');
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Odjavi se',
      'Da li ste sigurni da se želite odjaviti?',
      [
        {
          text: 'Otkaži',
          style: 'cancel',
        },
        {
          text: 'Odjavi se',
          style: 'destructive',
          onPress: async () => {
            console.log('Logout button pressed');
            try {
              console.log('Calling api.logout()...');
              await api.logout();
              console.log('api.logout() successful, calling onLogout()...');
              onLogout();
            } catch (error) {
              console.error('Logout error:', error);
              console.log('API logout failed, calling onLogout() anyway...');
              onLogout(); // Odjavi korisnika čak i ako API poziv ne uspe
            }
          },
        },
      ]
    );
  };



  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Učitava...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil</Text>
        </View>

        {/* User Info Section */}
        <View style={styles.userSection}>
          <View style={styles.profileIcon}>
            <Ionicons name="person" size={60} color={Colors.primary} />
          </View>
          <Text style={styles.userName}>
            {userInfo?.name || 'Korisnik'}
          </Text>
          <Text style={styles.userEmail}>{userInfo?.email || 'email@example.com'}</Text>
          
          {/* User Details */}
          <View style={styles.userDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={20} color={Colors.textSecondary} />
              <Text style={styles.detailLabel}>Ime:</Text>
              <Text style={styles.detailValue}>{userInfo?.ime || userInfo?.name?.split(' ')[0] || 'N/A'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={20} color={Colors.textSecondary} />
              <Text style={styles.detailLabel}>Prezime:</Text>
              <Text style={styles.detailValue}>{userInfo?.prezime || userInfo?.name?.split(' ').slice(1).join(' ') || 'N/A'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} />
              <Text style={styles.detailLabel}>Email:</Text>
              <Text style={styles.detailValue}>{userInfo?.email || 'N/A'}</Text>
            </View>
          </View>
        </View>


        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={() => {
            console.log('Logout button clicked!');
            onLogout();
          }}
        >
          <Ionicons name="log-out-outline" size={24} color="#FF4444" />
          <Text style={styles.logoutText}>Odjavi se</Text>
        </TouchableOpacity>

        {/* Version Info */}
        <Text style={styles.versionText}>Verzija 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: Sizes.lg,
    paddingVertical: Sizes.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
  },
  userSection: {
    alignItems: 'center',
    paddingVertical: Sizes.xl,
    backgroundColor: 'white',
    marginHorizontal: Sizes.lg,
    marginTop: Sizes.md,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F4FD',
    marginBottom: Sizes.md,
    borderWidth: 3,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
    marginBottom: Sizes.lg,
  },
  userDetails: {
    width: '100%',
    marginTop: Sizes.lg,
    paddingHorizontal: Sizes.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Sizes.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginLeft: Sizes.sm,
    minWidth: 80,
  },
  detailValue: {
    fontSize: Sizes.fontSize.md,
    color: Colors.primary,
    fontWeight: '400',
    marginLeft: Sizes.sm,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: Sizes.lg,
    marginTop: Sizes.md,
    paddingVertical: Sizes.md,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: Sizes.fontSize.md,
    color: '#FF4444',
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Sizes.lg,
    marginBottom: Sizes.xl,
  },
});
