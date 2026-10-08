import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Image } from 'expo-image';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAdmin } from '@/features/admin/admin-context';
import type { Attraction } from '@/features/admin/admin-context';
import { AdminField, AdminHeader, AdminScreen, adminColors } from '@/features/admin/admin-ui';
import { safeFileName, uploadMedia } from '@/features/admin/upload-media';

type FormValues = Omit<Attraction, 'id'>;

const emptyValues: FormValues = {
  name: '',
  category: '',
  description: '',
  location: '',
  durationMinutes: null,
  chapterCount: null,
  latitude: null,
  longitude: null,
  photos: [],
  audioGuide: null,
};

export default function AttractionFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    attractions,
    isLoading,
    error,
    createAttractionId,
    addAttraction,
    updateAttraction,
    deleteAttraction,
  } = useAdmin();
  const existing = attractions.find((item) => item.id === id);

  if (id !== 'new' && isLoading) {
    return (
      <AdminScreen>
        <View style={styles.centered}>
          <ActivityIndicator color={adminColors.green} />
        </View>
      </AdminScreen>
    );
  }

  if (id !== 'new' && !existing) {
    return (
      <AdminScreen>
        <AdminHeader title="Attraction not found" />
        <View style={styles.centered}>
          <Text style={styles.validation}>{error ?? 'This attraction does not exist.'}</Text>
          <Pressable accessibilityRole="button" onPress={() => router.replace('/admin/attractions')}>
            <Text style={styles.backLink}>Back to attractions</Text>
          </Pressable>
        </View>
      </AdminScreen>
    );
  }

  return (
    <AttractionEditor
      key={id}
      addAttraction={addAttraction}
      createAttractionId={createAttractionId}
      deleteSavedAttraction={deleteAttraction}
      existing={existing}
      id={id}
      updateAttraction={updateAttraction}
    />
  );
}

