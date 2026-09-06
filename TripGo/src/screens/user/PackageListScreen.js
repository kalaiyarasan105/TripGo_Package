/**
 * PackageListScreen
 * Shows all packages with search, destination filter, and sort.
 * Dark-mode aware. Wishlist connected to Redux.
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../redux/wishlistSlice';
import { useThemeColors } from '../../utils/themeUtils';
import { Theme } from '../../constants';
import { SearchBar, PackageCard, EmptyState } from '../../components';
import { MOCK_PACKAGES, MOCK_DESTINATIONS } from '../../constants/mockData';

const SORT_OPTIONS = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Duration: Short First', value: 'duration_asc' },
  { label: 'Highest Rated', value: 'rating_desc' },
];

const PackageListScreen = ({ navigation, route }) => {
  const C = useThemeColors();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((s) => s.wishlist.items);

  const initialDestination = route?.params?.destination || '';
  const initialSearch = route?.params?.search || '';

  const [search, setSearch] = useState(initialSearch);
  const [selectedDestination, setSelectedDestination] = useState(initialDestination);
  const [sortBy, setSortBy] = useState('recommended');
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const isWishlisted = (id) => wishlistItems.some((p) => p._id === id);

  // Filter + sort
  const packages = useMemo(() => {
    let result = [...MOCK_PACKAGES];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.destination.toLowerCase().includes(q)
      );
    }

    if (selectedDestination) {
      result = result.filter(
        (p) => p.destination.toLowerCase() === selectedDestination.toLowerCase()
      );
    }

    switch (sortBy) {
      case 'price_asc':    result.sort((a, b) => a.price - b.price); break;
      case 'price_desc':   result.sort((a, b) => b.price - a.price); break;
      case 'duration_asc': result.sort((a, b) => a.duration - b.duration); break;
      case 'rating_desc':  result.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }

    return result;
  }, [search, selectedDestination, sortBy]);

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <StatusBar backgroundColor={C.primary} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {selectedDestination ? `${selectedDestination} Packages` : 'All Packages'}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Search */}
      <View style={[styles.searchWrapper, { backgroundColor: C.surface }]}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search packages..."
          onClear={() => setSearch('')}
        />
      </View>

      {/* Filter & Sort toolbar */}
      <View style={[styles.toolbar, { backgroundColor: C.surface, borderBottomColor: C.border }]}>
        <Text style={[styles.resultCount, { color: C.textMuted }]}>
          {packages.length} package{packages.length !== 1 ? 's' : ''}
        </Text>
        <View style={styles.toolbarActions}>
          <TouchableOpacity
            style={[
              styles.toolBtn,
              { backgroundColor: C.inputBg, borderColor: C.border },
              selectedDestination && { backgroundColor: C.primaryLight, borderColor: C.primary },
            ]}
            onPress={() => setShowFilterModal(true)}
          >
            <Text style={[
              styles.toolBtnText,
              { color: C.textSecondary },
              selectedDestination && { color: C.primary, fontWeight: Theme.fontWeight.semiBold },
            ]}>
              🎯 {selectedDestination || 'Filter'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolBtn, { backgroundColor: C.inputBg, borderColor: C.border }]}
            onPress={() => setShowSortModal(true)}
          >
            <Text style={[styles.toolBtnText, { color: C.textSecondary }]}>↕ Sort</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Package List */}
      <FlatList
        data={packages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <PackageCard
            package={item}
            onPress={() => navigation.navigate('PackageDetails', { packageId: item._id })}
            onWishlist={() => dispatch(toggleWishlist(item))}
            isWishlisted={isWishlisted(item._id)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            emoji="🧳"
            title="No Packages Found"
            message="Try adjusting your search or removing filters."
            actionText="Clear Filters"
            onAction={() => { setSearch(''); setSelectedDestination(''); }}
          />
        }
      />

      {/* Sort Modal */}
      <Modal visible={showSortModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowSortModal(false)} />
        <View style={[styles.bottomSheet, { backgroundColor: C.surface }]}>
          <Text style={[styles.sheetTitle, { color: C.textPrimary }]}>Sort By</Text>
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.sheetOption, { borderBottomColor: C.border }]}
              onPress={() => { setSortBy(opt.value); setShowSortModal(false); }}
            >
              <Text style={[
                styles.sheetOptionText,
                { color: sortBy === opt.value ? C.primary : C.textSecondary },
                sortBy === opt.value && { fontWeight: Theme.fontWeight.semiBold },
              ]}>
                {opt.label}
              </Text>
              {sortBy === opt.value && (
                <Text style={[styles.checkmark, { color: C.primary }]}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal visible={showFilterModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowFilterModal(false)} />
        <View style={[styles.bottomSheet, { backgroundColor: C.surface }]}>
          <Text style={[styles.sheetTitle, { color: C.textPrimary }]}>Filter by Destination</Text>
          <TouchableOpacity
            style={[styles.sheetOption, { borderBottomColor: C.border }]}
            onPress={() => { setSelectedDestination(''); setShowFilterModal(false); }}
          >
            <Text style={[
              styles.sheetOptionText,
              { color: !selectedDestination ? C.primary : C.textSecondary },
              !selectedDestination && { fontWeight: Theme.fontWeight.semiBold },
            ]}>
              All Destinations
            </Text>
            {!selectedDestination && (
              <Text style={[styles.checkmark, { color: C.primary }]}>✓</Text>
            )}
          </TouchableOpacity>
          {MOCK_DESTINATIONS.map((dest) => (
            <TouchableOpacity
              key={dest._id}
              style={[styles.sheetOption, { borderBottomColor: C.border }]}
              onPress={() => { setSelectedDestination(dest.name); setShowFilterModal(false); }}
            >
              <Text style={[
                styles.sheetOptionText,
                { color: selectedDestination === dest.name ? C.primary : C.textSecondary },
                selectedDestination === dest.name && { fontWeight: Theme.fontWeight.semiBold },
              ]}>
                {dest.name}
              </Text>
              {selectedDestination === dest.name && (
                <Text style={[styles.checkmark, { color: C.primary }]}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    paddingTop: Theme.spacing.lg,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  backIcon: { fontSize: 22, color: '#FFFFFF', fontWeight: 'bold' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: '#FFFFFF',
  },

  searchWrapper: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },

  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderBottomWidth: 1,
    marginBottom: 4,
  },
  resultCount: { fontSize: Theme.fontSize.sm },
  toolbarActions: { flexDirection: 'row', gap: 8 },
  toolBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Theme.borderRadius.full,
    borderWidth: 1,
  },
  toolBtnText: { fontSize: Theme.fontSize.sm },

  list: { padding: Theme.spacing.md, paddingBottom: 24 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  bottomSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Theme.spacing.lg,
    paddingBottom: Theme.spacing.xxl,
  },
  sheetTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    marginBottom: Theme.spacing.md,
  },
  sheetOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  sheetOptionText: { fontSize: Theme.fontSize.md },
  checkmark: { fontSize: 16, fontWeight: 'bold' },
});

export default PackageListScreen;
