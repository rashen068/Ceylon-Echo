import { Audio } from 'expo-av';
import * as Location from 'expo-location';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { db } from '../../lib/firebase';

export interface Attraction {
  id: string;
  name: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
  audioUrl?: string;
}

export default function InteractiveMap(): React.JSX.Element {
  const [userLocation, setUserLocation] = useState<Location.LocationObjectCoordinates | null>(null);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSpot, setSelectedSpot] = useState<Attraction | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setUserLocation(loc.coords);
      }
      await loadAttractions();
    })();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const loadAttractions = async (): Promise<void> => {
    try {
      const snap = await getDocs(collection(db, 'attractions'));
      const list: Attraction[] = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Attraction, 'id'>),
      }));
      setAttractions(list);
    } catch (err) {
      console.error('Firestore fetch error: ', err);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = async (audioUrl?: string): Promise<void> => {
    if (sound) {
      await sound.unloadAsync();
    }
    if (audioUrl) {
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUrl });
      setSound(newSound);
      await newSound.playAsync();
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
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation ? userLocation.latitude : 7.9403,
          longitude: userLocation ? userLocation.longitude : 81.0188,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation={true}
      >
        {attractions.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
            title={spot.name}
            description={spot.category}
            onPress={() => setSelectedSpot(spot)}
          />
        ))}
      </MapView>

      {selectedSpot ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{selectedSpot.name}</Text>
          <Text style={styles.cardDesc}>{selectedSpot.description}</Text>
          <View style={styles.btnRow}>
            {selectedSpot.audioUrl ? (
              <TouchableOpacity style={styles.audioBtn} onPress={() => playAudio(selectedSpot.audioUrl)}>
                <Text style={styles.btnText}>▶ Play Audio Guide</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedSpot(null)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    elevation: 4,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  cardDesc: { fontSize: 13, color: '#64748B', marginVertical: 6 },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  audioBtn: { backgroundColor: '#2563EB', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  closeBtn: { backgroundColor: '#F1F5F9', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  btnText: { color: '#FFFFFF', fontWeight: '600' },
  closeText: { color: '#334155', fontWeight: '600' },
});