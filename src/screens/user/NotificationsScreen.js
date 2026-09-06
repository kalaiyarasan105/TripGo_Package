/**
 * NotificationsScreen
 * Lists all user notifications with read/unread states.
 * Supports mark-all-read and individual delete.
 */

import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../../redux/notificationSlice';
import { useThemeColors } from '../../utils/themeUtils';
import { Theme } from '../../constants';
import { EmptyState } from '../../components';

// Return emoji and color for each notification type
const getTypeStyle = (type) => {
  switch (type) {
    case 'booking': return { emoji: '🎒', color: '#1A73E8' };
    case 'offer': return { emoji: '🏷️', color: '#FF6B35' };
    case 'reminder': return { emoji: '⏰', color: '#FBBC04' };
    case 'review': return { emoji: '⭐', color: '#F4B400' };
    default: return { emoji: '📢', color: '#34A853' };
  }
};

// Format time ago — e.g. "2 hours ago"
const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'Just now';
};

const NotificationsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const C = useThemeColors();
  const notifications = useSelector((state) => state.notifications.items);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleDelete = (id) => {
    Alert.alert('Delete Notification', 'Remove this notification?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(deleteNotification(id)),
      },
    ]);
  };

  const renderItem = ({ item }) => {
    const typeStyle = getTypeStyle(item.type);
    return (
      <TouchableOpacity
        style={[
          styles.notifCard,
          {
            backgroundColor: item.isRead ? C.surface : C.primaryLight,
            borderLeftColor: typeStyle.color,
          },
        ]}
        onPress={() => dispatch(markAsRead(item._id))}
        activeOpacity={0.8}
      >
        {/* Icon */}
        <View style={[styles.iconCircle, { backgroundColor: typeStyle.color + '22' }]}>
          <Text style={styles.iconEmoji}>{typeStyle.emoji}</Text>
        </View>

        {/* Content */}
        <View style={styles.notifContent}>
          <View style={styles.notifHeader}>
            <Text
              style={[
                styles.notifTitle,
                { color: C.textPrimary },
                !item.isRead && { fontWeight: Theme.fontWeight.bold },
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            {!item.isRead && (
              <View style={[styles.unreadDot, { backgroundColor: C.primary }]} />
            )}
          </View>
          <Text
            style={[styles.notifMessage, { color: C.textSecondary }]}
            numberOfLines={2}
          >
            {item.message}
          </Text>
          <Text style={[styles.notifTime, { color: C.textMuted }]}>
            {timeAgo(item.createdAt)}
          </Text>
        </View>

        {/* Delete button */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item._id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.deleteIcon, { color: C.textMuted }]}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <StatusBar backgroundColor={C.primary} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.primary }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount} unread</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={() => dispatch(markAllAsRead())}
            style={styles.markAllBtn}
          >
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            emoji="🔔"
            title="No Notifications"
            message="You're all caught up! Check back later."
          />
        }
      />
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
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: '#FFFFFF',
  },
  unreadBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: Theme.borderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 2,
  },
  unreadBadgeText: {
    fontSize: Theme.fontSize.xs,
    color: '#FFFFFF',
  },
  markAllBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  markAllText: {
    fontSize: Theme.fontSize.xs,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: Theme.fontWeight.medium,
  },

  list: { padding: Theme.spacing.md, paddingBottom: 24 },

  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    borderLeftWidth: 4,
    ...Theme.shadow.sm,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
    flexShrink: 0,
  },
  iconEmoji: { fontSize: 22 },
  notifContent: { flex: 1 },
  notifHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    flex: 1,
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.medium,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  notifMessage: {
    fontSize: Theme.fontSize.sm,
    lineHeight: 20,
    marginBottom: 4,
  },
  notifTime: {
    fontSize: Theme.fontSize.xs,
  },
  deleteBtn: { padding: 4, marginLeft: 4 },
  deleteIcon: { fontSize: 14 },
});

export default NotificationsScreen;
