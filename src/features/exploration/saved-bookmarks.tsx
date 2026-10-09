import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../lib/firebase';

export interface Bookmark {
  id: string;
  name: string;
  category: string;
  audioUrl?: string;
}

export default function SavedBookmarks(): React.JSX.Element {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async (): Promise<void> => {
    try {
      const snap = await getDocs(collection(db, 'bookmarks'));
      const list: Bookmark[] = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Bookmark, 'id'>),
      }));
      setBookmarks(list);
    } catch (err) {
      console.error('Bookmarks load error: ', err);
    }
  };

  const deleteBookmark = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'bookmarks', id));
      setBookmarks((prev) => prev.filter((item) => item.id !== id));
      Alert.alert('Deleted', 'Bookmark removed successfully.');
    } catch (err) {
      console.error('Delete error: ', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Saved Bookmarks</Text>
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.sub}>{item.category}</Text>
            </View>
            <TouchableOpacity style={styles.delBtn} onPress={() => deleteBookmark(item.id)}>
              <Text style={styles.delText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No saved places found.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16, paddingTop: 50 },
  header: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
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
  empty: { textAlign: 'center', color: '#94A3B8', marginTop: 40 },
});