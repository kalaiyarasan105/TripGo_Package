/**
 * SearchScreen — Phase 10
 *
 * Full-screen global search across packages and destinations.
 * - Real-time filtering as user types
 * - Recent searches (persisted via storage)
 * - Results grouped by Packages / Destinations
 * - Tapping a result navigates to the correct screen
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
  SectionList,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useThemeColors } from '../../utils/themeUtils';
import { Theme } from '../../constants';
import { EmptyState, LoadingSpinner } from '../../components';
import { MOCK_PACKAGES, MOCK_DESTINATIONS } from '../../constants/mockData';
import { formatPrice } from '../../utils/helpers';
import { getItem, saveItem, STORAGE_KEYS } from '../../utils/storage';

const MAX_RECENT = 8;

const SearchScreen = ({ navigation }) => {
  const C = useThemeColors();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [results, setResults] = useState({ packages: [], destinations: [] });
  const [isSearching, setIsSearching] = useState(false);

  // Load recent searches from storage on mount
  useEffect(() => {
    getItem(STORAGE_KEYS.LAST_SEARCH).then((data) => {
      if (Array.isArray(data)) setRecentSearches(data);
    });
  }, []);

  // Real-time search as query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults({ packages: [], destinations: [] });
      return;
    }
    setIsSearching(true);
    const q = query.trim().toLowerCase();
    const packages = MOCK_PACKAGES.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.destination.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
    const destinations = MOCK_DESTINATIONS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q)
    );
    setResults({ packages, destinations });
    setIsSearching(false);
  }, [query]);

  const saveSearch = useCallback(async (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter((s) => s !== trimmed)].slice(0, MAX_RECENT);
    setRecentSearches(updated);
    await saveItem(STORAGE_KEYS.LAST_SEARCH, updated);
  }, [recentSearches]);

  const clearRecent = async () => {
    setRecentSearches([]);
    await saveItem(STORAGE_KEYS.LAST_SEARCH, []);
  };

  const handlePackagePress = (pkg) => {
    saveSearch(query || pkg.name);
    navigation.navigate('PackageDetails', { packageId: pkg._id });
  };

  const handleDestinationPress = (dest) => {
    saveSearch(query || dest.name);
    navigation.navigate('ExploreTab', {
      screen: 'PackageList',
      params: { destination: dest.name },
    });
  };

  const handleRecentPress = (term) => {
    setQuery(term);
  };

  const totalResults = results.packages.length + results.destinations.length;

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <StatusBar backgroundColor={C.primary} barStyle="light-content" />

      {/* ── Search Header ────────────────────────────── */}
      <View style={[styles.header, { backgroundColor: C.primary }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={[styles.searchBar, { backgroundColor: C.surface }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: C.textPrimary }]}
            value={query}
            onChangeText={setQuery}
            placeholder="Search destinations, packages..."
            placeholderTextColor={C.textMuted}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={() => saveSearch(query)}
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
              <Text style={[styles.clearIcon, { color: C.textMuted }]}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Empty query — show recent searches ─────── */}
      {!query.trim() && (
        <View style={styles.recentSection}>
          {recentSearches.length > 0 ? (
            <>
              <View style={styles.recentHeader}>
                <Text style={[styles.recentTitle, { color: C.textPrimary }]}>
                  Recent Searches
                </Text>
                <TouchableOpacity onPress={clearRecent}>
                  <Text style={[styles.clearAllText, { color: C.primary }]}>Clear All</Text>
                </TouchableOpacity>
              </View>
              {recentSearches.map((term, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.recentItem, { borderBottomColor: C.border }]}
                  onPress={() => handleRecentPress(term)}
                >
                  <Text style={styles.recentIcon}>🕐</Text>
                  <Text style={[styles.recentText, { color: C.textSecondary }]}>{term}</Text>
                  <Text style={[styles.recentArrow, { color: C.textMuted }]}>↗</Text>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <View style={styles.centerHint}>
              <Text style={styles.hintEmoji}>🔍</Text>
              <Text style={[styles.hintText, { color: C.textSecondary }]}>
                Search for destinations, package names, or trip types
              </Text>
              <View style={styles.trendingRow}>
                {['Goa', 'Manali', 'Kerala', 'Kashmir', 'Rajasthan'].map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.trendingChip, { backgroundColor: C.primaryLight }]}
                    onPress={() => setQuery(tag)}
                  >
                    <Text style={[styles.trendingText, { color: C.primary }]}>🔥 {tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      {/* ── Search results ──────────────────────────── */}
      {query.trim().length > 0 && !isSearching && (
        <>
          {totalResults === 0 ? (
            <EmptyState
              emoji="🔍"
              title="No Results Found"
              message={`We couldn't find anything matching "${query}". Try a different keyword.`}
            />
          ) : (
            <FlatList
              data={[]}
              ListHeaderComponent={
                <>
                  {/* Result count */}
                  <Text style={[styles.resultCount, { color: C.textMuted }]}>
                    {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
                  </Text>

                  {/* Destination results */}
                  {results.destinations.length > 0 && (
                    <View style={styles.resultGroup}>
                      <Text style={[styles.groupTitle, { color: C.textPrimary }]}>
                        📍 Destinations
                      </Text>
                      {results.destinations.map((dest) => (
                        <TouchableOpacity
                          key={dest._id}
                          style={[styles.destResult, { backgroundColor: C.surface, borderColor: C.border }]}
                          onPress={() => handleDestinationPress(dest)}
                        >
                          <View style={[styles.destIcon, { backgroundColor: C.primaryLight }]}>
                            <Text style={{ fontSize: 22 }}>📍</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.destName, { color: C.textPrimary }]}>{dest.name}</Text>
                            <Text style={[styles.destMeta, { color: C.textSecondary }]}>
                              {dest.country} • {dest.packageCount} packages
                            </Text>
                          </View>
                          <Text style={[styles.arrowIcon, { color: C.textMuted }]}>›</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* Package results */}
                  {results.packages.length > 0 && (
                    <View style={styles.resultGroup}>
                      <Text style={[styles.groupTitle, { color: C.textPrimary }]}>
                        📦 Packages
                      </Text>
                      {results.packages.map((pkg) => (
                        <TouchableOpacity
                          key={pkg._id}
                          style={[styles.pkgResult, { backgroundColor: C.surface, borderColor: C.border }]}
                          onPress={() => handlePackagePress(pkg)}
                        >
                          <View style={[styles.pkgIcon, { backgroundColor: C.secondaryLight }]}>
                            <Text style={{ fontSize: 22 }}>🏖️</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.pkgName, { color: C.textPrimary }]} numberOfLines={1}>
                              {pkg.name}
                            </Text>
                            <Text style={[styles.pkgMeta, { color: C.textSecondary }]}>
                              📍 {pkg.destination} • {pkg.duration} days
                            </Text>
                            <Text style={[styles.pkgPrice, { color: C.secondary }]}>
                              {formatPrice(pkg.price)}/person
                            </Text>
                          </View>
                          <View style={[styles.ratingBadge, { backgroundColor: C.primaryLight }]}>
                            <Text style={[styles.ratingText, { color: C.primary }]}>⭐ {pkg.rating}</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </>
              }
              keyExtractor={() => 'header'}
              contentContainerStyle={styles.resultsList}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}

      {isSearching && <LoadingSpinner message="Searching…" />}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.lg,
    paddingBottom: Theme.spacing.md,
    gap: 10,
  },
  backBtn: { padding: 4 },
  backIcon: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Theme.borderRadius.full,
    paddingHorizontal: Theme.spacing.md,
    height: 44,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: Theme.fontSize.md },
  clearBtn: { padding: 4 },
  clearIcon: { fontSize: 14 },

  recentSection: { padding: Theme.spacing.md },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  recentTitle: { fontSize: Theme.fontSize.md, fontWeight: Theme.fontWeight.bold },
  clearAllText: { fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.medium },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  recentIcon: { fontSize: 16 },
  recentText: { flex: 1, fontSize: Theme.fontSize.md },
  recentArrow: { fontSize: 16 },

  centerHint: { alignItems: 'center', paddingTop: Theme.spacing.xl },
  hintEmoji: { fontSize: 48, marginBottom: Theme.spacing.md },
  hintText: { fontSize: Theme.fontSize.md, textAlign: 'center', lineHeight: 24, marginBottom: Theme.spacing.lg },
  trendingRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  trendingChip: {
    borderRadius: Theme.borderRadius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  trendingText: { fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.semiBold },

  resultsList: { padding: Theme.spacing.md, paddingBottom: 40 },
  resultCount: { fontSize: Theme.fontSize.sm, marginBottom: Theme.spacing.md },
  resultGroup: { marginBottom: Theme.spacing.md },
  groupTitle: { fontSize: Theme.fontSize.base, fontWeight: Theme.fontWeight.bold, marginBottom: Theme.spacing.sm },

  destResult: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    gap: 12,
    ...Theme.shadow.sm,
  },
  destIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  destName: { fontSize: Theme.fontSize.md, fontWeight: Theme.fontWeight.bold },
  destMeta: { fontSize: Theme.fontSize.sm, marginTop: 2 },
  arrowIcon: { fontSize: 22 },

  pkgResult: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    gap: 12,
    ...Theme.shadow.sm,
  },
  pkgIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  pkgName: { fontSize: Theme.fontSize.md, fontWeight: Theme.fontWeight.bold },
  pkgMeta: { fontSize: Theme.fontSize.sm, marginTop: 2 },
  pkgPrice: { fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.bold, marginTop: 2 },
  ratingBadge: { borderRadius: Theme.borderRadius.full, paddingHorizontal: 8, paddingVertical: 4 },
  ratingText: { fontSize: Theme.fontSize.xs, fontWeight: Theme.fontWeight.bold },
});

export default SearchScreen;
