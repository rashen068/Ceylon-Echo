import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { DataMessage } from '@/components/data-message';
import {
  DetailRow,
  InfoPill,
  LandscapeArt,
  PrimaryButton,
  ScreenFrame,
  SoftButton,
  TravelColors,
} from '@/components/travel-ui';
import { useAuth } from '@/context/AuthContext';
import { useAttraction, useAttractions } from '@/hooks/use-attractions';
import { getSavedAttractionIds, removeSavedAttraction, saveAttraction } from '@/services/userService';

export default function AttractionScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user } = useAuth();
  const { attractions, isLoading: isLoadingAttractions, error: attractionsError } = useAttractions();
  const selectedId = id ?? attractions[0]?.id;
  const { attraction, isLoading, error } = useAttraction(selectedId);
  const [savedState, setSavedState] = useState<{
    userId: string;
    attractionId: string;
    saved: boolean;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const saved =
    savedState?.userId === user?.uid &&
    savedState?.attractionId === selectedId &&
    savedState?.saved === true;

  useEffect(() => {
    let active = true;
    if (!user || !selectedId) {
      return () => {
        active = false;
      };
    }

    getSavedAttractionIds(user.uid)
      .then((ids) => {
        if (active) {
          setSavedState({
            userId: user.uid,
            attractionId: selectedId,
            saved: ids.includes(selectedId),
          });
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setSaveError(loadError instanceof Error ? loadError.message : 'Could not load saved places.');
        }
      });

    return () => {
      active = false;
    };
  }, [selectedId, user]);

  async function toggleSaved() {
    if (isSaving) {
      return;
    }
    if (!user) {
      router.push('/login');
      return;
    }
    if (!attraction) {
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    try {
      if (saved) {
        await removeSavedAttraction(user.uid, attraction.id);
      } else {
        await saveAttraction(user.uid, attraction.id);
      }
      setSavedState({ userId: user.uid, attractionId: attraction.id, saved: !saved });
    } catch (saveFailure) {
      setSaveError(saveFailure instanceof Error ? saveFailure.message : 'Could not update saved places.');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoadingAttractions && !selectedId) {
    return (
      <ScreenFrame title="Attraction details">
        <DataMessage isLoading message="Loading attractions…" />
      </ScreenFrame>
    );
  }

  if (isLoading) {
    return (
      <ScreenFrame title="Attraction details">
        <DataMessage isLoading message="Loading attraction…" />
      </ScreenFrame>
    );
  }

  if (!attraction) {
    return (
      <ScreenFrame title="Attraction details">
        <DataMessage isError message={error ?? attractionsError ?? 'This attraction could not be found.'} />
      </ScreenFrame>
    );
  }

  return (
    <ScreenFrame title={attraction.name} subtitle={attraction.location}>
      {attraction.photos[0]?.url ? (
        <Image
          accessibilityLabel={`${attraction.name} photo`}
          resizeMode="cover"
          source={{ uri: attraction.photos[0].url }}
          style={styles.heroArt}
        />
      ) : (
        <LandscapeArt
          tone="gold"
          label={`${attraction.name} landscape illustration`}
          style={styles.heroArt}
        />
      )}
      <View style={styles.tagRow}>
        <InfoPill label={attraction.category || 'Attraction'} />
        {attraction.latitude !== null && attraction.longitude !== null ? (
          <Text style={styles.rating}>
            {attraction.latitude.toFixed(3)}, {attraction.longitude.toFixed(3)}
          </Text>
        ) : null}
      </View>
      <View style={styles.buttonRow}>
        {attraction.audioGuide ? (
          <PrimaryButton
            title="Play Audio Guide"
            onPress={() =>
              router.push({
                pathname: '/(tabs)/audio-guide',
                params: { id: attraction.id },
              })
            }
            style={styles.flexButton}
          />
        ) : (
          <View style={styles.flexButton} />
        )}
        <SoftButton
          title={isSaving ? 'Saving…' : saved ? 'Saved ✓' : '♡ Save'}
          onPress={() => void toggleSaved()}
          style={styles.saveButton}
        />
      </View>
      {saveError ? <DataMessage isError message={saveError} /> : null}
      <View style={styles.buttonRow}>
        <SoftButton
          title="Open map"
          onPress={() => router.push('/(tabs)/map')}
          style={styles.flexButton}
        />
        {attraction.audioGuide ? (
          <SoftButton
            title="Download"
            onPress={() => router.push('/(tabs)/downloads')}
            style={styles.flexButton}
          />
        ) : null}
      </View>
      <Text style={styles.sectionTitle}>About this place</Text>
      <Text style={styles.description}>{attraction.description || 'No description is available yet.'}</Text>
      <DetailRow
        icon="⌖"
        title={attraction.location}
        subtitle="Open directions in the map"
        onPress={() => router.push('/(tabs)/map')}
      />
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  heroArt: { height: 185, borderRadius: 13, width: '100%' },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  rating: { color: '#a36b34', fontSize: 10, fontWeight: '700' },
  description: { marginTop: 10, color: TravelColors.muted, fontSize: 11, lineHeight: 17 },
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
