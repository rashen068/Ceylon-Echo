import * as Linking from 'expo-linking';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { DataMessage } from '@/components/data-message';
import { LandscapeArt, ScreenFrame, TravelColors } from '@/components/travel-ui';
import { useLanguage } from '@/context/LanguageContext';
import { useAttractions } from '@/hooks/use-attractions';

export default function AudioGuideScreen() {
  const { t } = useLanguage();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { attractions, isLoading, error } = useAttractions();
  const attraction = id
    ? attractions.find((item) => item.id === id)
    : attractions.find((item) => item.audioGuide !== null);
  const [isOpening, setIsOpening] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function openAudioGuide() {
    if (!attraction?.audioGuide) {
      return;
    }

    setIsOpening(true);
    setMessage(null);
    try {
      await Linking.openURL(attraction.audioGuide.url);
      setMessage(t('audioUrlOpened'));
    } catch (openError) {
      setMessage(
        openError instanceof Error ? openError.message : t('noGuideForAttraction'),
      );
    } finally {
      setIsOpening(false);
    }
  }

  return (
    <ScreenFrame
      title={t('audioGuide')}
      subtitle={attraction?.name ?? t('audioGuideDescription')}>
      <LandscapeArt
        tone="forest"
        label={attraction ? `${attraction.name} ${t('audioGuide')}` : t('audioGuide')}
        style={styles.cover}
      />
      {isLoading ? <DataMessage isLoading message={t('loadingAudioGuides')} /> : null}
      {error ? <DataMessage isError message={error} /> : null}
      {!isLoading && !error && !attraction?.audioGuide ? (
        <DataMessage message={t('noGuideForAttraction')} />
      ) : null}
      {attraction?.audioGuide ? (
        <>
          <Text style={styles.guideTitle}>{attraction.name}</Text>
          <Text style={styles.fileName}>{attraction.audioGuide.name}</Text>
          <Pressable
            accessibilityRole="button"
            disabled={isOpening}
            onPress={() => void openAudioGuide()}
            style={({ pressed }) => [
              styles.playButton,
              pressed && !isOpening && styles.pressed,
              isOpening && styles.disabled,
            ]}>
            <Text style={styles.playIcon}>{isOpening ? '…' : '▶'}</Text>
          </Pressable>
          <Text style={styles.status}>
            {message ?? (isOpening ? t('openingAudioGuide') : t('readyWhenYouAre'))}
          </Text>
        </>
      ) : null}
      {message && !attraction?.audioGuide ? <DataMessage isError message={message} /> : null}
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  cover: { height: 200, borderRadius: 15 },
  guideTitle: {
    marginTop: 17,
    color: TravelColors.ink,
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  fileName: {
    marginTop: 5,
    color: TravelColors.muted,
    fontSize: 10,
    textAlign: 'center',
  },
  playButton: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 24,
    borderRadius: 26,
    backgroundColor: TravelColors.green,
  },
  playIcon: { color: '#ffffff', fontSize: 18 },
  status: { marginTop: 9, color: TravelColors.orange, fontSize: 9, textAlign: 'center' },
  disabled: { opacity: 0.65 },
  pressed: { opacity: 0.8 },
});
