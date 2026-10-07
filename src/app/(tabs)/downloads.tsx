import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DetailRow, ScreenFrame, SectionHeading, TravelColors } from '@/components/travel-ui';

const offlineItems = [
  { id: 'sigiriya', icon: '♫', title: 'Sigiriya Audio Guide', subtitle: '3 chapters · 31 min · 18 MB' },
  { id: 'dambulla', icon: '♫', title: 'Dambulla Cave Temple', subtitle: '2 chapters · 22 min · 14 MB' },
  { id: 'polonnaruwa', icon: '♫', title: 'Polonnaruwa Ancient City', subtitle: '4 chapters · 45 min · 26 MB' },
  { id: 'map', icon: '⌖', title: 'Cultural Triangle Map', subtitle: 'Offline map · 8 MB' },
];

export default function DownloadsScreen() {
  const [removed, setRemoved] = useState<string[]>([]);
  const availableItems = offlineItems.filter((item) => !removed.includes(item.id));

  return (
    <ScreenFrame title="Offline Downloads" subtitle="Your guides are ready, even without a connection.">
      <View style={styles.storageCard}>
        <View style={styles.storageHeader}>
          <Text style={styles.storageTitle}>Storage used</Text>
          <Text style={styles.storageSize}>66 MB of 1 GB</Text>
        </View>
        <View style={styles.storageTrack}>
          <View style={styles.storageFill} />
        </View>
        <Text style={styles.storageNote}>You have plenty of room for more adventures.</Text>
      </View>
      <SectionHeading title={`Downloaded (${availableItems.length})`} />
      {availableItems.length ? (
        availableItems.map((item) => (
          <View key={item.id} style={styles.downloadItem}>
            <DetailRow
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              trailing="✓"
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remove ${item.title} download`}
              onPress={() => setRemoved((current) => [...current, item.id])}
              style={styles.removeButton}>
              <Text style={styles.removeText}>Remove</Text>
            </Pressable>
          </View>
        ))
      ) : (
        <Text style={styles.empty}>No offline content yet. Save an audio guide to find it here.</Text>
      )}
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  storageCard: {
    borderRadius: 13,
    padding: 14,
    backgroundColor: '#f0f4ef',
  },
  storageHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  storageTitle: { color: TravelColors.ink, fontSize: 11, fontWeight: '700' },
  storageSize: { color: TravelColors.green, fontSize: 10, fontWeight: '600' },
  storageTrack: {
    height: 6,
    overflow: 'hidden',
    marginTop: 11,
    borderRadius: 5,
    backgroundColor: '#dce5dc',
  },
  storageFill: { width: '8%', height: '100%', borderRadius: 5, backgroundColor: TravelColors.green },
  storageNote: { marginTop: 7, color: TravelColors.muted, fontSize: 9 },
  downloadItem: { position: 'relative', paddingRight: 54 },
  removeButton: { position: 'absolute', top: 20, right: 0, padding: 5 },
  removeText: { color: '#a55e47', fontSize: 8, fontWeight: '600' },
  empty: {
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    color: TravelColors.muted,
    backgroundColor: '#f0f3ed',
    fontSize: 11,
    lineHeight: 17,
  },
});
