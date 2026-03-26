import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colors, BorderRadius, Spacing, FontSize, Fonts } from '../../constants/theme';
import type { Product } from '../../types/product';

interface LargeRecommendCardProps {
  product: Product;
  onPress?: () => void;
  onAddToCart?: (product: Product) => void;
  onFavorite?: (product: Product) => void;
}

const TAG_LABELS: Record<string, string> = {
  new: '新品首发',
  hot: '热销爆款',
  member_exclusive: '会员精选',
  promotion: '即时节省',
};

function formatPrice(price: string) {
  const num = parseFloat(price);
  const integer = Math.floor(num).toLocaleString();
  const decimal = (num % 1).toFixed(2).substring(1);
  return { integer, decimal };
}

function getPriceLabel(tags?: string[]): string {
  if (!tags || tags.length === 0) return '限时优惠';
  if (tags.includes('member_exclusive')) return '会员价';
  if (tags.includes('promotion')) return '即时节省';
  if (tags.includes('hot')) return '热销特价';
  return '限时优惠';
}

export default function LargeRecommendCard({
  product,
  onPress,
  onAddToCart,
  onFavorite,
}: LargeRecommendCardProps) {
  const [imgError, setImgError] = useState(false);
  const tagText = product.tags?.[0] ? TAG_LABELS[product.tags[0]] : null;
  const { integer, decimal } = formatPrice(product.price);
  const priceLabel = getPriceLabel(product.tags);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        {!imgError ? (
          <Image
            source={{ uri: product.images[0] }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <View style={styles.imageFallback}>
            <Text style={styles.fallbackEmoji}>📦</Text>
            <Text style={styles.fallbackText}>{product.name}</Text>
          </View>
        )}
        {tagText && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{tagText}</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {product.name}
          </Text>
          <TouchableOpacity
            onPress={() => onFavorite?.(product)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.heartIcon}>♡</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {product.description || product.name}
        </Text>

        <View style={styles.priceRow}>
          <View style={styles.priceLeft}>
            <Text style={styles.priceLabel}>{priceLabel}</Text>
            <View style={styles.priceDisplay}>
              <Text style={styles.currencySign}>¥</Text>
              <Text style={styles.priceInteger}>{integer}</Text>
              <Text style={styles.priceDecimal}>{decimal}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.addCartBtn}
            onPress={() => onAddToCart?.(product)}
            activeOpacity={0.8}
          >
            <Text style={styles.addCartText}>加入购物车</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04,
    shadowRadius: 32,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1.05,
    backgroundColor: Colors.surfaceSecondary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSecondary,
    padding: Spacing.xl,
  },
  fallbackEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  fallbackText: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: 11,
    left: 16,
    backgroundColor: 'rgba(0, 44, 102, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 4.5,
    borderRadius: 8,
  },
  badgeText: {
    color: Colors.textWhite,
    fontSize: 10,
    fontFamily: Fonts.medium,
  },
  content: {
    padding: Spacing.xxl,
    gap: 7,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.md,
    lineHeight: 23,
  },
  heartIcon: {
    fontSize: 20,
    color: Colors.textTertiary,
    marginTop: 1,
  },
  description: {
    fontSize: FontSize.md,
    color: Colors.bodyGray,
    lineHeight: 22.75,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 9,
  },
  priceLeft: {
    gap: 2,
  },
  priceLabel: {
    fontSize: 10,
    color: Colors.priceOrange,
    fontFamily: Fonts.medium,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  priceDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  currencySign: {
    fontSize: FontSize.md,
    fontFamily: Fonts.numMedium,
    color: Colors.navy,
    lineHeight: 20,
  },
  priceInteger: {
    fontSize: 24,
    fontFamily: Fonts.numBlack,
    color: Colors.navy,
    lineHeight: 32,
  },
  priceDecimal: {
    fontSize: FontSize.sm,
    fontFamily: Fonts.numMedium,
    color: Colors.navy,
    lineHeight: 16,
  },
  addCartBtn: {
    backgroundColor: Colors.navyButton,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: Colors.navyButton,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 4,
  },
  addCartText: {
    color: Colors.textWhite,
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    textAlign: 'center',
  },
});
