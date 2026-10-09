import * as Location from 'expo-location';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../lib/firebase';

export interface NearbyItem {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  audioUrl?: string;
  distance: number;
}

export default function NearbyAttractions(): React.JSX.Element {
  const [attractions, setAttractions] = useState<NearbyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      let coords: Location.LocationObjectCoordinates | null = null;
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        coords = loc.coords;
      }
      await loadNearbyData(coords);
    })();
  }, []);

  const getDistanceMeters = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371e3;
    const rad = Math.PI / 180;
    const dLat = (lat2 - lat1) * rad;
    const dLon = (lon2 - lon1) * rad;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const loadNearbyData = async (coords: Location.LocationObjectCoordinates | null): Promise<void> => {
    try {
      const snap = await getDocs(collection(db, 'attractions'));
      const list: NearbyItem[] = snap.docs.map((docSnap) => {
        const data = docSnap.data();
        const dist = coords ? getDistanceMeters(coords.latitude, coords.longitude, data.latitude, data.longitude) : 0;
        return {
          id: docSnap.id,
          name: data.name,
          category: data.category,
          latitude: data.latitude,
          longitude: data.longitude,
          audioUrl: data.audioUrl,
          distance: dist,
        };
      });
      list.sort((a, b) => a.distance - b.distance);
      setAttractions(list);
    } catch (err) {
      console.error('Error loading nearby attractions: ', err);
    } finally {
      setLoading(false);
    }
  };

  const bookmarkItem = async (item: NearbyItem): Promise<void> => {
    try {
      await addDoc(collection(db, 'bookmarks'), {
        attractionId: item.id,
        name: item.name,
        category: item.category,
        audioUrl: item.audioUrl || '',
        createdAt: new Date().toISOString(),
      });
      Alert.alert('Saved', `${item.name} added to your bookmarks.`);
    } catch (err) {
      console.error('Bookmark error: ', err);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Nearby Attractions</Text>
      <FlatList
        data={attractions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.sub}>📍 {item.distance}m away • {item.category}</Text>
            </View>
            <TouchableOpacity style={styles.saveBtn} onPress={() => bookmarkItem(item)}>
              <Text style={styles.saveText}>🔖 Save</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16, paddingTop: 50 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  sub: { fontSize: 12, color: '#64748B', marginTop: 4 },
  saveBtn: { backgroundColor: '#EFF6FF', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  saveText: { color: '#2563EB', fontWeight: '600', fontSize: 12 },
});