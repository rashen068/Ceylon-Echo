import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedText } from '@/lib/localized-attraction';
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

type FeaturedAttraction = {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  imageUrl: string | null;
};

export default function HomeScreen() {
  const { language, t } = useLanguage();
  const [attraction, setAttraction] = useState<FeaturedAttraction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadFeaturedAttraction() {
        setIsLoading(true);
        setErrorMessage(null);
        try {
          const snapshot = await getDocs(
            query(collection(requireFirestore(), 'attractions'), orderBy('name', 'asc')),
          );
          const firstAttraction = snapshot.docs[0];
          if (!firstAttraction) {
            if (isActive) {
              setAttraction(null);
            }
            return;
          }

          const data = firstAttraction.data();
          const photo = Array.isArray(data.photos)
            ? data.photos.find(isMediaWithUrl)
            : undefined;
          if (isActive) {
            setAttraction({
              id: firstAttraction.id,
              title: getText(data.name) || t('untitledAttraction'),
              category: getText(data.category) || t('heritageSite'),
              location: getText(data.location) || t('locationNotProvided'),
              description:
                getLocalizedText(data.description, language) || t('featuredAttractionDescription'),
              imageUrl: photo?.url ?? (getText(data.imageUrl) || null),
            });
          }
        } catch (loadError) {
          if (isActive) {
            setErrorMessage(
              loadError instanceof Error
                ? loadError.message
                : t('attractionsLoadError'),
            );
          }
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      }

      void loadFeaturedAttraction();
      return () => {
        isActive = false;
      };
    }, [language, t]),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>{t('homeEyebrow')}</Text>
            <Text style={styles.heading}>{t('discoverSriLankaTitle')}</Text>
          </View>
          <View style={styles.headerIcon}>
            <Feather color={colors.green} name="compass" size={20} />
          </View>
        </View>

        <Text style={styles.intro}>
          {t('homeIntro')}
        </Text>

        {isLoading ? (
          <View style={styles.feedbackCard}>
            <ActivityIndicator color={colors.green} />
            <Text style={styles.feedbackText}>{t('loadingAttractions')}</Text>
          </View>
        ) : errorMessage ? (
          <View style={styles.feedbackCard}>
            <Feather color={colors.rust} name="alert-circle" size={22} />
            <Text style={styles.feedbackText}>{errorMessage}</Text>
          </View>
        ) : attraction ? (
          <Pressable
            accessibilityLabel={t('exploreNamedAttraction', { title: attraction.title })}
            accessibilityRole="button"
            onPress={() =>
              router.push({
                pathname: '/attraction/[id]',
                params: { id: attraction.id },
              })
            }
            style={({ pressed }) => [styles.featuredCard, pressed && styles.pressed]}>
            <View style={styles.imageContainer}>
              {attraction.imageUrl && (
                <Image
                  contentFit="cover"
                  source={{ uri: attraction.imageUrl }}
                  style={styles.featuredImage}
                />
              )}
              <View style={styles.imageShade} />
              <Text style={styles.imageLabel}>{t('featuredHeritageSite')}</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{attraction.category}</Text>
              </View>
              <Text style={styles.featuredTitle}>{attraction.title}</Text>
              <View style={styles.location}>
                <Feather color={colors.muted} name="map-pin" size={14} />
                <Text style={styles.locationText}>{attraction.location}</Text>
              </View>
              <Text style={styles.description}>{attraction.description}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.exploreText}>{t('exploreAttraction')}</Text>
                <Feather color={colors.rust} name="arrow-right" size={17} />
              </View>
            </View>
          </Pressable>
        ) : (
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackText}>{t('noAttractionsYet')}</Text>
          </View>
        )}

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/downloads')}
          style={({ pressed }) => [styles.downloadLink, pressed && styles.pressed]}>
          <Feather color={colors.green} name="download" size={16} />
          <Text style={styles.downloadText}>{t('viewOfflineGuides')}</Text>
          <Feather color={colors.green} name="chevron-right" size={16} />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/admin')}
          style={({ pressed }) => [styles.adminLink, pressed && styles.pressed]}>
          <Feather color={colors.rust} name="lock" size={15} />
          <Text style={styles.adminLinkText}>{t('adminPortal')}</Text>
          <Feather color={colors.rust} name="chevron-right" size={16} />
        </Pressable>
      </ScrollView>
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
  feedbackCard: {
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    backgroundColor: colors.white,
  },
  feedbackText: {
    color: colors.muted,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
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
  adminLink: {
    minHeight: 44,
    marginTop: 18,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 10,
    backgroundColor: colors.rustLight,
  },
  adminLinkText: {
    color: colors.rust,
    fontSize: 12,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
});
