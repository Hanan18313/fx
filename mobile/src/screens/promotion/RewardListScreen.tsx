import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import api from '../../services/api';
import { Colors, Spacing, BorderRadius, FontSize } from '../../constants/theme';

interface Reward {
  type: 'referral' | 'commission';
  amount: string;
  from_nickname: string;
  created_at: string;
}

const TYPE_MAP: Record<string, { label: string; color: string; bg: string }> = {
  referral: { label: '邀请奖励', color: '#388E3C', bg: '#E8F5E9' },
  commission: { label: '订单佣金', color: '#F57C00', bg: '#FFF3E0' },
};

const PAGE_SIZE = 20;

export default function RewardListScreen() {
  const [data, setData] = useState<Reward[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchData = useCallback(async (p: number, isRefresh = false) => {
    try {
      const res = await api.get('/promotion/rewards', { params: { page: p, limit: PAGE_SIZE } });
      const list: Reward[] = res.data.data ?? [];
      setTotal(res.data.total ?? 0);
      setData(prev => (isRefresh || p === 1 ? list : [...prev, ...list]));
      setPage(p);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => { fetchData(1); }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData(1, true);
  };

  const onEndReached = () => {
    if (loadingMore || data.length >= total) return;
    setLoadingMore(true);
    fetchData(page + 1);
  };

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const renderItem = ({ item }: { item: Reward }) => {
    const typeInfo = TYPE_MAP[item.type] ?? TYPE_MAP.referral;
    return (
      <View style={styles.item}>
        <View style={styles.itemLeft}>
          <View style={styles.itemTitleRow}>
            <View style={[styles.tag, { backgroundColor: typeInfo.bg }]}>
              <Text style={[styles.tagText, { color: typeInfo.color }]}>{typeInfo.label}</Text>
            </View>
            <Text style={styles.fromText}>来自 {item.from_nickname}</Text>
          </View>
          <Text style={styles.dateText}>{formatDateTime(item.created_at)}</Text>
        </View>
        <Text style={styles.amount}>+¥{Number(item.amount).toFixed(2)}</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>💰</Text>
        <Text style={styles.emptyText}>暂无奖励记录</Text>
        <Text style={styles.emptySubtext}>邀请好友注册或下单即可获得奖励</Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      );
    }
    if (data.length > 0 && data.length >= total) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>— 没有更多了 —</Text>
        </View>
      );
    }
    return null;
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color={Colors.primary} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>共 <Text style={styles.headerCount}>{total}</Text> 条奖励记录</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
        contentContainerStyle={data.length === 0 ? { flex: 1 } : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  headerText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  headerCount: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: FontSize.xl,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  itemLeft: {
    flex: 1,
    marginRight: Spacing.md,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  tag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  tagText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  fromText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  dateText: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
  },
  amount: {
    fontSize: FontSize.xl,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.lg,
  },
  emptyText: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
  },
  footer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
  },
});
