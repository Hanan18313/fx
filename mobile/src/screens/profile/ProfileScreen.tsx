import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import {
  Colors,
  Spacing,
  FontSize,
  BorderRadius,
  Shadow,
  Fonts,
} from '../../constants/theme';

interface UserProfile {
  nickname?: string;
  phone?: string;
  avatar?: string;
  role?: string;
  member_no?: string;
  member_expire?: string;
}

interface WalletInfo {
  balance?: number;
  total_savings?: number;
}

const APP_VERSION = 'v2.4.0 (20241021)';

const MENU_ITEMS = [
  {
    key: 'OrderList',
    label: '我的订单',
    icon: 'bag-handle-outline' as const,
    iconColor: '#004191',
    iconBg: 'rgba(0,65,145,0.08)',
  },
  {
    key: 'Wallet',
    label: '我的钱包',
    icon: 'wallet-outline' as const,
    iconColor: '#004191',
    iconBg: 'rgba(0,65,145,0.08)',
  },
  {
    key: 'Promotion',
    label: '推广中心',
    icon: 'people-outline' as const,
    iconColor: '#004191',
    iconBg: 'rgba(0,65,145,0.08)',
    badge: '新上线',
  },
  {
    key: 'Favorites',
    label: '我的收藏',
    icon: 'heart-outline' as const,
    iconColor: '#004191',
    iconBg: 'rgba(0,65,145,0.08)',
  },
  {
    key: 'Notifications',
    label: '消息通知',
    icon: 'mail-outline' as const,
    iconColor: '#004191',
    iconBg: 'rgba(0,65,145,0.08)',
    dot: true,
  },
  {
    key: 'Settings',
    label: '系统设置',
    icon: 'settings-outline' as const,
    iconColor: '#004191',
    iconBg: 'rgba(0,65,145,0.08)',
  },
  {
    key: 'HelpCenter',
    label: '帮助中心',
    icon: 'help-circle-outline' as const,
    iconColor: '#004191',
    iconBg: 'rgba(0,65,145,0.08)',
  },
];

