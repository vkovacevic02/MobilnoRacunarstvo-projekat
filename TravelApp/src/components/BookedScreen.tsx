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
  Alert,
  Button,
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
  const [cancelingId, setCancelingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [testMessage, setTestMessage] = useState<string>('Klikni dugme da testiraš');
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    loadUserBookings();
  }, []);

  const updatePassengerCount = async (bookingId: number, newCount: number) => {
    try {
      setUpdatingId(bookingId);
      setTestMessage(`🔄 Ažuriram broj putnika...`);

      // Ako je mock podatak (ID 1 ili 2), samo simuliraj
      if (bookingId === 1 || bookingId === 2) {
        console.log('Mock data - simulating passenger count update');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Ažuriraj lokalno stanje za mock podatke
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === bookingId 
              ? { ...booking, guests: newCount, price: booking.price / booking.guests * newCount }
              : booking
          )
        );
        setTestMessage(`✅ Broj putnika je ažuriran!`);
      } else {
        // Stvarni API poziv za backend podatke
        console.log('Calling real API to update passenger count');
        const response = await api.updateReservation(bookingId, newCount);
        
        // Ažuriraj lokalno stanje na osnovu API odgovora
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === bookingId 
              ? { 
                  ...booking, 
                  guests: newCount, 
                  price: response.nova_cena || booking.price 
                }
              : booking
          )
        );
        setTestMessage(`✅ Rezervacija je ažurirana! Nova cena: €${response.nova_cena}`);
      }
    } catch (error: any) {
      console.error('Error updating passenger count:', error);
      setTestMessage(`❌ Greška: ${error.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const changePassengerCount = (bookingId: number, currentCount: number, increment: number) => {
    const newCount = currentCount + increment;
    if (newCount >= 1) {
      updatePassengerCount(bookingId, newCount);
    }
  };

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
          status: 'confirmed', // Promenio sa 'pending' na 'confirmed'
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

  const handleCancelReservation = (booking: BookingItem) => {
    Alert.alert(
      'Otkaži rezervaciju',
      `Da li ste sigurni da želite da otkažete rezervaciju za ${booking.destination}?`,
      [
        {
          text: 'Ne',
          style: 'cancel',
        },
        {
          text: 'Da, otkaži',
          style: 'destructive',
          onPress: () => cancelReservation(booking.id),
        },
      ]
    );
  };

  const cancelReservation = async (bookingId: number) => {
    console.log('Attempting to cancel reservation with ID:', bookingId);
    
    try {
      setCancelingId(bookingId);
      console.log('Calling API to cancel reservation...');
      
      // Ako koristiš mock podatke (ID 1 ili 2), simuliraj uspešan API poziv
      if (bookingId === 1 || bookingId === 2) {
        console.log('Using mock data, simulating successful API call...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simuliraj API delay
      } else {
        // Stvarni API poziv za backend podatke
        await api.cancelReservation(bookingId);
      }
      
      console.log('API call successful, removing from list...');
      
      // Ukloni rezervaciju iz liste
      setBookings(prevBookings => {
        const newBookings = prevBookings.filter(booking => booking.id !== bookingId);
        console.log('Updated bookings list. Before:', prevBookings.length, 'After:', newBookings.length);
        return newBookings;
      });
      
      Alert.alert('Uspešno ✅', 'Rezervacija je uspešno otkazana i izbačena iz baze podataka.');
    } catch (error: any) {
      console.error('Error canceling reservation:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      Alert.alert(
        'Greška ❌', 
        error.message || 'Došlo je do greške prilikom otkazivanja rezervacije. Molimo pokušajte ponovo.'
      );
    } finally {
      setCancelingId(null);
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
    <View style={styles.bookingCard}>
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
        
        <View style={styles.priceAndActionsRow}>
          <Text style={styles.price}>€{item.price}</Text>
        </View>
        
        {/* Edit Passenger Count Row */}
        {editingId === item.id ? (
          <View style={styles.editContainer}>
            <View style={styles.editControls}>
              <View style={styles.passengerControls}>
                <TouchableOpacity
                  style={[styles.controlButton, updatingId === item.id && styles.controlButtonDisabled]}
                  onPress={() => changePassengerCount(item.id, item.guests, -1)}
                  disabled={updatingId === item.id || item.guests <= 1}
                >
                  <Ionicons name="remove" size={20} color="white" />
                </TouchableOpacity>
                
                <View style={styles.passengerCountDisplay}>
                  <Text style={styles.passengerCountText}>{item.guests}</Text>
                  <Text style={styles.passengerLabel}>putnik{item.guests !== 1 ? 'a' : ''}</Text>
                </View>
                
                <TouchableOpacity
                  style={[styles.controlButton, updatingId === item.id && styles.controlButtonDisabled]}
                  onPress={() => changePassengerCount(item.id, item.guests, 1)}
                  disabled={updatingId === item.id}
                >
                  <Ionicons name="add" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.editButtonRow}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => setEditingId(null)}
              >
                <Ionicons name="save-outline" size={16} color="white" />
                <Text style={styles.saveButtonText}>Sačuvaj</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditingId(item.id)}
            >
              <Ionicons name="create-outline" size={16} color="white" />
              <Text style={styles.editButtonText}>Izmeni</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Cancel Button Row */}
        <View style={styles.cancelButtonRow}>
          {confirmingId === item.id ? (
            // Confirmation dugmici
            <View style={styles.confirmationContainer}>
              <TouchableOpacity 
                style={[styles.confirmButton, { backgroundColor: Colors.primary }]}
                onPress={async () => {
                  console.log('CONFIRMED CANCEL FOR:', item.id);
                  setTestMessage(`🗑️ Otkazujem rezervaciju ${item.destination}...`);
                  setCancelingId(item.id);
                  setConfirmingId(null);
                  
                  try {
                    // Ako je mock podatak (ID 1 ili 2), samo simuliraj
                    if (item.id === 1 || item.id === 2) {
                      console.log('Mock data - simulating API call');
                      await new Promise(resolve => setTimeout(resolve, 1000));
                    } else {
                      // Stvarni API poziv za backend podatke
                      console.log('Calling real API to delete reservation');
                      await api.cancelReservation(item.id);
                    }
                    
                    // Ukloni iz liste
                    setBookings(prevBookings => prevBookings.filter(booking => booking.id !== item.id));
                    setTestMessage(`✅ Rezervacija ${item.destination} je uspešno otkazana!`);
                    
                  } catch (error: any) {
                    console.error('Error canceling reservation:', error);
                    setTestMessage(`❌ Greška: ${error.message}`);
                  } finally {
                    setCancelingId(null);
                  }
                }}
              >
                <Text style={styles.confirmButtonText}>Da, otkaži</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.confirmButton, { backgroundColor: Colors.textSecondary }]}
                onPress={() => {
                  setConfirmingId(null);
                  setTestMessage('Otkazivanje poništeno');
                }}
              >
                <Text style={styles.confirmButtonText}>Ne</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Glavno dugme za otkazivanje
            <TouchableOpacity 
              style={[styles.cancelButton, cancelingId === item.id && styles.cancelButtonDisabled]}
              onPress={() => {
                setConfirmingId(item.id);
                setTestMessage(`Sigurno želite da otkažete ${item.destination}?`);
              }}
              disabled={cancelingId === item.id}
            >
              {cancelingId === item.id ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="close-circle" size={16} color="white" />
              )}
              <Text style={styles.cancelButtonText}>
                {cancelingId === item.id ? 'Otkazujem...' : 'Otkaži'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
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
      {/* STATUS MESSAGE */}
      {testMessage !== 'Klikni dugme da testiraš' && (
        <View style={styles.statusMessage}>
          <Text style={styles.statusMessageText}>
            {testMessage}
          </Text>
        </View>
      )}

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
          scrollEnabled={true}
          nestedScrollEnabled={true}
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
  priceAndActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: '700',
    color: Colors.primary,
  },
  cancelButtonRow: {
    alignItems: 'flex-end',
    marginTop: Sizes.sm,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.sm,
    borderRadius: Sizes.radius.lg,
    shadowColor: Colors.shadow.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 100,
  },
  cancelButtonText: {
    fontSize: Sizes.fontSize.sm,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 6,
  },
  cancelButtonDisabled: {
    opacity: 0.6,
  },
  confirmationContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: Sizes.sm,
  },
  confirmButton: {
    flex: 1,
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.sm,
    borderRadius: Sizes.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  confirmButtonText: {
    fontSize: Sizes.fontSize.sm,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statusMessage: {
    backgroundColor: Colors.surface,
    padding: Sizes.md,
    marginHorizontal: Sizes.lg,
    marginTop: Sizes.sm,
    borderRadius: Sizes.radius.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    shadowColor: Colors.shadow.light,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  statusMessageText: {
    fontSize: Sizes.fontSize.md,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.text,
  },
  editContainer: {
    marginTop: Sizes.sm,
    backgroundColor: Colors.surface,
    borderRadius: Sizes.radius.lg,
    padding: Sizes.md,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
  editControls: {
    alignItems: 'center',
    marginBottom: Sizes.sm,
  },
  editButtonRow: {
    alignItems: 'center',
  },
  passengerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  controlButtonDisabled: {
    opacity: 0.5,
  },
  passengerCountDisplay: {
    marginHorizontal: Sizes.lg,
    alignItems: 'center',
    minWidth: 60,
  },
  passengerCountText: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  passengerLabel: {
    fontSize: Sizes.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: Sizes.lg,
    paddingVertical: Sizes.md,
    borderRadius: Sizes.radius.lg,
    shadowColor: Colors.shadow.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    minWidth: 120,
  },
  saveButtonText: {
    fontSize: Sizes.fontSize.md,
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 6,
  },
  actionButtonsRow: {
    alignItems: 'flex-end',
    marginTop: Sizes.sm,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9800',
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.sm,
    borderRadius: Sizes.radius.lg,
    shadowColor: Colors.shadow.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 100,
  },
  editButtonText: {
    fontSize: Sizes.fontSize.sm,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 6,
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
