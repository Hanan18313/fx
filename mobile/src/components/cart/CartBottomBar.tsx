import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/theme';
import type { CartBottomBarProps } from './types';

export default function CartBottomBar({
  isAllSelected,
  onToggleSelectAll,
  totalPrice,
  selectedCount,
  editing,
  onSettle,
  onDeleteSelected,
}: CartBottomBarProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.selectAll} onPress={onToggleSelectAll}>
        <View
          style={[styles.checkbox, isAllSelected && styles.checkboxChecked]}
        >
          {isAllSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.selectAllText}>全选</Text>
      </TouchableOpacity>

      {!editing ? (
        <>
          <View style={styles.totalArea}>
            <Text style={styles.totalLabel}>合计：</Text>
            <Text style={styles.totalPrice}>¥{totalPrice.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={[styles.settleBtn, selectedCount === 0 && styles.settleBtnDisabled]}
            onPress={onSettle}
            disabled={selectedCount === 0}
          >
            <Text style={styles.settleText}>结算({selectedCount})</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={[styles.deleteBtn, selectedCount === 0 && styles.settleBtnDisabled]}
            onPress={onDeleteSelected}
            disabled={selectedCount === 0}
          >
            <Text style={styles.settleText}>删除({selectedCount})</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  selectAll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.textWhite,
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectAllText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  totalArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
    marginRight: Spacing.md,
  },
  totalLabel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  totalPrice: {
    fontSize: FontSize.xl,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  settleBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.full,
  },
  settleBtnDisabled: {
    opacity: 0.5,
  },
  deleteBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.full,
  },
  settleText: {
    color: Colors.textWhite,
    fontSize: FontSize.md,
    fontWeight: 'bold',
  },
});
