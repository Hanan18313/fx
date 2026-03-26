import React, { useState, useRef } from 'react';
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
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCartStore } from '../../store/cartStore';
import {
  Colors,
  Spacing,
  FontSize,
  BorderRadius,
  Fonts,
  Shadow,
} from '../../constants/theme';
import type { Product } from '../../types/product';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_HEIGHT = 358;
const THUMB_SIZE = 80;
const CONTENT_PADDING = Spacing.lg;

export default function ProductDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const product: Product = route.params?.product;
  const addItem = useCartStore((s) => s.addItem);
  const totalCount = useCartStore((s) => s.totalCount);
  const insets = useSafeAreaInsets();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  if (!product) {
    navigation.goBack();
    return null;
  }

  const currentPrice = Number(product.price);
  const originalPrice = product.originalPrice
    ? Number(product.originalPrice)
    : null;
  const savings = originalPrice ? (originalPrice - currentPrice).toFixed(2) : null;
  const profitPercent = (Number(product.profit_rate) * 100).toFixed(0);

  const handleAddToCart = () => {
    addItem(product);
    Alert.alert('', '已加入购物车');
  };

  const handleBuyNow = () => {
    addItem(product);
    navigation.navigate('Main', { screen: 'Cart' });
  };

  const scrollToImage = (index: number) => {
    setActiveImageIndex(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ===== Header ===== */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>商品详情</Text>
        <View style={styles.topBarPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ===== Full-bleed Hero Image ===== */}
        <View style={styles.imageWrapper}>
          <FlatList
            ref={flatListRef}
            data={product.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => String(i)}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(
                e.nativeEvent.contentOffset.x / SCREEN_WIDTH
              );
              setActiveImageIndex(idx);
            }}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.mainImage}
                resizeMode="cover"
              />
            )}
          />
          {/* Dots */}
          {product.images.length > 1 && (
            <View style={styles.dotsRow}>
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

        {/* ===== Padded Content ===== */}
        <View style={styles.paddedContent}>
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <View style={styles.thumbRow}>
              {product.images.slice(0, 4).map((img, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => scrollToImage(i)}
                  style={[
                    styles.thumbWrap,
                    i === activeImageIndex && styles.thumbActive,
                  ]}
                >
                  <Image
                    source={{ uri: img }}
                    style={styles.thumbImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ===== Product Info ===== */}
          <View style={styles.infoSection}>
            {/* Savings Badge */}
            {savings && (
              <View style={styles.savingsBadge}>
                <Text style={styles.savingsBadgeText}>
                  INSTANT SAVINGS 立即节省
                </Text>
              </View>
            )}

            {/* Product Title */}
            <Text style={styles.productName} numberOfLines={4}>
              {product.name}
            </Text>

            {/* Price Card */}
            <View style={styles.priceCard}>
              <View style={styles.priceRow}>
                <Text style={styles.currentPrice}>
                  ¥{currentPrice.toFixed(2)}
                </Text>
                {originalPrice && (
                  <Text style={styles.originalPrice}>
                    ¥{originalPrice.toFixed(2)}
                  </Text>
                )}
                {savings && (
                  <View style={styles.savingsAmountBadge}>
                    <Text style={styles.savingsAmountText}>
                      省 ¥{savings}
                    </Text>
                  </View>
                )}
              </View>
              {product.description && (
                <Text style={styles.descText}>{product.description}</Text>
              )}
            </View>

            {/* Reviews Row */}
            <View style={styles.reviewCard}>
              <View style={styles.reviewLeft}>
                <View style={styles.ratingWrap}>
                  <Ionicons name="star" size={14} color="#F5A623" />
                  <Text style={styles.ratingText}>4.8</Text>
                </View>
                <View style={styles.reviewDivider} />
                <Text style={styles.reviewCount}>
                  {product.sales ? `${product.sales}+` : '1.2k+'} 条真实评价
                </Text>
              </View>
              <TouchableOpacity style={styles.reviewLink}>
                <Text style={styles.reviewLinkText}>查看评价</Text>
                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color={Colors.navyButton}
                />
              </TouchableOpacity>
            </View>

            {/* Shipping Cards */}
            <View style={styles.shippingRow}>
              <View style={[styles.shippingCard, styles.shippingCardLeft]}>
                <View style={styles.shippingHeader}>
                  <Ionicons
                    name="flash"
                    size={16}
                    color={Colors.navyButton}
                  />
                  <Text style={styles.shippingTitle}>极速送达</Text>
                </View>
                <Text style={styles.shippingDesc}>预计 24 小时内送达</Text>
              </View>
              <View style={styles.shippingCard}>
                <View style={styles.shippingHeader}>
                  <Ionicons
                    name="storefront-outline"
                    size={16}
                    color={Colors.textPrimary}
                  />
                  <Text style={[styles.shippingTitle, { color: Colors.textPrimary }]}>
                    门店自提
                  </Text>
                </View>
                <Text style={styles.shippingDesc}>2小时内备货完成</Text>
              </View>
            </View>

            {/* Member Exclusive */}
            <TouchableOpacity style={styles.memberCard} activeOpacity={0.7}>
              <View style={styles.memberLeft}>
                <View style={styles.memberIcon}>
                  <Ionicons name="shield-checkmark" size={20} color="#FFF" />
                </View>
                <View style={styles.memberTextWrap}>
                  <Text style={styles.memberTitle}>
                    会员精选 Member Choice
                  </Text>
                  <Text style={styles.memberDesc}>
                    此订单可获得 {profitPercent}% 现金返利
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={14}
                color={Colors.navyButton}
              />
            </TouchableOpacity>
          </View>

          {/* ===== Product Features (Bento Grid) ===== */}
          <View style={styles.bentoSection}>
          {/* Features Card */}
          <View style={styles.featuresCard}>
            <Text style={styles.featuresTitle}>产品特色</Text>
            <View style={styles.featureItem}>
              <View style={styles.featureIconWrap}>
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={18}
                  color={Colors.navyButton}
                />
              </View>
              <Text style={styles.featureItemTitle}>100% 有机认证</Text>
              <Text style={styles.featureItemDesc}>
                严选全球优质产区，通过多重国际有机标准认证，确保食材纯天然无添加。
              </Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIconWrap}>
                <MaterialCommunityIcons
                  name="shield-search"
                  size={18}
                  color={Colors.navyButton}
                />
              </View>
              <Text style={styles.featureItemTitle}>专业品质监控</Text>
              <Text style={styles.featureItemDesc}>
                每一份包裹都经过严格的入库检测，从源头到餐桌，守护您的家庭健康。
              </Text>
            </View>
          </View>

          {/* Member CTA Card */}
          <View style={styles.memberCtaCard}>
            <View style={styles.memberCtaContent}>
              <Text style={styles.memberCtaTitle}>
                加入会员{'\n'}悦享生活
              </Text>
              <Text style={styles.memberCtaDesc}>
                解锁更多专属优惠与高品质生活方式。
              </Text>
              <TouchableOpacity style={styles.memberCtaBtn} activeOpacity={0.8}>
                <Text style={styles.memberCtaBtnText}>立即开通会员</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.memberCtaDecor}>
              <MaterialCommunityIcons
                name="diamond-stone"
                size={80}
                color="rgba(255,255,255,0.08)"
              />
            </View>
          </View>
          </View>{/* end bentoSection */}

          <View style={{ height: 100 }} />
        </View>{/* end paddedContent */}
      </ScrollView>

      {/* ===== Bottom Action Bar ===== */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Platform.OS === 'ios' ? insets.bottom || Spacing.lg : Spacing.sm },
        ]}
      >
        <TouchableOpacity
          style={styles.bottomCartIcon}
          onPress={() => navigation.navigate('Main', { screen: 'Cart' })}
        >
          <Ionicons name="cart-outline" size={24} color={Colors.textPrimary} />
          {totalCount() > 0 && (
            <View style={styles.bottomBadge}>
              <Text style={styles.bottomBadgeText}>{totalCount()}</Text>
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

  /* Header — matches OrderListScreen style */
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    paddingHorizontal: CONTENT_PADDING + 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    fontSize: FontSize.xl,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
  },
  topBarPlaceholder: {
    width: 34,
  },

  /* Scroll */
  scrollContent: {
    paddingTop: 0,
  },

  /* Full-bleed image wrapper */
  imageWrapper: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
    backgroundColor: Colors.surfaceSecondary,
  },

  /* Main Image */
  mainImage: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
  },

  /* Padded content area below image */
  paddedContent: {
    paddingHorizontal: CONTENT_PADDING,
    paddingTop: Spacing.lg,
    gap: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: Spacing.xxl,
    left: 0,
    right: 0,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C3C6D3',
  },
  dotActive: {
    backgroundColor: Colors.navyButton,
  },

  /* Thumbnails */
  thumbRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  thumbWrap: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: '#EEE',
  },
  thumbActive: {
    borderWidth: 2,
    borderColor: Colors.navyButton,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },

  /* Info Section */
  infoSection: {
    gap: 24,
  },

  /* Savings Badge */
  savingsBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#792C00',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  savingsBadgeText: {
    fontSize: FontSize.sm,
    fontFamily: Fonts.numBold,
    color: Colors.priceOrange,
    letterSpacing: 0.6,
  },

  /* Product Name */
  productName: {
    fontSize: 30,
    fontFamily: Fonts.black,
    color: Colors.textPrimary,
    lineHeight: 38,
    letterSpacing: -0.75,
  },

  /* Price Card */
  priceCard: {
    backgroundColor: '#F3F3F3',
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    gap: 15,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  currentPrice: {
    fontSize: 36,
    fontFamily: Fonts.numBlack,
    color: Colors.navyButton,
    letterSpacing: -1.8,
    lineHeight: 40,
  },
  originalPrice: {
    fontSize: FontSize.md,
    fontFamily: Fonts.numRegular,
    color: Colors.bodyGray,
    textDecorationLine: 'line-through',
    lineHeight: 20,
  },
  savingsAmountBadge: {
    backgroundColor: '#FFDBCD',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.md,
  },
  savingsAmountText: {
    fontSize: FontSize.md,
    fontFamily: Fonts.numBold,
    color: '#7C2E02',
    lineHeight: 20,
  },
  descText: {
    fontSize: FontSize.md,
    color: Colors.bodyGray,
    lineHeight: 23,
    fontFamily: Fonts.regular,
  },

  /* Review Card */
  reviewCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(195,198,211,0.3)',
    borderRadius: BorderRadius.lg,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  ratingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ratingText: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.numBold,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  reviewDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#C3C6D3',
  },
  reviewCount: {
    fontSize: FontSize.md,
    fontFamily: Fonts.regular,
    color: Colors.bodyGray,
    lineHeight: 20,
  },
  reviewLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  reviewLinkText: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: Colors.navyButton,
    lineHeight: 20,
  },

  /* Shipping */
  shippingRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  shippingCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadow.sm,
  },
  shippingCardLeft: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.navyButton,
    paddingLeft: 20,
  },
  shippingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  shippingTitle: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: Colors.navyButton,
    lineHeight: 20,
  },
  shippingDesc: {
    fontSize: FontSize.sm,
    fontFamily: Fonts.regular,
    color: Colors.bodyGray,
    lineHeight: 16,
  },

  /* Member Card */
  memberCard: {
    backgroundColor: 'rgba(0,65,145,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0,65,145,0.1)',
    borderRadius: BorderRadius.xl,
    padding: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    flex: 1,
  },
  memberIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.navyButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberTextWrap: {
    flex: 1,
  },
  memberTitle: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.bold,
    color: Colors.navyButton,
    lineHeight: 24,
  },
  memberDesc: {
    fontSize: FontSize.sm,
    fontFamily: Fonts.regular,
    color: Colors.bodyGray,
    lineHeight: 16,
  },

  /* Bento Section */
  bentoSection: {
    paddingVertical: 48,
    gap: 24,
  },

  /* Features Card */
  featuresCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: Spacing.xxxl,
    gap: 24,
  },
  featuresTitle: {
    fontSize: 24,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    lineHeight: 32,
  },
  featureItem: {
    gap: Spacing.md,
  },
  featureIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#C8D7FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureItemTitle: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  featureItemDesc: {
    fontSize: FontSize.md,
    fontFamily: Fonts.regular,
    color: Colors.bodyGray,
    lineHeight: 20,
  },

  /* Member CTA */
  memberCtaCard: {
    backgroundColor: Colors.navy,
    borderRadius: 24,
    padding: Spacing.xxxl,
    overflow: 'hidden',
    minHeight: 236,
    justifyContent: 'center',
  },
  memberCtaContent: {
    gap: Spacing.lg,
    zIndex: 1,
  },
  memberCtaTitle: {
    fontSize: 24,
    fontFamily: Fonts.medium,
    color: Colors.textWhite,
    lineHeight: 30,
  },
  memberCtaDesc: {
    fontSize: FontSize.md,
    fontFamily: Fonts.regular,
    color: '#AEC6FF',
    lineHeight: 20,
  },
  memberCtaBtn: {
    backgroundColor: Colors.surface,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.lg,
  },
  memberCtaBtnText: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: Colors.navy,
    lineHeight: 20,
    textAlign: 'center',
  },
  memberCtaDecor: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    opacity: 1,
  },

  /* Bottom Bar */
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: CONTENT_PADDING,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  bottomCartIcon: {
    marginRight: Spacing.lg,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBadge: {
    position: 'absolute',
    top: 0,
    right: -4,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  bottomBadgeText: {
    color: Colors.textWhite,
    fontSize: 10,
    fontFamily: Fonts.numBold,
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
    fontFamily: Fonts.bold,
  },
  buyBtn: {
    flex: 1,
    backgroundColor: Colors.navyButton,
    height: 44,
    borderTopRightRadius: BorderRadius.full,
    borderBottomRightRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyText: {
    color: Colors.textWhite,
    fontSize: FontSize.md,
    fontFamily: Fonts.bold,
  },
});
