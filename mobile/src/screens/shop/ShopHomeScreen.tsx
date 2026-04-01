import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import { useCartStore } from '../../store/cartStore';
import { Colors, Spacing, FontSize } from '../../constants/theme';
import {
  mockBanners,
  mockQuickCategories,
  mockProducts,
} from '../../constants/mockData';
import SearchBar from '../../components/common/SearchBar';
import BannerCarousel from '../../components/shop/BannerCarousel';
import QuickCategoryGrid from '../../components/shop/QuickCategoryGrid';
import SectionHeader from '../../components/shop/SectionHeader';
import FlashSalesSection from '../../components/shop/FlashSalesSection';
import LargeRecommendCard from '../../components/shop/LargeRecommendCard';
import type { Product } from '../../types/product';
import type { Banner } from '../../types/banner';
import type { QuickCategory } from '../../types/category';
import type { FlashSaleProduct } from '../../constants/mockData';

export default function ShopHomeScreen() {
  const navigation = useNavigation<any>();
  const addItem = useCartStore((s) => s.addItem);

  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>(mockBanners);
  const [quickCategories, setQuickCategories] = useState<QuickCategory[]>(mockQuickCategories);
  const [flashSaleProducts, setFlashSaleProducts] = useState<FlashSaleProduct[]>([]);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = useCallback(
    async (p: number, replace: boolean) => {
      if (loading) return;
      setLoading(true);
      try {
        const { data } = await api.get('/products', {
          params: { keyword, page: p, pageSize: 10 },
        });
        const list: Product[] = data.data ?? data;
        if (replace) {
          setProducts(list);
        } else {
          setProducts((prev) => [...prev, ...list]);
        }
        setHasMore(Array.isArray(list) && list.length >= 10);
        setPage(p);
      } catch {
        if (p === 1) {
          setProducts(mockProducts);
          setHasMore(false);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [keyword, loading],
  );

  useEffect(() => {
    fetchProducts(1, true);
    fetchBanners();
    fetchQuickCategories();
    fetchFlashSale();
  }, []);

  const fetchFlashSale = async () => {
    try {
      const { data } = await api.get('/products/flash-sale');
      const list = data.data ?? data;
      if (Array.isArray(list) && list.length > 0) {
        setFlashSaleProducts(list.map((p: any) => ({
          id: p.id,
          name: p.name,
          imageUrl: Array.isArray(p.images) ? p.images[0] : '',
          originalPrice: String(p.originalPrice ?? p.price),
          salePrice: String(p.flashPrice ?? p.price),
          discount: p.flashPrice && p.price
            ? `${Math.round((1 - p.flashPrice / p.price) * 10)}折`
            : '',
        })));
      }
    } catch {
      /* keep empty */
    }
  };

  const fetchBanners = async () => {
    try {
      const { data } = await api.get('/banners');
      const list = data.data ?? data;
      if (Array.isArray(list) && list.length > 0) setBanners(list);
    } catch {
      /* keep mock */
    }
  };

  const fetchQuickCategories = async () => {
    try {
      const { data } = await api.get('/categories/quick');
      const list = data.data ?? data;
      if (Array.isArray(list) && list.length > 0) setQuickCategories(list);
    } catch {
      /* keep mock */
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchProducts(page + 1, false);
    }
  };

  const handleSearch = () => {
    if (keyword.trim()) {
      navigation.navigate('Search', { keyword: keyword.trim() });
    } else {
      navigation.navigate('Search');
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
    Alert.alert('', '已加入购物车');
  };

  const handleCategoryPress = (cat: QuickCategory) => {
    navigation.navigate('Category', { categoryId: cat.id });
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const ListHeader = () => (
    <>
      <BannerCarousel banners={banners} />

      <QuickCategoryGrid categories={quickCategories} onPress={handleCategoryPress} />

      <FlashSalesSection products={flashSaleProducts} />

      <SectionHeader title="为您推荐" variant="large" />
    </>
  );

  const ListFooter = () => {
    if (loading && products.length > 0) {
      return (
        <ActivityIndicator
          style={{ paddingVertical: 20 }}
          color={Colors.navyButton}
        />
      );
    }
    if (!hasMore && products.length > 0) {
      return <Text style={styles.noMore}>— 没有更多了 —</Text>;
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SearchBar
        value={keyword}
        onChangeText={setKeyword}
        onSubmit={handleSearch}
      />
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <LargeRecommendCard
              product={item}
              onPress={() => handleProductPress(item)}
              onAddToCart={handleAddToCart}
            />
          </View>
        )}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: Spacing.lg,
  },
  cardWrapper: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xxl,
  },
  noMore: {
    textAlign: 'center',
    color: Colors.textTertiary,
    fontSize: FontSize.sm,
    paddingVertical: 20,
  },
});
