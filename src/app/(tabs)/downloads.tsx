import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { DataMessage } from '@/components/data-message';
import { DetailRow, ScreenFrame, SectionHeading, TravelColors } from '@/components/travel-ui';
import { useLanguage } from '@/context/LanguageContext';
import { useAttractions } from '@/hooks/use-attractions';

export default function AudioGuidesScreen() {
  const { t } = useLanguage();
  const { attractions, isLoading, error } = useAttractions();
  const audioAttractions = attractions.filter((attraction) => attraction.audioGuide !== null);

  return (
    <ScreenFrame title={t('audioGuides')} subtitle={t('audioGuideDescription')}>
      <View style={styles.storageCard}>
        <View style={styles.storageHeader}>
          <Text style={styles.storageTitle}>{t('availableFromStorage')}</Text>
          <Text style={styles.storageSize}>{t('guidesCount', { count: audioAttractions.length })}</Text>
        </View>
        <Text style={styles.storageNote}>{t('audioInternetRequired')}</Text>
      </View>
      <SectionHeading title={t('availableAudioGuides')} />
      {isLoading ? <DataMessage isLoading message={t('loadingAudioGuides')} /> : null}
      {error ? <DataMessage isError message={error} /> : null}
      {!isLoading && !error && audioAttractions.length === 0 ? (
        <DataMessage message={t('noGuidesUploaded')} />
      ) : null}
      {audioAttractions.map((attraction) => (
        <DetailRow
          key={attraction.id}
          icon="♫"
          title={attraction.name}
          subtitle={attraction.audioGuide?.name}
          trailing="▶"
          onPress={() =>
            router.push({
              pathname: '/(tabs)/audio-guide',
              params: { id: attraction.id },
            })
          }
        />
      ))}
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  storageCard: {
    borderRadius: 13,
    padding: 14,
    backgroundColor: '#f0f4ef',
  },
  storageHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  storageTitle: { flex: 1, color: TravelColors.ink, fontSize: 11, fontWeight: '700' },
  storageSize: { color: TravelColors.green, fontSize: 10, fontWeight: '600' },
  storageNote: { marginTop: 7, color: TravelColors.muted, fontSize: 9, lineHeight: 14 },
});
