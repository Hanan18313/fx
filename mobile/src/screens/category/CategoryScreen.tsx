import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../../services/api';
import { useCartStore } from '../../store/cartStore';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/theme';
import { mockCategories, mockProducts } from '../../constants/mockData';
import SectionHeader from '../../components/shop/SectionHeader';
import ProductCard from '../../components/shop/ProductCard';
import type { Category } from '../../types/category';
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
    if (activeCategoryId) {
      loadProducts(activeCategoryId);
    }
  }, [activeCategoryId]);

  const loadCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      const list: Category[] = data.data ?? data;
      setCategories(list);
      if (list.length > 0 && !activeCategoryId) {
        setActiveCategoryId(list[0].id);
      }
    } catch {
      setCategories(mockCategories);
      if (mockCategories.length > 0 && !activeCategoryId) {
        setActiveCategoryId(mockCategories[0].id);
      }
    }
  };

  const loadProducts = async (categoryId: number) => {
    try {
      const { data } = await api.get('/products', { params: { categoryId } });
      setProducts(data.data ?? data);
    } catch {
      const idx = categories.findIndex((c) => c.id === categoryId);
      setProducts(
        mockProducts.filter(
          (_, i) => i % Math.max(categories.length, 1) === Math.max(idx, 0),
        ),
      );
    }
  };

  const activeCategory = categories.find((c) => c.id === activeCategoryId);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    Alert.alert('', '已加入购物车');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>商品分类</Text>
      </View>
      <View style={styles.body}>
        {/* 左栏 */}
        <FlatList
          style={styles.leftPanel}
          data={categories}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryItem,
                activeCategoryId === item.id && styles.categoryItemActive,
              ]}
              onPress={() => setActiveCategoryId(item.id)}
            >
              {activeCategoryId === item.id && (
                <View style={styles.activeIndicator} />
              )}
              <Text
                style={[
                  styles.categoryText,
                  activeCategoryId === item.id && styles.categoryTextActive,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* 右栏 */}
        <ScrollView
          style={styles.rightPanel}
          showsVerticalScrollIndicator={false}
        >
          {activeCategory?.children && activeCategory.children.length > 0 && (
            <View style={styles.subGrid}>
              {activeCategory.children.map((sub) => (
                <TouchableOpacity key={sub.id} style={styles.subItem}>
                  <View style={styles.subIconCircle}>
                    <Text style={styles.subIcon}>{sub.icon || '📦'}</Text>
                  </View>
                  <Text style={styles.subName}>{sub.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <SectionHeader title="热门商品" />
          <View style={styles.productGrid}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() =>
                  navigation.navigate('ProductDetail', { product })
                }
                onAddToCart={handleAddToCart}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  body: { display: 'flex', flexDirection: 'row', flex: 1 },
  leftPanel: { backgroundColor: Colors.surfaceSecondary, width: '10%' },
  categoryItem: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    position: 'relative',
  },
  categoryItemActive: { backgroundColor: Colors.surface },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: Spacing.sm,
    bottom: Spacing.sm,
    width: 3,
    backgroundColor: Colors.primary,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  categoryText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  categoryTextActive: { color: Colors.primary, fontWeight: 'bold' },
  rightPanel: {
    backgroundColor: Colors.surface,
    flex: 1,
    paddingTop: Spacing.sm,
  },
  subGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: Spacing.md },
  subItem: { width: '33.33%', alignItems: 'center', marginBottom: Spacing.lg },
  subIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  subIcon: { fontSize: 26 },
  subName: { fontSize: FontSize.xs, color: Colors.textPrimary },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.sm,
    justifyContent: 'space-between',
  },
});
