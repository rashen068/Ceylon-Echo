import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import {
  DetailRow,
  PrimaryButton,
  ScreenFrame,
  SectionHeading,
  TravelColors,
} from '@/components/travel-ui';

export default function ProfileScreen() {
  return (
    <ScreenFrame title="Your Profile" subtitle="Your saved discoveries, all in one place.">
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>AP</Text>
        </View>
        <View style={styles.profileCopy}>
          <Text style={styles.name}>Ashan Perera</Text>
          <Text style={styles.email}>ashan.perera@example.com</Text>
          <Text style={styles.member}>Explorer since 2025</Text>
        </View>
        <Text style={styles.edit}>Edit</Text>
      </View>

      <SectionHeading
        title="Your Saved Places"
        action="See all"
        onPress={() => router.push('/(tabs)/bookmarks')}
      />
      <DetailRow
        icon="⌑"
        title="Sigiriya Ancient Fortress"
        subtitle="Matale District · Cultural site"
        trailing="›"
        onPress={() => router.push('/(tabs)/attraction')}
      />
      <DetailRow
        icon="⌑"
        title="Dambulla Cave Temple"
        subtitle="Central Province · Temple"
        trailing="›"
        onPress={() => router.push('/(tabs)/attraction')}
      />
      <DetailRow
        icon="⌑"
        title="Minneriya National Park"
        subtitle="North Central · Wildlife"
        trailing="›"
        onPress={() => router.push('/(tabs)/attraction')}
      />

      <SectionHeading
        title="Your Offline Audio Guides"
        action="Downloads"
        onPress={() => router.push('/(tabs)/downloads')}
      />
      <DetailRow
        icon="♫"
        title="Sigiriya Audio Guide · Chapter 1"
        subtitle="12 min · Downloaded"
        trailing="▶"
        onPress={() => router.push('/(tabs)/audio-guide')}
      />
      <DetailRow
        icon="♫"
        title="Dambulla Cave Temple"
        subtitle="18 min · Downloaded"
        trailing="▶"
        onPress={() => router.push('/(tabs)/audio-guide')}
      />

      <PrimaryButton
        title="Edit travel preferences"
        onPress={() => router.push('/preferences')}
        style={styles.preferencesButton}
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
  edit: { color: '#ffffff', fontSize: 10, fontWeight: '700' },
  preferencesButton: { marginTop: 20 },
});
