import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  LayoutAnimation,
  Pressable,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  UIManager,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { requireFirestore } from '@/lib/firebase';

const colors = {
  background: '#F8F6F1',
  white: '#FFFFFF',
  ink: '#1F2937',
  muted: '#7C838A',
  line: '#EAE5DD',
  rust: '#B85E3B',
  rustLight: '#F7EDE7',
  green: '#315443',
  greenLight: '#EAF1EC',
};

type AttractionDetails = {
  title: string;
  category: string;
  location: string;
  description: string;
  imageUrl: string | null;
  audioUrl: string | null;
  duration: string;
  chapterCount: string;
};

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

function formatDuration(value: unknown): string {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${value} Mins`;
  }
  return getText(value) || '—';
}

function formatChapterCount(value: unknown): string {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${value} Parts`;
  }
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }
  return '—';
}

export default function AttractionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [attraction, setAttraction] = useState<AttractionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  function toggleDescription() {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental?.(true);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded((expanded) => !expanded);
  }

  useEffect(() => {
    let isActive = true;

    async function loadAttraction() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        if (!id) {
          throw new Error('No attraction ID was provided.');
        }

        const snapshot = await getDoc(doc(requireFirestore(), 'attractions', id));
        if (!snapshot.exists()) {
          throw new Error('This attraction could not be found.');
        }

        const data = snapshot.data();
        const photos = Array.isArray(data.photos) ? data.photos : [];
        const firstPhoto = photos.find(isMediaWithUrl);
        const audioGuide = isMediaWithUrl(data.audioGuide) ? data.audioGuide : null;
        const chapters = Array.isArray(data.chapters) ? data.chapters.length : undefined;

        if (isActive) {
          setAttraction({
            title: getText(data.name) || getText(data.title) || 'Untitled attraction',
            category: getText(data.category) || 'Heritage Site',
            location: getText(data.location) || 'Location not provided',
            description: getText(data.description) || 'No description available.',
            imageUrl:
              getText(data.imageUrl) ||
              getText(data.image) ||
              firstPhoto?.url ||
              null,
            audioUrl: audioGuide?.url || getText(data.audioUrl) || null,
            duration: formatDuration(data.duration ?? data.durationMinutes ?? data.durationMins),
            chapterCount: formatChapterCount(
              data.chapterCount ?? data.chaptersCount ?? chapters,
            ),
          });
        }
      } catch (fetchError) {
        if (isActive) {
          setErrorMessage(
            fetchError instanceof Error
              ? fetchError.message
              : 'Could not load this attraction. Please try again.',
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadAttraction();
    return () => {
      isActive = false;
    };
  }, [id, retryCount]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.stateContainer}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator color={colors.green} size="large" />
        <Text style={styles.stateText}>Loading attraction...</Text>
      </SafeAreaView>
    );
  }

  if (errorMessage || !attraction) {
    return (
      <SafeAreaView style={styles.stateContainer}>
        <StatusBar barStyle="dark-content" />
        <Feather color={colors.rust} name="alert-circle" size={30} />
        <Text style={styles.stateTitle}>Unable to load attraction</Text>
        <Text style={styles.stateText}>
          {errorMessage ?? 'This attraction has no available details.'}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => setRetryCount((count) => count + 1)}
          style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => router.back()}>
          <Text style={styles.backLink}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { height: width * 0.72 }]}>
          {attraction.imageUrl && (
            <Image
              contentFit="cover"
              source={{ uri: attraction.imageUrl }}
              style={styles.heroImage}
            />
          )}
          <View style={[styles.heroShade, { paddingTop: insets.top + 8 }]}>
            <View style={styles.heroHeader}>
              <Pressable
                accessibilityLabel="Go back"
                accessibilityRole="button"
                onPress={() => router.back()}
                style={styles.heroIconButton}>
                <Feather color={colors.white} name="arrow-left" size={20} />
              </Pressable>
              <Text numberOfLines={1} style={styles.brand}>
                Lanka Heritage
              </Text>
              <Pressable
                accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Bookmark attraction'}
                accessibilityRole="button"
                onPress={() => setIsBookmarked((value) => !value)}
                style={[styles.heroIconButton, isBookmarked && styles.bookmarkedButton]}>
                <Feather
                  color={colors.white}
                  name={isBookmarked ? 'bookmark' : 'bookmark'}
                  size={19}
                />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.tagRow}>
            <Text style={styles.heritageTag}>{attraction.category}</Text>
            <Text style={styles.unescoTag}>UNESCO World Heritage</Text>
          </View>
          <Text style={styles.title}>{attraction.title}</Text>
          <View style={styles.locationRow}>
            <Feather color={colors.muted} name="map-pin" size={14} />
            <Text style={styles.locationText}>{attraction.location}</Text>
          </View>
          <Text numberOfLines={isExpanded ? undefined : 3} style={styles.description}>
            {attraction.description}
          </Text>

          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <View style={[styles.infoIcon, styles.durationIcon]}>
                <Feather color={colors.green} name="clock" size={16} />
              </View>
              <View>
                <Text style={styles.infoLabel}>DURATION</Text>
                <Text style={styles.infoValue}>{attraction.duration}</Text>
              </View>
            </View>
            <View style={styles.infoCard}>
              <View style={[styles.infoIcon, styles.chapterIcon]}>
                <Feather color={colors.rust} name="music" size={16} />
              </View>
              <View>
                <Text style={styles.infoLabel}>CHAPTERS</Text>
                <Text style={styles.infoValue}>{attraction.chapterCount}</Text>
              </View>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() =>
              router.push({
                pathname: '/player',
                params: {
                  audioUrl: attraction.audioUrl ?? '',
                  title: `${attraction.title} Audio Guide - Chapter 1`,
                  subtitle: attraction.category,
                  imageUrl: attraction.imageUrl ?? '',
                },
              })
            }
            style={({ pressed }) => [styles.playButton, pressed && styles.pressed]}>
            <Feather color={colors.white} name="play" size={17} />
            <Text style={styles.playButtonText}>Play Audio Guide</Text>
          </Pressable>
          <View style={styles.secondaryRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: isExpanded }}
              onPress={toggleDescription}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
              <Feather
                color={colors.ink}
                name={isExpanded ? 'minus-circle' : 'info'}
                size={15}
              />
              <Text style={styles.secondaryButtonText}>
                {isExpanded ? 'Less Details' : 'More Details'}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/downloads')}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
              <Feather color={colors.ink} name="download" size={15} />
              <Text style={styles.secondaryButtonText}>Download</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 12,
    backgroundColor: colors.background,
  },
  stateTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '800',
  },
  stateText: {
    color: colors.muted,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 19,
  },
  retryButton: {
    marginTop: 6,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 9,
    backgroundColor: colors.green,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  backLink: {
    marginTop: 5,
    color: colors.rust,
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  hero: {
    height: 270,
    overflow: 'hidden',
    borderBottomRightRadius: 22,
    borderBottomLeftRadius: 22,
    backgroundColor: colors.green,
  },
  heroImage: {
    ...StyleSheet.absoluteFill,
  },
  heroShade: {
    ...StyleSheet.absoluteFill,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(16, 25, 20, 0.24)',
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroIconButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.24)',
  },
  brand: {
    flexShrink: 1,
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  bookmarkedButton: {
    backgroundColor: colors.rust,
  },
  details: {
    marginTop: -1,
    paddingHorizontal: 18,
    paddingTop: 16,
    gap: 12,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  heritageTag: {
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: colors.greenLight,
    color: colors.green,
    fontSize: 10,
    fontWeight: '700',
  },
  unescoTag: {
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: colors.rustLight,
    color: colors.rust,
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    marginTop: 1,
    color: colors.ink,
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '800',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  locationText: {
    color: colors.muted,
    fontSize: 12,
  },
  description: {
    marginTop: 1,
    color: '#717983',
    fontSize: 12,
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  infoCard: {
    minHeight: 56,
    flex: 1,
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  infoIcon: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  durationIcon: {
    backgroundColor: colors.greenLight,
  },
  chapterIcon: {
    backgroundColor: colors.rustLight,
  },
  infoLabel: {
    color: colors.muted,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  infoValue: {
    marginTop: 2,
    color: colors.ink,
    fontSize: 12,
    fontWeight: '700',
  },
  playButton: {
    minHeight: 48,
    marginTop: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    borderRadius: 9,
    backgroundColor: colors.rust,
  },
  playButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    minHeight: 42,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 9,
    backgroundColor: colors.white,
  },
  secondaryButtonText: {
    color: colors.ink,
    fontSize: 11,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.75,
  },
});
