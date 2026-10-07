import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { featuredGuide, touristGuides } from '@/features/tourist/mock-guide-data';

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

export default function AttractionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const attraction = touristGuides.find((guide) => guide.id === id) ?? featuredGuide;

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { height: width * 0.72 }]}>
          <Image contentFit="cover" source={{ uri: attraction.image }} style={styles.heroImage} />
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
            <Text style={styles.heritageTag}>Heritage Site</Text>
            <Text style={styles.unescoTag}>UNESCO World Heritage</Text>
          </View>
          <Text style={styles.title}>{attraction.title}</Text>
          <View style={styles.locationRow}>
            <Feather color={colors.muted} name="map-pin" size={14} />
            <Text style={styles.locationText}>Matale District, Central Province</Text>
          </View>
          <Text style={styles.description}>
            Rising dramatically from the central plains, this 5th-century fortress is a
            masterpiece of ancient Sri Lankan urban planning, landscape design, and engineering.
            Built by King Kashyapa, the fortress features stunning frescoes and mirror walls.
          </Text>
          {showMoreDetails && (
            <Text style={styles.description}>
              Wander through the water gardens and climb the rock to discover the palace ruins,
              frescoes, and sweeping views across the surrounding plains.
            </Text>
          )}

          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <View style={[styles.infoIcon, styles.durationIcon]}>
                <Feather color={colors.green} name="clock" size={16} />
              </View>
              <View>
                <Text style={styles.infoLabel}>DURATION</Text>
                <Text style={styles.infoValue}>45 Mins</Text>
              </View>
            </View>
            <View style={styles.infoCard}>
              <View style={[styles.infoIcon, styles.chapterIcon]}>
                <Feather color={colors.rust} name="music" size={16} />
              </View>
              <View>
                <Text style={styles.infoLabel}>CHAPTERS</Text>
                <Text style={styles.infoValue}>8 Parts</Text>
              </View>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/player')}
            style={({ pressed }) => [styles.playButton, pressed && styles.pressed]}>
            <Feather color={colors.white} name="play" size={17} />
            <Text style={styles.playButtonText}>Play Audio Guide</Text>
          </Pressable>
          <View style={styles.secondaryRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setShowMoreDetails((visible) => !visible)}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
              <Feather
                color={colors.ink}
                name={showMoreDetails ? 'minus-circle' : 'info'}
                size={15}
              />
              <Text style={styles.secondaryButtonText}>
                {showMoreDetails ? 'Less Details' : 'More Details'}
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
