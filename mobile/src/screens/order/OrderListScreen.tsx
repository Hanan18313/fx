import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import {
  Colors,
  Spacing,
  FontSize,
  BorderRadius,
  Shadow,
  Fonts,
} from '../../constants/theme';
import type { Order, OrderStatus } from '../../types/order';
import { ORDER_STATUS_MAP } from '../../types/order';
import EmptyState from '../../components/common/EmptyState';

const PAGE_SIZE = 10;

// ── Status badge config ──────────────────────────────────────────────────────
const STATUS_STYLE: Record<
  OrderStatus,
  { label: string; enLabel: string; badgeBg: string; badgeText: string; filled?: boolean }
> = {
  pending:   { label: '待付款', enLabel: 'Pending',    badgeBg: '#FFDAD6',            badgeText: '#93000A' },
  paid:      { label: '处理中', enLabel: 'Processing', badgeBg: 'rgba(121,44,0,0.1)', badgeText: '#FF9768' },
  shipped:   { label: '运输中', enLabel: 'Shipping',   badgeBg: '#004191',            badgeText: '#FFFFFF', filled: true },
  done:      { label: '已完成', enLabel: 'Completed',  badgeBg: '#C8D7FE',            badgeText: '#4F5D7E' },
  cancelled: { label: '已取消', enLabel: 'Cancelled',  badgeBg: '#E0E0E0',            badgeText: '#616161' },
};

// ── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { key: '',          label: '全部',  enLabel: 'All' },
  { key: 'pending',   label: '待付款' },
  { key: 'paid',      label: '处理中' },
  { key: 'shipped',   label: '待收货' },
  { key: 'done',      label: '已完成' },
] as const;

// ── Countdown hook ───────────────────────────────────────────────────────────
function useCountdown(createdAt: string) {
  const LIMIT = 15 * 60; // 15 min
  const elapsed = Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000);
  const [remaining, setRemaining] = useState(Math.max(0, LIMIT - elapsed));

  useEffect(() => {
    if (remaining <= 0) return;
    const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(t);
  }, [remaining]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  return remaining > 0 ? `${mm}:${ss}` : null;
}

