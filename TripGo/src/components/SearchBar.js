/**
 * SearchBar Component
 *
 * A styled text input used for searching packages and destinations.
 * Shows a clear (✕) button when text is entered.
 *
 * Usage:
 *   <SearchBar
 *     value={query}
 *     onChangeText={setQuery}
 *     placeholder="Search destinations..."
 *     onClear={() => setQuery('')}
 *   />
 */

import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { Colors, Theme } from '../constants';

const SearchBar = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
  onSubmit,
  style,
  autoFocus = false,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Search icon — using emoji as placeholder (replace with vector icon in Phase 3) */}
      <Text style={styles.searchIcon}>🔍</Text>

      {/* Text input */}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        autoFocus={autoFocus}
        autoCorrect={false}
        autoCapitalize="none"
      />

      {/* Clear button — only visible when there is text */}
      {value && value.length > 0 && (
        <TouchableOpacity
          onPress={onClear}
          style={styles.clearButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.clearIcon}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: Theme.borderRadius.full,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: Theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Theme.fontSize.md,
    color: Colors.textPrimary,
    padding: 0, // Remove default Android padding
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: 'bold',
  },
});

export default SearchBar;
