/**
 * AdminUsersScreen
 * View all users, enable/disable accounts.
 */

import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, StatusBar,
  TouchableOpacity, Alert, Switch,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleUserStatus } from '../../redux/adminSlice';
import { Colors, Theme } from '../../constants';
import { SearchBar, EmptyState } from '../../components';
import { formatDate } from '../../utils/helpers';

const AdminUsersScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const users = useSelector((s) => s.admin.users);
  const [search, setSearch] = useState('');

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (user) => {
    const action = user.isActive ? 'Disable' : 'Enable';
    Alert.alert(`${action} User`, `${action} account for "${user.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: action, onPress: () => dispatch(toggleUserStatus(user._id)) },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userMeta}>
          📱 {item.phone} · 🎒 {item.bookingsCount} bookings · Joined {formatDate(item.joinedAt)}
        </Text>
      </View>

      <View style={styles.rightSection}>
        <Switch
          value={item.isActive}
          onValueChange={() => handleToggle(item)}
          trackColor={{ false: Colors.border, true: Colors.success }}
          thumbColor="#FFFFFF"
        />
        <Text style={[styles.statusLabel, { color: item.isActive ? Colors.success : Colors.error }]}>
          {item.isActive ? 'Active' : 'Disabled'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={Colors.primaryDark} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Users ({users.length})</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.searchWrapper}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search users..." onClear={() => setSearch('')} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState emoji="👥" title="No Users Found" message="Try a different search." actionText="Clear" onAction={() => setSearch('')} />}
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
  searchWrapper: { padding: Theme.spacing.md, paddingBottom: 0 },
  list: { padding: Theme.spacing.md, paddingBottom: 24 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md, marginBottom: Theme.spacing.sm, ...Theme.shadow.sm,
  },
  avatarCircle: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  avatarText: { color: Colors.white, fontSize: Theme.fontSize.lg, fontWeight: Theme.fontWeight.bold },
  userInfo: { flex: 1 },
  userName: { fontSize: Theme.fontSize.md, fontWeight: Theme.fontWeight.bold, color: Colors.textPrimary },
  userEmail: { fontSize: Theme.fontSize.sm, color: Colors.textSecondary, marginBottom: 2 },
  userMeta: { fontSize: Theme.fontSize.xs, color: Colors.textMuted },
  rightSection: { alignItems: 'center', marginLeft: 8 },
  statusLabel: { fontSize: Theme.fontSize.xs, fontWeight: Theme.fontWeight.semiBold, marginTop: 2 },
});

export default AdminUsersScreen;
