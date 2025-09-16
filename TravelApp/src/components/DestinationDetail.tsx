import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import api from '../services/api';
import { Putovanje, Aranzman } from '../types';

const { width, height } = Dimensions.get('window');

interface DestinationDetailProps {
  destination: Putovanje;
  onBack: () => void;
}

export default function DestinationDetail({ destination, onBack }: DestinationDetailProps) {
  const [aranzmani, setAranzmani] = useState<Aranzman[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [filterMin, setFilterMin] = useState<string>('');
  const [filterMax, setFilterMax] = useState<string>('');

  const loadAranzmani = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get<Aranzman[]>(`/aranzmani/${destination.id}`);
      setAranzmani(data);
      
      // Izračunaj najnižu cenu
      if (data && data.length > 0) {
        const lowest = Math.min(...data.map((a: Aranzman) => a.cena));
        setMinPrice(lowest);
      } else {
        setMinPrice(destination.cena || null);
      }
    } catch (e: any) {
      console.error('Greška pri učitavanju aranžmana:', e);
      setError(`Greška pri učitavanju aranžmana: ${e.message || e}`);
      setMinPrice(destination.cena || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAranzmani();
  }, [destination.id]);

  const handleReserve = (aranzman: Aranzman) => {
    // TODO: Implementirati rezervaciju
    alert(`Rezervacija za ${aranzman.nazivAranzmana}`);
  };

  const parsedMin = filterMin.trim() === '' ? null : Number(filterMin.replace(',', '.'));
  const parsedMax = filterMax.trim() === '' ? null : Number(filterMax.replace(',', '.'));

  const visibleAranzmani = aranzmani.filter((a) => {
    const cena = Number(a.cena);
    if (!isNaN(parsedMin as number) && parsedMin !== null && cena < (parsedMin as number)) return false;
    if (!isNaN(parsedMax as number) && parsedMax !== null && cena > (parsedMax as number)) return false;
    return true;
  });

  const clearFilters = () => {
    setFilterMin('');
    setFilterMax('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header sa slikom */}
      <View style={styles.imageContainer}>
        <Image
          source={{ 
            uri: destination.slika || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop' 
          }}
          style={styles.headerImage}
          resizeMode="cover"
        />
        
        {/* Navigacioni dugmići */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Glavna kartica sa sadržajem */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {/* Naziv destinacije */}
          <Text style={styles.destinationTitle}>{destination.nazivPutovanja}</Text>
          
          {/* Cena i ocena */}
          <View style={styles.priceRatingContainer}>
            <Text style={styles.price}>
              {minPrice ? `Od €${minPrice}` : 'Cena na upit'}
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.starIcon}>★</Text>
              <Text style={styles.rating}>4.9</Text>
            </View>
          </View>

          {/* Sadržaji */}
          <View style={styles.amenitiesContainer}>
            <View style={styles.amenityTag}>
              <Ionicons name="bed-outline" size={20} color={Colors.primary} style={{ marginRight: 4 }} />
              <Text style={styles.amenityText}>4 Rooms</Text>
            </View>
            <View style={styles.amenityTag}>
              <Ionicons name="water-outline" size={20} color={Colors.primary} style={{ marginRight: 4 }} />
              <Text style={styles.amenityText}>Pool</Text>
            </View>
            <View style={styles.amenityTag}>
              <Ionicons name="restaurant-outline" size={20} color={Colors.primary} style={{ marginRight: 4 }} />
              <Text style={styles.amenityText}>Restaurant</Text>
            </View>
          </View>

          {/* Opis */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText} numberOfLines={showFullDescription ? undefined : 3}>
              {destination.opis}
            </Text>
            <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
              <Text style={styles.readMore}>
                {showFullDescription ? 'Read less..' : 'Read more..'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Filter po ceni */}
          <View style={styles.filterContainer}>
            <View style={styles.filterInputsRow}>
              <View style={styles.filterInputWrapper}>
                <Text style={styles.filterLabel}>Min cena</Text>
                <TextInput
                  style={styles.filterInput}
                  placeholder="npr. 300"
                  placeholderTextColor={Colors.textSecondary}
                  keyboardType="numeric"
                  value={filterMin}
                  onChangeText={setFilterMin}
                />
              </View>
              <View style={styles.filterInputWrapper}>
                <Text style={styles.filterLabel}>Max cena</Text>
                <TextInput
                  style={styles.filterInput}
                  placeholder="npr. 800"
                  placeholderTextColor={Colors.textSecondary}
                  keyboardType="numeric"
                  value={filterMax}
                  onChangeText={setFilterMax}
                />
              </View>
            </View>
            <View style={styles.filterActionsRow}>
              <TouchableOpacity onPress={clearFilters}>
                <Text style={styles.clearFilterText}>Očisti filter</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Aranžmani */}
          {loading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Učitavanje aranžmana...</Text>
            </View>
          )}

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          {!loading && !error && visibleAranzmani.length > 0 && (
            <View style={styles.arrangementsContainer}>
              <Text style={styles.arrangementsTitle}>Dostupni aranžmani</Text>
              {visibleAranzmani.map((aranzman) => (
                <View key={aranzman.id} style={styles.arrangementCard}>
                  <View style={styles.arrangementHeader}>
                    <Text style={styles.arrangementName}>{aranzman.nazivAranzmana}</Text>
                    <Text style={styles.arrangementPrice}>€{aranzman.cena}</Text>
                  </View>
                  <Text style={styles.arrangementDates}>
                    {new Date(aranzman.datumOd).toLocaleDateString()} - {new Date(aranzman.datumDo).toLocaleDateString()}
                  </Text>
                  <Text style={styles.arrangementCapacity}>
                    Kapacitet: {aranzman.kapacitet} osoba
                  </Text>
                  {aranzman.popust > 0 && (
                    <Text style={styles.arrangementDiscount}>
                      Popust: {aranzman.popust}%
                    </Text>
                  )}
                  <TouchableOpacity 
                    style={styles.reserveButton}
                    onPress={() => handleReserve(aranzman)}
                  >
                    <Text style={styles.reserveButtonText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {!loading && !error && visibleAranzmani.length === 0 && (
            <View style={styles.noArrangementsContainer}>
              <Text style={styles.noArrangementsText}>Nema dostupnih aranžmana za ovu destinaciju.</Text>
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
  imageContainer: {
    height: height * 0.4,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  navigationContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Sizes.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    marginTop: -20,
  },
  card: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Sizes.lg,
    minHeight: height * 0.6,
  },
  destinationTitle: {
    fontSize: Sizes.fontSize.xxxl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Sizes.sm,
  },
  priceRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.md,
  },
  price: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Sizes.sm,
    paddingVertical: Sizes.xs,
    borderRadius: Sizes.radius.sm,
  },
  starIcon: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.accent,
    marginRight: 4,
  },
  rating: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.text,
    fontWeight: 'bold',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Sizes.lg,
  },
  amenityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Sizes.sm,
    paddingVertical: Sizes.xs,
    borderRadius: Sizes.radius.sm,
    marginRight: Sizes.sm,
    marginBottom: Sizes.sm,
  },
  amenityText: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.text,
  },
  descriptionContainer: {
    marginBottom: Sizes.lg,
  },
  descriptionTitle: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Sizes.sm,
  },
  descriptionText: {
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  readMore: {
    fontSize: Sizes.fontSize.md,
    color: Colors.primary,
    marginTop: Sizes.xs,
    fontWeight: '600',
  },
  arrangementsContainer: {
    marginTop: Sizes.lg,
  },
  filterContainer: {
    backgroundColor: Colors.surface,
    borderRadius: Sizes.radius.md,
    padding: Sizes.md,
    marginTop: Sizes.md,
  },
  filterInputsRow: {
    flexDirection: 'row',
    gap: Sizes.md,
  },
  filterInputWrapper: {
    flex: 1,
  },
  filterLabel: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Sizes.xs,
  },
  filterInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: Sizes.radius.sm,
    paddingHorizontal: Sizes.sm,
    paddingVertical: 10,
    color: Colors.text,
  },
  filterActionsRow: {
    marginTop: Sizes.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterHint: {
    fontSize: Sizes.fontSize.xs,
    color: Colors.textSecondary,
  },
  clearFilterText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  arrangementsTitle: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Sizes.md,
  },
  arrangementCard: {
    backgroundColor: Colors.surface,
    borderRadius: Sizes.radius.md,
    padding: Sizes.md,
    marginBottom: Sizes.md,
  },
  arrangementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.sm,
  },
  arrangementName: {
    fontSize: Sizes.fontSize.md,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },
  arrangementPrice: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  arrangementDates: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Sizes.xs,
  },
  arrangementCapacity: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Sizes.xs,
  },
  arrangementDiscount: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.accent,
    fontWeight: 'bold',
    marginBottom: Sizes.sm,
  },
  reserveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Sizes.md,
    borderRadius: Sizes.radius.md,
    alignItems: 'center',
  },
  reserveButtonText: {
    color: Colors.background,
    fontSize: Sizes.fontSize.md,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Sizes.lg,
  },
  loadingText: {
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
  },
  errorText: {
    fontSize: Sizes.fontSize.md,
    color: Colors.error,
    textAlign: 'center',
    paddingVertical: Sizes.lg,
  },
  noArrangementsContainer: {
    alignItems: 'center',
    paddingVertical: Sizes.lg,
  },
  noArrangementsText: {
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

