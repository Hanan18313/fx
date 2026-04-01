import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { Colors, Spacing, BorderRadius, FontSize, Fonts, Shadow } from '../../constants/theme';

interface PromotionStats {
  invite_count: number;
  referral_total: number;
  commission_total: number;
  total_reward: number;
  monthly_estimate?: number;
  yesterday_earning?: number;
}

interface InviteeMember {
  nickname: string;
  avatar?: string;
  createdAt: string;
  todayEarning?: number;
  level?: number;
}

function formatJoinDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function levelLabel(level?: number): string {
  if (!level) return '';
  const map: Record<number, string> = { 1: '一级成员', 2: '二级成员', 3: '三级成员' };
  return map[level] ?? `${level}级成员`;
}

export default function PromotionScreen() {
  const navigation = useNavigation<any>();
  const [stats, setStats] = useState<PromotionStats | null>(null);
  const [members, setMembers] = useState<InviteeMember[]>([]);
  const [membersTotal, setMembersTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, membersRes] = await Promise.all([
        api.get('/promotion/stats'),
        api.get('/promotion/invitees', { params: { page: 1, limit: 4 } }),
      ]);
      setStats(statsRes.data);
      setMembers(membersRes.data.data ?? []);
      setMembersTotal(membersRes.data.total ?? 0);
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

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={Colors.navyButton} />
      </View>
    );
  }

  const totalReward = Number(stats?.total_reward || 0);
  const monthlyEst = Number(stats?.monthly_estimate || 0);
  const yesterdayEarning = Number(stats?.yesterday_earning || 0);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.navyButton]} />
        }
      >
        {/* Hero Earnings Card */}
        <LinearGradient
          colors={['#004191', '#002C66']}
          start={{ x: 0.3, y: 0 }}
          end={{ x: 0.7, y: 1 }}
          style={styles.heroCard}
        >
          {/* Decorative blur circle */}
          <View style={styles.heroBlob} />

          <Text style={styles.heroLabel}>累计收益 (元)</Text>
          <Text style={styles.heroAmount}>
            {totalReward.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>

          <View style={styles.heroBtnRow}>
            <TouchableOpacity
              style={styles.heroBtnWhite}
              onPress={() => navigation.navigate('Withdraw')}
              activeOpacity={0.85}
            >
              <Text style={styles.heroBtnWhiteText}>立即提现</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.heroBtnGlass}
              onPress={() => navigation.navigate('Invite')}
              activeOpacity={0.85}
            >
              <Text style={styles.heroBtnGlassText}>邀请好友</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Stats Bento Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>本月预估收益</Text>
            <Text style={styles.statValue}>
              ¥{monthlyEst.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>昨日收益</Text>
            <Text style={styles.statValue}>
              ¥{yesterdayEarning.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        {/* Team Members Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>我的团队成员</Text>
            <Text style={styles.sectionCount}>共 {membersTotal} 人</Text>
          </View>

          <View style={styles.memberList}>
            {members.length === 0 ? (
              <View style={styles.memberEmpty}>
                <Text style={styles.memberEmptyText}>还没有团队成员</Text>
              </View>
            ) : (
              members.map((m, idx) => (
                <View key={idx} style={styles.memberCard}>
                  <View style={styles.memberLeft}>
                    {m.avatar ? (
                      <Image source={{ uri: m.avatar }} style={styles.memberAvatar} />
                    ) : (
                      <View style={[styles.memberAvatar, styles.memberAvatarFallback]}>
                        <Text style={styles.memberAvatarText}>{(m.nickname || '?')[0]}</Text>
                      </View>
                    )}
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{m.nickname}</Text>
                      <Text style={styles.memberDate}>加入时间: {formatJoinDate(m.createdAt)}</Text>
                    </View>
                  </View>
                  <View style={styles.memberRight}>
                    {m.todayEarning !== undefined && (
                      <Text style={styles.memberEarning}>
                        + ¥{Number(m.todayEarning).toFixed(2)}
                      </Text>
                    )}
                    {m.level !== undefined && (
                      <Text style={styles.memberLevel}>{levelLabel(m.level)}</Text>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>

          <TouchableOpacity
            style={styles.viewAllBtn}
            onPress={() => navigation.navigate('InviteeList')}
            activeOpacity={0.8}
          >
            <Text style={styles.viewAllText}>查看全部团队成员</Text>
          </TouchableOpacity>
        </View>

        {/* 推广秘籍 Card */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>推广秘籍</Text>

          <View style={styles.tipRow}>
            <View style={styles.tipIconWrap}>
              <Ionicons name="share-social-outline" size={18} color={Colors.navyButton} />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipName}>分享专属链接</Text>
              <Text style={styles.tipDesc}>转发到朋友圈或微信群，每邀请一位新人均可获得佣金。</Text>
            </View>
          </View>

          <View style={styles.tipRow}>
            <View style={styles.tipIconWrap}>
              <Ionicons name="people-outline" size={18} color={Colors.navyButton} />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipName}>建立自己的社群</Text>
              <Text style={styles.tipDesc}>辅导下级成员进行推广，享受高额团队管理奖励。</Text>
            </View>
          </View>
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
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  scroll: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xxl,
    paddingBottom: 48,
    gap: Spacing.xxxl,
  },

  // Hero
  heroCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxxl,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#004191', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15 },
      android: { elevation: 8 },
    }),
  },
  heroBlob: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: -64,
    right: -64,
  },
  heroLabel: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.medium,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 0.4,
    marginBottom: Spacing.sm,
  },
  heroAmount: {
    fontSize: 48,
    fontFamily: Fonts.numBlack,
    color: '#fff',
    letterSpacing: -2.4,
    lineHeight: 52,
    marginBottom: Spacing.xl,
  },
  heroBtnRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: Spacing.sm,
  },
  heroBtnWhite: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBtnWhiteText: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.medium,
    color: '#002C66',
  },
  heroBtnGlass: {
    flex: 1,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBtnGlassText: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.medium,
    color: '#fff',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    borderRadius: BorderRadius.lg,
    padding: 21,
    gap: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
  },
  statValue: {
    fontSize: 24,
    fontFamily: Fonts.numBold,
    color: '#002C66',
    lineHeight: 32,
  },

  // Team Members
  section: {
    gap: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: FontSize.title,
    fontFamily: Fonts.medium,
    color: '#1a1c1c',
    letterSpacing: -0.5,
  },
  sectionCount: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
  },
  memberList: {
    gap: Spacing.md,
  },
  memberCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadow.sm,
  },
  memberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    flex: 1,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2E2E2',
  },
  memberAvatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarText: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.bold,
    color: Colors.navyButton,
  },
  memberInfo: {
    gap: 2,
  },
  memberName: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.medium,
    color: '#1a1c1c',
  },
  memberDate: {
    fontSize: FontSize.sm,
    fontFamily: Fonts.numRegular,
    color: Colors.bodyGray,
  },
  memberRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  memberEarning: {
    fontSize: FontSize.md,
    fontFamily: Fonts.numBlack,
    color: Colors.priceOrange,
  },
  memberLevel: {
    fontSize: FontSize.xs,
    fontFamily: Fonts.medium,
    color: '#737783',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  memberEmpty: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingVertical: 40,
    alignItems: 'center',
  },
  memberEmptyText: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: Colors.textTertiary,
  },
  viewAllBtn: {
    backgroundColor: '#EEEEEE',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
  },

  // Tips Card
  tipsCard: {
    backgroundColor: 'rgba(0,65,145,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0,65,145,0.1)',
    borderRadius: BorderRadius.xl,
    padding: 25,
    gap: Spacing.lg,
  },
  tipsTitle: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.medium,
    color: '#002C66',
  },
  tipRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    alignItems: 'flex-start',
  },
  tipIconWrap: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(0,65,145,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  tipContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  tipName: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: '#1a1c1c',
  },
  tipDesc: {
    fontSize: FontSize.sm,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
    lineHeight: 18,
  },
});