function AttractionEditor({
  id,
  existing,
  createAttractionId,
  deleteSavedAttraction,
  addAttraction,
  updateAttraction,
}: {
  id: string;
  existing: Attraction | undefined;
  createAttractionId: () => string;
  deleteSavedAttraction: (id: string) => Promise<void>;
  addAttraction: (id: string, attraction: FormValues) => Promise<void>;
  updateAttraction: (id: string, attraction: FormValues) => Promise<void>;
}) {
  const isNew = id === 'new';
  const [values, setValues] = useState<FormValues>(existing ?? emptyValues);
  const [durationInput, setDurationInput] = useState(
    existing?.durationMinutes === null || existing?.durationMinutes === undefined
      ? ''
      : String(existing.durationMinutes),
  );
  const [chapterCountInput, setChapterCountInput] = useState(
    existing?.chapterCount === null || existing?.chapterCount === undefined
      ? ''
      : String(existing.chapterCount),
  );
  const [attractionId] = useState(() => (isNew ? createAttractionId() : id));
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  function updateField(field: keyof FormValues, value: string) {
    if (field === 'name' || field === 'category' || field === 'description' || field === 'location') {
      setValues((current) => ({ ...current, [field]: value }));
    }
  }

  async function saveAttraction() {
    if (!values.name.trim()) {
      setValidationMessage('Add an attraction name before saving.');
      return;
    }
    if (!isOptionalPositiveInteger(durationInput) || !isOptionalPositiveInteger(chapterCountInput)) {
      setValidationMessage('Duration and chapter count must be positive whole numbers.');
      return;
    }

    setValidationMessage(null);
    setIsBusy(true);
    try {
      const attractionValues: FormValues = {
        ...values,
        durationMinutes: durationInput.trim() ? Number(durationInput) : null,
        chapterCount: chapterCountInput.trim() ? Number(chapterCountInput) : null,
      };
      if (isNew) {
        await addAttraction(attractionId, attractionValues);
      } else {
        await updateAttraction(attractionId, attractionValues);
      }
      router.replace('/admin/attractions');
    } catch (saveError) {
      setValidationMessage(
        saveError instanceof Error ? saveError.message : 'Could not save this attraction.',
      );
    } finally {
      setIsBusy(false);
    }
  }

  async function getCurrentLocation() {
    setValidationMessage(null);
    setIsLocating(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        throw new Error('Location permission was not granted. Enable location access to use GPS.');
      }

      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setValues((current) => ({
        ...current,
        latitude: coords.latitude,
        longitude: coords.longitude,
      }));
    } catch (locationError) {
      setValidationMessage(
        locationError instanceof Error
          ? locationError.message
          : 'Could not get the current GPS location.',
      );
    } finally {
      setIsLocating(false);
    }
  }

  async function uploadPhoto() {
    setIsBusy(true);
    setValidationMessage(null);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.85,
      });
      if (result.canceled) {
        return;
      }
      const uploaded = await Promise.all(
        result.assets.map((asset) => {
          const name = safeFileName(asset.fileName ?? `photo-${Date.now()}.jpg`);
          const contentType = getContentType(asset.mimeType, name, 'image/jpeg');
          const path = `attractions/${attractionId}/photos/${Date.now()}-${name}`;
          return uploadMedia(asset.uri, name, contentType, path);
        }),
      );
      setValues((current) => ({ ...current, photos: [...current.photos, ...uploaded] }));
    } catch (uploadError) {
      setValidationMessage(
        uploadError instanceof Error ? uploadError.message : 'Could not upload the photo.',
      );
    } finally {
      setIsBusy(false);
    }
  }

  async function uploadAudio() {
    setIsBusy(true);
    setValidationMessage(null);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: Platform.OS !== 'android',
      });
      if (result.canceled) {
        return;
      }
      const asset = result.assets[0];
      const name = safeFileName(asset.name);
      const contentType = getContentType(asset.mimeType, name, 'audio/mpeg');
      const path = `attractions/${attractionId}/audio/${Date.now()}-${name}`;
      const audioGuide = await uploadMedia(asset.uri, name, contentType, path);
      setValues((current) => ({ ...current, audioGuide }));
    } catch (uploadError) {
      setValidationMessage(
        uploadError instanceof Error ? uploadError.message : 'Could not upload the audio file.',
      );
    } finally {
      setIsBusy(false);
    }
  }

  async function deleteCurrentAttraction() {
    if (!existing) {
      return;
    }
    setIsBusy(true);
    try {
      await deleteSavedAttraction(existing.id);
      router.replace('/admin/attractions');
    } catch (deleteError) {
      setValidationMessage(
        deleteError instanceof Error ? deleteError.message : 'Could not delete attraction.',
      );
    } finally {
      setIsBusy(false);
    }
  }

  function confirmDelete() {
    const message = 'This will permanently delete this site and its uploaded files.';
    if (Platform.OS === 'web') {
      if (globalThis.confirm(`Delete attraction? ${message}`)) {
        void deleteCurrentAttraction();
      }
      return;
    }

    Alert.alert(
      'Delete attraction?',
      message,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => void deleteCurrentAttraction() },
      ],
    );
  }

  function removePhoto(path: string) {
    setValues((current) => ({
      ...current,
      photos: current.photos.filter((photo) => photo.path !== path),
    }));
  }

  function removeAudio() {
    setValues((current) => ({ ...current, audioGuide: null }));
  }

  return (
    <AdminScreen>
      <AdminHeader
        title={isNew ? 'Add Attraction' : 'Edit Attraction'}
        onDelete={!isNew ? confirmDelete : undefined}
        onSave={() => void saveAttraction()}
        saveDisabled={isBusy || isLocating}
      />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Photos</Text>
          <ScrollView horizontal contentContainerStyle={styles.photoRow} showsHorizontalScrollIndicator={false}>
            {values.photos.map((photo) => (
              <View key={photo.path} style={styles.photoItem}>
                <Image contentFit="cover" source={{ uri: photo.url }} style={styles.photoImage} />
                <Pressable
                  accessibilityLabel={`Remove ${photo.name}`}
                  accessibilityRole="button"
                  disabled={isBusy}
                  onPress={() => removePhoto(photo.path)}
                  style={styles.removeMedia}>
                  <Text style={styles.removeMediaText}>×</Text>
                </Pressable>
              </View>
            ))}
            <Pressable
              accessibilityRole="button"
              disabled={isBusy}
              onPress={() => void uploadPhoto()}
              style={styles.addPhoto}>
              <Text style={styles.plus}>{isBusy ? '…' : '+'}</Text>
            </Pressable>
          </ScrollView>
        </View>

        <AdminField
          label="Name"
          onChangeText={(value) => updateField('name', value)}
          placeholder="Attraction name"
          value={values.name}
        />
        <AdminField
          label="Description"
          multiline
          onChangeText={(value) => updateField('description', value)}
          placeholder="Describe this attraction..."
          value={values.description}
        />
        <AdminField
          keyboardType="number-pad"
          label="Audio guide duration (minutes)"
          onChangeText={setDurationInput}
          placeholder="e.g. 45"
          value={durationInput}
        />
        <AdminField
          keyboardType="number-pad"
          label="Audio chapter count"
          onChangeText={setChapterCountInput}
          placeholder="e.g. 8"
          value={chapterCountInput}
        />
        <View style={styles.locationGroup}>
          <AdminField
            label="Location"
            onChangeText={(value) => updateField('location', value)}
            placeholder="District, Province, Sri Lanka"
            value={values.location}
          />
          <Pressable
            accessibilityRole="button"
            disabled={isBusy || isLocating}
            onPress={() => void getCurrentLocation()}
            style={[styles.locationButton, (isBusy || isLocating) && styles.disabledButton]}>
            {isLocating ? <ActivityIndicator color={adminColors.rust} /> : null}
            <Text style={styles.locationButtonText}>
              {isLocating ? 'Getting Current GPS Location…' : 'Use Current GPS Location'}
            </Text>
          </Pressable>
          <Text style={styles.coordinateStatus}>
            {values.latitude !== null && values.longitude !== null
              ? `GPS coordinates: ${values.latitude.toFixed(5)}, ${values.longitude.toFixed(5)}`
              : 'GPS coordinates not set'}
          </Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Audio Guide Files</Text>
          <Pressable
            accessibilityRole="button"
            disabled={isBusy}
            onPress={() => void uploadAudio()}
            style={styles.uploadButton}>
            {isBusy ? (
              <ActivityIndicator color={adminColors.rust} />
            ) : (
              <Text style={styles.uploadText}>⇧  Upload New Audio Chapter</Text>
            )}
          </Pressable>
          {values.audioGuide ? (
            <View style={styles.audioRow}>
              <Text numberOfLines={1} style={styles.audioName}>
                {values.audioGuide.name}
              </Text>
              <Pressable
                accessibilityRole="button"
                disabled={isBusy}
                onPress={() => {
                  void Linking.openURL(values.audioGuide!.url).catch((openError: unknown) => {
                    setValidationMessage(
                      openError instanceof Error
                        ? openError.message
                        : 'Could not open the audio file.',
                    );
                  });
                }}
                style={styles.removeAudio}>
                <Text style={styles.playAudioText}>Play</Text>
              </Pressable>
              <Pressable
                accessibilityLabel="Remove audio guide"
                accessibilityRole="button"
                disabled={isBusy}
                onPress={removeAudio}
                style={styles.removeAudio}>
                <Text style={styles.removeAudioText}>Remove</Text>
              </Pressable>
            </View>
          ) : null}
        </View>

        <AdminField
          label="Category"
          onChangeText={(value) => updateField('category', value)}
          placeholder="e.g. Ancient Citadel"
          value={values.category}
        />
        {validationMessage ? <Text style={styles.validation}>{validationMessage}</Text> : null}
      </ScrollView>
    </AdminScreen>
  );
}

