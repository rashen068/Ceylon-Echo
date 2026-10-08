import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
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

import type { OfflineGuide } from '@/features/tourist/offline-guides';
import {
  downloadOfflineGuide,
  formatFileSize,
  getOfflineGuides,
  removeOfflineGuide,
} from '@/features/tourist/offline-guides';
import { requireFirestore } from '@/lib/firebase';
import { useLanguage } from '@/context/LanguageContext';

type Guide = {
  id: string;
  title: string;
  category: string;
  imageUrl: string | null;
  audioUrl: string;
  isAvailableOnline: boolean;
};

const colors = {
  background: '#F8F6F1',
  white: '#FFFFFF',
  ink: '#1F2937',
  muted: '#858B91',
  line: '#E9E5DE',
  rust: '#B85E3B',
  green: '#315443',
  greenLight: '#EDF3EF',
};

export default function DownloadsScreen() {
  const { t } = useLanguage();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [offlineGuides, setOfflineGuides] = useState<OfflineGuide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyGuideId, setBusyGuideId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refreshGuides = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    let savedGuides: OfflineGuide[] = [];
    try {
      savedGuides = await getOfflineGuides();
      setOfflineGuides(savedGuides);
      setGuides(savedGuides.map(toGuide));
      if (savedGuides.length > 0) {
        setIsLoading(false);
      }
    } catch (loadError) {
      setErrorMessage(
        loadError instanceof Error
          ? loadError.message
          : t('offlineReadError'),
      );
    }

    try {
      const snapshot = await getDocs(
        query(collection(requireFirestore(), 'attractions'), orderBy('name', 'asc')),
      );
      const availableGuides = snapshot.docs.flatMap((item) => {
        const data = item.data();
        const media = isMediaWithUrl(data.audioGuide) ? data.audioGuide : null;
        if (!media) {
          return [];
        }
        const firstPhoto = Array.isArray(data.photos)
          ? data.photos.find(isMediaWithUrl)
          : undefined;
        return [{
          id: item.id,
          title: getText(data.name) || t('untitledAttraction'),
          category: getText(data.category) || t('audioGuide'),
          imageUrl: firstPhoto?.url ?? null,
          audioUrl: media.url,
          isAvailableOnline: true,
        }];
      });

      const availableIds = new Set(availableGuides.map((guide) => guide.id));
      const savedOnlyGuides = savedGuides
        .filter((guide) => !availableIds.has(guide.id))
        .map(toGuide);
      setGuides([...availableGuides, ...savedOnlyGuides]);
    } catch (loadError) {
      setGuides(savedGuides.map(toGuide));
      if (savedGuides.length === 0) {
        setErrorMessage(
          loadError instanceof Error
            ? loadError.message
            : t('offlineLoadGuidesError'),
        );
      } else {
        setErrorMessage(t('offlineBrowsingSavedOnly'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useFocusEffect(
    useCallback(() => {
      void refreshGuides();
    }, [refreshGuides]),
  );

  async function handleGuideAction(guide: Guide) {
    const offlineGuide = offlineGuides.find((item) => item.id === guide.id);
    if (offlineGuide) {
      router.push({
        pathname: '/player',
        params: {
          audioUrl: offlineGuide.localUri,
          title: `${offlineGuide.title} ${t('audioGuide')}`,
          subtitle: offlineGuide.category,
          imageUrl: offlineGuide.imageUrl ?? '',
        },
      });
      return;
    }

    setBusyGuideId(guide.id);
    setErrorMessage(null);
    try {
      const saved = await downloadOfflineGuide(guide);
      setOfflineGuides((current) => [...current.filter((item) => item.id !== saved.id), saved]);
    } catch (downloadError) {
      let message =
        downloadError instanceof Error
          ? downloadError.message
          : t('offlineDownloadError', { title: guide.title });
      try {
        setOfflineGuides(await getOfflineGuides());
      } catch (refreshError) {
        message += ` Saved download state could not be refreshed: ${
          refreshError instanceof Error ? refreshError.message : t('unknownError')
        }`;
      }
      setErrorMessage(message);
    } finally {
      setBusyGuideId(null);
    }
  }

  async function handleRemove(guideId: string) {
    setBusyGuideId(guideId);
    setErrorMessage(null);
    try {
      await removeOfflineGuide(guideId);
      setOfflineGuides((current) => current.filter((item) => item.id !== guideId));
    } catch (removeError) {
      setErrorMessage(
        removeError instanceof Error
          ? removeError.message
          : t('offlineRemoveError'),
      );
    } finally {
      setBusyGuideId(null);
    }
  }

  const availableGuideCount = guides.filter((guide) => guide.isAvailableOnline).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('audioGuides')}</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.storageCard}>
          <View style={styles.storageHeader}>
            <Text style={styles.storageTitle}>{t('availableFromStorage')}</Text>
            <Text style={styles.storageSize}>{t('guidesCount', { count: availableGuideCount })}</Text>
          </View>
          <Text style={styles.storageNote}>
            {t('offlineGuideIntro')}
          </Text>
        </View>
        <Text style={styles.sectionTitle}>{t('availableAudioGuides')}</Text>
        {isLoading ? (
          <View style={styles.state}>
            <ActivityIndicator color={colors.green} />
            <Text style={styles.stateText}>{t('loadingAudioGuides')}</Text>
          </View>
        ) : errorMessage && guides.length === 0 ? (
          <View style={styles.state}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <Pressable accessibilityRole="button" onPress={() => void refreshGuides()}>
              <Text style={styles.retryText}>{t('languageRetry')}</Text>
            </Pressable>
          </View>
        ) : guides.length === 0 ? (
          <View style={styles.state}>
            <Text style={styles.stateText}>{t('noGuidesUploaded')}</Text>
          </View>
        ) : (
          <View style={styles.guideList}>
            {guides.map((guide) => {
              const savedGuide = offlineGuides.find((item) => item.id === guide.id);
              const isBusy = busyGuideId === guide.id;
              const isAvailableOnline = guide.isAvailableOnline;
              return (
                <View key={guide.id} style={styles.guideCard}>
                  {guide.imageUrl ? (
                    <Image
                      contentFit="cover"
                      source={{ uri: guide.imageUrl }}
                      style={styles.thumbnail}
                    />
                  ) : (
                    <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
                      <Feather color={colors.green} name="map" size={17} />
                    </View>
                  )}
                  <View style={styles.guideCopy}>
                    <Text numberOfLines={1} style={styles.guideTitle}>
                      {guide.title}
                    </Text>
                    <Text numberOfLines={1} style={styles.category}>
                      {guide.category}
                    </Text>
                    <Text style={styles.fileSize}>
                      {savedGuide
                        ? formatFileSize(savedGuide.sizeBytes)
                        : t('availableToDownload')}
                    </Text>
                    {isAvailableOnline && (
                      <Pressable
                        accessibilityLabel={t('listenOnline', { title: guide.title })}
                        accessibilityRole="button"
                        onPress={() =>
                          router.push({
                            pathname: '/(tabs)/audio-guide',
                            params: { id: guide.id },
                          })
                        }>
                        <Text style={styles.onlineLink}>{t('listenOnlineLabel')}</Text>
                      </Pressable>
                    )}
                    {savedGuide && (
                      <Pressable
                        accessibilityRole="button"
                        disabled={isBusy}
                        onPress={() => void handleRemove(guide.id)}>
                        <Text style={styles.removeText}>{t('removeDownload')}</Text>
                      </Pressable>
                    )}
                  </View>
                  <Pressable
                    accessibilityLabel={
                      savedGuide
                        ? t('playOffline', { title: guide.title })
                        : t('downloadGuide', { title: guide.title })
                    }
                    accessibilityRole="button"
                    disabled={isBusy}
                    onPress={() => void handleGuideAction(guide)}
                    style={({ pressed }) => [
                      styles.playButton,
                      pressed && styles.pressed,
                      isBusy && styles.disabled,
                    ]}>
                    {isBusy ? (
                      <ActivityIndicator color={colors.green} size="small" />
                    ) : (
                      <Feather
                        color={colors.green}
                        name={savedGuide ? 'play' : 'download'}
                        size={15}
                      />
                    )}
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}
        {errorMessage && guides.length > 0 && (
          <Text accessibilityRole="alert" style={styles.errorBanner}>
            {errorMessage}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function getText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function toGuide(guide: OfflineGuide): Guide {
  return {
    id: guide.id,
    title: guide.title,
    category: guide.category,
    imageUrl: guide.imageUrl,
    audioUrl: guide.audioUrl,
    isAvailableOnline: false,
  };
}

function isMediaWithUrl(value: unknown): value is { url: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'url' in value &&
    typeof value.url === 'string' &&
    value.url.length > 0
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    minHeight: 58,
    paddingHorizontal: 18,
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
    backgroundColor: colors.background,
  },
  headerTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '800',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
    gap: 10,
  },
  storageCard: {
    borderRadius: 13,
    padding: 14,
    backgroundColor: colors.greenLight,
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  storageTitle: {
    flex: 1,
    color: colors.ink,
    fontSize: 11,
    fontWeight: '700',
  },
  storageSize: {
    color: colors.green,
    fontSize: 10,
    fontWeight: '600',
  },
  storageNote: {
    marginTop: 7,
    color: colors.muted,
    fontSize: 9,
    lineHeight: 14,
  },
  sectionTitle: {
    marginBottom: 1,
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
  },
  guideList: {
    gap: 8,
  },
  guideCard: {
    minHeight: 62,
    padding: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  thumbnail: {
    width: 44,
    height: 44,
    borderRadius: 7,
    backgroundColor: colors.line,
  },
  thumbnailPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideCopy: {
    flex: 1,
    gap: 3,
  },
  guideTitle: {
    color: colors.ink,
    fontSize: 11,
    fontWeight: '700',
  },
  category: {
    color: colors.muted,
    fontSize: 9,
  },
  fileSize: {
    color: colors.muted,
    fontSize: 9,
  },
  onlineLink: {
    color: colors.green,
    fontSize: 9,
    fontWeight: '700',
  },
  removeText: {
    color: colors.rust,
    fontSize: 9,
    fontWeight: '600',
  },
  playButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.greenLight,
  },
  disabled: {
    opacity: 0.6,
  },
  state: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    gap: 10,
  },
  stateText: {
    color: colors.muted,
    textAlign: 'center',
    fontSize: 12,
  },
  errorText: {
    color: colors.rust,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
  },
  errorBanner: {
    color: colors.rust,
    fontSize: 11,
    lineHeight: 16,
  },
  retryText: {
    color: colors.green,
    fontSize: 12,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.65,
  },
});
