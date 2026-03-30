import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { useCartStore } from '../../store/cartStore';
import { Colors, Spacing, FontSize, BorderRadius, Shadow, Fonts } from '../../constants/theme';
import ProductCard from '../../components/shop/ProductCard';
import EmptyState from '../../components/common/EmptyState';
import type { Product } from '../../types/product';

const HISTORY_KEY = 'search_history';
const MAX_HISTORY = 20;
const SORT_OPTIONS = [
  { key: '', label: '综合' },
  { key: 'sales', label: '销量' },
  { key: 'price_asc', label: '价格↑' },
  { key: 'price_desc', label: '价格↓' },
];

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const inputRef = useRef<TextInput>(null);

  const [keyword, setKeyword] = useState(route.params?.keyword ?? '');
  const [history, setHistory] = useState<string[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    loadHistory();
    if (route.params?.keyword) {
      doSearch(route.params.keyword);
    } else {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, []);

  const loadHistory = async () => {
    try {
      const json = await AsyncStorage.getItem(HISTORY_KEY);
      if (json) setHistory(JSON.parse(json));
    } catch {}
  };

  const saveHistory = async (kw: string) => {
    const updated = [kw, ...history.filter((h) => h !== kw)].slice(0, MAX_HISTORY);
    setHistory(updated);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  };

  const clearHistory = () => {
    Alert.alert('提示', '确认清除搜索历史？', [
      { text: '取消' },
      { text: '确认', onPress: async () => {
        setHistory([]);
        await AsyncStorage.removeItem(HISTORY_KEY);
      }},
    ]);
  };

  const doSearch = useCallback(async (kw?: string, sortKey?: string, p = 1) => {
    const q = kw ?? keyword;
    if (!q.trim()) return;
    saveHistory(q.trim());
    setSearched(true);
    setLoading(true);

    try {
      const params: Record<string, any> = {
        keyword: q.trim(),
        page: p,
        limit: 20,
      };
      const s = sortKey ?? sort;
      if (s === 'sales') params.sort = 'sales';
      if (s === 'price_asc') { params.sort = 'price'; params.order = 'ASC'; }
      if (s === 'price_desc') { params.sort = 'price'; params.order = 'DESC'; }

      const res = await api.get('/products', { params });
      const list: Product[] = res.data?.data ?? res.data ?? [];
      if (p === 1) {
        setResults(list);
      } else {
        setResults((prev) => [...prev, ...list]);
      }
      setHasMore(list.length >= 20);
      setPage(p);
    } catch {
      if (p === 1) setResults([]);
    } finally {
      setLoading(false);
    }
  }, [keyword, sort, history]);

  const handleSortChange = (key: string) => {
    setSort(key);
    doSearch(keyword, key, 1);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) doSearch(keyword, sort, page + 1);
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
    Alert.alert('', '已加入购物车');
  };

  const renderSearchPanel = () => (
    <View style={styles.panel}>
      {history.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>搜索历史</Text>
            <TouchableOpacity onPress={clearHistory}>
              <Text style={styles.clearText}>清除</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tagWrap}>
            {history.map((h) => (
              <TouchableOpacity
                key={h}
                style={styles.tag}
                onPress={() => { setKeyword(h); doSearch(h); }}
              >
                <Text style={styles.tagText}>{h}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  const renderSortBar = () => (
    <View style={styles.sortBar}>
      {SORT_OPTIONS.map((opt) => (
        <TouchableOpacity
          key={opt.key}
          style={[styles.sortItem, sort === opt.key && styles.sortItemActive]}
          onPress={() => handleSortChange(opt.key)}
        >
          <Text style={[styles.sortText, sort === opt.key && styles.sortTextActive]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={Colors.navyButton} />
        </TouchableOpacity>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="搜索商品..."
            placeholderTextColor={Colors.textTertiary}
            value={keyword}
            onChangeText={setKeyword}
            onSubmitEditing={() => doSearch()}
            returnKeyType="search"
          />
          {keyword.length > 0 && (
            <TouchableOpacity onPress={() => setKeyword('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => doSearch()}>
          <Text style={styles.searchBtn}>搜索</Text>
        </TouchableOpacity>
      </View>

      {!searched ? (
        renderSearchPanel()
      ) : (
        <>
          {renderSortBar()}
          <FlatList
            data={results}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={() => handleProductPress(item)}
                onAddToCart={handleAddToCart}
              />
            )}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            ListEmptyComponent={
              loading ? (
                <ActivityIndicator style={{ marginTop: 60 }} size="large" color={Colors.primary} />
              ) : (
                <EmptyState icon="🔍" message="没有找到相关商品" />
              )
            }
            ListFooterComponent={
              results.length > 0 && loading ? (
                <ActivityIndicator style={{ paddingVertical: 20 }} color={Colors.primary} />
              ) : results.length > 0 && !hasMore ? (
                <Text style={styles.noMore}>— 没有更多了 —</Text>
              ) : null
            }
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    height: 38,
  },
  searchIcon: { fontSize: FontSize.md, marginRight: Spacing.xs },
  input: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary, padding: 0 },
  clearIcon: { fontSize: FontSize.sm, color: Colors.textTertiary, paddingLeft: Spacing.sm },
  searchBtn: { fontSize: FontSize.md, color: Colors.primary, fontFamily: Fonts.semibold, paddingLeft: Spacing.md },
  panel: { flex: 1, padding: Spacing.lg },
  section: { marginBottom: Spacing.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSize.lg, fontFamily: Fonts.bold, color: Colors.textPrimary },
  clearText: { fontSize: FontSize.sm, color: Colors.textTertiary },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  tagText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  sortBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sortItem: { flex: 1, alignItems: 'center', paddingVertical: Spacing.xs },
  sortItemActive: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  sortText: { fontSize: FontSize.md, color: Colors.textSecondary },
  sortTextActive: { color: Colors.primary, fontFamily: Fonts.bold },
  row: { paddingHorizontal: Spacing.lg, justifyContent: 'space-between' },
  listContent: { paddingBottom: Spacing.lg, paddingTop: Spacing.sm },
  noMore: { textAlign: 'center', color: Colors.textTertiary, fontSize: FontSize.sm, paddingVertical: 20 },
});
