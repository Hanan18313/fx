import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';

const menuItems = [
  { title: '我的分润', screen: 'ProfitDashboard', subtitle: '查看收益与分润明细' },
  { title: '我的钱包', screen: 'Wallet', subtitle: '余额管理与提现' },
  { title: '推广中心', screen: 'Promotion', subtitle: '邀请好友赚佣金' },
];

export default function ProfileScreen() {
  const { role, logout } = useAuthStore();
  const navigation = useNavigation<any>();

  const roleLabel: Record<string, string> = {
    user: '普通用户',
    distributor: '分销商',
    agent: '区域代理',
    admin: '管理员',
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>用</Text>
        </View>
        <Text style={styles.roleTag}>{roleLabel[role || 'user']}</Text>
      </View>

      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.screen}
            style={[styles.menuItem, index < menuItems.length - 1 && styles.menuItemBorder]}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => Alert.alert('确认', '确定退出登录？', [
          { text: '取消' },
          { text: '退出', style: 'destructive', onPress: logout },
        ])}
      >
        <Text style={styles.logoutText}>退出登录</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#fff', padding: 30, alignItems: 'center', marginBottom: 16 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#E53935', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  roleTag: { backgroundColor: '#FFF3E0', color: '#F57C00', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, fontSize: 13 },
  menuSection: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 12, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  menuItemBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#eee' },
  menuTitle: { fontSize: 16, color: '#333', fontWeight: '500' },
  menuSubtitle: { fontSize: 12, color: '#999', marginTop: 2 },
  arrow: { fontSize: 22, color: '#ccc' },
  logoutBtn: { margin: 24, padding: 16, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center' },
  logoutText: { color: '#E53935', fontSize: 16 },
});
