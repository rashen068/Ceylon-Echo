import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DataMessage } from '@/components/data-message';
import { AttractionCard, ScreenFrame, TravelColors } from '@/components/travel-ui';
import { useAttractions } from '@/hooks/use-attractions';
import { useLanguage } from '@/context/LanguageContext';

const filters = ['All', 'Heritage', 'Nature', 'Temple'] as const;
const filterTranslationKeys = {
  All: 'all',
  Heritage: 'heritage',
  Nature: 'nature',
  Temple: 'temple',
} as const;

export default function NearbyScreen() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState('All');
  const { attractions, isLoading, error } = useAttractions();
  const filteredAttractions = useMemo(
    () =>
      attractions.filter(
        (item) =>
          selected === 'All' || item.category.toLowerCase().includes(selected.toLowerCase()),
      ),
    [attractions, selected],
  );

  return (
    <ScreenFrame title={t('nearbyAttractions')} subtitle={t('nearbySubtitle')}>
      <View style={styles.location}>
        <Text style={styles.locationPin}>⌖</Text>
        <View style={styles.locationCopy}>
          <Text style={styles.locationTitle}>{t('acrossSriLanka')}</Text>
          <Text style={styles.locationSubtitle}>{t('browseCuratedAttractions')}</Text>
        </View>
      </View>
      <View style={styles.filters}>
        {filters.map((filter) => {
          const active = selected === filter;
          return (
            <Pressable
              key={filter}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setSelected(filter)}
              style={[styles.filter, active && styles.filterActive]}>
              <Text style={[styles.filterText, active && styles.filterTextActive]}>
                {t(filterTranslationKeys[filter])}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {isLoading ? <DataMessage isLoading message={t('loadingAttractions')} /> : null}
      {error ? <DataMessage isError message={error} /> : null}
      {!isLoading && !error && filteredAttractions.length === 0 ? (
        <DataMessage message={t('noNearbyAttractions')} />
      ) : null}
      {filteredAttractions.map((item, index) => (
        <AttractionCard
          key={item.id}
          title={item.name}
          location={item.location}
          category={item.category}
          tone={index % 3 === 0 ? 'gold' : index % 3 === 1 ? 'blue' : 'forest'}
          imageUrl={item.photos[0]?.url}
          onPress={() =>
            router.push({ pathname: '/attraction/[id]', params: { id: item.id } })
          }
        />
      ))}
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  location: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 12,
    borderRadius: 11,
    paddingHorizontal: 11,
    backgroundColor: '#eef3ef',
  },
  locationPin: { color: TravelColors.orange, fontSize: 18 },
  locationCopy: { flex: 1 },
  locationTitle: { color: TravelColors.ink, fontSize: 10, fontWeight: '700' },
  locationSubtitle: { marginTop: 3, color: TravelColors.muted, fontSize: 8 },
  filters: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  filter: {
    borderWidth: 1,
    borderColor: TravelColors.border,
    borderRadius: 18,
    paddingHorizontal: 11,
    paddingVertical: 7,
    backgroundColor: '#ffffff',
  },
  filterActive: { borderColor: TravelColors.green, backgroundColor: TravelColors.green },
  filterText: { color: TravelColors.muted, fontSize: 8, fontWeight: '600' },
  filterTextActive: { color: '#ffffff' },
});
