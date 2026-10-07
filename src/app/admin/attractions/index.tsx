import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAdminAuth } from '@/features/admin/admin-auth';
import { useAdmin } from '@/features/admin/admin-context';
import type { Attraction } from '@/features/admin/admin-context';
import { AdminHeader, AdminScreen, adminColors } from '@/features/admin/admin-ui';

export default function AttractionsListScreen() {
  const { attractions, isLoading, error, deleteAttraction } = useAdmin();
  const { signOutAdmin } = useAdminAuth();
  const [search, setSearch] = useState('');
  const [searchByLocation, setSearchByLocation] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const filteredAttractions = useMemo(
    () =>
      attractions.filter((item) =>
        (searchByLocation ? item.location : `${item.name} ${item.category}`)
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [attractions, search, searchByLocation],
  );

  async function handleSignOut() {
    try {
      await signOutAdmin();
      router.replace('/admin');
    } catch (signOutError) {
      Alert.alert(
        'Could not sign out',
        signOutError instanceof Error ? signOutError.message : 'Please try again.',
      );
    }
  }

  async function removeAttraction(id: string) {
    try {
      await deleteAttraction(id);
    } catch (deleteError) {
      Alert.alert(
        'Could not delete attraction',
        deleteError instanceof Error ? deleteError.message : 'Please try again.',
      );
    }
  }

  function confirmDeleteAttraction(id: string) {
    Alert.alert('Delete attraction', 'Are you sure you want to delete the listed attraction?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', style: 'destructive', onPress: () => void removeAttraction(id) },
    ]);
  }

  function editSelectedAttraction() {
    if (!selectedAttraction) {
      return;
    }
    const attractionId = selectedAttraction.id;
    setSelectedAttraction(null);
    router.push(`/admin/attractions/${attractionId}`);
  }

  function deleteSelectedAttraction() {
    if (!selectedAttraction) {
      return;
    }
    const attractionId = selectedAttraction.id;
    setSelectedAttraction(null);
    setTimeout(() => confirmDeleteAttraction(attractionId), 250);
  }

  return (
    <AdminScreen>
      <AdminHeader title="Attraction List" onSignOut={() => void handleSignOut()} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.searchRow}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            accessibilityLabel={searchByLocation ? 'Search by location' : 'Search attractions'}
            onChangeText={setSearch}
            placeholder={searchByLocation ? 'Search provinces / districts...' : 'Search attractions...'}
            placeholderTextColor={adminColors.muted}
            style={styles.searchInput}
            value={search}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/admin/attractions/new')}
            style={styles.addButton}>
            <Text style={styles.addText}>+ Add</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Attraction List</Text>
        {isLoading ? <Text style={styles.message}>Loading attractions…</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {!isLoading && !error && filteredAttractions.length === 0 ? (
          <Text style={styles.message}>
            {search ? `No attractions match “${search}”.` : 'No attractions yet. Add your first site.'}
          </Text>
        ) : null}
        {!isLoading && !error ? filteredAttractions.map((item, index) => (
          <View
            key={item.id}
            style={[styles.attractionCard, index === 0 && styles.featuredCard]}>
            <View style={styles.attractionCopy}>
              <Text style={[styles.attractionName, index === 0 && styles.featuredText]}>
                {item.name}
              </Text>
              <Text style={[styles.category, index === 0 && styles.featuredCategory]}>
                {item.category}
              </Text>
            </View>
            <Pressable
              accessibilityLabel={`Options for ${item.name}`}
              accessibilityRole="button"
              onPress={() => setSelectedAttraction(item)}
              style={({ pressed }) => [styles.moreButton, pressed && styles.pressed]}>
              <Text style={[styles.moreIcon, index === 0 && styles.featuredText]}>⋮</Text>
            </Pressable>
          </View>
        )) : null}

        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setSearch('');
            setSearchByLocation((current) => !current);
          }}
          style={styles.filterButton}>
          <Text style={styles.filterText}>
            ⌖  {searchByLocation ? 'Search attractions' : 'Search by Province / District'}
          </Text>
        </Pressable>
      </ScrollView>
      <Modal
        animationType="fade"
        onRequestClose={() => setSelectedAttraction(null)}
        statusBarTranslucent
        transparent
        visible={selectedAttraction !== null}>
        <View style={styles.modalOverlay}>
          <Pressable
            accessibilityLabel="Close attraction options"
            accessibilityRole="button"
            onPress={() => setSelectedAttraction(null)}
            style={StyleSheet.absoluteFill}
          />
          <View accessibilityViewIsModal style={styles.optionsDialog}>
            <View style={styles.modalHeader}>
              <Text numberOfLines={2} style={styles.modalTitle}>
                {selectedAttraction?.name}
              </Text>
              <Pressable
                accessibilityLabel="Cancel"
                accessibilityRole="button"
                onPress={() => setSelectedAttraction(null)}
                style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={editSelectedAttraction}
              style={({ pressed }) => [styles.optionRow, pressed && styles.optionPressed]}>
              <Feather color={adminColors.green} name="edit-2" size={19} />
              <Text style={styles.editOptionText}>Edit Attraction</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={deleteSelectedAttraction}
              style={({ pressed }) => [styles.optionRow, pressed && styles.optionPressed]}>
              <Feather color={adminColors.rust} name="trash-2" size={19} />
              <Text style={styles.deleteOptionText}>Delete Attraction</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 18,
    gap: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
    color: adminColors.muted,
    fontSize: 19,
  },
  searchInput: {
    height: 42,
    flex: 1,
    paddingLeft: 34,
    paddingRight: 10,
    borderRadius: 7,
    backgroundColor: adminColors.surface,
    borderWidth: 1,
    borderColor: adminColors.line,
    color: adminColors.text,
    fontSize: 14,
  },
  addButton: {
    height: 42,
    minWidth: 68,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    backgroundColor: adminColors.rust,
  },
  addText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionTitle: {
    marginBottom: 2,
    color: adminColors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  attractionCard: {
    minHeight: 66,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: adminColors.surface,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: adminColors.line,
  },
  featuredCard: {
    backgroundColor: adminColors.green,
    borderColor: adminColors.green,
  },
  attractionCopy: {
    flex: 1,
    gap: 4,
  },
  attractionName: {
    color: adminColors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  featuredText: {
    color: '#FFFFFF',
  },
  category: {
    color: adminColors.muted,
    fontSize: 11,
  },
  featuredCategory: {
    color: '#D8E3DA',
  },
  moreButton: {
    width: 32,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreIcon: {
    color: adminColors.text,
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 22, 20, 0.56)',
  },
  optionsDialog: {
    width: '100%',
    maxWidth: 420,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 16,
    backgroundColor: adminColors.surface,
    elevation: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
  },
  modalHeader: {
    minHeight: 42,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalTitle: {
    flex: 1,
    color: adminColors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  cancelButton: {
    minHeight: 40,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: adminColors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  optionRow: {
    minHeight: 54,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: adminColors.line,
  },
  editOptionText: {
    color: adminColors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  deleteOptionText: {
    color: adminColors.rust,
    fontSize: 15,
    fontWeight: '600',
  },
  optionPressed: {
    opacity: 0.65,
  },
  message: {
    paddingVertical: 20,
    color: adminColors.muted,
    textAlign: 'center',
    fontSize: 14,
  },
  error: {
    paddingVertical: 12,
    color: adminColors.rust,
    fontSize: 13,
  },
  filterButton: {
    padding: 12,
    borderRadius: 7,
    backgroundColor: adminColors.surface,
    borderWidth: 1,
    borderColor: adminColors.line,
  },
  filterText: {
    color: adminColors.rust,
    fontSize: 12,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.76,
  },
});
