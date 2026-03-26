import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Colors, BorderRadius, Spacing, FontSize, Fonts } from '../../constants/theme';
import type { ProductCardProps } from './types';

const CARD_WIDTH =
  (Dimensions.get('window').width - Spacing.lg * 2 - Spacing.sm) / 2;

const TAG_LABELS: Record<string, { text: string; color: string }> = {
  new: { text: '新品', color: '#4CAF50' },
  hot: { text: '热销', color: Colors.primary },
  member_exclusive: { text: '会员', color: Colors.memberGold },
  promotion: { text: '促销', color: Colors.accent },
};

export default function ProductCard({
  product,
  onPress,
  onAddToCart,
}: ProductCardProps) {
  const tag = product.tags?.[0] ? TAG_LABELS[product.tags[0]] : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: product.images[0] }}
          style={styles.image}
          resizeMode="cover"
        />
        {tag && (
          <View style={[styles.tag, { backgroundColor: tag.color }]}>
            <Text style={styles.tagText}>{tag.text}</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.bottomRow}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>¥{product.price}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>¥{product.originalPrice}</Text>
            )}
          </View>
          <View style={styles.carticon}>
            {onAddToCart && (
              <TouchableOpacity
                style={styles.addBtn}
                onPress={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
              >
                <Text style={styles.addBtnText}>+</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.surfaceSecondary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  tag: {
    position: 'absolute',
    top: Spacing.sm,
    left: 0,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderTopRightRadius: BorderRadius.sm,
    borderBottomRightRadius: BorderRadius.sm,
  },
  tagText: {
    color: Colors.textWhite,
    fontSize: FontSize.xs,
    fontFamily: Fonts.bold,
  },
  info: {
    padding: Spacing.sm,
    display: 'flex',
  },
  name: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: Spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.xs,
  },
  price: {
    fontSize: FontSize.xl,
    fontFamily: Fonts.numBold,
    color: Colors.primary,
  },
  originalPrice: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textDecorationLine: 'line-through',
    marginLeft: Spacing.xs,
  },
  bottomRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carticon: {},
  profit: {
    fontSize: FontSize.xs,
    color: Colors.accent,
  },
  addBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: Colors.textWhite,
    fontFamily: Fonts.numBold,
  },
});