function formatNumber(val: number): string {
  return val.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function maskCardNo(no: string): string {
  if (!no || no.length < 8) return no || '8829 **** 0211';
  return `${no.slice(0, 4)} ****\n${no.slice(-4)}`;
}

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { role, logout } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile>({});
  const [wallet, setWallet] = useState<WalletInfo>({});
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [profileRes, walletRes] = await Promise.allSettled([
        api.get('/user/profile'),
        api.get('/wallet/info'),
      ]);
      if (profileRes.status === 'fulfilled') {
        setProfile(profileRes.value.data.data ?? profileRes.value.data);
      }
      if (walletRes.status === 'fulfilled') {
        setWallet(walletRes.value.data.data ?? walletRes.value.data);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert('确认退出', '确定要退出登录吗？', [
      { text: '取消', style: 'cancel' },
      { text: '退出登录', style: 'destructive', onPress: logout },
    ]);
  };

  const maskedPhone = profile.phone
    ? profile.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1 **** $2')
    : '';
  const cardNo = maskCardNo(profile.member_no || '');
  const expireDate = profile.member_expire ?? '12/26';
  const balance = wallet.balance ?? 0;
  const totalSavings = wallet.total_savings ?? 0;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.navyButton]}
            tintColor={Colors.navyButton}
          />
        }
      >
        {/* ── Page Header ── */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>个人中心</Text>
          <View style={styles.pageHeaderActions}>
            <TouchableOpacity
              style={styles.headerActionBtn}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerActionBtn}
              onPress={() => navigation.navigate('Settings')}
            >
              <Ionicons name="settings-outline" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Digital Membership Card ── */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('UserInfo')}
        >
          <LinearGradient
            colors={['rgba(0,44,102,0.95)', 'rgba(0,65,145,0.9)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.memberCard}
          >
            {/* Decorative blobs */}
            <View style={styles.blobTopRight} />
            <View style={styles.blobBottomLeft} />
            {/* Inner highlight border */}
            <View style={styles.cardInnerBorder} />

            {/* Top row */}
            <View style={styles.cardTopRow}>
              <View>
                <Text style={styles.cardSubLabel}>会员权益卡</Text>
                <Text style={styles.cardTitle}>尊享高级会员</Text>
              </View>
              <View style={styles.qrWrap}>
                <MaterialCommunityIcons
                  name="qrcode"
                  size={40}
                  color="#002C66"
                />
              </View>
            </View>

            {/* Bottom row */}
            <View style={styles.cardBottomRow}>
              <View>
                <Text style={styles.cardNoLabel}>会员卡号</Text>
                <Text style={styles.cardNo}>
                  {profile.member_no
                    ? `${profile.member_no.slice(0, 4)} ****\n${profile.member_no.slice(-4)}`
                    : `8829 ****\n0211`}
                </Text>
              </View>
              <LinearGradient
                colors={['#FF9768', '#FFB596']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.expirePill}
              >
                <Text style={styles.expireLabel}>有效期至</Text>
                <Text style={styles.expireDate}>{expireDate}</Text>
              </LinearGradient>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* ── Asset Bento Cards ── */}
        <View style={styles.bentoRow}>
          {/* Balance */}
          <TouchableOpacity
            style={styles.bentoCard}
            onPress={() => navigation.navigate('Wallet')}
            activeOpacity={0.8}
          >
            <View style={styles.bentoCardHeader}>
              <View style={[styles.bentoIconWrap, { backgroundColor: 'rgba(0,44,102,0.05)' }]}>
                <Ionicons name="wallet-outline" size={14} color={Colors.navy} />
              </View>
              <Text style={[styles.bentoLabel, { color: Colors.bodyGray }]}>可用余额</Text>
              {/* Trend sparkline placeholder */}
              {/* <View style={styles.sparklinePlaceholder}>
                <Ionicons name="trending-up" size={14} color="#22C55E" />
              </View> */}
            </View>
            <View>
              <View style={styles.bentoAmountRow}>
                <Text style={[styles.bentoCurrencySign, { color: Colors.navy }]}>¥</Text>
                <Text style={[styles.bentoAmount, { color: Colors.navy }]}>
                  {formatNumber(balance)}
                </Text>
              </View>
              <Text style={styles.bentoSubLabel}>当前账户结余</Text>
            </View>
          </TouchableOpacity>

          {/* Savings */}
          <TouchableOpacity
            style={styles.bentoCard}
            onPress={() => navigation.navigate('ProfitDashboard')}
            activeOpacity={0.8}
          >
            <View style={styles.bentoCardHeader}>
              <View style={[styles.bentoIconWrap, { backgroundColor: '#FFF7ED' }]}>
                <Ionicons name="gift-outline" size={14} color={Colors.priceOrange} />
              </View>
              <Text style={[styles.bentoLabel, { color: Colors.priceOrange }]}>累计节省</Text>
              {/* <View style={styles.sparklinePlaceholder}>
                <Ionicons name="trending-up" size={14} color={Colors.priceOrange} />
              </View> */}
            </View>
            <View>
              <View style={styles.bentoAmountRow}>
                <Text style={[styles.bentoCurrencySign, { color: Colors.priceOrange }]}>¥</Text>
                <Text style={[styles.bentoAmount, { color: Colors.priceOrange }]}>
                  {formatNumber(totalSavings)}
                </Text>
              </View>
              <Text style={styles.bentoSubLabel}>会员专享优惠</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Services Section ── */}
        <View style={styles.serviceCard}>
          {/* Section header */}
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceHeaderTitle}>我的服务</Text>
            <Text style={styles.serviceHeaderSub}>常用工具</Text>
          </View>

          {/* Menu items */}
          {MENU_ITEMS.map((item, idx) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.menuItem,
                idx > 0 && styles.menuItemBorder,
              ]}
              onPress={() => navigation.navigate(item.key)}
              activeOpacity={0.7}
            >
              {/* Left: icon + label */}
              <View style={styles.menuLeft}>
                <View
                  style={[
                    styles.menuIconCircle,
                    { backgroundColor: item.iconBg },
                  ]}
                >
                  <Ionicons name={item.icon} size={18} color={item.iconColor} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>

              {/* Right: badge / dot / arrow */}
              <View style={styles.menuRight}>
                {item.badge && (
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>{item.badge}</Text>
                  </View>
                )}
                {item.dot && <View style={styles.notifDot} />}
                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color={Colors.textTertiary}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Promo Banner ── */}
        <LinearGradient
          colors={['#FFDBCD', '#FFEDD5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.promoBanner}
        >
          <View style={styles.promoIconWrap}>
            <MaterialCommunityIcons
              name="crown-outline"
              size={20}
              color={Colors.priceOrange}
            />
          </View>
          <View style={styles.promoText}>
            <Text style={styles.promoTitle}>升级黑金会员</Text>
            <Text style={styles.promoDesc}>每年平均可多省约 ¥2,400+</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color="#7C2E02"
          />
        </LinearGradient>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <View style={styles.footerLinks}>
            <TouchableOpacity>
              <Text style={styles.footerLink}>关于我们</Text>
            </TouchableOpacity>
            <Text style={styles.footerSep}>|</Text>
            <TouchableOpacity>
              <Text style={styles.footerLink}>隐私协议</Text>
            </TouchableOpacity>
            <Text style={styles.footerSep}>|</Text>
            <TouchableOpacity>
              <Text style={styles.footerLink}>用户协议</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.footerVersion}>版本号 {APP_VERSION}</Text>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const CARD_PADDING = Spacing.xxl;
const CONTENT_PADDING = Spacing.lg;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },

  /* Page Header */
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: Spacing.lg,
  },
  pageTitle: {
    fontSize: 30,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    letterSpacing: -0.75,
    lineHeight: 36,
  },
  pageHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingBottom: 2,
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: {
    paddingHorizontal: CONTENT_PADDING,
    paddingTop: Spacing.xxl,
    gap: Spacing.lg,
  },

  /* ── Membership Card ── */
  memberCard: {
    borderRadius: BorderRadius.xl,
    padding: CARD_PADDING,
    overflow: 'hidden',
    gap: 40,
    shadowColor: '#002C66',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.14,
    shadowRadius: 25,
    elevation: 12,
  },
  blobTopRight: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -64,
    right: -64,
  },
  blobBottomLeft: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(255,151,104,0.1)',
    bottom: -48,
    left: -48,
  },
  cardInnerBorder: {
    position: 'absolute',
    inset: 0,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardSubLabel: {
    fontSize: 10,
    fontFamily: Fonts.medium,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.textWhite,
    letterSpacing: -0.6,
    lineHeight: 32,
  },
  qrWrap: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: BorderRadius.lg,
    padding: 6,
    ...Shadow.sm,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardNoLabel: {
    fontSize: 9,
    fontFamily: Fonts.medium,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  cardNo: {
    fontSize: 18,
    fontFamily: Fonts.numBold,
    color: Colors.textWhite,
    letterSpacing: 4.5,
    lineHeight: 28,
  },
  expirePill: {
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 6,
    alignItems: 'flex-start',
    ...Shadow.sm,
  },
  expireLabel: {
    fontSize: 10,
    fontFamily: Fonts.numBold,
    color: '#360F00',
    lineHeight: 15,
  },
  expireDate: {
    fontSize: 10,
    fontFamily: Fonts.numBold,
    color: '#360F00',
    lineHeight: 15,
  },

  /* ── Bento Cards ── */
  bentoRow: {
    flexDirection: 'row',
    gap: CONTENT_PADDING,
  },
  bentoCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(238,238,238,0.5)',
    padding: 21,
    height: 144,
    justifyContent: 'space-between',
    ...Shadow.sm,
  },
  bentoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  bentoIconWrap: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bentoLabel: {
    fontSize: FontSize.sm,
    fontFamily: Fonts.medium,
    flex: 1,
  },
  sparklinePlaceholder: {
    width: 32,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bentoAmountRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  bentoCurrencySign: {
    fontSize: FontSize.sm,
    fontFamily: Fonts.numBold,
    lineHeight: 32,
    marginBottom: 2,
  },
  bentoAmount: {
    fontSize: 24,
    fontFamily: Fonts.numBlack,
    letterSpacing: -0.6,
    lineHeight: 32,
  },
  bentoSubLabel: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: 'rgba(67,71,81,0.7)',
    lineHeight: 15,
    marginTop: 4,
  },

  /* ── Services Card ── */
  serviceCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(238,238,238,0.5)',
    overflow: 'hidden',
    ...Shadow.sm,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: CARD_PADDING,
    paddingTop: 20,
    paddingBottom: 21,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(238,238,238,0.3)',
  },
  serviceHeaderTitle: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  serviceHeaderSub: {
    fontSize: 10,
    fontFamily: Fonts.medium,
    color: '#737783',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: CARD_PADDING,
    paddingVertical: 24,
  },
  menuItemBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(238,238,238,0.3)',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  menuIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    lineHeight: 22.5,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  newBadge: {
    backgroundColor: '#F97316',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    ...Shadow.sm,
  },
  newBadgeText: {
    fontSize: 9,
    fontFamily: Fonts.medium,
    color: Colors.textWhite,
    lineHeight: 13.5,
  },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#BA1A1A',
    marginRight: 4,
  },

  /* ── Promo Banner ── */
  promoBanner: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,237,213,0.5)',
    padding: 21,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    ...Shadow.sm,
  },
  promoIconWrap: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  promoText: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: '#360F00',
    lineHeight: 22.5,
  },
  promoDesc: {
    fontSize: FontSize.sm,
    fontFamily: Fonts.regular,
    color: '#7C2E02',
    lineHeight: 16,
    opacity: 0.8,
  },

  /* ── Footer ── */
  footer: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
    gap: Spacing.sm,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  footerLink: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: '#737783',
    lineHeight: 16.5,
  },
  footerSep: {
    fontSize: 11,
    color: '#E2E2E2',
  },
  footerVersion: {
    fontSize: 10,
    fontFamily: Fonts.numRegular,
    color: 'rgba(115,119,131,0.6)',
    letterSpacing: 0.5,
    lineHeight: 15,
  },

  /* Logout */
  logoutBtn: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    ...Shadow.sm,
    marginTop: Spacing.md,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  logoutText: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
  },
});
