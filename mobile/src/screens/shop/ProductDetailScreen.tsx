import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCartStore } from '../../store/cartStore';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/theme';
import type { Product } from '../../types/product';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ProductDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const product: Product = route.params?.product;
  const addItem = useCartStore((s) => s.addItem);
  const totalCount = useCartStore((s) => s.totalCount);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) {
    navigation.goBack();
    return null;
  }

  const handleAddToCart = () => {
    addItem(product);
    Alert.alert('', '已加入购物车');
  };

  const handleBuyNow = () => {
    addItem(product);
    navigation.navigate('Main', { screen: 'Cart' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部返回 */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>商品详情</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 图片轮播 */}
        <View>
          <FlatList
            data={product.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => String(i)}
            onMomentumScrollEnd={(e) => {
              setActiveImageIndex(
                Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH)
              );
            }}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.productImage}
                resizeMode="cover"
              />
            )}
          />
          {product.images.length > 1 && (
            <View style={styles.dots}>
              {product.images.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    i === activeImageIndex && styles.dotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* 价格区 */}
        <View style={styles.priceSection}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>¥{product.price}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>
                ¥{product.originalPrice}
              </Text>
            )}
          </View>
          <View style={styles.profitBadge}>
            <Text style={styles.profitText}>
              分润 {(Number(product.profit_rate) * 100).toFixed(0)}%
            </Text>
          </View>
        </View>

        {/* 商品名 */}
        <View style={styles.nameSection}>
          <Text style={styles.productName} numberOfLines={3}>
            {product.name}
          </Text>
          {product.sales != null && (
            <Text style={styles.sales}>已售 {product.sales} 件</Text>
          )}
        </View>

        {/* 描述 */}
        {product.description && (
          <View style={styles.descSection}>
            <Text style={styles.descTitle}>商品详情</Text>
            <Text style={styles.descText}>{product.description}</Text>
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* 底部操作栏 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.cartIcon}
          onPress={() => navigation.navigate('Main', { screen: 'Cart' })}
        >
          <Text style={{ fontSize: 24 }}>🛒</Text>
          {totalCount() > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.addCartBtn} onPress={handleAddToCart}>
          <Text style={styles.addCartText}>加入购物车</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyBtn} onPress={handleBuyNow}>
          <Text style={styles.buyText}>立即购买</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    width: 50,
  },
  topTitle: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  productImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    backgroundColor: Colors.surfaceSecondary,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: Spacing.md,
    left: 0,
    right: 0,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginHorizontal: 3,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 16,
    borderRadius: 3,
  },
  priceSection: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: FontSize.xxl + 4,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  originalPrice: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
    textDecorationLine: 'line-through',
    marginLeft: Spacing.sm,
  },
  profitBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  profitText: {
    fontSize: FontSize.sm,
    color: Colors.accent,
    fontWeight: 'bold',
  },
  nameSection: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  productName: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    lineHeight: 24,
    marginBottom: Spacing.sm,
  },
  sales: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
  },
  descSection: {
    backgroundColor: Colors.surface,
    marginTop: Spacing.sm,
    padding: Spacing.lg,
  },
  descTitle: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  descText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cartIcon: {
    marginRight: Spacing.lg,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Colors.textWhite,
    fontSize: 10,
    fontWeight: 'bold',
  },
  addCartBtn: {
    flex: 1,
    backgroundColor: Colors.accent,
    height: 44,
    borderTopLeftRadius: BorderRadius.full,
    borderBottomLeftRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCartText: {
    color: Colors.textWhite,
    fontSize: FontSize.md,
    fontWeight: 'bold',
  },
  buyBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    height: 44,
    borderTopRightRadius: BorderRadius.full,
    borderBottomRightRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyText: {
    color: Colors.textWhite,
    fontSize: FontSize.md,
    fontWeight: 'bold',
  },
});
