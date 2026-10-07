import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AttractionCard, ScreenFrame, TravelColors } from '@/components/travel-ui';

const filters = ['All', 'Heritage', 'Nature', 'Temple'];

export default function NearbyScreen() {
  const [selected, setSelected] = useState('All');

  return (
    <ScreenFrame title="Nearby Attractions" subtitle="Wonderful places close to your location.">
      <View style={styles.location}>
        <Text style={styles.locationPin}>⌖</Text>
        <View style={styles.locationCopy}>
          <Text style={styles.locationTitle}>Near Sigiriya, Sri Lanka</Text>
          <Text style={styles.locationSubtitle}>Showing places within 50 km</Text>
        </View>
        <Text style={styles.change}>Change</Text>
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
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{filter}</Text>
            </Pressable>
          );
        })}
      </View>
      <AttractionCard
        title="Sigiriya Ancient Fortress"
        location="12 km away"
        category="Heritage"
        tone="gold"
        onPress={() => router.push('/(tabs)/attraction')}
      />
      <AttractionCard
        title="Dambulla Cave Temple"
        location="19 km away"
        category="Temple"
        tone="blue"
        onPress={() => router.push('/(tabs)/attraction')}
      />
      <AttractionCard
        title="Minneriya National Park"
        location="27 km away"
        category="Nature"
        tone="forest"
        onPress={() => router.push('/(tabs)/attraction')}
      />
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
  change: { color: TravelColors.green, fontSize: 9, fontWeight: '700' },
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
