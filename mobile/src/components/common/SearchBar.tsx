import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing, FontSize, Fonts } from '../../constants/theme';
import type { SearchBarProps } from './types';

export default function SearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder = '搜索商品...',
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.locationBtn}>
          <Ionicons name="location-outline" size={20} color={Colors.navy} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.searchBox} onPress={onSubmit} activeOpacity={0.8}>
          <Ionicons name="search-outline" size={16} color={Colors.textTertiary} />
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={Colors.textTertiary}
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmit}
            returnKeyType="search"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.scanBtn}>
          <Ionicons name="scan-outline" size={22} color={Colors.navy} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.md,
    paddingTop: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locationBtn: {
    padding: 2,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    height: 40,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: Fonts.regular,
    color: Colors.textPrimary,
    padding: 0,
  },
  scanBtn: {
    padding: 2,
  },
});
