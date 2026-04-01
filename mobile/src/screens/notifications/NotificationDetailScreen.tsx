import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../components/common/AppHeader';
import api from '../../services/api';
import { Colors, Spacing, FontSize, BorderRadius, Fonts } from '../../constants/theme';
import type { Notification, NotificationType } from '../../types/notification';

type RouteParams = {
  NotificationDetail: { item: Notification };
};

const TYPE_LABEL: Record<NotificationType, string> = {
  system: 'SYSTEM UPDATE',
  order: 'ORDER UPDATE',
  profit: 'PROFIT UPDATE',
};

const TYPE_AUTHOR: Record<NotificationType, string> = {
  system: '管理团队',
  order: '订单系统',
  profit: '收益系统',
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function NotificationDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, 'NotificationDetail'>>();
  const { item } = route.params;

  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(item.isRead === 1);

  const handleConfirm = async () => {
    if (confirmed) return;
    setConfirming(true);
    try {
      await api.put(`/notifications/${item.id}/read`);
      setConfirmed(true);
    } catch {
      Alert.alert('提示', '操作失败，请稍后重试');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <AppHeader title="通知详情" onBack={() => navigation.goBack()} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Editorial Header */}
        <View style={styles.headerSection}>
          {/* Type badge row */}
          <View style={styles.badgeRow}>
            <View style={styles.accentBar} />
            <Text style={styles.typeLabel}>{TYPE_LABEL[item.type]}</Text>
          </View>

          {/* Large title */}
          <Text style={styles.title}>{item.title}</Text>

          {/* Meta row */}
          <View style={styles.metaRow}>
            <Text style={styles.metaDate}>{formatDate(item.createdAt)}</Text>
            <View style={styles.metaDot} />
            <Text style={styles.metaAuthor}>{TYPE_AUTHOR[item.type]}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Body content */}
        <View style={styles.bodySection}>
          <Text style={styles.bodyText}>{item.content}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.confirmBtn, confirmed && styles.confirmBtnDone]}
            onPress={handleConfirm}
            disabled={confirmed || confirming}
            activeOpacity={0.85}
          >
            {confirmed ? (
              <View style={styles.confirmedInner}>
                <Ionicons name="checkmark-circle" size={18} color={Colors.navyButton} style={{ marginRight: 6 }} />
                <Text style={styles.confirmedText}>已阅读</Text>
              </View>
            ) : (
              <Text style={styles.confirmBtnText}>{confirming ? '处理中...' : '确认阅读'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  // Header
  headerSection: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: 32,
    paddingBottom: 24,
    gap: Spacing.xl,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  accentBar: {
    width: 32,
    height: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.navyButton,
  },
  typeLabel: {
    fontSize: FontSize.xs,
    fontFamily: Fonts.bold,
    color: Colors.bodyGray,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    color: '#1a1c1c',
    letterSpacing: -0.8,
    lineHeight: 42,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  metaDate: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C3C6D3',
  },
  metaAuthor: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
  },
  // Divider
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E2E2E2',
    marginHorizontal: Spacing.xxl,
    marginBottom: 24,
  },
  // Body
  bodySection: {
    paddingHorizontal: Spacing.xxl,
    gap: 24,
  },
  bodyText: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.medium,
    color: '#1a1c1c',
    lineHeight: 32,
  },
  // Footer
  footer: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: 40,
  },
  confirmBtn: {
    backgroundColor: Colors.navyButton,
    height: 54,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.navyButton,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  confirmBtnDone: {
    backgroundColor: 'rgba(0,65,145,0.08)',
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: FontSize.lg,
    fontFamily: Fonts.bold,
  },
  confirmedInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confirmedText: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.medium,
    color: Colors.navyButton,
  },
});
