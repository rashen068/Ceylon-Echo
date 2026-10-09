import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface RouteCardProps {
  title: string;
  duration: string;
  stopsCount: number;
  distance: string;
  onDownloadOffline: () => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({
  title,
  duration,
  stopsCount,
  distance,
  onDownloadOffline,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.info}>
        ⏱ {duration} • 📍 {stopsCount} Stops • {distance}
      </Text>
      <TouchableOpacity style={styles.dlBtn} onPress={onDownloadOffline}>
        <Text style={styles.dlText}>💾 Download Offline Audio</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, marginBottom: 14, elevation: 2 },
  title: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  info: { fontSize: 13, color: '#64748B', marginVertical: 8 },
  dlBtn: { backgroundColor: '#10B981', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, alignSelf: 'flex-start' },
  dlText: { color: '#FFFFFF', fontWeight: '600', fontSize: 12 },
});