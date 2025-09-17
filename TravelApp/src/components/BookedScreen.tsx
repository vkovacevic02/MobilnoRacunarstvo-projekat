import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import { UserBooking, User } from '../types';
import api from '../services/api';

interface BookingItem {
  id: number;
  destination: string;
  location: string;
  date: string;
  status: 'confirmed' | 'pending' | 'completed';
  image: string;
  price: number;
  guests: number;
}

export default function BookedScreen() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [userInfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    loadUserBookings();
  }, []);

  const loadUserBookings = async () => {
    try {
      setLoading(true);
      
      // Ucitaj korisnicke informacije
      const userData = await AsyncStorage.getItem('user_data');
      if (!userData) {
        console.log('No user data found');
        setLoading(false);
        return;
      }

      const user = JSON.parse(userData);
      setUserInfo(user);

      console.log('Loading bookings for user ID:', user.id);

      // Ucitaj rezervacije korisnika iz backend-a
      const userBookings = await api.getUserBookings(user.id);
      console.log('Loaded user bookings:', userBookings);

      // Transformisi backend podatke u format koji očekuje komponenta
      const transformedBookings: BookingItem[] = userBookings.map((booking: UserBooking) => {
        // Odredjivanje statusa na osnovu datuma
        const today = new Date();
        const bookingStartDate = new Date(booking.aranzman.datumOd);
        const bookingEndDate = new Date(booking.aranzman.datumDo);
        
        let status: 'confirmed' | 'pending' | 'completed';
        if (bookingEndDate < today) {
          status = 'completed';
        } else {
          status = 'confirmed'; // Pretpostavljamo da su sve rezervacije potvrđene
        }

        return {
          id: booking.id,
          destination: booking.aranzman.putovanje?.nazivPutovanja || 'N/A',
          location: booking.aranzman.putovanje?.lokacija || 'N/A',
          date: booking.aranzman.datumOd,
          status,
          image: booking.aranzman.putovanje?.slika || 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop',
          price: booking.ukupnaCenaAranzmana,
          guests: booking.broj_putnika ?? 1,
        };
      });

      setBookings(transformedBookings);
    } catch (error) {
      console.error('Error loading user bookings:', error);
      
      
      const mockBookings: BookingItem[] = [
        {
          id: 1,
          destination: 'Santorini',
          location: 'Grčka',
          date: '2025-10-15',
          status: 'confirmed',
          image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop',
          price: 1299,
          guests: 2,
        },
        {
          id: 2,
          destination: 'Maldivi',
          location: 'Maldivi',
          date: '2025-08-20',
          status: 'pending',
          image: 'https://itravel.rs/wp-content/uploads/2019/10/Maldivi-najbolje-ponude.jpg',
          price: 1899,
          guests: 1,
        },
      ];
      setBookings(mockBookings);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'completed':
        return '#2196F3';
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Potvrđeno';
      case 'pending':
        return 'Na čekanju';
      case 'completed':
        return 'Završeno';
      default:
        return status;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'upcoming') {
      return booking.status === 'confirmed' || booking.status === 'pending';
    } else {
      return booking.status === 'completed';
    }
  });

  const renderBookingItem = ({ item }: { item: BookingItem }) => (
    <TouchableOpacity style={styles.bookingCard}>
      <Image source={{ uri: item.image }} style={styles.bookingImage} />
      
      <View style={styles.bookingInfo}>
        <View style={styles.bookingHeader}>
          <Text style={styles.destinationName}>{item.destination}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>
        
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
        
        <View style={styles.bookingDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.detailText}>{new Date(item.date).toLocaleDateString('sr-RS')}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.detailText}>{item.guests} {item.guests === 1 ? 'putnik' : 'putnika'}</Text>
          </View>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.price}>€{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="bookmark-outline" size={80} color={Colors.textSecondary} />
      <Text style={styles.emptyTitle}>
        {activeTab === 'upcoming' ? 'Nema nadolazećih rezervacija' : 'Nema završenih putovanja'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'upcoming' 
          ? 'Počnite planiranje svog sledećeg putovanja!' 
          : 'Vaša završena putovanja će se pojaviti ovde.'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Moje rezervacije</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Nadolazeće
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Završeno
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Učitavam rezervacije...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBookings}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    color: Colors.text,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    margin: Sizes.lg,
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: Sizes.sm,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: Sizes.lg,
    paddingBottom: Sizes.lg,
  },
  bookingCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: Sizes.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  bookingImage: {
    width: 100,
    height: 120,
  },
  bookingInfo: {
    flex: 1,
    padding: Sizes.sm,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  destinationName: {
    fontSize: Sizes.fontSize.md,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: Sizes.sm,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 4,
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
  },
  bookingDetails: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 6,
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  price: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: '700',
    color: Colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Sizes.xxl * 2,
  },
  emptyTitle: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Sizes.md,
    marginBottom: Sizes.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Sizes.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Sizes.xl,
  },
  loadingText: {
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
    marginTop: Sizes.md,
  },
});