// ── Order Card ───────────────────────────────────────────────────────────────
function OrderCard({
  item,
  onPress,
  onPay,
  onConfirm,
  onCancel,
  onRemind,
}: {
  item: Order;
  onPress: () => void;
  onPay: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  onRemind: () => void;
}) {
  const statusCfg = STATUS_STYLE[item.status] ?? STATUS_STYLE.cancelled;
  const firstItem = item.items?.[0];
  const countdown = useCountdown(item.createdAt);

  const formattedDate = item.createdAt
    ? item.createdAt.replace('T', ' ').substring(0, 10).replace(/-/g, '.')
    : '';

  const isPending = item.status === 'pending';
  const isShipped = item.status === 'shipped';
  const isDone    = item.status === 'done';

  return (
    <TouchableOpacity
      style={[styles.card, isPending && styles.cardPending]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      {/* ── Card header: status badge + order no ── */}
      <View style={styles.cardHead}>
        <View style={[styles.statusBadge, { backgroundColor: statusCfg.badgeBg }]}>
          <Text style={[styles.statusText, { color: statusCfg.badgeText }]}>
            {statusCfg.label}
            {statusCfg.enLabel ? ` (${statusCfg.enLabel})` : ''}
          </Text>
        </View>
        <Text style={styles.orderNo} numberOfLines={1}>
          #{item.orderNo ?? `ORD-${item.id}`}
        </Text>
      </View>

      {/* ── Product row ── */}
      <View style={styles.productRow}>
        {firstItem?.productImage ? (
          <Image
            source={{ uri: firstItem.productImage }}
            style={styles.productThumb}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.productThumb, styles.productThumbPlaceholder]}>
            <Ionicons name="image-outline" size={24} color={Colors.textTertiary} />
          </View>
        )}

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {firstItem?.productName ?? '商品'}
          </Text>
          {/* Show description for shipped orders, spec otherwise */}
          {isShipped && item.items && item.items.length > 1 ? (
            <Text style={styles.productSpec} numberOfLines={2}>
              共 {item.items.length} 件商品
            </Text>
          ) : (
            <Text style={styles.productSpec} numberOfLines={1}>
              x{firstItem?.quantity ?? 1}
            </Text>
          )}
          <View style={styles.priceTrackRow}>
            <Text style={styles.priceText}>
              ¥{item.payAmount ?? item.totalAmount}
            </Text>
            {isShipped && (
              <Text style={styles.trackingText} numberOfLines={1}>
                顺丰速运
              </Text>
            )}
          </View>
        </View>

        {/* Extra thumbnails count */}
        {item.items && item.items.length > 1 && (
          <View style={styles.extraCount}>
            <Text style={styles.extraCountText}>+{item.items.length - 1}</Text>
          </View>
        )}
      </View>

      {/* ── Card footer ── */}
      <View style={styles.cardFooter}>
        {/* Left: date or countdown */}
        {isPending && countdown ? (
          <Text style={styles.countdownText}>剩余支付时间: {countdown}</Text>
        ) : (
          <Text style={styles.dateText}>下单日期: {formattedDate}</Text>
        )}

        {/* Right: action button(s) */}
        {isPending && (
          <TouchableOpacity style={styles.btnPrimary} onPress={onPay} activeOpacity={0.8}>
            <Text style={styles.btnPrimaryText}>立即支付</Text>
          </TouchableOpacity>
        )}
        {item.status === 'paid' && (
          <TouchableOpacity onPress={onRemind} activeOpacity={0.7}>
            <Text style={styles.linkText}>提醒发货</Text>
          </TouchableOpacity>
        )}
        {isShipped && (
          <View style={styles.actionGroup}>
            <TouchableOpacity style={styles.btnPrimary} onPress={onConfirm} activeOpacity={0.8}>
              <Text style={styles.btnPrimaryText}>确认收货</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSecondary} onPress={onPress} activeOpacity={0.8}>
              <Text style={styles.btnSecondaryText}>订单详情</Text>
            </TouchableOpacity>
          </View>
        )}
        {(isDone || item.status === 'cancelled') && (
          <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <Text style={styles.linkText}>查看详情</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ── Main Screen ──────────────────────────────────────────────────────────────
export default function OrderListScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const initialTab = route.params?.initialTab ?? '';

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const loadingMore = useRef(false);

  const fetchOrders = useCallback(
    async (p: number, replace: boolean) => {
      if (loadingMore.current && !replace) return;
      loadingMore.current = true;
      if (replace) setLoading(true);
      try {
        const params: Record<string, any> = { page: p, limit: PAGE_SIZE };
        if (activeTab) params.status = activeTab;
        const res = await api.get('/orders', { params });
        const list: Order[] = res.data?.data ?? res.data ?? [];
        const total = res.data?.total;
        if (replace) setOrders(list);
        else setOrders((prev) => [...prev, ...list]);
        setPage(p);
        setHasMore(total != null ? p * PAGE_SIZE < total : list.length === PAGE_SIZE);
      } catch {
        if (replace) setOrders([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
        loadingMore.current = false;
      }
    },
    [activeTab],
  );

  useEffect(() => { fetchOrders(1, true); }, [fetchOrders]);
  useFocusEffect(useCallback(() => { fetchOrders(1, true); }, [fetchOrders]));

  const handleRefresh = () => { setRefreshing(true); fetchOrders(1, true); };
  const handleLoadMore = () => { if (!hasMore || loadingMore.current) return; fetchOrders(page + 1, false); };
  const handleTabChange = (key: string) => {
    if (key === activeTab) return;
    setActiveTab(key); setOrders([]); setPage(1); setHasMore(true);
  };

  const handlePay = async (id: number) => {
    try {
      const res = await api.post(`/orders/${id}/pay`);
      const order = res.data?.data ?? res.data;
      navigation.navigate('PayResult', { orderId: id, success: true, amount: order?.payAmount ?? order?.totalAmount ?? '0' });
    } catch {
      navigation.navigate('PayResult', { orderId: id, success: false, amount: '0' });
    }
  };

  const handleConfirm = (id: number) => {
    Alert.alert('确认收货', '确认已收到商品？', [
      { text: '取消' },
      { text: '确认', onPress: async () => { try { await api.put(`/orders/${id}/confirm`); fetchOrders(1, true); } catch { Alert.alert('提示', '操作失败'); } } },
    ]);
  };

  const handleCancel = (id: number) => {
    Alert.alert('取消订单', '确定要取消这笔订单吗？', [
      { text: '再想想' },
      { text: '确定取消', style: 'destructive', onPress: async () => { try { await api.put(`/orders/${id}/cancel`); fetchOrders(1, true); } catch { Alert.alert('提示', '取消失败'); } } },
    ]);
  };

  const handleRemind = () => Alert.alert('提示', '已提醒商家尽快发货');

  const renderItem = ({ item }: { item: Order }) => (
    <OrderCard
      item={item}
      onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
      onPay={() => handlePay(item.id)}
      onConfirm={() => handleConfirm(item.id)}
      onCancel={() => handleCancel(item.id)}
      onRemind={handleRemind}
    />
  );

  const renderFooter = () => {
    if (!hasMore) return orders.length > 0 ? <Text style={styles.footerHint}>没有更多订单了</Text> : null;
    if (loadingMore.current) return <ActivityIndicator style={{ paddingVertical: Spacing.lg }} color={Colors.navyButton} />;
    return null;
  };

  return (
    <SafeAreaView style={styles.root} edges={[]}>

      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          orders.length === 0 && styles.listEmpty,
        ]}
        ListHeaderComponent={
          <>
            {/* ── Editorial Header ── */}
            <View style={styles.editorialHeader}>
              <Text style={styles.editorialSub}>Order History</Text>
              <Text style={styles.editorialTitle}>我的订单</Text>
            </View>

            {/* ── Category Tabs ── */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsContainer}
              style={styles.tabsScroll}
            >
              {TABS.map((tab) => {
                const active = activeTab === tab.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    style={[styles.tab, active && styles.tabActive]}
                    onPress={() => handleTabChange(tab.key)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.tabText, active && styles.tabTextActive]}>
                      {'enLabel' in tab
                        ? `${tab.label} (${tab.enLabel})`
                        : tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={Colors.navyButton} />
            </View>
          ) : (
            <EmptyState icon="📋" message="暂无相关订单" />
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.navyButton]}
            tintColor={Colors.navyButton}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const CONTENT_H = Spacing.lg;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },

  /* List */
  listContent: {
    paddingHorizontal: CONTENT_H,
    paddingBottom: 32,
  },
  listEmpty: {
    flexGrow: 1,
  },

  /* Editorial Header */
  editorialHeader: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: 4,
  },
  editorialSub: {
    fontSize: 10,
    fontFamily: Fonts.numMedium,
    color: Colors.bodyGray,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  editorialTitle: {
    fontSize: 36,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    letterSpacing: -0.9,
    lineHeight: 40,
  },

  /* Tabs */
  tabsScroll: {
    marginBottom: Spacing.xxl,
  },
  tabsContainer: {
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingRight: Spacing.sm,
  },
  tab: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    backgroundColor: '#F3F3F3',
  },
  tabActive: {
    backgroundColor: Colors.navyButton,
    shadowColor: Colors.navyButton,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  tabText: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
    lineHeight: 20,
  },
  tabTextActive: {
    color: Colors.textWhite,
    fontFamily: Fonts.bold,
  },

  /* Order Card */
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: CONTENT_H + 8,
    marginBottom: Spacing.xxl,
    ...Shadow.sm,
  },
  cardPending: {
    borderWidth: 2,
    borderColor: 'rgba(0,65,145,0.1)',
  },

  /* Card head */
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xxl,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: 11,
    fontFamily: Fonts.numBold,
    letterSpacing: 0.55,
    textTransform: 'uppercase',
    lineHeight: 17,
  },
  orderNo: {
    fontSize: FontSize.sm,
    fontFamily: Fonts.numRegular,
    color: Colors.bodyGray,
    lineHeight: 18,
  },

  /* Product row */
  productRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  productThumb: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.md,
    backgroundColor: '#EEE',
  },
  productThumbPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  productName: {
    fontSize: 18,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    lineHeight: 23,
  },
  productSpec: {
    fontSize: FontSize.md,
    fontFamily: Fonts.regular,
    color: Colors.bodyGray,
    lineHeight: 20,
  },
  priceTrackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: 4,
  },
  priceText: {
    fontSize: 20,
    fontFamily: Fonts.numExtraBold,
    color: Colors.navyButton,
    lineHeight: 28,
  },
  trackingText: {
    fontSize: FontSize.sm,
    fontFamily: Fonts.numRegular,
    color: Colors.bodyGray,
    lineHeight: 18,
    flex: 1,
  },
  extraCount: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  extraCountText: {
    fontSize: 11,
    fontFamily: Fonts.numMedium,
    color: Colors.textSecondary,
  },

  /* Card footer */
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 17,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  dateText: {
    fontSize: FontSize.sm,
    fontFamily: Fonts.numRegular,
    color: Colors.bodyGray,
    lineHeight: 18,
  },
  countdownText: {
    fontSize: FontSize.sm,
    fontFamily: Fonts.numBold,
    color: '#BA1A1A',
    lineHeight: 18,
  },
  linkText: {
    fontSize: FontSize.md,
    fontFamily: Fonts.numBold,
    color: Colors.navyButton,
    lineHeight: 20,
  },
  actionGroup: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  btnPrimary: {
    backgroundColor: Colors.navyButton,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.sm,
    shadowColor: Colors.navyButton,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  btnPrimaryText: {
    fontSize: FontSize.sm,
    fontFamily: Fonts.medium,
    color: Colors.textWhite,
    lineHeight: 16,
    textAlign: 'center',
  },
  btnSecondary: {
    backgroundColor: '#E8E8E8',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.sm,
  },
  btnSecondaryText: {
    fontSize: FontSize.sm,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    lineHeight: 16,
    textAlign: 'center',
  },

  /* Loading / Footer */
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  footerHint: {
    textAlign: 'center',
    color: Colors.textTertiary,
    fontSize: FontSize.sm,
    paddingVertical: Spacing.xl,
  },
});
