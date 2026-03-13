import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Spacing, FontSize } from '../../constants/theme';
import type { EmptyStateProps } from './types';

export default function EmptyState({ icon = '📦', message, actionText, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionText && onAction && (
        <TouchableOpacity style={styles.btn} onPress={onAction}>
          <Text style={styles.btnText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  icon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  message: {
    fontSize: FontSize.lg,
    color: Colors.textTertiary,
    marginBottom: Spacing.xl,
  },
  btn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  btnText: {
    color: Colors.textWhite,
    fontSize: FontSize.md,
    fontWeight: 'bold',
  },
});
