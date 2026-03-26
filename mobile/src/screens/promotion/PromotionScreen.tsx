import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import { Colors, Spacing, BorderRadius, FontSize, Fonts } from '../../constants/theme';

interface PromotionStats {
  invite_count: number;
  referral_total: number;
  commission_total: number;
  total_reward: number;
}

export default function PromotionScreen() {
  const navigation = useNavigation<any>();
  const [stats, setStats] = useState<PromotionStats | null>(null);
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, codeRes] = await Promise.all([
        api.get('/promotion/stats'),
        api.get('/promotion/invite-code'),
      ]);
      setStats(statsRes.data);
      setInviteCode(codeRes.data.invite_code);
    } catch (err: any) {
      Alert.alert('加载失败', err.response?.data?.message || '网络错误');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `我在用这款超值购物App，输入邀请码 ${inviteCode} 注册即可获得奖励！`,
      });
    } catch {
      // user cancelled
    }
  };

  const handleCopyCode = async () => {
    try {
      const Clipboard = await import('expo-clipboard');
      await Clipboard.setStringAsync(inviteCode);
      Alert.alert('', '邀请码已复制到剪贴板');
    } catch {
      Alert.alert('邀请码', inviteCode);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color={Colors.primary} />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
    >
      {/* 总收益卡片 */}
      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>累计推广收益（元）</Text>
        <Text style={styles.heroValue}>¥{Number(stats?.total_reward || 0).toFixed(2)}</Text>
        <View style={styles.heroRow}>
          <View style={styles.heroItem}>
            <Text style={styles.heroItemValue}>{stats?.invite_count ?? 0}</Text>
            <Text style={styles.heroItemLabel}>邀请人数</Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroItem}>
            <Text style={styles.heroItemValue}>¥{Number(stats?.referral_total || 0).toFixed(2)}</Text>
            <Text style={styles.heroItemLabel}>邀请奖励</Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroItem}>
            <Text style={styles.heroItemValue}>¥{Number(stats?.commission_total || 0).toFixed(2)}</Text>
            <Text style={styles.heroItemLabel}>佣金收益</Text>
          </View>
        </View>
      </View>

      {/* 邀请码卡片 */}
      <View style={styles.codeCard}>
        <Text style={styles.codeTitle}>我的邀请码</Text>
        <View style={styles.codeRow}>
          <Text style={styles.codeText}>{inviteCode}</Text>
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopyCode}>
            <Text style={styles.copyBtnText}>复制</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.8}>
          <Text style={styles.shareBtnText}>邀请好友</Text>
        </TouchableOpacity>
      </View>

      {/* 功能入口 */}
      <View style={styles.menuCard}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('InviteeList')}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#E8F5E9' }]}>
            <Text style={{ fontSize: 18 }}>👥</Text>
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>我的下级</Text>
            <Text style={styles.menuSubtitle}>查看已邀请的好友列表</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <View style={styles.menuDivider} />
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('RewardList')}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#FFF3E0' }]}>
            <Text style={{ fontSize: 18 }}>💰</Text>
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>奖励流水</Text>
            <Text style={styles.menuSubtitle}>查看邀请奖励与佣金明细</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* 推广说明 */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>推广规则</Text>
        <Text style={styles.tipsText}>• 分享邀请码给好友，好友注册后即可获得邀请奖励</Text>
        <Text style={styles.tipsText}>• 好友下单消费后，您可获得一定比例的佣金</Text>
        <Text style={styles.tipsText}>• 奖励将自动发放到您的钱包余额</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  heroCard: {
    backgroundColor: Colors.primary,
    margin: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FontSize.md,
    marginBottom: Spacing.sm,
  },
  heroValue: {
    color: Colors.textWhite,
    fontSize: 36,
    fontFamily: Fonts.numBold,
    marginBottom: Spacing.xl,
  },
  heroRow: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.3)',
    paddingTop: Spacing.lg,
  },
  heroItem: {
    flex: 1,
    alignItems: 'center',
  },
  heroItemValue: {
    color: Colors.textWhite,
    fontSize: FontSize.lg,
    fontFamily: Fonts.numBold,
    marginBottom: 2,
  },
  heroItemLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FontSize.sm,
  },
  heroDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  codeCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  codeTitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  codeText: {
    fontSize: 28,
    fontFamily: Fonts.numBold,
    color: Colors.primary,
    letterSpacing: 4,
    marginRight: Spacing.md,
  },
  copyBtn: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  copyBtnText: {
    color: Colors.primary,
    fontSize: FontSize.sm,
  },
  shareBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 48,
    paddingVertical: Spacing.md,
  },
  shareBtnText: {
    color: Colors.textWhite,
    fontSize: FontSize.lg,
    fontFamily: Fonts.bold,
  },
  menuCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    fontFamily: Fonts.medium,
  },
  menuSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 22,
    color: Colors.textTertiary,
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginLeft: 68,
  },
  tipsCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xxl,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
  },
  tipsTitle: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  tipsText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.xs,
  },
});
