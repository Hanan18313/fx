import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { useCartStore } from '../../store/cartStore';
import { Colors, Spacing, FontSize, Fonts } from '../../constants/theme';
import { mockCategories, mockProducts } from '../../constants/mockData';
import type { Category, SubCategory } from '../../types/category';
import type { Product } from '../../types/product';

export default function CategoryScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const addItem = useCartStore((s) => s.addItem);

  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (route.params?.categoryId && categories.length > 0) {
      setActiveCategoryId(route.params.categoryId);
    }
  }, [route.params?.categoryId, categories]);

  useEffect(() => {
    if (activeCategoryId) loadProducts(activeCategoryId);
  }, [activeCategoryId]);

  const loadCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      const list: Category[] = data.data ?? data;
      setCategories(list);
      if (list.length > 0 && !activeCategoryId) setActiveCategoryId(list[0].id);
    } catch {
      setCategories(mockCategories);
      if (mockCategories.length > 0 && !activeCategoryId) setActiveCategoryId(mockCategories[0].id);
    }
  };

  const loadProducts = async (categoryId: number) => {
    try {
      const { data } = await api.get('/products', { params: { categoryId } });
      setProducts(data.data ?? data);
    } catch {
      const idx = categories.findIndex((c) => c.id === categoryId);
      setProducts(
        mockProducts.filter((_, i) => i % Math.max(categories.length, 1) === Math.max(idx, 0)),
      );
    }
  };

  const activeCategory = categories.find((c) => c.id === activeCategoryId);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    Alert.alert('', '已加入购物车');
  };

  const featuredChildren = activeCategory?.children?.filter((c) => c.imageUrl) ?? [];
  const featured = featuredChildren[0];
  const secondaryCards = featuredChildren.slice(1, 3);
  const gridChildren = activeCategory?.children?.filter((c) => !c.imageUrl) ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Body */}
      <View style={styles.body}>
        {/* Left sidebar */}
        <ScrollView style={styles.sidebar} showsVerticalScrollIndicator={false}>
          {categories.map((item) => {
            const isActive = activeCategoryId === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.sideItem, isActive && styles.sideItemActive]}
                onPress={() => setActiveCategoryId(item.id)}
                activeOpacity={0.7}
              >
                {isActive && <View style={styles.sideIndicator} />}
                <Ionicons
                  name={(item.iconName ?? 'ellipsis-horizontal-outline') as any}
                  size={20}
                  color={isActive ? Colors.navyButton : Colors.bodyGray}
                />
                <Text style={[styles.sideText, isActive && styles.sideTextActive]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Right content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Search bar */}
          <TouchableOpacity style={styles.searchBar} activeOpacity={0.7}>
            <Ionicons name="search-outline" size={18} color={Colors.bodyGray} />
            <Text style={styles.searchPlaceholder}>
              搜索{activeCategory?.name ?? '分类'}...
            </Text>
          </TouchableOpacity>

          {/* Category title */}
          <View style={styles.catHeader}>
            <Text style={styles.catTitle}>{activeCategory?.name}</Text>
            <Text style={styles.catDesc}>{activeCategory?.description}</Text>
          </View>

          {/* Bento Grid */}
          {featuredChildren.length > 0 && (
            <View style={styles.bentoGrid}>
              {featured && (
                <TouchableOpacity style={styles.bentoFeatured} activeOpacity={0.85}>
                  <View style={styles.bentoFeaturedLeft}>
                    <Text style={styles.bentoFeaturedTitle}>{featured.name}</Text>
                    {featured.description && (
                      <Text style={styles.bentoFeaturedDesc}>{featured.description}</Text>
                    )}
                    <View style={styles.bentoBtnWrap}>
                      <Text style={styles.bentoBtnText}>全部{'\n'}购买</Text>
                    </View>
                  </View>
                  <Image
                    source={{ uri: featured.imageUrl }}
                    style={styles.bentoFeaturedImg}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}

              {secondaryCards.length > 0 && (
                <View style={styles.bentoRow}>
                  {secondaryCards.map((sub) => (
                    <TouchableOpacity key={sub.id} style={styles.bentoCard} activeOpacity={0.85}>
                      <Image
                        source={{ uri: sub.imageUrl }}
                        style={styles.bentoCardImg}
                        resizeMode="contain"
                      />
                      <Text style={styles.bentoCardTitle}>{sub.name}</Text>
                      {sub.productCount && (
                        <Text style={styles.bentoCardCount}>{sub.productCount}件商品</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Popular Items */}
          {products.length > 0 && (
            <View style={styles.popularSection}>
              <View style={styles.popularHeader}>
                <Text style={styles.popularTitle}>会员最爱</Text>
                <TouchableOpacity>
                  <Text style={styles.popularMore}>查看更多</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={products.slice(0, 6)}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.popularList}
                renderItem={({ item }) => (
                  <PopularProductCard
                    product={item}
                    onPress={() => navigation.navigate('ProductDetail', { product: item })}
                    onAddToCart={() => handleAddToCart(item)}
                  />
                )}
              />
            </View>
          )}

          {/* Sub-category icon grid */}
          {gridChildren.length > 0 && (
            <View style={styles.subGridSection}>
              <Text style={styles.subGridTitle}>更多分类</Text>
              <View style={styles.subGrid}>
                {gridChildren.map((sub) => (
                  <TouchableOpacity key={sub.id} style={styles.subGridItem} activeOpacity={0.7}>
                    <Ionicons
                      name={(sub.iconName ?? 'ellipsis-horizontal-outline') as any}
                      size={24}
                      color={Colors.textPrimary}
                    />
                    <Text style={styles.subGridLabel}>{sub.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function PopularProductCard({
  product,
  onPress,
  onAddToCart,
}: {
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
}) {
  return (
    <TouchableOpacity style={pStyles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={pStyles.imgWrap}>
        <Image source={{ uri: product.images[0] }} style={pStyles.img} resizeMode="cover" />
        {product.tags?.[0] && (
          <View style={pStyles.badge}>
            <Text style={pStyles.badgeText}>
              {product.tags[0] === 'member_exclusive' ? '会员' : '超值省'}
            </Text>
          </View>
        )}
      </View>
      <Text style={pStyles.name} numberOfLines={2}>{product.name}</Text>
      <View style={pStyles.ratingRow}>
        <Ionicons name="star" size={10} color="#F5A623" />
        <Text style={pStyles.rating}>4.8</Text>
      </View>
      <View style={pStyles.priceRow}>
        <Text style={pStyles.price}>¥{product.price}</Text>
        <TouchableOpacity
          style={pStyles.addBtn}
          onPress={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
        >
          <Ionicons name="add" size={16} color={Colors.textWhite} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const pStyles = StyleSheet.create({
  card: {
    width: 140,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 10,
    marginRight: 12,
    ...Platform.select({
      ios: { shadowColor: 'rgba(0,0,0,0.06)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  imgWrap: {
    width: '100%',
    height: 110,
    marginBottom: 6,
  },
  img: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.priceOrange,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeText: {
    color: Colors.textWhite,
    fontSize: 9,
    fontFamily: Fonts.medium,
  },
  name: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 15,
    fontFamily: Fonts.bold,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  rating: {
    fontSize: 10,
    color: Colors.textPrimary,
    fontFamily: Fonts.numMedium,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 14,
    fontFamily: Fonts.numBlack,
    color: Colors.textPrimary,
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: Colors.navyButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 88,
    backgroundColor: '#EEEEEE',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: 'rgba(195,198,211,0.25)',
    flexGrow: 0,
    flexShrink: 0,
  },
  sideItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 8,
    gap: 6,
    position: 'relative' as const,
  },
  sideItemActive: {
    backgroundColor: '#FFFFFF',
  },
  sideIndicator: {
    position: 'absolute',
    left: 0,
    top: 16,
    bottom: 16,
    width: 4,
    backgroundColor: Colors.navyButton,
    borderTopRightRadius: 999,
    borderBottomRightRadius: 999,
  },
  sideIcon: {},
  sideText: {
    fontSize: 11,
    color: Colors.bodyGray,
    textAlign: 'center',
    lineHeight: 14,
  },
  sideTextActive: {
    color: Colors.navyButton,
    fontFamily: Fonts.semibold,
  },
  content: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    marginBottom: 20,
  },
  searchPlaceholder: {
    fontSize: 13,
    color: Colors.bodyGray,
  },
  catHeader: {
    gap: 4,
    marginBottom: 20,
  },
  catTitle: {
    fontSize: 24,
    fontFamily: Fonts.semibold,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  catDesc: {
    fontSize: 13,
    color: Colors.bodyGray,
    lineHeight: 18,
  },
  bentoGrid: {
    gap: 12,
    marginBottom: 28,
  },
  bentoFeatured: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    minHeight: 160,
    overflow: 'hidden',
  },
  bentoFeaturedLeft: {
    flex: 1,
    gap: 4,
    marginRight: 12,
  },
  bentoFeaturedTitle: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  bentoFeaturedDesc: {
    fontSize: 11,
    color: Colors.bodyGray,
    lineHeight: 15,
    marginBottom: 10,
  },
  bentoBtnWrap: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.navyButton,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  bentoBtnText: {
    fontSize: 10,
    color: Colors.textWhite,
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 14,
    fontFamily: Fonts.medium,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bentoCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  bentoCardImg: {
    width: '80%',
    height: 80,
    marginBottom: 8,
  },
  bentoCardTitle: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    lineHeight: 18,
    textAlign: 'center',
  },
  bentoCardCount: {
    fontSize: 10,
    color: Colors.bodyGray,
    lineHeight: 14,
  },
  bentoFeaturedImg: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  popularSection: {
    marginBottom: 28,
    gap: 12,
  },
  popularHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  popularTitle: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  popularMore: {
    fontSize: 12,
    color: Colors.navyButton,
    lineHeight: 16,
  },
  popularList: {
    paddingRight: 16,
  },
  subGridSection: {
    marginBottom: 28,
    gap: 12,
  },
  subGridTitle: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  subGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  subGridItem: {
    width: '46%',
    backgroundColor: '#F3F3F3',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  subGridLabel: {
    fontSize: 11,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
});
