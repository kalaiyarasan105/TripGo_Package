/**
 * AdminPackagesScreen
 * Lists all packages with enable/disable/delete/edit actions.
 */

import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, StatusBar,
  TouchableOpacity, Alert, Switch,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { deletePackage, togglePackageStatus } from '../../redux/adminSlice';
import { Colors, Theme } from '../../constants';
import { SearchBar, EmptyState } from '../../components';
import { formatPrice } from '../../utils/helpers';

const AdminPackagesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const packages = useSelector((s) => s.admin.packages);
  const [search, setSearch] = useState('');

  const filtered = packages.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.destination.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (pkg) => {
    Alert.alert(
      'Delete Package',
      `Delete "${pkg.name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => dispatch(deletePackage(pkg._id)) },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Status indicator */}
      <View style={[styles.statusBar, { backgroundColor: item.status === 'active' ? Colors.success : Colors.error }]} />

      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <View style={styles.cardInfo}>
            <Text style={styles.pkgName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.pkgDest}>📍 {item.destination} · {item.duration} Days</Text>
            <Text style={styles.pkgPrice}>{formatPrice(item.price)}/person</Text>
          </View>

          {/* Enable/Disable toggle */}
          <Switch
            value={item.status === 'active'}
            onValueChange={() => dispatch(togglePackageStatus(item._id))}
            trackColor={{ false: Colors.border, true: Colors.success }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: Colors.primaryLight }]}
            onPress={() => navigation.navigate('AdminPackageForm', { mode: 'edit', package: item })}
          >
            <Text style={[styles.actionBtnText, { color: Colors.primary }]}>✏️ Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: Colors.errorLight }]}
            onPress={() => handleDelete(item)}
          >
            <Text style={[styles.actionBtnText, { color: Colors.error }]}>🗑️ Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={Colors.primaryDark} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Packages ({packages.length})</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AdminPackageForm', { mode: 'add' })}
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrapper}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search packages..." onClear={() => setSearch('')} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState emoji="📦" title="No Packages" message="Add your first package." actionText="Add Package" onAction={() => navigation.navigate('AdminPackageForm', { mode: 'add' })} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primaryDark, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Theme.spacing.md, paddingVertical: Theme.spacing.md, paddingTop: Theme.spacing.lg,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  backIcon: { fontSize: 22, color: Colors.white, fontWeight: 'bold' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: Theme.fontSize.lg, fontWeight: Theme.fontWeight.bold, color: Colors.white },
  addBtn: { backgroundColor: Colors.secondary, borderRadius: Theme.borderRadius.md, paddingHorizontal: 12, paddingVertical: 6 },
  addBtnText: { color: Colors.white, fontWeight: Theme.fontWeight.bold, fontSize: Theme.fontSize.sm },
  searchWrapper: { padding: Theme.spacing.md, paddingBottom: 0 },
  list: { padding: Theme.spacing.md, paddingBottom: 24 },
  card: {
    backgroundColor: Colors.surface, borderRadius: Theme.borderRadius.lg,
    marginBottom: Theme.spacing.md, flexDirection: 'row', overflow: 'hidden', ...Theme.shadow.sm,
  },
  statusBar: { width: 5 },
  cardBody: { flex: 1, padding: Theme.spacing.md },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Theme.spacing.sm },
  cardInfo: { flex: 1, marginRight: 8 },
  pkgName: { fontSize: Theme.fontSize.md, fontWeight: Theme.fontWeight.bold, color: Colors.textPrimary, marginBottom: 2 },
  pkgDest: { fontSize: Theme.fontSize.sm, color: Colors.textSecondary, marginBottom: 2 },
  pkgPrice: { fontSize: Theme.fontSize.sm, color: Colors.primary, fontWeight: Theme.fontWeight.semiBold },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 1, borderRadius: Theme.borderRadius.sm, paddingVertical: 7, alignItems: 'center' },
  actionBtnText: { fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.semiBold },
});

export default AdminPackagesScreen;
