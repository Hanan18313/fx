import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize } from '../../constants/theme';
import type { SectionHeaderProps } from './types';

export default function SectionHeader({ title, showMore = false, onMore }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.bar} />
        <Text style={styles.title}>{title}</Text>
      </View>
      {showMore && (
        <TouchableOpacity onPress={onMore}>
          <Text style={styles.more}>查看更多 &gt;</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar: {
    width: 3,
    height: 16,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  more: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
  },
});
