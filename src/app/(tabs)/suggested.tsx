import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { LandscapeArt, PrimaryButton, ScreenFrame, TravelColors } from '@/components/travel-ui';

const stops = [
  { day: 'DAY 1', title: 'Sigiriya Ancient Fortress', detail: 'Sunrise climb · 2–3 hours' },
  { day: 'DAY 1', title: 'Dambulla Cave Temple', detail: 'Golden Temple · 1–2 hours' },
  { day: 'DAY 2', title: 'Polonnaruwa Ancient City', detail: 'Cycle the ancient ruins · 3 hours' },
];

export default function SuggestedRouteScreen() {
  return (
    <ScreenFrame title="Suggested Route" subtitle="A thoughtful journey through Sri Lanka’s Cultural Triangle.">
      <LandscapeArt tone="gold" style={styles.hero} />
      <View style={styles.routeSummary}>
        <Text style={styles.routeTitle}>The Cultural Triangle</Text>
        <Text style={styles.routeSub}>3 days · 3 stops · History & heritage</Text>
      </View>
      <View style={styles.timeline}>
        {stops.map((stop, index) => (
          <View key={stop.title} style={styles.stopRow}>
            <View style={styles.timelineColumn}>
              <View style={[styles.stopDot, index === 0 && styles.firstDot]}>
                <Text style={styles.stopNumber}>{index + 1}</Text>
              </View>
              {index < stops.length - 1 ? <View style={styles.connector} /> : null}
            </View>
            <View style={styles.stopContent}>
              <Text style={styles.stopDay}>{stop.day}</Text>
              <Text style={styles.stopTitle}>{stop.title}</Text>
              <Text style={styles.stopDetail}>{stop.detail}</Text>
            </View>
            <Text style={styles.stopMore}>›</Text>
          </View>
        ))}
      </View>
      <PrimaryButton
        title="Navigate this route"
        onPress={() => router.push('/(tabs)/map')}
        style={styles.button}
      />
      <Text style={styles.helper}>You can adjust this itinerary any time.</Text>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  hero: { height: 150, borderRadius: 13 },
  routeSummary: {
    marginTop: 12,
    borderRadius: 11,
    padding: 12,
    backgroundColor: '#f2eee4',
  },
  routeTitle: { color: TravelColors.ink, fontFamily: 'serif', fontSize: 15, fontWeight: '700' },
  routeSub: { marginTop: 4, color: TravelColors.muted, fontSize: 9 },
  timeline: { marginTop: 14 },
  stopRow: { minHeight: 62, flexDirection: 'row', alignItems: 'stretch', gap: 10 },
  timelineColumn: { width: 24, alignItems: 'center' },
  stopDot: {
    zIndex: 1,
    width: 23,
    height: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#c8d8cd',
    borderRadius: 13,
    backgroundColor: '#ffffff',
  },
  firstDot: { borderColor: TravelColors.orange, backgroundColor: TravelColors.orange },
  stopNumber: { color: TravelColors.green, fontSize: 8, fontWeight: '700' },
  connector: {
    position: 'absolute',
    top: 23,
    bottom: -1,
    width: 1,
    backgroundColor: '#cedbd1',
  },
  stopContent: { flex: 1, paddingBottom: 12 },
  stopDay: { color: TravelColors.orange, fontSize: 7, fontWeight: '700', letterSpacing: 0.6 },
  stopTitle: { marginTop: 3, color: TravelColors.ink, fontSize: 10, fontWeight: '700' },
  stopDetail: { marginTop: 3, color: TravelColors.muted, fontSize: 8 },
  stopMore: { color: TravelColors.green, fontSize: 18 },
  button: { marginTop: 12, backgroundColor: TravelColors.green },
  helper: { marginTop: 8, color: TravelColors.muted, fontSize: 8, textAlign: 'center' },
});
