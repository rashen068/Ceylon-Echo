import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  AttractionCard,
  DetailRow,
  LandscapeArt,
  PrimaryButton,
  ScreenFrame,
  SectionHeading,
} from '@/components/travel-ui';

export default function HomeScreen() {
  return (
    <ScreenFrame
      title="Discover Sri Lanka"
      subtitle="Stories, places and experiences worth remembering."
      onProfile={() => router.push('/(tabs)/profile')}>
      <View style={styles.search}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          accessibilityLabel="Search destinations"
          placeholder="Search destinations..."
          placeholderTextColor="#8b9189"
          style={styles.searchInput}
        />
        <Text style={styles.filter}>☷</Text>
      </View>

      <View style={styles.hero}>
        <LandscapeArt tone="forest" style={styles.heroArt} />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroEyebrow}>YOUR ISLAND, YOUR WAY</Text>
          <Text style={styles.heroTitle}>Find your next story</Text>
          <Text style={styles.heroCopy}>Explore the places that make Sri Lanka unforgettable.</Text>
          <PrimaryButton
            title="Explore the map"
            onPress={() => router.push('/(tabs)/map')}
            style={styles.heroButton}
          />
        </View>
      </View>

      <SectionHeading
        title="Nearby Attractions"
        action="See all"
        onPress={() => router.push('/(tabs)/nearby')}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
        <AttractionCard
          title="Sigiriya Ancient Fortress"
          location="Matale District"
          tone="gold"
          compact
          onPress={() => router.push('/(tabs)/attraction')}
        />
        <AttractionCard
          title="Dambulla Cave Temple"
          location="Central Province"
          tone="blue"
          compact
          onPress={() => router.push('/(tabs)/attraction')}
        />
      </ScrollView>

      <SectionHeading
        title="Suggested Routes"
        action="View routes"
        onPress={() => router.push('/(tabs)/suggested')}
      />
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/(tabs)/suggested')}
        style={styles.routeCard}>
        <View style={styles.routeBadge}>
          <Text style={styles.routeBadgeText}>3 DAYS · CULTURE</Text>
        </View>
        <Text style={styles.routeTitle}>The Cultural Triangle</Text>
        <Text style={styles.routeDescription}>Sigiriya · Dambulla · Polonnaruwa</Text>
        <Text style={styles.routeArrow}>See your itinerary  →</Text>
      </Pressable>

      <SectionHeading
        title="Popular with visitors"
        action="Saved"
        onPress={() => router.push('/(tabs)/bookmarks')}
      />
      <DetailRow
        icon="◎"
        title="Lahiru Sannayake"
        subtitle="Explorer · 12 places saved"
        trailing="4.9"
      />
      <DetailRow
        icon="◎"
        title="Chathuri Perera"
        subtitle="Local guide · 8 routes"
        trailing="4.8"
      />
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  search: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    borderWidth: 1,
    borderColor: '#e7e8e1',
    borderRadius: 11,
    paddingHorizontal: 11,
    backgroundColor: '#ffffff',
  },
  searchIcon: { color: '#617167', fontSize: 21 },
  searchInput: { flex: 1, color: '#26382f', fontSize: 11 },
  filter: { color: '#285944', fontSize: 17 },
  hero: {
    height: 190,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 15,
    borderRadius: 13,
    backgroundColor: '#315c49',
  },
  heroArt: { ...StyleSheet.absoluteFill },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: 15,
    backgroundColor: 'rgba(26, 48, 37, 0.34)',
  },
  heroEyebrow: {
    color: '#f0dca7',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
  },
  heroTitle: { marginTop: 5, color: '#ffffff', fontSize: 20, fontWeight: '700' },
  heroCopy: { maxWidth: 255, marginTop: 3, color: '#f4f2e9', fontSize: 10 },
  heroButton: { minHeight: 32, marginTop: 9, paddingHorizontal: 13 },
  horizontalList: { overflow: 'visible' },
  routeCard: {
    minHeight: 104,
    justifyContent: 'center',
    borderRadius: 13,
    paddingHorizontal: 15,
    backgroundColor: '#f0f3ed',
  },
  routeBadge: {
    alignSelf: 'flex-start',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#dce8df',
  },
  routeBadgeText: { color: '#285944', fontSize: 8, fontWeight: '700' },
  routeTitle: { marginTop: 6, color: '#26382f', fontSize: 14, fontWeight: '700' },
  routeDescription: { marginTop: 3, color: '#777d75', fontSize: 10 },
  routeArrow: { position: 'absolute', right: 14, bottom: 12, color: '#285944', fontSize: 9 },
});
