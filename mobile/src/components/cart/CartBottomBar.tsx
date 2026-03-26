import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Fonts } from '../../constants/theme';
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
      <View style={styles.summaryRow}>
        <View style={styles.leftCol}>
          <Text style={styles.totalLabel}>合计</Text>
          <Text style={styles.totalPrice}>¥{totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.selectAllPill} onPress={onToggleSelectAll}>
          <View style={[styles.checkbox, isAllSelected && styles.checkboxChecked]}>
            {isAllSelected && <Ionicons name="checkmark" size={12} color={Colors.textWhite} />}
          </View>
          <Text style={styles.selectAllText}>全选</Text>
        </TouchableOpacity>
      </View>

      {!editing ? (
        <TouchableOpacity
          style={[styles.settleBtn, selectedCount === 0 && styles.btnDisabled]}
          onPress={onSettle}
          disabled={selectedCount === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.settleBtnText}>去结算</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.textWhite} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.deleteBtn, selectedCount === 0 && styles.btnDisabled]}
          onPress={onDeleteSelected}
          disabled={selectedCount === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.settleBtnText}>删除({selectedCount})</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(195,198,211,0.15)',
    gap: 16,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,44,102,0.12)',
        shadowOffset: { width: 0, height: -12 },
        shadowOpacity: 1,
        shadowRadius: 32,
      },
      android: { elevation: 8 },
    }),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  leftCol: {
    gap: 2,
  },
  totalLabel: {
    fontSize: 10,
    color: Colors.bodyGray,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  totalPrice: {
    fontSize: 30,
    fontFamily: Fonts.numBlack,
    color: Colors.textPrimary,
    letterSpacing: -1.5,
    lineHeight: 36,
  },
  selectAllPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.navyButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.navyButton,
    borderColor: Colors.navyButton,
  },
  selectAllText: {
    fontSize: 12,
    color: Colors.navyButton,
    fontFamily: Fonts.medium,
    letterSpacing: 0.6,
  },
  settleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.navyButton,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,65,145,0.2)',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 1,
        shadowRadius: 25,
      },
      android: { elevation: 6 },
    }),
  },
  settleBtnText: {
    fontSize: 18,
    fontFamily: Fonts.medium,
    color: Colors.textWhite,
    lineHeight: 28,
  },
  deleteBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D32F2F',
    paddingVertical: 16,
    borderRadius: 12,
  },
  btnDisabled: {
    opacity: 0.4,
  },
});
