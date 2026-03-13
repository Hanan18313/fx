import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/theme';
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
          <View style={[styles.iconCircle, { backgroundColor: cat.color }]}>
            <Text style={styles.icon}>{cat.icon}</Text>
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
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  item: {
    width: '20%',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  icon: {
    fontSize: 24,
  },
  name: {
    fontSize: FontSize.xs,
    color: Colors.textPrimary,
  },
});
