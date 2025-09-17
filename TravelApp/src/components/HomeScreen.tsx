import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import { Putovanje, User, Aranzman } from '../types';
import api from '../services/api';
import { API_CONFIG } from '../constants/api';

interface HomeScreenProps {
  onLogout: () => void;
  onDestinationSelect?: (destination: Putovanje) => void;
}

export default function HomeScreen({ onLogout, onDestinationSelect }: HomeScreenProps) {
  const [destinations, setDestinations] = useState<Putovanje[]>([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [destinationPrices, setDestinationPrices] = useState<{[key: number]: number}>({});

  useEffect(() => {
    loadDestinations();
    loadUserInfo();
  }, []);

  const loadDestinations = async () => {
    try {
      const destinations = await api.getPutovanja();
      const destinationsToUse = destinations && destinations.length > 0 ? destinations : [
        {
          id: 1,
          nazivPutovanja: 'Santorini',
          opis: 'Uživajte u čarima grčkih ostrva sa predivnim zalaskom sunca.',
          lokacija: 'Grčka',
          cena: 499,
          slika: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          nazivPutovanja: 'Pariz',
          opis: 'Grad ljubavi i svetlosti sa Eiffelovom kulom i bogatom kulturom.',
          lokacija: 'Francuska',
          cena: 559,
          slika: 'https://images.unsplash.com/photo-1471623432079-b009d30b6729?w=400&h=300&fit=crop',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 3,
          nazivPutovanja: 'Zermatt',
          opis: 'Alpsko skijalište sa predivnim pogledom na Matterhorn.',
          lokacija: 'Švajcarska',
          cena: 799,
          slika: 'https://www.travelandleisure.com/thmb/F3V1ei2YrUH4Qd_fvSgkAneZ4R8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/TAL-header-zermatt-switzerland-ZERMATT0123-08b7127082434b9f83db57251c051c1b.jpg',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 4,
          nazivPutovanja: 'Dubai',
          opis: 'Moderni grad sa najvišim neboderom na svetu i luksuznim shoppingom.',
          lokacija: 'UAE',
          cena: 649,
          slika: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 5,
          nazivPutovanja: 'Barcelona',
          opis: 'Grad Gaudija sa Sagrada Familijom i živopisnim ulicama.',
          lokacija: 'Španija',
          cena: 399,
          slika: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 6,
          nazivPutovanja: 'Maldivi',
          opis: 'Tropski raj sa kristalno čistim morem i predivnim plažama.',
          lokacija: 'Maldivi',
          cena: 1299,
          slika: 'https://itravel.rs/wp-content/uploads/2019/10/Maldivi-najbolje-ponude.jpg',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      setDestinations(destinationsToUse);
      
      // Ucitaj cene aranzmana za sve destinacije
      await loadDestinationPrices(destinationsToUse);
    } catch (error) {
      console.error('Error loading destinations:', error);
      // Dodaj test podatke ako API ne radi
      const testDestinations: Putovanje[] = [
        {
          id: 1,
          nazivPutovanja: 'Santorini',
          opis: 'Uživajte u čarima grčkih ostrva sa predivnim zalaskom sunca.',
          lokacija: 'Grčka',
          cena: 499,
          slika: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          nazivPutovanja: 'Pariz',
          opis: 'Grad ljubavi i svetlosti sa Eiffelovom kulom i bogatom kulturom.',
          lokacija: 'Francuska',
          cena: 559,
          slika: 'https://images.unsplash.com/photo-1471623432079-b009d30b6729?w=400&h=300&fit=crop',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 3,
          nazivPutovanja: 'Zermatt',
          opis: 'Alpsko skijalište sa predivnim pogledom na Matterhorn.',
          lokacija: 'Švajcarska',
          cena: 799,
          slika: 'https://www.travelandleisure.com/thmb/F3V1ei2YrUH4Qd_fvSgkAneZ4R8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/TAL-header-zermatt-switzerland-ZERMATT0123-08b7127082434b9f83db57251c051c1b.jpg',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 4,
          nazivPutovanja: 'Dubai',
          opis: 'Moderni grad sa najvišim neboderom na svetu i luksuznim shoppingom.',
          lokacija: 'UAE',
          cena: 649,
          slika: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 5,
          nazivPutovanja: 'Barcelona',
          opis: 'Grad Gaudija sa Sagrada Familijom i živopisnim ulicama.',
          lokacija: 'Španija',
          cena: 399,
          slika: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 6,
          nazivPutovanja: 'Maldivi',
          opis: 'Tropski raj sa kristalno čistim morem i predivnim plažama.',
          lokacija: 'Maldivi',
          cena: 1299,
          slika: 'https://itravel.rs/wp-content/uploads/2019/10/Maldivi-najbolje-ponude.jpg',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setDestinations(testDestinations);
    } finally {
      setLoading(false);
    }
  };

  const loadUserInfo = async () => {
    try {
      // Prvo pokusaj da ucitas iz AsyncStorage-a
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        const user = JSON.parse(userData);
        setUserInfo(user);
      }
      
      // pokusaj da ucitas najnovije informacije sa servera
      try {
        const response = await api.getUserInfo();
        if (response.success) {
          setUserInfo(response.data);
          // Ažuriraj AsyncStorage sa najnovijim podacima
          await AsyncStorage.setItem('user_data', JSON.stringify(response.data));
        }
      } catch (apiError) {
        // Ako API poziv ne uspe, koristi lokalne podatke
        console.log('Could not fetch user info from server, using cached data');
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const loadDestinationPrices = async (destinations: Putovanje[]) => {
    const prices: {[key: number]: number} = {};
    
    for (const destination of destinations) {
      try {
        const aranzmani = await api.getAranzmaniByDestination(destination.id);
        if (aranzmani && aranzmani.length > 0) {
          // Pronadji najnizu cenu aranzmana
          const minPrice = Math.min(...aranzmani.map((a: Aranzman) => a.cena));
          prices[destination.id] = minPrice;
        } else {
          // Ako nema aranžmana, koristi cenu putovanja kao fallback
          prices[destination.id] = destination.cena || 499;
        }
      } catch (error) {
        console.error('Error loading arrangements:', error);
        // Fallback na cenu putovanja
        prices[destination.id] = destination.cena || 499;
      }
    }
    
    setDestinationPrices(prices);
  };


  const renderDestinationCard = (destination: Putovanje) => (
    <TouchableOpacity 
      key={destination.id} 
      style={styles.destinationCard}
      onPress={() => onDestinationSelect && onDestinationSelect(destination)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={
            destination.slika 
              ? { uri: destination.slika }
              : require('../../assets/tajland.jpeg')
          }
          style={styles.destinationImage}
        />
      </View>
      
      <View style={styles.destinationInfo}>
        <Text style={styles.destinationName}>{destination.nazivPutovanja}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.destinationLocation}>{destination.lokacija}</Text>
        </View>
        <View style={styles.ratingPriceRow}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>4.9</Text>
          </View>
          <Text style={styles.price}>€{destinationPrices[destination.id] || destination.cena || 499}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with user avatar */}
      <View style={styles.header}>
        <View style={styles.userSection}>
          <TouchableOpacity style={styles.avatarContainer}>
            <View style={styles.avatarIcon}>
              <Ionicons name="person" size={32} color={Colors.primary} />
            </View>
          </TouchableOpacity>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>Zdravo, {userInfo?.name?.split(' ')[0] || 'Putniče'}</Text>
            <Text style={styles.welcomeText}>Dobrodošli nazad!</Text>
          </View>
        </View>
      </View>

      {/* Trip Planning Section */}
      <View style={styles.planSection}>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => {
            const url = `${API_CONFIG.BASE_URL}/export/plans.pdf`;
            Linking.openURL(url);
          }}
        >
          <Ionicons name="download-outline" size={18} color="#fff" />
          <Text style={styles.downloadButtonText}>Preuzmite plan aranžmana</Text>
        </TouchableOpacity>
      </View>

      {/* Destinations List */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.destinationsHeader}>
          <Text style={styles.sectionTitle}>Destinacije</Text>
          <Text style={styles.destinationsCount}>
            {destinations.length} {destinations.length === 1 ? 'destinacija' : 'destinacija'}
          </Text>
        </View>

        <View style={styles.destinationsGrid}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Učitavam destinacije...</Text>
            </View>
          ) : destinations.length > 0 ? (
            destinations.map(renderDestinationCard)
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nema dostupnih destinacija</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizes.lg,
    paddingTop: Sizes.md,
    paddingBottom: Sizes.sm,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: Sizes.sm,
  },
  avatarIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F4FD',
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingContainer: {
    marginLeft: Sizes.sm,
  },
  greeting: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: '600',
    color: Colors.primary,
  },
  welcomeText: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  planSection: {
    paddingHorizontal: Sizes.lg,
    paddingBottom: Sizes.lg,
  },
  downloadButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: Sizes.fontSize.md,
    fontWeight: '700',
    marginLeft: 8,
  },
  scrollContent: {
    paddingHorizontal: Sizes.lg,
  },
  destinationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.md,
  },
  sectionTitle: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: '600',
    color: Colors.primary,
  },
  destinationsCount: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  loadingContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Sizes.xl,
  },
  loadingText: {
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Sizes.xl,
  },
  emptyText: {
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  destinationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    minHeight: 200,
  },
  destinationCard: {
    width: '48%',
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
  },
  imageContainer: {
    position: 'relative',
  },
  destinationImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  destinationInfo: {
    padding: Sizes.sm,
  },
  destinationName: {
    fontSize: Sizes.fontSize.md,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  destinationLocation: {
    marginLeft: 4,
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
  },
  ratingPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: Sizes.fontSize.sm,
    fontWeight: '500',
    color: Colors.primary,
  },
  price: {
    fontSize: Sizes.fontSize.md,
    fontWeight: '700',
    color: Colors.primary,
  },
});
