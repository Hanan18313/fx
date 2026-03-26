import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';
import { Colors, Spacing, FontSize, BorderRadius, Shadow, Fonts } from '../../constants/theme';

interface Wallet {
  balance: number;
  frozen: number;
  total_earn: number;
}

export default function WalletScreen() {
  const navigation = useNavigation<any>();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const handleWithdraw = () => {
    navigation.navigate('Withdraw', { balance: wallet?.balance || 0 });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => { setRefreshing(true); fetchWallet(); }}
          colors={[Colors.primary]}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.label}>可用余额（元）</Text>
        <Text style={styles.balance}>¥{Number(wallet?.balance || 0).toFixed(2)}</Text>
        <TouchableOpacity style={styles.withdrawBtn} onPress={handleWithdraw}>
          <Text style={styles.withdrawBtnText}>申请提现</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoItem}>
          <Text style={styles.infoValue}>¥{Number(wallet?.frozen || 0).toFixed(2)}</Text>
          <Text style={styles.infoLabel}>冻结中</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoItem}>
          <Text style={styles.infoValue}>¥{Number(wallet?.total_earn || 0).toFixed(2)}</Text>
          <Text style={styles.infoLabel}>累计收益</Text>
        </View>
      </View>
    </ScrollView>
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
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    padding: Spacing.xxxl,
    alignItems: 'center',
  },
  label: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FontSize.md,
    marginBottom: Spacing.sm,
  },
  balance: {
    color: Colors.textWhite,
    fontSize: 42,
    fontFamily: Fonts.numBold,
    marginBottom: Spacing.xl,
  },
  withdrawBtn: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  withdrawBtnText: {
    color: Colors.primary,
    fontFamily: Fonts.bold,
    fontSize: FontSize.md,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    ...Shadow.sm,
    margin: Spacing.lg,
    padding: Spacing.xl,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoValue: {
    fontSize: FontSize.xl,
    fontFamily: Fonts.numBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  infoLabel: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: Colors.divider,
  },
});
