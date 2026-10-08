import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

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
import { useLanguage } from '@/context/LanguageContext';
import type { Attraction } from '@/services/attractionService';
import { getAttractionsByIds } from '@/services/attractionService';
import { getSavedAttractionIds, getUserProfile, updateUserProfile } from '@/services/userService';
import type { UserProfile } from '@/services/userService';
import { safeFileName, uploadMedia } from '@/features/admin/upload-media';

export default function ProfileScreen() {
  return (
    <AuthGate>
      <AuthenticatedProfileScreen />
    </AuthGate>
  );
}

function AuthenticatedProfileScreen() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [savedAttractions, setSavedAttractions] = useState<Attraction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSelectingPhoto, setIsSelectingPhoto] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [pendingPhoto, setPendingPhoto] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [failedImageUri, setFailedImageUri] = useState<string | null>(null);
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
      } catch {
        if (active) {
          setError('We couldn’t load your profile. Check your connection and try again.');
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
    } catch {
      setError('We couldn’t sign you out. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  }

  function startEditing() {
    setEditedName(profile?.name || user?.displayName || '');
    setPendingPhoto(null);
    setError(null);
    setIsEditing(true);
  }

  function cancelEditing() {
    setPendingPhoto(null);
    setEditedName('');
    setError(null);
    setIsEditing(false);
  }

  async function selectProfilePhoto() {
    if (isSelectingPhoto || isSaving) {
      return;
    }

    setIsSelectingPhoto(true);
    setError(null);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        setPendingPhoto(result.assets[0]);
        if (!isEditing) {
          setEditedName(profile?.name || user?.displayName || '');
          setIsEditing(true);
        }
      }
    } catch {
      setError('We couldn’t open your photo library. Please try again.');
    } finally {
      setIsSelectingPhoto(false);
    }
  }

  async function saveProfile() {
    if (!user || isSaving) {
      return;
    }
    const nameToSave = editedName.trim();
    if (!nameToSave) {
      setError(t('yourNameRequired'));
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      let imageUrl = profile?.profileImage ?? user.photoURL ?? null;
      if (pendingPhoto) {
        const fileName = safeFileName(pendingPhoto.fileName ?? 'profile-image.jpg');
        const contentType = pendingPhoto.mimeType ?? 'image/jpeg';
        if (!/^image\/(jpeg|jpg|png|webp|heic|heif)$/i.test(contentType)) {
          setError(t('invalidProfilePhoto'));
          return;
        }
        const uploaded = await uploadMedia(
          pendingPhoto.uri,
          fileName,
          contentType,
          `users/${user.uid}/profile/${Date.now()}-profile-image`,
        );
        imageUrl = uploaded.url;
      }

      await updateUserProfile(user.uid, {
        name: nameToSave,
        ...(pendingPhoto ? { profileImage: imageUrl } : {}),
      });

      setProfile((current) => ({
        name: nameToSave,
        email: current?.email ?? user.email ?? '',
        profileImage: imageUrl,
        interests: current?.interests ?? [],
        createdAt: current?.createdAt ?? null,
        role: current?.role ?? 'user',
      }));
      setFailedImageUri(null);
      setPendingPhoto(null);
      setIsEditing(false);
      setEditedName('');
    } catch {
      setError(
        pendingPhoto
          ? 'We couldn’t save your profile changes or photo. Check your connection and try again.'
          : 'We couldn’t save your profile changes. Check your connection and try again.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  const email = profile?.email ?? user?.email ?? '';
  const name = profile?.name || user?.displayName || email.split('@')[0] || t('traveller');
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const memberYear =
    profile?.createdAt?.toDate().getFullYear() ??
    (user?.metadata.creationTime ? new Date(user.metadata.creationTime).getFullYear() : null);
  const profileImage = pendingPhoto?.uri ?? profile?.profileImage ?? user?.photoURL ?? null;
  const showProfileImage = profileImage !== null && failedImageUri !== profileImage;

  return (
    <ScreenFrame title={t('profileTitle')} subtitle={t('profileSubtitle')}>
      {isLoading ? <DataMessage isLoading message={t('loadingProfile')} /> : null}
      {error ? <DataMessage isError message={error} /> : null}
      <View style={styles.profileCard}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            {showProfileImage ? (
              <Image
                accessibilityLabel={`${name}'s profile photo`}
                contentFit="cover"
                onError={() => setFailedImageUri(profileImage)}
                source={{ uri: profileImage ?? '' }}
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarText}>{initials}</Text>
            )}
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('changeProfilePhoto')}
            disabled={isSelectingPhoto || isSaving || isLoading}
            onPress={() => void selectProfilePhoto()}
            style={({ pressed }) => [
              styles.photoEditButton,
              pressed && styles.pressed,
              (isSelectingPhoto || isSaving || isLoading) && styles.disabled,
            ]}>
            {isSelectingPhoto ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.photoEditIcon}>📷</Text>
            )}
          </Pressable>
        </View>
        <View style={styles.profileCopy}>
          {isEditing ? (
            <TextInput
              accessibilityLabel={t('profileName')}
              autoCapitalize="words"
              autoCorrect={false}
              editable={!isSaving}
              maxLength={100}
              onChangeText={setEditedName}
              placeholder={t('yourName')}
              placeholderTextColor="#f5ded3"
              returnKeyType="done"
              style={styles.nameInput}
              value={editedName}
            />
          ) : (
            <Text style={styles.name}>{name}</Text>
          )}
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.member}>
            {memberYear ? t('explorerSince', { year: memberYear }) : t('ceylonExplorer')}
          </Text>
        </View>
        {!isEditing ? (
          <Pressable
            accessibilityRole="button"
            disabled={isLoading || isSaving}
            onPress={startEditing}
            style={({ pressed }) => [
              styles.editProfileButton,
              pressed && styles.pressed,
              (isLoading || isSaving) && styles.disabled,
            ]}>
            <Text style={styles.editProfileText}>{t('editProfile')}</Text>
          </Pressable>
        ) : null}
      </View>
      {isEditing ? (
        <View style={styles.editActions}>
          <Pressable
            accessibilityRole="button"
            disabled={isSaving}
            onPress={cancelEditing}
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && styles.pressed,
              isSaving && styles.disabled,
            ]}>
            <Text style={styles.cancelText}>{t('cancel')}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={isSaving || isSelectingPhoto}
            onPress={() => void saveProfile()}
            style={({ pressed }) => [
              styles.saveButton,
              pressed && !isSaving && styles.pressed,
              (isSaving || isSelectingPhoto) && styles.disabled,
            ]}>
            {isSaving ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.saveText}>{t('saveChanges')}</Text>
            )}
          </Pressable>
        </View>
      ) : null}

      <SectionHeading
        title={t('yourSavedPlaces')}
        action={t('seeAll')}
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
              router.push({ pathname: '/attraction/[id]', params: { id: item.id } })
            }
          />
        ))
      ) : (
        <Text style={styles.emptyNote}>{t('savedAttractionsAppear')}</Text>
      )}

      <SectionHeading
        title={t('audioGuides')}
        action={t('downloads')}
        onPress={() => router.push('/(tabs)/downloads')}
      />
      <DetailRow
        icon="♫"
        title={t('browseAudioGuides')}
        subtitle={t('openAttractionAudio')}
        trailing="›"
        onPress={() => router.push('/(tabs)/explore')}
      />

      <PrimaryButton
        title={t('editTravelPreferences')}
        onPress={() => router.push('/preferences')}
        style={styles.preferencesButton}
      />
      <PrimaryButton
        title={t('changeLanguage')}
        onPress={() => router.push('/language')}
      />
      <PrimaryButton
        title={isSigningOut ? t('signingOut') : t('signOut')}
        disabled={isSigningOut}
        onPress={() => void handleSignOut()}
        style={styles.signOutButton}
      />
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    minHeight: 104,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 11,
    backgroundColor: TravelColors.orange,
  },
  avatarWrap: {
    position: 'relative',
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.88)',
    borderRadius: 36,
    backgroundColor: '#8d553f',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: { color: '#ffffff', fontSize: 19, fontWeight: '700' },
  photoEditButton: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 29,
    height: 29,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: TravelColors.orange,
    borderRadius: 15,
    backgroundColor: TravelColors.green,
  },
  photoEditIcon: {
    fontSize: 13,
  },
  profileCopy: { flex: 1, minWidth: 0 },
  name: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  nameInput: {
    minHeight: 36,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
    color: '#ffffff',
    backgroundColor: 'rgba(255,255,255,0.12)',
    fontSize: 13,
    fontWeight: '700',
  },
  email: { marginTop: 3, color: '#fff4ed', fontSize: 9 },
  member: { marginTop: 5, color: '#ffe6d8', fontSize: 8 },
  editProfileButton: {
    minHeight: 33,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.72)',
    borderRadius: 9,
    paddingHorizontal: 9,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  editProfileText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 9,
    marginTop: 9,
  },
  cancelButton: {
    minHeight: 39,
    minWidth: 82,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: TravelColors.border,
    borderRadius: 9,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
  },
  cancelText: {
    color: TravelColors.green,
    fontSize: 10,
    fontWeight: '700',
  },
  saveButton: {
    minHeight: 39,
    minWidth: 124,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    paddingHorizontal: 14,
    backgroundColor: TravelColors.green,
  },
  saveText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.62,
  },
  emptyNote: {
    paddingVertical: 12,
    color: TravelColors.muted,
    fontSize: 10,
  },
  preferencesButton: { marginTop: 20 },
  signOutButton: { marginTop: 9, backgroundColor: TravelColors.green },
});
