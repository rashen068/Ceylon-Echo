import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAdmin } from '@/features/admin/admin-context';
import type { Attraction } from '@/features/admin/admin-context';
import { AdminField, AdminHeader, AdminScreen, adminColors } from '@/features/admin/admin-ui';

type FormValues = Omit<Attraction, 'id'>;

const emptyValues: FormValues = {
  name: '',
  category: '',
  description: '',
  location: '',
  pin: '',
  audioGuide: '',
};

export default function AttractionFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { attractions, addAttraction, updateAttraction } = useAdmin();
  const existing = attractions.find((item) => item.id === id);

  return (
    <AttractionEditor
      key={id}
      addAttraction={addAttraction}
      existing={existing}
      id={id}
      updateAttraction={updateAttraction}
    />
  );
}

function AttractionEditor({
  id,
  existing,
  addAttraction,
  updateAttraction,
}: {
  id: string;
  existing: Attraction | undefined;
  addAttraction: (attraction: FormValues) => void;
  updateAttraction: (id: string, attraction: FormValues) => void;
}) {
  const isNew = id === 'new';
  const [values, setValues] = useState<FormValues>(existing ?? emptyValues);
  const [validationMessage, setValidationMessage] = useState('');

  function updateField(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function saveAttraction() {
    if (!values.name.trim()) {
      setValidationMessage('Add an attraction name before saving.');
      return;
    }
    if (isNew) {
      addAttraction(values);
    } else if (existing) {
      updateAttraction(existing.id, values);
    } else {
      Alert.alert('Attraction not found', 'This attraction may have been removed.');
      router.replace('/admin/attractions');
      return;
    }
    router.replace('/admin/attractions');
  }

  function showUploadNotice(kind: 'photo' | 'audio') {
    Alert.alert(
      `${kind === 'photo' ? 'Photo' : 'Audio'} upload`,
      'Connect a file picker and storage service to enable uploads.',
    );
  }

  return (
    <AdminScreen>
      <AdminHeader title={isNew ? 'Add Attraction' : 'Edit Attraction'} onSave={saveAttraction} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Photos</Text>
          <View style={styles.photoRow}>
            {!isNew ? (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoSymbol}>▧</Text>
              </View>
            ) : null}
            <Pressable
              accessibilityRole="button"
              onPress={() => showUploadNotice('photo')}
              style={styles.addPhoto}>
              <Text style={styles.plus}>+</Text>
            </Pressable>
          </View>
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
          label="Location"
          onChangeText={(value) => updateField('location', value)}
          placeholder="District, Province, Sri Lanka"
          value={values.location}
        />

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Location Pin</Text>
          <View style={styles.pinRow}>
            <Text style={styles.pinIcon}>⌖</Text>
            <Text style={styles.pinText}>{values.pin || 'Add map coordinates'}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                Alert.alert('Location pin', 'Connect a map picker to choose coordinates.')
              }
              style={styles.pinAction}>
              <Text style={styles.pinActionText}>Add Pin</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Audio Guide Files</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => showUploadNotice('audio')}
            style={styles.uploadButton}>
            <Text style={styles.uploadText}>⇧  Upload New Audio Chapter</Text>
          </Pressable>
          {!isNew && values.audioGuide ? (
            <View style={styles.audioRow}>
              <Text numberOfLines={1} style={styles.audioName}>
                {values.audioGuide}
              </Text>
              <Text style={styles.audioDuration}>4:30</Text>
              <Pressable
                accessibilityLabel="Play audio guide"
                accessibilityRole="button"
                onPress={() =>
                  Alert.alert('Audio preview', 'Connect an audio player to preview this guide.')
                }
                style={styles.playButton}>
                <Text style={styles.playSymbol}>▶</Text>
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

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 36,
    gap: 17,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  photoPlaceholder: {
    width: 66,
    height: 66,
    borderRadius: 7,
    backgroundColor: '#B39A80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoSymbol: {
    color: '#F5EEE5',
    fontSize: 29,
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
  pinRow: {
    minHeight: 42,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: adminColors.line,
    borderRadius: 6,
    backgroundColor: adminColors.surface,
  },
  pinIcon: {
    color: adminColors.rust,
    fontSize: 18,
  },
  pinText: {
    flex: 1,
    color: adminColors.text,
    fontSize: 12,
  },
  pinAction: {
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 5,
    backgroundColor: adminColors.background,
  },
  pinActionText: {
    color: adminColors.text,
    fontSize: 11,
    fontWeight: '600',
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
    paddingLeft: 10,
    paddingRight: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  audioDuration: {
    color: adminColors.muted,
    fontSize: 11,
  },
  playButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playSymbol: {
    color: adminColors.green,
    fontSize: 13,
  },
  validation: {
    color: adminColors.rust,
    fontSize: 13,
  },
});
