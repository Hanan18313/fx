import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import api from '../../services/api';

interface Dashboard {
  released_total: number;
  today_amount: number;
  pending_total: number;
}

export default function ProfitDashboardScreen() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/profit/dashboard')
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#E53935" />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>我的分润</Text>
      </View>

      <View style={styles.cards}>
        <View style={[styles.card, { backgroundColor: '#E53935' }]}>
          <Text style={styles.cardLabel}>累计收益（元）</Text>
          <Text style={styles.cardValue}>¥{Number(data?.released_total || 0).toFixed(2)}</Text>
        </View>

        <View style={styles.row}>
          <View style={[styles.card, styles.halfCard, { backgroundColor: '#F57C00' }]}>
            <Text style={styles.cardLabel}>今日释放</Text>
            <Text style={styles.cardValue}>¥{Number(data?.today_amount || 0).toFixed(2)}</Text>
          </View>
          <View style={[styles.card, styles.halfCard, { backgroundColor: '#388E3C' }]}>
            <Text style={styles.cardLabel}>待释放</Text>
            <Text style={styles.cardValue}>¥{Number(data?.pending_total || 0).toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>分润说明</Text>
      <View style={styles.desc}>
        <Text style={styles.descText}>• 购买商品后，分润将在30天内每日自动释放</Text>
        <Text style={styles.descText}>• 个人释放采用衰减模型，前期释放比例较高</Text>
        <Text style={styles.descText}>• 团队分红根据团队业绩按权重分配</Text>
        <Text style={styles.descText}>• 每日凌晨 00:05 系统自动结算</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#E53935', padding: 20, paddingTop: 40 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  cards: { padding: 16 },
  card: { borderRadius: 12, padding: 20, marginBottom: 12 },
  halfCard: { flex: 1, marginHorizontal: 4 },
  row: { flexDirection: 'row' },
  cardLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 8 },
  cardValue: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 16, marginTop: 8, marginBottom: 8 },
  desc: { backgroundColor: '#fff', margin: 16, borderRadius: 10, padding: 16 },
  descText: { color: '#666', fontSize: 14, lineHeight: 26 },
});
