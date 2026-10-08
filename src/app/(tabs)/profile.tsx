import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AuthGate } from '@/components/auth-gate';
import { DataMessage } from '@/components/data-message';
import {
  DetailRow,
  PrimaryButton,
  ScreenFrame,
  SectionHeading,
  TravelColors,
} from '@/components/travel-ui';
import { useAuth } from '@/context/AuthContext';
import type { Attraction } from '@/services/attractionService';
import { getAttractionsByIds } from '@/services/attractionService';
import { getSavedAttractionIds, getUserProfile } from '@/services/userService';
import type { UserProfile } from '@/services/userService';

export default function ProfileScreen() {
  return (
    <AuthGate>
      <AuthenticatedProfileScreen />
    </AuthGate>
  );
}

function AuthenticatedProfileScreen() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [savedAttractions, setSavedAttractions] = useState<Attraction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const userId = user?.uid;

  useEffect(() => {
    let active = true;
    if (!userId) {
      return () => {
        active = false;
      };
    }
    const uid = userId;

    async function loadProfile() {
      try {
        const [nextProfile, savedIds] = await Promise.all([
          getUserProfile(uid),
          getSavedAttractionIds(uid),
        ]);
        const attractions = await getAttractionsByIds(savedIds);
        if (active) {
          setProfile(nextProfile);
          setSavedAttractions(attractions);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Could not load your profile.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadProfile();
    return () => {
      active = false;
    };
  }, [userId]);

  async function handleSignOut() {
    setIsSigningOut(true);
    setError(null);
    try {
      await logout();
      router.replace('/login');
    } catch (signOutError) {
      setError(signOutError instanceof Error ? signOutError.message : 'Could not sign out. Please retry.');
    } finally {
      setIsSigningOut(false);
    }
  }

  const email = profile?.email ?? user?.email ?? '';
  const name = profile?.name || user?.displayName || email.split('@')[0] || 'Traveller';
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const memberYear =
    profile?.createdAt?.toDate().getFullYear() ??
    (user?.metadata.creationTime ? new Date(user.metadata.creationTime).getFullYear() : null);

  return (
    <ScreenFrame title="Your Profile" subtitle="Your saved discoveries, all in one place.">
      {isLoading ? <DataMessage isLoading message="Loading your profile…" /> : null}
      {error ? <DataMessage isError message={error} /> : null}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.profileCopy}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.member}>
            {memberYear ? `Explorer since ${memberYear}` : 'Ceylon Echo explorer'}
          </Text>
        </View>
      </View>

      <SectionHeading
        title="Your Saved Places"
        action="See all"
        onPress={() => router.push('/(tabs)/bookmarks')}
      />
      {savedAttractions.length ? (
        savedAttractions.slice(0, 3).map((item) => (
          <DetailRow
            key={item.id}
            icon="⌑"
            title={item.name}
            subtitle={`${item.location} · ${item.category}`}
            trailing="›"
            onPress={() =>
              router.push({ pathname: '/(tabs)/attraction', params: { id: item.id } })
            }
          />
        ))
      ) : (
        <Text style={styles.emptyNote}>Your saved attractions will appear here.</Text>
      )}

      <SectionHeading
        title="Audio Guides"
        action="Downloads"
        onPress={() => router.push('/(tabs)/downloads')}
      />
      <DetailRow
        icon="♫"
        title="Browse available audio guides"
        subtitle="Open an attraction to see its audio guide."
        trailing="›"
        onPress={() => router.push('/(tabs)/explore')}
      />

      <PrimaryButton
        title="Edit travel preferences"
        onPress={() => router.push('/preferences')}
        style={styles.preferencesButton}
      />
      <PrimaryButton
        title={isSigningOut ? 'Signing out…' : 'Sign out'}
        disabled={isSigningOut}
        onPress={() => void handleSignOut()}
        style={styles.signOutButton}
      />
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    minHeight: 86,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 13,
    paddingHorizontal: 13,
    backgroundColor: TravelColors.orange,
  },
  avatar: {
    width: 49,
    height: 49,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
    borderRadius: 25,
    backgroundColor: '#d8b69a',
  },
  avatarText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  profileCopy: { flex: 1, marginLeft: 11 },
  name: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  email: { marginTop: 3, color: '#fff4ed', fontSize: 9 },
  member: { marginTop: 5, color: '#ffe6d8', fontSize: 8 },
  emptyNote: {
    paddingVertical: 12,
    color: TravelColors.muted,
    fontSize: 10,
  },
  preferencesButton: { marginTop: 20 },
  signOutButton: { marginTop: 9, backgroundColor: TravelColors.green },
});
