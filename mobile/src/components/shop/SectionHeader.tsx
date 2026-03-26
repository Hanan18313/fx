import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, Fonts } from '../../constants/theme';
import type { SectionHeaderProps } from './types';

export default function SectionHeader({
  title,
  showMore = false,
  onMore,
  variant = 'default',
}: SectionHeaderProps) {
  const isLarge = variant === 'large';

  return (
    <View style={[styles.container, isLarge && styles.containerLarge]}>
      <View style={styles.left}>
        {!isLarge && <View style={styles.bar} />}
        <Text style={[styles.title, isLarge && styles.titleLarge]}>
          {title}
        </Text>
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
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  containerLarge: {
    paddingTop: Spacing.xxl,
    paddingBottom: 0,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar: {
    width: 3,
    height: 16,
    backgroundColor: Colors.navyButton,
    borderRadius: 2,
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
  },
  titleLarge: {
    fontSize: 24,
    letterSpacing: -0.6,
    lineHeight: 32,
  },
  more: {
    fontSize: FontSize.md,
    color: Colors.navyButton,
    fontFamily: Fonts.medium,
  },
});
