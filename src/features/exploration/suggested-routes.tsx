import * as FileSystem from 'expo-file-system';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../lib/firebase';

export interface ExplorationRoute {
  id: string;
  title: string;
  duration: string;
  stopsCount: number;
  distance: string;
  audioUrl?: string;
}

export default function SuggestedRoutes(): React.JSX.Element {
  const [routes, setRoutes] = useState<ExplorationRoute[]>([]);

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async (): Promise<void> => {
    try {
      const snap = await getDocs(collection(db, 'routes'));
      const list: ExplorationRoute[] = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<ExplorationRoute, 'id'>),
      }));
      setRoutes(list);
    } catch (err) {
      console.error('Routes load error: ', err);
    }
  };

  const handleOfflineDownload = async (audioUrl?: string, title?: string): Promise<void> => {
    if (!audioUrl || !title) {
      Alert.alert('Info', 'No offline audio available for this route.');
      return;
    }

    try {
      const targetUri = FileSystem.documentDirectory + `${title.replace(/\s+/g, '_')}.mp3`;
      const result = await FileSystem.downloadAsync(audioUrl, targetUri);
      Alert.alert('Download Complete', `Saved locally at:\n${result.uri}`);
    } catch (err) {
      console.error('Offline download error: ', err);
      Alert.alert('Error', 'Failed to download audio for offline usage.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Suggested Routes</Text>
      <FlatList
        data={routes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.info}>⏱ {item.duration} • 📍 {item.stopsCount} Stops • {item.distance}</Text>
            <TouchableOpacity
              style={styles.dlBtn}
              onPress={() => handleOfflineDownload(item.audioUrl, item.title)}
            >
              <Text style={styles.dlText}>💾 Download Offline Audio</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16, paddingTop: 50 },
  header: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, marginBottom: 14, elevation: 2 },
  title: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  info: { fontSize: 13, color: '#64748B', marginVertical: 8 },
  dlBtn: { backgroundColor: '#10B981', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, alignSelf: 'flex-start' },
  dlText: { color: '#FFFFFF', fontWeight: '600', fontSize: 12 },
});
