import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface BookmarkCardProps {
  name: string;
  category: string;
  onDelete: () => void;
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({
  name,
  category,
  onDelete,
}) => {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.sub}>{category}</Text>
      </View>
      <TouchableOpacity style={styles.delBtn} onPress={onDelete}>
        <Text style={styles.delText}>Delete</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  sub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  delBtn: { backgroundColor: '#FEE2E2', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  delText: { color: '#DC2626', fontWeight: '600', fontSize: 12 },
});