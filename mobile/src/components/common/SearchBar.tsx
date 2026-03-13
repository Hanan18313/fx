import React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, BorderRadius, Spacing, FontSize } from '../../constants/theme';
import type { SearchBarProps } from './types';

export default function SearchBar({ value, onChangeText, onSubmit, placeholder = '搜索商品...' }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.location}>📍</Text>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={Colors.textTertiary}
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmit}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity>
          <Text style={styles.scanIcon}>📷</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    paddingTop: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: FontSize.xl,
    marginRight: Spacing.sm,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    height: 36,
  },
  searchIcon: {
    fontSize: FontSize.md,
    marginRight: Spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    padding: 0,
  },
  scanIcon: {
    fontSize: FontSize.xl,
    marginLeft: Spacing.sm,
  },
});
