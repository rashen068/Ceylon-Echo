import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AttractionCard, ScreenFrame, TravelColors } from '@/components/travel-ui';

const savedAttractions = [
  { id: 'sigiriya', title: 'Sigiriya Ancient Fortress', location: 'Matale District', tone: 'gold' as const },
  { id: 'dambulla', title: 'Dambulla Cave Temple', location: 'Central Province', tone: 'blue' as const },
  { id: 'minneriya', title: 'Minneriya National Park', location: 'North Central', tone: 'forest' as const },
];

export default function BookmarksScreen() {
  const [saved, setSaved] = useState(savedAttractions.map((item) => item.id));
  const visibleAttractions = savedAttractions.filter((item) => saved.includes(item.id));

  return (
    <ScreenFrame title="Saved Attractions" subtitle="The places you want to remember.">
      {visibleAttractions.length ? (
        visibleAttractions.map((item) => (
          <View key={item.id} style={styles.savedCard}>
            <AttractionCard
              title={item.title}
              location={item.location}
              tone={item.tone}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remove ${item.title} from saved attractions`}
              onPress={() => setSaved((current) => current.filter((id) => id !== item.id))}
              style={styles.bookmarkButton}>
              <Text style={styles.bookmarkIcon}>▮</Text>
            </Pressable>
          </View>
        ))
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyMark}>♡</Text>
          <Text style={styles.emptyTitle}>Your saved places will be here</Text>
          <Text style={styles.emptyCopy}>Save a destination when you find one you love.</Text>
        </View>
      )}
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  savedCard: { position: 'relative', marginBottom: 11 },
  bookmarkButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#ffffff',
  },
  bookmarkIcon: { color: TravelColors.green, fontSize: 12 },
  empty: {
    alignItems: 'center',
    marginTop: 45,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 28,
    backgroundColor: '#f0f3ed',
  },
  emptyMark: { color: TravelColors.green, fontSize: 30 },
  emptyTitle: { marginTop: 12, color: TravelColors.ink, fontSize: 13, fontWeight: '700' },
  emptyCopy: { marginTop: 5, color: TravelColors.muted, fontSize: 10, textAlign: 'center' },
});
