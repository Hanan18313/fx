import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Fonts } from '../../constants/theme';
import type { FlashSaleProduct } from '../../constants/mockData';

interface FlashSalesSectionProps {
  products: FlashSaleProduct[];
  onViewAll?: () => void;
  onProductPress?: (product: FlashSaleProduct) => void;
}

function formatPrice(price: string) {
  const num = parseFloat(price);
  const integer = Math.floor(num).toLocaleString();
  const decimal = (num % 1).toFixed(2).substring(1);
  return { integer, decimal };
}

function CountdownTimer() {
  const [seconds, setSeconds] = useState(10212);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');

  return (
    <View style={styles.timerRow}>
      <Text style={styles.timerLabel}>距离结束</Text>
      <View style={styles.timerBoxes}>
        <View style={styles.timerBox}>
          <Text style={styles.timerDigit}>{h}</Text>
        </View>
        <Text style={styles.timerColon}>:</Text>
        <View style={styles.timerBox}>
          <Text style={styles.timerDigit}>{m}</Text>
        </View>
        <Text style={styles.timerColon}>:</Text>
        <View style={styles.timerBox}>
          <Text style={styles.timerDigit}>{s}</Text>
        </View>
      </View>
    </View>
  );
}

function FlashProductCard({ product, onPress }: { product: FlashSaleProduct; onPress?: () => void }) {
  const { integer, decimal } = formatPrice(product.salePrice);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardImageWrap}>
        <Image source={{ uri: product.imageUrl }} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{product.discount}</Text>
        </View>
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={2}>
          {product.name}
        </Text>
      </View>

      <View style={styles.cardPriceArea}>
        <Text style={styles.originalPrice}>${product.originalPrice}</Text>
        <View style={styles.salePriceRow}>
          <Text style={styles.priceCurrency}>$</Text>
          <Text style={styles.priceInteger}>{integer}</Text>
          <Text style={styles.priceDecimal}>{decimal}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function FlashSalesSection({
  products,
  onViewAll,
  onProductPress,
}: FlashSalesSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.sectionTitle}>限时秒杀</Text>
          <CountdownTimer />
        </View>

        <TouchableOpacity style={styles.viewAllBtn} onPress={onViewAll}>
          <Text style={styles.viewAllText}>查看全部</Text>
          <Ionicons name="chevron-forward" size={14} color={Colors.navyButton} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <FlashProductCard product={item} onPress={() => onProductPress?.(item)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.xxl,
    gap: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.xxl,
  },
  headerLeft: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    letterSpacing: -0.6,
    lineHeight: 32,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerLabel: {
    fontSize: 12,
    color: Colors.bodyGray,
    letterSpacing: 1.2,
  },
  timerBoxes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timerBox: {
    backgroundColor: Colors.navy,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  timerDigit: {
    color: Colors.textWhite,
    fontSize: 10,
    fontFamily: Fonts.numBlack,
  },
  timerColon: {
    color: Colors.navy,
    fontSize: 16,
    fontFamily: Fonts.numBold,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.navyButton,
    fontFamily: Fonts.medium,
  },
  listContent: {
    paddingHorizontal: Spacing.xxl,
    gap: 16,
  },
  card: {
    width: 160,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.06)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 12,
      },
      android: { elevation: 2 },
    }),
  },
  cardImageWrap: {
    width: 136,
    height: 136,
    marginHorizontal: 12,
    marginTop: 12,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  discountBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.priceOrange,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  discountText: {
    color: Colors.textWhite,
    fontSize: 9,
    fontFamily: Fonts.black,
  },
  cardInfo: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  cardName: {
    fontSize: 11,
    color: Colors.bodyGray,
    lineHeight: 15,
  },
  cardPriceArea: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 4,
    gap: 1,
  },
  originalPrice: {
    fontSize: 12,
    color: Colors.bodyGray,
    textDecorationLine: 'line-through',
    lineHeight: 16,
  },
  salePriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  priceCurrency: {
    fontSize: 12,
    fontFamily: Fonts.numMedium,
    color: Colors.navy,
    lineHeight: 16,
  },
  priceInteger: {
    fontSize: 18,
    fontFamily: Fonts.numBlack,
    color: Colors.navy,
    lineHeight: 28,
  },
  priceDecimal: {
    fontSize: 10,
    fontFamily: Fonts.numMedium,
    color: Colors.navy,
    lineHeight: 15,
  },
});
