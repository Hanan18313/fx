import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import { BorderRadius, Colors, FontSize, Fonts, Shadow, Spacing } from '../../constants/theme';

interface Wallet {
  balance: number;
  frozen: number;
  total_earn: number;
}

const QUICK_ACTIONS = [
  { icon: 'arrow-up-circle-outline' as const, label: '提现' },
  { icon: 'time-outline' as const, label: '明细' },
  { icon: 'help-circle-outline' as const, label: '帮助' },
] as const;

const MOCK_BANK_CARDS = [
  { id: '1', bankName: '招商银行', cardNo: '尾号 1234', icon: 'card-outline' as const },
  { id: '2', bankName: '中国工商银行', cardNo: '尾号 5678', icon: 'card-outline' as const },
];

const MOCK_TRANSACTIONS = [
  { id: '1', name: '在线购物退款', date: '今天 14:32', amount: '+¥128.00', iconBg: '#C8D7FE', iconColor: Colors.navyButton },
  { id: '2', name: '提现到账', date: '昨天 09:15', amount: '-¥500.00', iconBg: '#E8E8E8', iconColor: Colors.bodyGray },
];

export default function WalletScreen() {
  const navigation = useNavigation<any>();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="notifications-outline" size={20} color={Colors.bodyGray} />
          </TouchableOpacity>
          <View style={styles.avatar}>
            <Ionicons name="person" size={16} color={Colors.textWhite} />
          </View>
        </View>
      ),
    });
  }, [navigation]);

  const fetchWallet = useCallback(async () => {
    try {
      const res = await api.get('/wallet');
      setWallet(res.data.data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchWallet();
    }, [fetchWallet]),
  );

  const totalAssets = Number(wallet?.balance || 0) + Number(wallet?.frozen || 0);
  const formatAmount = (val: number) =>
    val.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.navyButton} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => { setRefreshing(true); fetchWallet(); }}
          colors={[Colors.navyButton]}
        />
      }
    >
      {/* Hero Card */}
      <LinearGradient
        colors={['#004191', '#002B66']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.heroCard}
      >
        {/* Decorative circle */}
        <View style={styles.decorCircle} />

        {/* Label row */}
        <View style={styles.heroLabelRow}>
          <Text style={styles.heroLabel}>总资产 (元)</Text>
          <TouchableOpacity onPress={() => setBalanceVisible(v => !v)} style={styles.eyeBtn}>
            <Ionicons
              name={balanceVisible ? 'eye-outline' : 'eye-off-outline'}
              size={16}
              color="rgba(255,255,255,0.8)"
            />
          </TouchableOpacity>
        </View>

        {/* Balance */}
        <Text style={styles.heroBalance}>
          {balanceVisible ? `¥ ${formatAmount(totalAssets)}` : '¥ ****'}
        </Text>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {QUICK_ACTIONS.map((action, i) => (
            <TouchableOpacity
              key={action.label}
              style={styles.quickActionBtn}
              onPress={() => {
                if (i === 0) navigation.navigate('Withdraw', { balance: wallet?.balance || 0 });
              }}
            >
              <Ionicons name={action.icon} size={22} color={Colors.textWhite} />
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {/* Available Balance Card */}
      <View style={styles.bentoCard}>
        <View style={styles.bentoHeader}>
          <View>
            <Text style={styles.bentoTitle}>可用余额</Text>
            <Text style={styles.bentoSubtitle}>随时可提现</Text>
          </View>
          <View style={styles.bentoIconWrap}>
            <Ionicons name="wallet-outline" size={20} color="#FF9768" />
          </View>
        </View>
        <Text style={styles.bentoAmount}>
          {balanceVisible ? `¥ ${formatAmount(Number(wallet?.balance || 0))}` : '¥ ****'}
        </Text>
        <View style={styles.bentoBadge}>
          <Text style={styles.bentoBadgeText}>可提现</Text>
        </View>
      </View>

      {/* Total Earn Card */}
      <View style={styles.bentoCard}>
        <View style={styles.bentoHeader}>
          <View>
            <Text style={styles.bentoTitle}>累计收益</Text>
            <Text style={styles.bentoSubtitle}>历史总收益</Text>
          </View>
          <View style={styles.bentoIconWrap}>
            <Ionicons name="trending-up" size={20} color={Colors.navy} />
          </View>
        </View>
        <Text style={[styles.bentoAmount, { color: Colors.textPrimary }]}>
          {balanceVisible ? `¥ ${formatAmount(Number(wallet?.total_earn || 0))}` : '¥ ****'}
        </Text>
        <Text style={styles.bentoInsight}>超过 98% 的高级会员</Text>
      </View>

      {/* Bank Cards Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>银行卡</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>管理卡片</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          {MOCK_BANK_CARDS.map((bc, i) => (
            <React.Fragment key={bc.id}>
              {i > 0 && <View style={styles.cardDivider} />}
              <TouchableOpacity style={styles.bankCardRow}>
                <View style={styles.bankIconWrap}>
                  <Ionicons name={bc.icon} size={22} color={Colors.bodyGray} />
                </View>
                <View style={styles.bankInfo}>
                  <Text style={styles.bankName}>{bc.bankName}</Text>
                  <Text style={styles.bankCardNo}>{bc.cardNo}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.bodyGray} />
              </TouchableOpacity>
            </React.Fragment>
          ))}
          <TouchableOpacity style={styles.addCardRow}>
            <Ionicons name="add-circle-outline" size={20} color={Colors.bodyGray} />
            <Text style={styles.addCardText}>添加新银行卡</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Transaction Preview */}
      <View style={[styles.section, { marginBottom: Spacing.xl }]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>最近账单</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>查看全部</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          {MOCK_TRANSACTIONS.map((tx, i) => (
            <React.Fragment key={tx.id}>
              {i > 0 && <View style={styles.cardDivider} />}
              <View style={styles.txRow}>
                <View style={[styles.txIconWrap, { backgroundColor: tx.iconBg }]}>
                  <Ionicons name="receipt-outline" size={18} color={tx.iconColor} />
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txName}>{tx.name}</Text>
                  <Text style={styles.txDate}>{tx.date}</Text>
                </View>
                <Text
                  style={[
                    styles.txAmount,
                    tx.amount.startsWith('+') ? styles.txAmountIn : styles.txAmountOut,
                  ]}
                >
                  {tx.amount}
                </Text>
              </View>
            </React.Fragment>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },

  // Header
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginRight: Spacing.sm,
  },
  headerIconBtn: {
    padding: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.navyButton,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Hero Card
  heroCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    paddingBottom: Spacing.xl,
    overflow: 'hidden',
    minHeight: 220,
  },
  decorCircle: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  heroLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
  },
  eyeBtn: {
    padding: 2,
  },
  heroBalance: {
    color: Colors.textWhite,
    fontSize: 36,
    fontFamily: Fonts.numExtraBold,
    marginBottom: Spacing.xl,
    letterSpacing: -0.5,
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickActionBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  quickActionLabel: {
    color: Colors.textWhite,
    fontSize: FontSize.sm,
    fontFamily: Fonts.medium,
  },

  // Bento Cards
  bentoCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    ...Shadow.sm,
  },
  bentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  bentoTitle: {
    fontSize: FontSize.md,
    fontFamily: Fonts.semibold,
    color: Colors.textPrimary,
  },
  bentoSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    fontFamily: Fonts.regular,
    marginTop: 2,
  },
  bentoIconWrap: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bentoAmount: {
    fontSize: 24,
    fontFamily: Fonts.numBold,
    color: Colors.navy,
    marginBottom: Spacing.sm,
  },
  bentoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(121,44,0,0.08)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  bentoBadgeText: {
    fontSize: FontSize.xs,
    color: '#7A2C00',
    fontFamily: Fonts.medium,
  },
  bentoInsight: {
    fontSize: FontSize.sm,
    color: '#737783',
    fontFamily: Fonts.regular,
  },

  // Section
  section: {},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
  },
  sectionLink: {
    fontSize: FontSize.md,
    fontFamily: Fonts.semibold,
    color: Colors.navyButton,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  cardDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#F0F0F0',
    marginHorizontal: Spacing.lg,
  },

  // Bank Cards
  bankCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  bankIconWrap: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankInfo: {
    flex: 1,
  },
  bankName: {
    fontSize: FontSize.md,
    fontFamily: Fonts.semibold,
    color: Colors.textPrimary,
  },
  bankCardNo: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    fontFamily: Fonts.regular,
    marginTop: 2,
  },
  addCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  addCardText: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.semibold,
    color: '#737783',
  },

  // Transactions
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  txIconWrap: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txInfo: {
    flex: 1,
  },
  txName: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
  },
  txDate: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    fontFamily: Fonts.regular,
    marginTop: 2,
  },
  txAmount: {
    fontSize: FontSize.md,
    fontFamily: Fonts.numBold,
  },
  txAmountIn: {
    color: '#2E7D32',
  },
  txAmountOut: {
    color: Colors.textPrimary,
  },
});
