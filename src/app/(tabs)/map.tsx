import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton, ScreenFrame, SectionHeading, TravelColors } from '@/components/travel-ui';

export default function InteractiveMapScreen() {
  return (
    <ScreenFrame title="Explore Map" subtitle="Discover remarkable places around you.">
      <View style={styles.map}>
        <View style={styles.terrainOne} />
        <View style={styles.terrainTwo} />
        <View style={styles.water} />
        <View style={styles.roadVertical} />
        <View style={styles.roadDiagonal} />
        <View style={styles.roadHorizontal} />
        <View style={styles.routeLine} />
        <MapPin title="Sigiriya" style={styles.sigiriyaPin} onPress={() => router.push('/(tabs)/attraction')} />
        <MapPin title="Dambulla" style={styles.dambullaPin} onPress={() => router.push('/(tabs)/attraction')} />
        <View style={styles.currentLocation}>
          <View style={styles.currentDot} />
        </View>
        <View style={styles.locateButton}>
          <Text style={styles.locateText}>◎</Text>
        </View>
        <View style={styles.mapLegend}>
          <Text style={styles.legendTitle}>Cultural Triangle</Text>
          <Text style={styles.legendSubtitle}>2 places nearby</Text>
        </View>
      </View>
      <SectionHeading title="Around this area" action="Nearby" onPress={() => router.push('/(tabs)/nearby')} />
      <View style={styles.placeRow}>
        <View style={styles.placePin}><Text style={styles.placePinText}>1</Text></View>
        <View style={styles.placeCopy}>
          <Text style={styles.placeTitle}>Sigiriya Ancient Fortress</Text>
          <Text style={styles.placeDistance}>12 km · about 25 min drive</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>
      <View style={styles.placeRow}>
        <View style={[styles.placePin, styles.placePinAlt]}><Text style={styles.placePinText}>2</Text></View>
        <View style={styles.placeCopy}>
          <Text style={styles.placeTitle}>Dambulla Cave Temple</Text>
          <Text style={styles.placeDistance}>19 km · about 35 min drive</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>
      <PrimaryButton title="See nearby attractions" onPress={() => router.push('/(tabs)/nearby')} style={styles.button} />
    </ScreenFrame>
  );
}

function MapPin({
  title,
  style,
  onPress,
}: {
  title: string;
  style: object;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.pinWrap, style]}>
      <View style={styles.pinBubble}><Text style={styles.pinDot}>•</Text></View>
      <Text style={styles.pinLabel}>{title}</Text>
    </Pressable>
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
  terrainOne: {
    position: 'absolute',
    top: '4%',
    left: '-20%',
    width: '80%',
    height: '55%',
    borderRadius: 150,
    backgroundColor: '#dce9d8',
    transform: [{ rotate: '-16deg' }],
  },
  terrainTwo: {
    position: 'absolute',
    right: '-17%',
    bottom: '-4%',
    width: '85%',
    height: '61%',
    borderRadius: 160,
    backgroundColor: '#d4e4d2',
    transform: [{ rotate: '13deg' }],
  },
  water: {
    position: 'absolute',
    top: '10%',
    right: '7%',
    width: 65,
    height: 110,
    borderRadius: 40,
    backgroundColor: '#c7dfe0',
    transform: [{ rotate: '27deg' }],
  },
  roadVertical: {
    position: 'absolute',
    top: '-25%',
    left: '47%',
    width: 14,
    height: '150%',
    borderRadius: 20,
    backgroundColor: '#fffdf4',
    transform: [{ rotate: '20deg' }],
  },
  roadDiagonal: {
    position: 'absolute',
    top: '20%',
    left: '16%',
    width: 12,
    height: '115%',
    borderRadius: 20,
    backgroundColor: '#fffdf4',
    transform: [{ rotate: '-43deg' }],
  },
  roadHorizontal: {
    position: 'absolute',
    top: '55%',
    left: '-20%',
    width: '145%',
    height: 12,
    borderRadius: 20,
    backgroundColor: '#fffdf4',
    transform: [{ rotate: '8deg' }],
  },
  routeLine: {
    position: 'absolute',
    top: '31%',
    left: '36%',
    width: '39%',
    height: '37%',
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#bc603e',
    borderStyle: 'dashed',
    borderBottomRightRadius: 45,
    transform: [{ rotate: '-4deg' }],
  },
  pinWrap: { position: 'absolute', alignItems: 'center' },
  sigiriyaPin: { top: '25%', left: '37%' },
  dambullaPin: { right: '18%', bottom: '25%' },
  pinBubble: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 16,
    backgroundColor: TravelColors.orange,
  },
  pinDot: { color: '#ffffff', fontSize: 17, lineHeight: 18 },
  pinLabel: {
    marginTop: 3,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    color: TravelColors.ink,
    backgroundColor: '#ffffff',
    fontSize: 8,
    fontWeight: '600',
  },
  currentLocation: {
    position: 'absolute',
    right: '37%',
    top: '51%',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: 'rgba(86, 147, 236, 0.2)',
  },
  currentDot: {
    width: 10,
    height: 10,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 6,
    backgroundColor: '#4f91e8',
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
