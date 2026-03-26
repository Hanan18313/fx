import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Fonts } from '../../constants/theme';
import type { QuickCategoryGridProps } from './types';

export default function QuickCategoryGrid({ categories, onPress }: QuickCategoryGridProps) {
  return (
    <View style={styles.container}>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={styles.item}
          onPress={() => onPress?.(cat)}
          activeOpacity={0.7}
        >
          <View style={styles.iconBox}>
            <Ionicons
              name={cat.icon as any}
              size={20}
              color={Colors.navy}
            />
          </View>
          <Text style={styles.name}>{cat.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg,
  },
  item: {
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,44,102,0.12)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 24,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  name: {
    fontSize: 10,
    color: Colors.bodyGray,
    fontFamily: Fonts.medium,
    textAlign: 'center',
  },
});
