/**
 * DestinationsScreen
 * Full-page grid of all destinations.
 * Dark-mode aware. Tapping navigates to packages for that destination.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useThemeColors } from '../../utils/themeUtils';
import { Theme } from '../../constants';
import { SearchBar, EmptyState } from '../../components';
import { MOCK_DESTINATIONS } from '../../constants/mockData';

const DestinationsScreen = ({ navigation }) => {
  const C = useThemeColors();
  const [search, setSearch] = useState('');

  const filtered = MOCK_DESTINATIONS.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.country.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PackageList', { destination: item.name })}
      activeOpacity={0.85}
    >
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.overlay} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.country}>{item.country}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.packageCount} Packages</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <StatusBar backgroundColor={C.primary} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.primary }]}>
        <Text style={styles.headerTitle}>Destinations</Text>
        <Text style={styles.headerSubtitle}>
          {MOCK_DESTINATIONS.length} amazing places to explore
        </Text>
      </View>

      {/* Search floats over the header */}
      <View style={styles.searchWrapper}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search destinations..."
          onClear={() => setSearch('')}
        />
      </View>

      {/* Grid */}
      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            emoji="🗺️"
            title="No Destinations Found"
            message="Try a different search keyword."
            actionText="Clear Search"
            onAction={() => setSearch('')}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },

  header: {
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.lg,
    paddingBottom: Theme.spacing.xl,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: Theme.fontSize.title,
    fontWeight: Theme.fontWeight.extraBold,
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: Theme.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },

  searchWrapper: {
    paddingHorizontal: Theme.spacing.md,
    marginTop: -20,
    marginBottom: Theme.spacing.md,
    zIndex: 10,
  },

  list: { paddingHorizontal: Theme.spacing.md, paddingBottom: 24 },
  row: { justifyContent: 'space-between', marginBottom: Theme.spacing.md },

  card: {
    width: '48%',
    height: 170,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    ...Theme.shadow.md,
  },
  image: { width: '100%', height: '100%', position: 'absolute' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  name: {
    fontSize: Theme.fontSize.base,
    fontWeight: Theme.fontWeight.bold,
    color: '#FFFFFF',
  },
  country: {
    fontSize: Theme.fontSize.xs,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 6,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: Theme.borderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: Theme.fontSize.xs,
    color: '#FFFFFF',
    fontWeight: Theme.fontWeight.semiBold,
  },
});

export default DestinationsScreen;
