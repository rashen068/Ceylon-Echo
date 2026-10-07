import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  AttractionCard,
  ScreenFrame,
  SectionHeading,
  TravelColors,
} from '@/components/travel-ui';

const filters = ['All', 'Heritage', 'Nature', 'Beaches'];

export default function ExploreScreen() {
  const [filter, setFilter] = useState('All');

  return (
    <ScreenFrame
      title="Explore"
      subtitle="Find a place that feels like yours."
      onProfile={() => router.push('/(tabs)/profile')}>
      <View style={styles.search}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          accessibilityLabel="Search attractions"
          placeholder="Search attractions..."
          placeholderTextColor="#8b9189"
          style={styles.searchInput}
        />
      </View>

      <SectionHeading title="Explore the map" />
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/(tabs)/map')}
        style={styles.mapCard}>
        <View style={styles.mapGrid} />
        <View style={styles.mapRoadOne} />
        <View style={styles.mapRoadTwo} />
        <View style={styles.mapWater} />
        <View style={[styles.mapPin, styles.pinOne]}>
          <Text style={styles.pinText}>•</Text>
        </View>
        <View style={[styles.mapPin, styles.pinTwo]}>
          <Text style={styles.pinText}>•</Text>
        </View>
        <View style={styles.mapAction}>
          <Text style={styles.mapActionText}>Open interactive map  →</Text>
        </View>
      </Pressable>

      <SectionHeading title="Nearby attractions" action="See all" onPress={() => router.push('/(tabs)/nearby')} />
      <View style={styles.filterRow}>
        {filters.map((item) => {
          const active = filter === item;
          return (
            <Pressable
              key={item}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setFilter(item)}
              style={[styles.filter, active && styles.filterActive]}>
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{item}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.cardList}>
        <AttractionCard
          title="Sigiriya Fortress"
          location="Matale District"
          category="Ancient site"
          tone="gold"
          onPress={() => router.push('/(tabs)/attraction')}
        />
        <AttractionCard
          title="Dambulla Cave Temple"
          location="Central Province"
          category="Temple"
          tone="blue"
          onPress={() => router.push('/(tabs)/attraction')}
        />
        <AttractionCard
          title="Minneriya National Park"
          location="North Central"
          category="Wildlife"
          tone="forest"
          onPress={() => router.push('/(tabs)/attraction')}
        />
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  search: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: TravelColors.border,
    borderRadius: 11,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
  },
  searchIcon: { color: '#617167', fontSize: 20 },
  searchInput: { flex: 1, color: TravelColors.ink, fontSize: 11 },
  mapCard: {
    height: 165,
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 13,
    backgroundColor: '#e3ece6',
  },
  mapGrid: {
    ...StyleSheet.absoluteFill,
    opacity: 0.4,
    backgroundColor: '#d9e4dc',
  },
  mapRoadOne: {
    position: 'absolute',
    top: -55,
    left: '48%',
    width: 17,
    height: 280,
    borderRadius: 20,
    backgroundColor: '#fbfaf5',
    transform: [{ rotate: '31deg' }],
  },
  mapRoadTwo: {
    position: 'absolute',
    top: '42%',
    left: -20,
    width: '120%',
    height: 13,
    borderRadius: 20,
    backgroundColor: '#fbfaf5',
    transform: [{ rotate: '-8deg' }],
  },
  mapWater: {
    position: 'absolute',
    top: -10,
    right: -26,
    width: 105,
    height: 105,
    borderRadius: 55,
    backgroundColor: '#c3d9d6',
  },
  mapPin: {
    position: 'absolute',
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 14,
    backgroundColor: TravelColors.orange,
  },
  pinOne: { left: '35%', top: '34%' },
  pinTwo: { right: '28%', bottom: '30%', backgroundColor: TravelColors.green },
  pinText: { color: '#ffffff', fontSize: 14, lineHeight: 16 },
  mapAction: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  mapActionText: { color: TravelColors.green, fontSize: 10, fontWeight: '700' },
  filterRow: { flexDirection: 'row', gap: 7, marginBottom: 10 },
  filter: {
    borderWidth: 1,
    borderColor: TravelColors.border,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#ffffff',
  },
  filterActive: { borderColor: TravelColors.green, backgroundColor: TravelColors.green },
  filterText: { color: TravelColors.muted, fontSize: 9, fontWeight: '600' },
  filterTextActive: { color: '#ffffff' },
  cardList: { gap: 10 },
});
