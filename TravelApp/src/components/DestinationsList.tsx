import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Sizes } from '../constants/sizes';
import api from '../services/api';
import { Putovanje } from '../types';

interface DestinationsListProps {
  onDestinationSelect: (destination: Putovanje) => void;
  onLogout: () => void;
}

export default function DestinationsList({ onDestinationSelect, onLogout }: DestinationsListProps) {
  const [destinations, setDestinations] = useState<Putovanje[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDestinations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getPutovanja();
      setDestinations(data);
    } catch (e: any) {
      console.error('Greška pri učitavanju destinacija:', e);
      setError(`Greška pri učitavanju destinacija: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, []);

  const renderDestinationCard = (destination: Putovanje) => (
    <TouchableOpacity
      key={destination.id}
      style={styles.destinationCard}
      onPress={() => onDestinationSelect(destination)}
    >
      <View style={styles.imageContainer}>
        {destination.slika ? (
          <Image source={{ uri: destination.slika }} style={styles.destinationImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>🌍</Text>
          </View>
        )}
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.destinationTitle}>{destination.nazivPutovanja}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="airplane-outline" size={16} color={Colors.textSecondary} style={{ marginRight: 4 }} />
          <Text style={styles.destinationLocation}>{destination.lokacija}</Text>
        </View>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.starIcon}>★</Text>
          <Text style={styles.rating}>4.9</Text>
          <Text style={styles.reviews}>(128 reviews)</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Učitavanje destinacija...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadDestinations}>
            <Text style={styles.retryButtonText}>Pokušaj ponovo</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Destinacije</Text>
          <Text style={styles.headerSubtitle}>Pronađite svoju savršenu destinaciju</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutButtonText}>Odjavi se</Text>
        </TouchableOpacity>
      </View>

      {/* Destinations List */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {destinations.length > 0 ? (
          destinations.map(renderDestinationCard)
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nema dostupnih destinacija</Text>
          </View>
        )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Sizes.lg,
    paddingVertical: Sizes.md,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: Sizes.fontSize.xxl,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.sm,
    borderRadius: Sizes.radius.sm,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: Sizes.fontSize.sm,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Sizes.lg,
    paddingBottom: Sizes.xl,
  },
  destinationCard: {
    backgroundColor: 'white',
    borderRadius: Sizes.radius.lg,
    marginBottom: Sizes.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
    borderTopLeftRadius: Sizes.radius.lg,
    borderTopRightRadius: Sizes.radius.lg,
    overflow: 'hidden',
  },
  destinationImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.9,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
  },
  cardContent: {
    padding: Sizes.lg,
  },
  destinationTitle: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Sizes.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.sm,
  },
  destinationLocation: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
  },
  destinationDescription: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Sizes.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    fontSize: Sizes.fontSize.sm,
    color: '#FFD700',
    marginRight: 4,
  },
  rating: {
    fontSize: Sizes.fontSize.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginRight: 4,
  },
  reviews: {
    fontSize: Sizes.fontSize.xs,
    color: Colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Sizes.md,
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Sizes.lg,
  },
  errorText: {
    fontSize: Sizes.fontSize.md,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Sizes.lg,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Sizes.lg,
    paddingVertical: Sizes.md,
    borderRadius: Sizes.radius.md,
  },
  retryButtonText: {
    color: 'white',
    fontSize: Sizes.fontSize.md,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Sizes.xxl,
  },
  emptyText: {
    fontSize: Sizes.fontSize.lg,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
