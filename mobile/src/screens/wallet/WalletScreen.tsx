import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import api from '../../services/api';

interface Wallet {
  balance: number;
  frozen: number;
  total_earn: number;
}

export default function WalletScreen() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWallet = () => {
    api.get('/wallet')
      .then((res) => setWallet(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchWallet(); }, []);

  const handleWithdraw = () => {
    Alert.prompt('申请提现', '请输入提现金额', async (amount) => {
      if (!amount || isNaN(Number(amount))) return;
      try {
        await api.post('/wallet/withdraw', { amount: Number(amount) });
        Alert.alert('提交成功', '提现申请已提交，预计1-3个工作日到账');
        fetchWallet();
      } catch (err: any) {
        Alert.alert('失败', err.response?.data?.message || '网络错误');
      }
    });
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#E53935" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>可用余额（元）</Text>
        <Text style={styles.balance}>¥{Number(wallet?.balance || 0).toFixed(2)}</Text>
        <TouchableOpacity style={styles.withdrawBtn} onPress={handleWithdraw}>
          <Text style={styles.withdrawBtnText}>申请提现</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoRow}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#E53935', padding: 30, alignItems: 'center' },
  label: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 8 },
  balance: { color: '#fff', fontSize: 42, fontWeight: 'bold', marginBottom: 20 },
  withdrawBtn: { backgroundColor: '#fff', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 24 },
  withdrawBtnText: { color: '#E53935', fontWeight: 'bold', fontSize: 15 },
  infoRow: { flexDirection: 'row', backgroundColor: '#fff', margin: 16, borderRadius: 12, padding: 20 },
  infoItem: { flex: 1, alignItems: 'center' },
  infoValue: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  infoLabel: { fontSize: 13, color: '#999' },
  divider: { width: 1, backgroundColor: '#eee' },
});
