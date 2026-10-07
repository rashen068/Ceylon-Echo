import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { featuredGuide } from '@/features/tourist/mock-guide-data';

const colors = {
  background: '#F8F6F1',
  white: '#FFFFFF',
  ink: '#1F2937',
  muted: '#7C838A',
  line: '#EAE5DD',
  rust: '#B85E3B',
  green: '#315443',
  greenLight: '#EAF1EC',
};

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>LANKA HERITAGE</Text>
            <Text style={styles.heading}>Discover Sri Lanka</Text>
          </View>
          <View style={styles.headerIcon}>
            <Feather color={colors.green} name="compass" size={20} />
          </View>
        </View>

        <Text style={styles.intro}>
          Explore the island through the stories behind its remarkable places.
        </Text>

        <Pressable
          accessibilityLabel={`Explore ${featuredGuide.title}`}
          accessibilityRole="button"
          onPress={() => router.push(`/attraction/${featuredGuide.id}`)}
          style={({ pressed }) => [styles.featuredCard, pressed && styles.pressed]}>
          <View style={styles.imageContainer}>
            <Image
              contentFit="cover"
              source={{ uri: featuredGuide.image }}
              style={styles.featuredImage}
            />
            <View style={styles.imageShade} />
            <Text style={styles.imageLabel}>FEATURED HERITAGE SITE</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>UNESCO World Heritage</Text>
            </View>
            <Text style={styles.featuredTitle}>{featuredGuide.title}</Text>
            <View style={styles.location}>
              <Feather color={colors.muted} name="map-pin" size={14} />
              <Text style={styles.locationText}>Matale District, Central Province</Text>
            </View>
            <Text style={styles.description}>
              Discover the ancient rock fortress and its extraordinary gardens with an audio guide.
            </Text>
            <View style={styles.cardFooter}>
              <Text style={styles.exploreText}>Explore attraction</Text>
              <Feather color={colors.rust} name="arrow-right" size={17} />
            </View>
          </View>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/downloads')}
          style={({ pressed }) => [styles.downloadLink, pressed && styles.pressed]}>
          <Feather color={colors.green} name="download" size={16} />
          <Text style={styles.downloadText}>View offline audio guides</Text>
          <Feather color={colors.green} name="chevron-right" size={16} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: colors.rust,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.3,
  },
  heading: {
    marginTop: 5,
    color: colors.ink,
    fontSize: 23,
    fontWeight: '800',
  },
  headerIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: colors.greenLight,
  },
  intro: {
    maxWidth: 300,
    marginTop: 10,
    marginBottom: 20,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  featuredCard: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  imageContainer: {
    height: 220,
    justifyContent: 'flex-end',
    backgroundColor: colors.green,
  },
  featuredImage: {
    ...StyleSheet.absoluteFill,
  },
  imageShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(16, 25, 20, 0.2)',
  },
  imageLabel: {
    margin: 15,
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  cardContent: {
    padding: 16,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: colors.greenLight,
  },
  tagText: {
    color: colors.green,
    fontSize: 10,
    fontWeight: '700',
  },
  featuredTitle: {
    marginTop: 10,
    color: colors.ink,
    fontSize: 21,
    fontWeight: '800',
  },
  location: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  locationText: {
    color: colors.muted,
    fontSize: 11,
  },
  description: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  cardFooter: {
    marginTop: 17,
    paddingTop: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  exploreText: {
    color: colors.rust,
    fontSize: 12,
    fontWeight: '700',
  },
  downloadLink: {
    minHeight: 54,
    marginTop: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  downloadText: {
    flex: 1,
    color: colors.green,
    fontSize: 12,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
});
