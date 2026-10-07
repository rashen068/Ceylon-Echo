import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { requireFirestore } from '@/lib/firebase';

type AttractionCard = {
  id: string;
  name: string;
  category: string;
  location: string;
  imageUrl: string | null;
};

const colors = {
  background: '#F8F6F1',
  white: '#FFFFFF',
  ink: '#1F2937',
  muted: '#7C838A',
  line: '#EAE5DD',
  rust: '#B85E3B',
  green: '#315443',
};

export default function ExploreScreen() {
  const [attractions, setAttractions] = useState<AttractionCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadAttractions() {
        setIsLoading(true);
        setErrorMessage(null);
        try {
          const snapshot = await getDocs(
            query(collection(requireFirestore(), 'attractions'), orderBy('name', 'asc')),
          );
          if (isActive) {
            setAttractions(
              snapshot.docs.map((item) => {
                const data = item.data();
                const photo = Array.isArray(data.photos)
                  ? data.photos.find(isMediaWithUrl)
                  : undefined;
                return {
                  id: item.id,
                  name: getText(data.name) || 'Untitled attraction',
                  category: getText(data.category) || 'Heritage Site',
                  location: getText(data.location) || 'Location not provided',
                  imageUrl: photo?.url ?? (getText(data.imageUrl) || null),
                };
              }),
            );
          }
        } catch (loadError) {
          if (isActive) {
            setErrorMessage(
              loadError instanceof Error
                ? loadError.message
                : 'Could not load attractions. Please try again.',
            );
          }
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      }

      void loadAttractions();
      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        contentContainerStyle={styles.content}
        data={attractions}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.state}>
            {isLoading ? (
              <ActivityIndicator color={colors.green} />
            ) : (
              <Feather
                color={errorMessage ? colors.rust : colors.muted}
                name={errorMessage ? 'alert-circle' : 'map'}
                size={25}
              />
            )}
            <Text style={styles.stateText}>
              {isLoading ? 'Loading attractions...' : errorMessage || 'No attractions available yet.'}
            </Text>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>LANKA HERITAGE</Text>
            <Text style={styles.title}>Explore attractions</Text>
            <Text style={styles.subtitle}>Discover places and stories across Sri Lanka.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityLabel={`View ${item.name}`}
            accessibilityRole="button"
            onPress={() => router.push(`/attraction/${item.id}`)}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
            {item.imageUrl ? (
              <Image contentFit="cover" source={{ uri: item.imageUrl }} style={styles.image} />
            ) : (
              <View style={[styles.image, styles.imagePlaceholder]}>
                <Feather color={colors.green} name="map" size={22} />
              </View>
            )}
            <View style={styles.cardCopy}>
              <Text numberOfLines={1} style={styles.category}>
                {item.category}
              </Text>
              <Text numberOfLines={1} style={styles.name}>
                {item.name}
              </Text>
              <View style={styles.locationRow}>
                <Feather color={colors.muted} name="map-pin" size={12} />
                <Text numberOfLines={1} style={styles.location}>
                  {item.location}
                </Text>
              </View>
            </View>
            <Feather color={colors.rust} name="chevron-right" size={19} />
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function getText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function isMediaWithUrl(value: unknown): value is { url: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'url' in value &&
    typeof value.url === 'string'
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
    gap: 10,
  },
  header: {
    paddingTop: 5,
    paddingBottom: 8,
  },
  eyebrow: {
    color: colors.rust,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  title: {
    marginTop: 5,
    color: colors.ink,
    fontSize: 23,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 12,
  },
  card: {
    minHeight: 82,
    padding: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  image: {
    width: 62,
    height: 62,
    borderRadius: 8,
    backgroundColor: colors.line,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCopy: {
    flex: 1,
    gap: 4,
  },
  category: {
    color: colors.rust,
    fontSize: 9,
    fontWeight: '700',
  },
  name: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    flex: 1,
    color: colors.muted,
    fontSize: 10,
  },
  state: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 10,
  },
  stateText: {
    color: colors.muted,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.7,
  },
});
