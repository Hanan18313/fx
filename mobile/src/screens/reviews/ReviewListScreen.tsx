import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRoute, RouteProp } from '@react-navigation/native';

type RouteParams = { ReviewList: { productId?: number } };
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { Colors, Spacing, FontSize, BorderRadius, Fonts, Shadow } from '../../constants/theme';

interface Review {
  id: number;
  productId: number;
  productName: string;
  rating: number;
  content: string;
  images?: string[];
  hasFollowup?: boolean;
  createdAt: string;
}

interface ReviewStats {
  avgRating: number;
  total: number;
  withImage: number;
  positive: number;
  withFollowup: number;
}

type FilterKey = 'all' | 'with_image' | 'positive' | 'with_followup';

const FILTERS: { key: FilterKey; label: (s: ReviewStats) => string }[] = [
  { key: 'all', label: (s) => `全部评价 (${s.total})` },
  { key: 'with_image', label: (s) => `带图评价 (${s.withImage})` },
  { key: 'positive', label: (s) => `好评 (${s.positive})` },
  { key: 'with_followup', label: (s) => `有追评 (${s.withFollowup})` },
];

const STAR_COLOR = '#F5A623';
const PAGE_SIZE = 20;

function Stars({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <View style={starStyles.row}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Ionicons
          key={n}
          name={n <= Math.round(rating) ? 'star' : 'star-outline'}
          size={size}
          color={n <= Math.round(rating) ? STAR_COLOR : '#C3C6D3'}
        />
      ))}
    </View>
  );
}

const starStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 2 },
});

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function ReviewListScreen() {
  const route = useRoute<RouteProp<RouteParams, 'ReviewList'>>();
  const productId = route.params?.productId;

  const [stats, setStats] = useState<ReviewStats>({
    avgRating: 0, total: 0, withImage: 0, positive: 0, withFollowup: 0,
  });
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadingMore = useRef(false);

  const fetchStats = useCallback(async () => {
    try {
      const params = productId ? { productId } : {};
      const { data } = await api.get('/reviews/stats', { params });
      setStats(data);
    } catch { /* ignore */ }
  }, [productId]);

  const fetchReviews = useCallback(async (p: number, replace: boolean, filter: FilterKey) => {
    if (p > 1 && loadingMore.current) return;
    if (p > 1) loadingMore.current = true;
    try {
      const params: Record<string, unknown> = { page: p, limit: PAGE_SIZE };
      if (productId) params.productId = productId;
      if (filter === 'with_image') params.hasImage = true;
      if (filter === 'positive') params.minRating = 4;
      if (filter === 'with_followup') params.hasFollowup = true;
      const { data } = await api.get('/reviews', { params });
      const list: Review[] = data.data ?? data;
      setReviews((prev) => (replace ? list : [...prev, ...list]));
      setHasMore(list.length >= PAGE_SIZE);
      setPage(p);
    } catch { /* ignore */ }
    finally {
      setLoading(false);
      setRefreshing(false);
      loadingMore.current = false;
    }
  }, [productId]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchStats();
      fetchReviews(1, true, activeFilter);
    }, [fetchStats, fetchReviews, activeFilter]),
  );

  const handleFilterChange = (key: FilterKey) => {
    if (key === activeFilter) return;
    setActiveFilter(key);
    setLoading(true);
    setReviews([]);
    fetchReviews(1, true, key);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchReviews(page + 1, false, activeFilter);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
    fetchReviews(1, true, activeFilter);
  };

  const renderReview = ({ item, index }: { item: Review; index: number }) => (
    <View style={styles.reviewItem}>
      {/* Header: product name + date */}
      <View style={styles.reviewHeader}>
        <Text style={styles.productName} numberOfLines={1}>{item.productName}</Text>
        <Text style={styles.reviewDate}>{formatDate(item.createdAt)}</Text>
      </View>

      {/* Stars */}
      <Stars rating={item.rating} size={12} />

      {/* Content */}
      <Text style={styles.reviewContent}>{item.content}</Text>

      {/* Images */}
      {item.images && item.images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imagesRow}
          contentContainerStyle={styles.imagesContent}
        >
          {item.images.map((uri, i) => (
            <Image key={i} source={{ uri }} style={styles.reviewImage} />
          ))}
        </ScrollView>
      )}

      {/* Divider — skip last item */}
      <View style={styles.itemDivider} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={reviews}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderReview}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[Colors.navyButton]} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryLeft}>
                <Text style={styles.summaryLabel}>我的平均评分</Text>
                <View style={styles.summaryScoreRow}>
                  <Text style={styles.summaryScore}>
                    {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '--'}
                  </Text>
                  <Text style={styles.summaryScoreDenom}>/ 5.0</Text>
                </View>
              </View>
              <Stars rating={stats.avgRating} size={20} />
            </View>

            {/* Filter chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}
              contentContainerStyle={styles.filterContent}
            >
              {FILTERS.map(({ key, label }) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.filterChip, activeFilter === key && styles.filterChipActive]}
                  onPress={() => handleFilterChange(key)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.filterChipText, activeFilter === key && styles.filterChipTextActive]}>
                    {label(stats)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Loading indicator replaces list */}
            {loading && (
              <View style={styles.loadingInline}>
                <ActivityIndicator color={Colors.navyButton} />
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Ionicons name="chatbubble-ellipses-outline" size={40} color={Colors.textTertiary} />
              <Text style={styles.emptyText}>暂无评价记录</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          loadingMore.current ? (
            <ActivityIndicator style={styles.footerLoader} color={Colors.navyButton} />
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
  listContent: {
    paddingBottom: 48,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(195,198,211,0.15)',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xxl,
    paddingHorizontal: 25,
    paddingVertical: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: { shadowColor: '#002C66', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.04, shadowRadius: 12 },
      android: { elevation: 2 },
    }),
  },
  summaryLeft: {
    gap: Spacing.xs,
  },
  summaryLabel: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
  },
  summaryScoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  summaryScore: {
    fontSize: 36,
    fontFamily: Fonts.numBlack,
    color: '#002C66',
    letterSpacing: -1.8,
    lineHeight: 42,
  },
  summaryScoreDenom: {
    fontSize: FontSize.md,
    fontFamily: Fonts.numRegular,
    color: Colors.bodyGray,
  },

  // Filters
  filterScroll: {
    marginTop: Spacing.xxxl,
    marginBottom: Spacing.xs,
  },
  filterContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  filterChip: {
    height: 32,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: Colors.navyButton,
  },
  filterChipText: {
    fontSize: FontSize.sm,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
  },
  filterChipTextActive: {
    color: '#fff',
    fontFamily: Fonts.bold,
  },

  // Review items
  reviewItem: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xxl,
    gap: Spacing.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productName: {
    flex: 1,
    fontSize: FontSize.lg,
    fontFamily: Fonts.medium,
    color: '#1a1c1c',
    letterSpacing: -0.4,
    marginRight: Spacing.md,
  },
  reviewDate: {
    fontSize: 11,
    fontFamily: Fonts.numMedium,
    color: Colors.bodyGray,
    letterSpacing: 0.55,
    flexShrink: 0,
  },
  reviewContent: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
    lineHeight: 22,
    marginTop: Spacing.xs,
  },
  imagesRow: {
    marginTop: Spacing.sm,
  },
  imagesContent: {
    gap: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  reviewImage: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    backgroundColor: '#EEE',
  },
  itemDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(195,198,211,0.35)',
    marginTop: Spacing.sm,
  },

  // States
  loadingInline: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: Colors.textTertiary,
  },
  footerLoader: {
    paddingVertical: Spacing.xxl,
  },
});
