import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DataMessage } from '@/components/data-message';
import SriLankaMap from '@/components/sri-lanka-map';
import type { MappedAttraction } from '@/components/sri-lanka-map.types';
import { PrimaryButton, ScreenFrame, SectionHeading, TravelColors } from '@/components/travel-ui';
import { useLanguage } from '@/context/LanguageContext';
import { useAttractions } from '@/hooks/use-attractions';

export default function InteractiveMapScreen() {
  const { t } = useLanguage();
  const { attractions, isLoading, error } = useAttractions();
  const [recenterMap, setRecenterMap] = useState<() => void>(() => () => {});
  const registerRecenterMap = useCallback((recenter: () => void) => {
    setRecenterMap(() => recenter);
  }, []);
  const mapAttractions = attractions.slice(0, 2);
  const mappedAttractions: MappedAttraction[] = useMemo(
    () =>
      attractions.flatMap((attraction) => {
        if (
          typeof attraction.latitude !== 'number' ||
          !Number.isFinite(attraction.latitude) ||
          typeof attraction.longitude !== 'number' ||
          !Number.isFinite(attraction.longitude)
        ) {
          return [];
        }
        return [
          {
            id: attraction.id,
            name: attraction.name,
            location: attraction.location,
            latitude: attraction.latitude,
            longitude: attraction.longitude,
          },
        ];
      }),
    [attractions],
  );
  const onAttractionPress = useCallback(
    (id: string) => router.push({ pathname: '/attraction/[id]', params: { id } }),
    [],
  );

  return (
    <ScreenFrame title={t('mapTitle')} subtitle={t('mapSubtitle')}>
      <View style={styles.map}>
        <SriLankaMap
          attractions={mappedAttractions}
          onAttractionPress={onAttractionPress}
          onRecenterReady={registerRecenterMap}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Recenter map on Sri Lanka"
          onPress={recenterMap}
          style={styles.locateButton}>
          <Text style={styles.locateText}>◎</Text>
        </Pressable>
        <View style={styles.mapLegend}>
          <Text style={styles.legendTitle}>{t('culturalTriangle')}</Text>
          <Text style={styles.legendSubtitle}>
            {t('attractionsCount', { count: attractions.length })}
          </Text>
        </View>
      </View>
      {isLoading ? <DataMessage isLoading message={t('loadingMapAttractions')} /> : null}
      {error ? <DataMessage isError message={error} /> : null}
      <SectionHeading
        title={t('aroundThisArea')}
        action={t('nearby')}
        onPress={() => router.push('/(tabs)/nearby')}
      />
      {!isLoading && !error && attractions.length === 0 ? (
        <DataMessage message={t('noMapAttractions')} />
      ) : null}
      {mapAttractions.map((item, index) => (
        <Pressable
          key={item.id}
          accessibilityRole="button"
          onPress={() => router.push({ pathname: '/attraction/[id]', params: { id: item.id } })}
          style={styles.placeRow}>
          <View style={[styles.placePin, index === 1 && styles.placePinAlt]}>
            <Text style={styles.placePinText}>{index + 1}</Text>
          </View>
          <View style={styles.placeCopy}>
            <Text style={styles.placeTitle}>{item.name}</Text>
            <Text style={styles.placeDistance}>{item.location}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      ))}
      <PrimaryButton
        title={t('seeNearbyAttractions')}
        onPress={() => router.push('/(tabs)/nearby')}
        style={styles.button}
      />
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 320,
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 15,
    backgroundColor: '#eaf0e8',
  },
  locateButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  locateText: { color: TravelColors.green, fontSize: 17 },
  mapLegend: {
    position: 'absolute',
    right: 9,
    bottom: 9,
    left: 9,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  legendTitle: { color: TravelColors.ink, fontSize: 10, fontWeight: '700' },
  legendSubtitle: { marginTop: 3, color: TravelColors.muted, fontSize: 8 },
  placeRow: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderColor: '#efeee8',
  },
  placePin: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: TravelColors.orange,
  },
  placePinAlt: { backgroundColor: TravelColors.green },
  placePinText: { color: '#ffffff', fontSize: 10, fontWeight: '700' },
  placeCopy: { flex: 1 },
  placeTitle: { color: TravelColors.ink, fontSize: 10, fontWeight: '700' },
  placeDistance: { marginTop: 3, color: TravelColors.muted, fontSize: 8 },
  chevron: { color: TravelColors.green, fontSize: 18 },
  button: { marginTop: 15 },
});
