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
import { Colors, Spacing, BorderRadius, FontSize, Fonts } from '../../constants/theme';

interface Invitee {
  nickname: string;
  avatar: string;
  createdAt: string;
}

const PAGE_SIZE = 20;

export default function InviteeListScreen() {
  const [data, setData] = useState<Invitee[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchData = useCallback(async (p: number, isRefresh = false) => {
    try {
      const res = await api.get('/promotion/invitees', { params: { page: p, limit: PAGE_SIZE } });
      const list: Invitee[] = res.data.data ?? [];
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

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const renderItem = ({ item }: { item: Invitee }) => (
    <View style={styles.item}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{(item.nickname || '?')[0]}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.nickname}>{item.nickname}</Text>
        <Text style={styles.date}>注册于 {formatDate(item.createdAt)}</Text>
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>👥</Text>
        <Text style={styles.emptyText}>还没有邀请记录</Text>
        <Text style={styles.emptySubtext}>快去分享邀请码给好友吧</Text>
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
        <Text style={styles.headerText}>共邀请 <Text style={styles.headerCount}>{total}</Text> 位好友</Text>
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
    fontFamily: Fonts.numBold,
    fontSize: FontSize.xl,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    color: Colors.textWhite,
    fontSize: FontSize.lg,
    fontFamily: Fonts.bold,
  },
  info: {
    flex: 1,
  },
  nickname: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    fontFamily: Fonts.medium,
  },
  date: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    marginTop: 2,
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
