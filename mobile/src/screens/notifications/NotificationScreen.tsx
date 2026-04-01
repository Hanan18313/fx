import React, { useCallback, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';
import { Colors, Spacing, FontSize, BorderRadius, Shadow, Fonts } from '../../constants/theme';
import type { Notification, NotificationType } from '../../types/notification';

const TABS: { key: string; label: string }[] = [
  { key: '', label: '全部' },
  { key: 'system', label: '系统通知' },
  { key: 'order', label: '订单消息' },
  { key: 'profit', label: '收益消息' },
];

const TYPE_ICON: Record<NotificationType, string> = {
  system: '📢',
  order: '📦',
  profit: '💰',
};

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '刚刚';
  if (mins < 60) return `${mins}分钟前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}天前`;
  return d.toLocaleDateString('zh-CN');
}

export default function NotificationScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadingMore = useRef(false);

  const fetchNotifications = useCallback(
    async (p: number, replace: boolean) => {
      if (p > 1 && loadingMore.current) return;
      if (p > 1) loadingMore.current = true;

      try {
        const params: any = { page: p, limit: 20 };
        if (activeTab) params.type = activeTab;
        const { data } = await api.get('/notifications', { params });
        const list: Notification[] = data.data ?? data;
        if (replace) {
          setNotifications(list);
        } else {
          setNotifications((prev) => [...prev, ...list]);
        }
        setHasMore(Array.isArray(list) && list.length >= 20);
        setPage(p);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
        setRefreshing(false);
        loadingMore.current = false;
      }
    },
    [activeTab],
  );

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchNotifications(1, true);
    }, [fetchNotifications]),
  );

  const handleTabChange = (key: string) => {
    if (key === activeTab) return;
    setActiveTab(key);
    setLoading(true);
    setNotifications([]);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications(1, true);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchNotifications(page + 1, false);
    }
  };

  const handleItemPress = async (item: Notification) => {
    if (item.linkType === 'order' && item.linkValue) {
      if (item.isRead === 0) {
        try {
          await api.put(`/notifications/${item.id}/read`);
          setNotifications((prev) =>
            prev.map((n) => (n.id === item.id ? { ...n, isRead: 1 } : n)),
          );
        } catch { /* ignore */ }
      }
      navigation.navigate('OrderDetail', { orderId: item.linkValue });
    } else {
      const updated = { ...item, isRead: 1 };
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? updated : n)),
      );
      navigation.navigate('NotificationDetail', { item: updated });
      if (item.isRead === 0) {
        api.put(`/notifications/${item.id}/read`).catch(() => null);
      }
    }
  };

  const handleMarkAllRead = () => {
    Alert.alert('全部已读', '确定将所有消息标记为已读？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确定',
        onPress: async () => {
          try {
            await api.put('/notifications/read-all');
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: 1 })));
          } catch {
            /* ignore */
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.cardLeft}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>{TYPE_ICON[item.type] || '🔔'}</Text>
        </View>
        {item.isRead === 0 && <View style={styles.unreadDot} />}
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, item.isRead === 0 && styles.cardTitleUnread]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.cardBody} numberOfLines={2}>
          {item.content}
        </Text>
        <Text style={styles.cardTime}>{formatTime(item.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Tabs */}
      <View style={styles.tabBar}>
        <View style={styles.tabRow}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => handleTabChange(tab.key)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.readAllBtn} onPress={handleMarkAllRead}>
          <Text style={styles.readAllText}>全部已读</Text>
        </TouchableOpacity>
      </View>

      {loading && notifications.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🔕</Text>
              <Text style={styles.emptyText}>暂无消息</Text>
            </View>
          }
          ListFooterComponent={
            loadingMore.current ? (
              <ActivityIndicator
                style={{ paddingVertical: 20 }}
                color={Colors.primary}
              />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
  },
  tabRow: {
    flex: 1,
    flexDirection: 'row',
  },
  tab: {
    paddingVertical: Spacing.md,
    marginRight: Spacing.xl,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
  },
  tabTextActive: {
    color: Colors.primary,
    fontFamily: Fonts.semibold,
  },
  readAllBtn: {
    paddingVertical: Spacing.sm,
    paddingLeft: Spacing.md,
  },
  readAllText: {
    fontSize: FontSize.sm,
    color: Colors.textLink,
  },
  list: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    ...Shadow.sm,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    flexDirection: 'row',
  },
  cardLeft: {
    marginRight: Spacing.md,
    position: 'relative',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  cardTitleUnread: {
    fontFamily: Fonts.bold,
  },
  cardBody: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  cardTime: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 120,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
  },
});
