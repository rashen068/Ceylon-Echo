import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface MapCalloutCardProps {
  title: string;
  description: string;
  audioUrl?: string;
  onPlayAudio?: () => void;
  onClose: () => void;
}

export const MapCalloutCard: React.FC<MapCalloutCardProps> = ({
  title,
  description,
  audioUrl,
  onPlayAudio,
  onClose,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDesc} numberOfLines={2}>
        {description}
      </Text>
      <View style={styles.btnRow}>
        {audioUrl && onPlayAudio ? (
          <TouchableOpacity style={styles.audioBtn} onPress={onPlayAudio}>
            <Text style={styles.btnText}>▶ Play Audio Guide</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  cardDesc: { fontSize: 13, color: '#64748B', marginVertical: 6 },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  audioBtn: { backgroundColor: '#2563EB', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  closeBtn: { backgroundColor: '#F1F5F9', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  btnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },
  closeText: { color: '#334155', fontWeight: '600', fontSize: 13 },
});