import React, { useEffect, useState, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList,
  ActivityIndicator, Image, Dimensions
} from 'react-native';
import { Colors } from './src/constants/colors';
import { Sizes } from './src/constants/sizes';
import api from './src/services/api';
import { Putovanje } from './src/types';

const { width } = Dimensions.get('window');

// === NOVO: dinamičan broj kolona i proračun širine kartice ===
const SCREEN_PADDING = Sizes.md * 2;          // levo+desno padding ScrollView-a
const GUTTER = Sizes.md;                       // razmak između kartica
const COLUMNS = width >= 820 ? 4 : width >= 600 ? 3 : 3; // 3 kol. na mobu, 4 na tabletima
const CARD_WIDTH = Math.floor((width - SCREEN_PADDING - GUTTER * (COLUMNS - 1)) / COLUMNS);

export default function App() {
  const [putovanja, setPutovanja] = useState<Putovanje[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPutovanja = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getPutovanja();
      setPutovanja(data);
    } catch (e: any) {
      console.error('Greška pri učitavanju:', e);
      setError(`Greška pri učitavanju putovanja: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPutovanja();
  }, []);

  const renderItem = ({ item }: { item: Putovanje }) => (
    <TouchableOpacity style={[styles.destCard, { width: CARD_WIDTH }]}>
      <View style={[styles.imageContainer, { height: Math.round(CARD_WIDTH * 0.62) }]}>
        <Image
          source={{ uri: item.slika || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop' }}
          style={styles.destImage}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.heartButton}>
          <Text style={styles.heartIcon}>♡</Text>
        </TouchableOpacity>
        {item.cena ? (
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>{item.cena} €</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.destTitle} numberOfLines={1}>{item.nazivPutovanja}</Text>
        <Text style={styles.destLocation} numberOfLines={1}>{item.lokacija}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Putovanja</Text>
          <Text style={styles.subtitle}>Pronađite svoju sledeću destinaciju</Text>
        </View>

        <View style={styles.listHeaderRow}>
          <Text style={styles.sectionTitle}>Destinacije</Text>
          <TouchableOpacity onPress={loadPutovanja} style={styles.reloadBtn}>
            <Text style={styles.reloadText}>Osveži</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator color={Colors.primary} size="large" />
          </View>
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {!loading && !error && putovanja.length === 0 && (
          <View style={styles.center}>
            <Text style={styles.destLocation}>Nema dostupnih destinacija.</Text>
          </View>
        )}

        {!loading && !error && putovanja.length > 0 && (
          <FlatList
            data={putovanja}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            scrollEnabled={false}
            numColumns={COLUMNS}                                 // ← više kolona
            columnWrapperStyle={{ gap: GUTTER, justifyContent: 'flex-start' }} // ← razmak između kartica
            ItemSeparatorComponent={() => <View style={{ height: GUTTER }} />}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { flexGrow: 1, padding: Sizes.md },
  header: { alignItems: 'center', marginBottom: Sizes.xl, paddingTop: Sizes.xxl },
  title: { fontSize: Sizes.fontSize.xxxl, fontWeight: 'bold', color: Colors.primary, marginBottom: Sizes.sm },
  subtitle: { fontSize: Sizes.fontSize.lg, color: Colors.textSecondary, textAlign: 'center' },
  listHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Sizes.md },
  sectionTitle: { fontSize: Sizes.fontSize.xl, fontWeight: 'bold', color: Colors.text, marginBottom: Sizes.md },
  reloadBtn: { backgroundColor: Colors.primary, paddingVertical: Sizes.xs, paddingHorizontal: Sizes.md, borderRadius: Sizes.radius.md },
  reloadText: { color: Colors.background, fontWeight: 'bold' },
  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: Sizes.lg },
  errorText: { color: Colors.error, marginBottom: Sizes.md },

  // kartica
  destCard: {
    backgroundColor: Colors.surface,
    borderRadius: Sizes.radius.lg,
    overflow: 'hidden',
    shadowColor: Colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: { position: 'relative' },
  destImage: { width: '100%', height: '100%' },
  heartButton: {
    position: 'absolute', top: Sizes.sm, right: Sizes.sm,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center',
  },
  heartIcon: { fontSize: 16, color: Colors.text },
  priceBadge: {
    position: 'absolute', bottom: Sizes.sm, right: Sizes.sm,
    backgroundColor: Colors.primary, paddingHorizontal: Sizes.sm, paddingVertical: Sizes.xs,
    borderRadius: Sizes.radius.sm,
  },
  priceText: { color: Colors.background, fontSize: Sizes.fontSize.sm, fontWeight: 'bold' },
  cardContent: { padding: Sizes.md },
  destTitle: { fontSize: Sizes.fontSize.md, fontWeight: 'bold', color: Colors.text, marginBottom: Sizes.xs },
  destLocation: { fontSize: Sizes.fontSize.sm, color: Colors.textSecondary },
});