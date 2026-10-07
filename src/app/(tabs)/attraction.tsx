import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  DetailRow,
  InfoPill,
  LandscapeArt,
  PrimaryButton,
  ScreenFrame,
  SoftButton,
  TravelColors,
} from '@/components/travel-ui';

export default function AttractionScreen() {
  const [saved, setSaved] = useState(false);

  return (
    <ScreenFrame title="Sigiriya Fortress" subtitle="An ancient wonder rising above the central plains.">
      <LandscapeArt
        tone="gold"
        label="Illustrated landscape placeholder; Sigiriya photo asset required"
        style={styles.heroArt}
      />
      <View style={styles.tagRow}>
        <InfoPill label="UNESCO WORLD HERITAGE" />
        <Text style={styles.rating}>★ 4.9 (2.4k)</Text>
      </View>
      <Text style={styles.description}>
        Discover the remarkable rock fortress, water gardens and frescoes of one of Sri Lanka’s
        most treasured historic sites.
      </Text>
      <View style={styles.facts}>
        <Fact label="BEST TIME" value="Early morning" />
        <Fact label="VISIT" value="2–3 hours" />
        <Fact label="DISTANCE" value="12 km away" />
      </View>
      <View style={styles.buttonRow}>
        <PrimaryButton
          title="Play Audio Guide"
          onPress={() => router.push('/(tabs)/audio-guide')}
          style={styles.flexButton}
        />
        <SoftButton
          title={saved ? 'Saved ✓' : '♡ Save'}
          onPress={() => setSaved((value) => !value)}
          style={styles.saveButton}
        />
      </View>
      <View style={styles.buttonRow}>
        <SoftButton
          title="Open map"
          onPress={() => router.push('/(tabs)/map')}
          style={styles.flexButton}
        />
        <SoftButton
          title="Download"
          onPress={() => router.push('/(tabs)/downloads')}
          style={styles.flexButton}
        />
      </View>
      <Text style={styles.sectionTitle}>About this place</Text>
      <Text style={styles.description}>
        Wander through landscaped gardens before climbing to the summit for sweeping views across
        the Cultural Triangle.
      </Text>
      <DetailRow icon="⌖" title="Sigiriya, Central Province" subtitle="Open directions in the map" />
    </ScreenFrame>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heroArt: { height: 185, borderRadius: 13 },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  rating: { color: '#a36b34', fontSize: 10, fontWeight: '700' },
  description: { marginTop: 10, color: TravelColors.muted, fontSize: 11, lineHeight: 17 },
  facts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    borderRadius: 11,
    padding: 12,
    backgroundColor: '#f0f3ed',
  },
  fact: { flex: 1 },
  factLabel: { color: '#8a9088', fontSize: 7, fontWeight: '700', letterSpacing: 0.5 },
  factValue: { marginTop: 4, color: '#26382f', fontSize: 9, fontWeight: '600' },
  buttonRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  flexButton: { flex: 1 },
  saveButton: { minWidth: 95 },
  sectionTitle: {
    marginTop: 20,
    color: '#26382f',
    fontSize: 14,
    fontWeight: '700',
  },
});
