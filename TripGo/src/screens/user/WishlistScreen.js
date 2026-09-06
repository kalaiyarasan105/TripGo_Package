/**
 * WishlistScreen
 * Shows all packages the user has saved to their wishlist.
 * Supports removing items and navigating to package details.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromWishlist } from '../../redux/wishlistSlice';
import { useThemeColors } from '../../utils/themeUtils';
import { Theme } from '../../constants';
import { PackageCard, EmptyState } from '../../components';

const WishlistScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const C = useThemeColors();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleRemove = (pkg) => {
    Alert.alert(
      'Remove from Wishlist',
      `Remove "${pkg.name}" from your wishlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => dispatch(removeFromWishlist(pkg._id)),
        },
      ]
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <StatusBar
        backgroundColor={C.primary}
        barStyle="light-content"
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.primary }]}>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <Text style={styles.headerSubtitle}>
          {wishlistItems.length} saved package{wishlistItems.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Package List */}
      <FlatList
        data={wishlistItems}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <PackageCard
              package={item}
              onPress={() =>
                navigation.navigate('PackageDetails', { packageId: item._id })
              }
              onWishlist={() => handleRemove(item)}
              isWishlisted={true}
            />
            {/* Remove label under the card */}
            <TouchableOpacity
              style={[styles.removeBtn, { borderColor: C.error }]}
              onPress={() => handleRemove(item)}
            >
              <Text style={[styles.removeBtnText, { color: C.error }]}>
                ✕ Remove from Wishlist
              </Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[C.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            emoji="❤️"
            title="Your Wishlist is Empty"
            message="Tap the ❤️ on any package to save it here for later."
            actionText="Explore Packages"
            onAction={() => navigation.navigate('ExploreTab')}
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
    paddingBottom: Theme.spacing.lg,
    borderBottomLeftRadius: 0,
  },
  headerTitle: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: Theme.fontWeight.extraBold,
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: Theme.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },

  list: { padding: Theme.spacing.md, paddingBottom: 24 },

  cardWrapper: { marginBottom: 4 },
  removeBtn: {
    borderWidth: 1,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
    marginTop: -8,
  },
  removeBtnText: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.medium,
  },
});

export default WishlistScreen;