function isOptionalPositiveInteger(value: string): boolean {
  return value.trim() === '' || (/^\d+$/.test(value.trim()) && Number(value) > 0);
}

function getContentType(provided: string | null | undefined, name: string, fallback: string) {
  if (provided && provided !== 'application/octet-stream') {
    return provided;
  }
  const extension = name.split('.').pop()?.toLowerCase();
  const knownTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    mp3: 'audio/mpeg',
    m4a: 'audio/mp4',
    mp4: 'audio/mp4',
    wav: 'audio/wav',
    aac: 'audio/aac',
    ogg: 'audio/ogg',
  };
  return extension ? knownTypes[extension] ?? fallback : fallback;
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 36,
    gap: 17,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  backLink: {
    color: adminColors.green,
    fontWeight: '700',
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: adminColors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  photoRow: {
    alignItems: 'center',
    gap: 10,
  },
  photoItem: {
    width: 66,
    height: 66,
  },
  photoImage: {
    width: 66,
    height: 66,
    borderRadius: 7,
    backgroundColor: adminColors.line,
  },
  removeMedia: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 23,
    height: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: adminColors.text,
  },
  removeMediaText: {
    color: '#FFFFFF',
    fontSize: 17,
    lineHeight: 20,
  },
  addPhoto: {
    width: 66,
    height: 66,
    borderWidth: 1,
    borderColor: adminColors.line,
    borderRadius: 7,
    backgroundColor: adminColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plus: {
    color: adminColors.muted,
    fontSize: 26,
    fontWeight: '300',
  },
  locationGroup: {
    gap: 8,
  },
  locationButton: {
    minHeight: 44,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: adminColors.rust,
    borderRadius: 7,
    backgroundColor: adminColors.surface,
  },
  locationButtonText: {
    color: adminColors.rust,
    fontSize: 13,
    fontWeight: '600',
  },
  coordinateStatus: {
    color: adminColors.muted,
    fontSize: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  uploadButton: {
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: adminColors.rust,
    borderRadius: 7,
    backgroundColor: adminColors.surface,
  },
  uploadText: {
    color: adminColors.rust,
    fontSize: 12,
    fontWeight: '600',
  },
  audioRow: {
    minHeight: 40,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: adminColors.line,
    borderRadius: 6,
    backgroundColor: adminColors.surface,
  },
  audioName: {
    flex: 1,
    color: adminColors.text,
    fontSize: 11,
  },
  removeAudio: {
    padding: 8,
  },
  removeAudioText: {
    color: adminColors.rust,
    fontSize: 11,
    fontWeight: '600',
  },
  playAudioText: {
    color: adminColors.green,
    fontSize: 11,
    fontWeight: '700',
  },
  validation: {
    color: adminColors.rust,
    fontSize: 13,
  },
});
