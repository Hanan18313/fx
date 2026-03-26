import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Fonts } from '../../constants/theme';
import type { CartItemCardProps } from './types';

export default function CartItemCard({
  item,
  onToggleSelect,
  onUpdateQuantity,
  onRemove,
}: CartItemCardProps) {
  const handleDecrement = () => {
    if (item.quantity <= 1) {
      Alert.alert('提示', '确认删除该商品？', [
        { text: '取消' },
        { text: '删除', style: 'destructive', onPress: onRemove },
      ]);
    } else {
      onUpdateQuantity(item.quantity - 1);
    }
  };

  const hasDiscount = item.product.originalPrice && item.product.originalPrice !== item.product.price;
  const savings = hasDiscount
    ? (parseFloat(item.product.originalPrice!) - parseFloat(item.product.price)).toFixed(2)
    : null;

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: item.product.images[0] }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>{item.product.name}</Text>
          <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close" size={14} color={Colors.bodyGray} />
          </TouchableOpacity>
        </View>

        {item.spec && <Text style={styles.spec}>{item.spec}</Text>}

        {savings && (
          <View style={styles.savingsRow}>
            <Ionicons name="pricetag" size={10} color={Colors.priceOrange} />
            <Text style={styles.savingsText}>即时立减: -¥{savings}</Text>
          </View>
        )}

        <View style={styles.bottomRow}>
          <View style={styles.priceWrap}>
            {hasDiscount && (
              <Text style={styles.originalPrice}>¥{item.product.originalPrice}</Text>
            )}
            <Text style={styles.price}>¥{item.product.price}</Text>
          </View>

          <View style={styles.stepper}>
            <TouchableOpacity style={styles.stepBtn} onPress={handleDecrement}>
              <Ionicons name="remove" size={12} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.stepQty}>{item.quantity}</Text>
            <TouchableOpacity style={styles.stepBtn} onPress={() => onUpdateQuantity(item.quantity + 1)}>
              <Ionicons name="add" size={12} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 16,
    marginBottom: 16,
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: 8,
    backgroundColor: '#EEE',
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 96,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  name: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: 19,
  },
  spec: {
    fontSize: 11,
    color: Colors.bodyGray,
    lineHeight: 17,
    marginTop: 2,
  },
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  savingsText: {
    fontSize: 10,
    color: Colors.priceOrange,
    fontFamily: Fonts.bold,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 'auto' as any,
  },
  priceWrap: {
    gap: 0,
  },
  originalPrice: {
    fontSize: 12,
    color: Colors.bodyGray,
    textDecorationLine: 'line-through',
    lineHeight: 16,
  },
  price: {
    fontSize: 18,
    fontFamily: Fonts.numBlack,
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2E2E2',
    borderRadius: 8,
    padding: 4,
  },
  stepBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  stepQty: {
    fontSize: 14,
    fontFamily: Fonts.numBold,
    color: Colors.textPrimary,
    minWidth: 32,
    textAlign: 'center',
  },
});
