import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { Colors, Spacing, FontSize, BorderRadius, Fonts } from '../../constants/theme';
import type { ProductTag } from '../../types/product';

interface FavoriteProduct {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  images: string[];
  tags?: ProductTag[];
  categoryName?: string;
  description?: string;
  profit_rate?: string;
  sales?: number;
}

interface FavoriteItem {
  id: number;
  productId: number;
  product?: FavoriteProduct;
}

const TAG_MAP: Record<ProductTag, { label: string; highlight: boolean }> = {
  promotion: { label: '限时优惠', highlight: true },
  new: { label: '新品上市', highlight: true },
  hot: { label: '热销爆款', highlight: true },
  member_exclusive: { label: '会员专属', highlight: true },
};

function getTagInfo(product: FavoriteProduct): { label: string; highlight: boolean } | null {
  if (product.tags && product.tags.length > 0) {
    return TAG_MAP[product.tags[0]] ?? null;
  }
  if (product.categoryName) {
    return { label: product.categoryName, highlight: false };
  }
  return null;
}

export default function FavoritesScreen() {
  const navigation = useNavigation<any>();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    try {
      const { data } = await api.get('/favorites');
      setFavorites(data.data ?? data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useFocusEffect(useCallback(() => { fetchFavorites(); }, [fetchFavorites]));

  const handleRemove = (item: FavoriteItem) => {
    Alert.alert('取消收藏', '确定要取消收藏吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确定',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/favorites/${item.productId}`);
            setFavorites((prev) => prev.filter((f) => f.id !== item.id));
          } catch (err: any) {
            Alert.alert('失败', err.response?.data?.message || '操作失败');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: FavoriteItem }) => {
    const product = item.product;
    if (!product) return null;
    const tagInfo = getTagInfo(product);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ProductDetail', { product })}
        activeOpacity={0.8}
      >
        {/* Product Image */}
        <View style={styles.imageWrap}>
          <Image
            source={{ uri: product.images?.[0] }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Right Content */}
        <View style={styles.cardBody}>
          <View style={styles.cardTop}>
            {tagInfo && (
              <Text style={[styles.tagLabel, tagInfo.highlight && styles.tagLabelHighlight]}>
                {tagInfo.label}
              </Text>
            )}
            <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
          </View>

          <View style={styles.cardBottom}>
            <Text style={styles.price}>
              ¥{Number(product.price).toLocaleString('zh-CN')}
            </Text>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleRemove(item)}
              hitSlop={8}
            >
              <Ionicons name="trash-outline" size={16} color={Colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={Colors.navyButton} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            {/* FAVORITES badge */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>FAVORITES</Text>
            </View>
            {/* Title */}
            <Text style={styles.title}>精选清单</Text>
            {/* Subtitle */}
            <Text style={styles.subtitle}>您珍藏的每一件单品，都代表了对品质生活的独特追求。</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={48} color={Colors.textTertiary} style={{ marginBottom: Spacing.lg }} />
            <Text style={styles.emptyTitle}>还没有收藏</Text>
            <Text style={styles.emptySubtitle}>去逛逛商城，发现心仪商品吧</Text>
            <TouchableOpacity
              style={styles.discoverBtn}
              onPress={() => navigation.navigate('Main', { screen: 'Shop' })}
              activeOpacity={0.85}
            >
              <Text style={styles.discoverBtnText}>去发现更多</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          favorites.length > 0 ? (
            <View style={styles.footer}>
              <Text style={styles.footerText}>没有更多收藏了</Text>
              <TouchableOpacity
                style={styles.discoverBtn}
                onPress={() => navigation.navigate('Main', { screen: 'Shop' })}
                activeOpacity={0.85}
              >
                <Text style={styles.discoverBtnText}>去发现更多</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  listContent: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: 48,
  },

  // Editorial Header
  header: {
    paddingTop: Spacing.xxxl,
    paddingBottom: 40,
    gap: Spacing.sm,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.navyButton,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.md,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontFamily: Fonts.bold,
    color: '#fff',
    letterSpacing: 1,
  },
  title: {
    fontSize: 36,
    fontFamily: Fonts.bold,
    color: '#1a1c1c',
    letterSpacing: -1.8,
    lineHeight: 42,
  },
  subtitle: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
    lineHeight: 22,
    marginTop: Spacing.xs,
  },

  // Product Cards
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    ...Platform.select({
      ios: { shadowColor: '#002C66', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12 },
      android: { elevation: 2 },
    }),
  },
  imageWrap: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.md,
    backgroundColor: '#EEEEEE',
    overflow: 'hidden',
    flexShrink: 0,
  },
  image: {
    width: 96,
    height: 96,
  },
  cardBody: {
    flex: 1,
    paddingVertical: Spacing.xs,
    justifyContent: 'space-between',
    minHeight: 80,
  },
  cardTop: {
    gap: Spacing.xs,
  },
  tagLabel: {
    fontSize: FontSize.xs,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
    lineHeight: 15,
  },
  tagLabelHighlight: {
    color: Colors.priceOrange,
  },
  productName: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.medium,
    color: '#1a1c1c',
    letterSpacing: -0.4,
    lineHeight: 24,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  price: {
    fontSize: FontSize.xl,
    fontFamily: Fonts.numBlack,
    color: '#002C66',
    letterSpacing: -0.9,
    lineHeight: 28,
  },
  deleteBtn: {
    padding: Spacing.sm,
  },

  // Footer
  footer: {
    paddingTop: Spacing.xl,
    paddingBottom: 48,
    alignItems: 'center',
    gap: Spacing.lg,
  },
  footerText: {
    fontSize: FontSize.sm,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
    textAlign: 'center',
  },
  discoverBtn: {
    backgroundColor: '#002C66',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.md,
  },
  discoverBtnText: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: '#fff',
    letterSpacing: 0.35,
    textAlign: 'center',
  },

  // Empty State
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: Colors.textTertiary,
    marginBottom: Spacing.xxl,
  },
});
