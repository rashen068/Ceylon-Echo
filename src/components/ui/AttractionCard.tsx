import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface AttractionCardProps {
  name: string;
  category: string;
  distanceMeters: number;
  onSave: () => void;
}

export const AttractionCard: React.FC<AttractionCardProps> = ({
  name,
  category,
  distanceMeters,
  onSave,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.sub}>📍 {distanceMeters}m away • {category}</Text>
      </View>
      <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
        <Text style={styles.saveText}>🔖 Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  sub: { fontSize: 12, color: '#64748B', marginTop: 4 },
  saveBtn: { backgroundColor: '#EFF6FF', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  saveText: { color: '#2563EB', fontWeight: '600', fontSize: 12 },
});