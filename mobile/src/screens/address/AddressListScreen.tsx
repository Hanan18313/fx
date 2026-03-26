import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';
import { Colors, Spacing, FontSize, BorderRadius, Shadow, Fonts } from '../../constants/theme';
import type { Address } from '../../types/order';

export default function AddressListScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const selectMode = route.params?.selectMode === true;

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = useCallback(async () => {
    try {
      const { data } = await api.get('/addresses');
      setAddresses(data.data ?? data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [fetchAddresses]),
  );

  const handleDelete = (id: number) => {
    Alert.alert('确认删除', '确定要删除这个地址吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/addresses/${id}`);
            setAddresses((prev) => prev.filter((a) => a.id !== id));
          } catch (err: any) {
            Alert.alert('失败', err.response?.data?.message || '删除失败');
          }
        },
      },
    ]);
  };

  const handleSetDefault = async (id: number) => {
    try {
      await api.put(`/addresses/${id}`, { isDefault: 1 });
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === id ? 1 : 0 })),
      );
    } catch (err: any) {
      Alert.alert('失败', err.response?.data?.message || '操作失败');
    }
  };

  const handleSelect = (address: Address) => {
    if (selectMode) {
      navigation.navigate({
        name: route.params?.returnTo || 'OrderConfirm',
        params: { selectedAddress: address },
        merge: true,
      });
    }
  };

  const renderAddress = ({ item }: { item: Address }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={selectMode ? 0.7 : 1}
      onPress={() => handleSelect(item)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.phone}>{item.phone}</Text>
          {item.isDefault === 1 && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>默认</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('AddressEdit', { address: item })}
        >
          <Text style={styles.editIcon}>✏️</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.addressText} numberOfLines={2}>
        {item.province}{item.city}{item.district}{item.detail}
      </Text>

      <View style={styles.cardActions}>
        {item.isDefault !== 1 && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleSetDefault(item.id)}
          >
            <Text style={styles.actionText}>设为默认</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={[styles.actionText, { color: Colors.error }]}>删除</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={addresses}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderAddress}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>暂无收货地址</Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('AddressEdit')}
      >
        <Text style={styles.addBtnText}>＋ 新增收货地址</Text>
      </TouchableOpacity>
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
    backgroundColor: Colors.background,
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
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  name: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.semibold,
    color: Colors.textPrimary,
    marginRight: Spacing.md,
  },
  phone: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  defaultBadge: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginLeft: Spacing.sm,
  },
  defaultText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontFamily: Fonts.semibold,
  },
  editBtn: {
    padding: Spacing.xs,
  },
  editIcon: {
    fontSize: 16,
  },
  addressText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.divider,
    paddingTop: Spacing.md,
    gap: Spacing.lg,
  },
  actionBtn: {
    paddingVertical: Spacing.xs,
  },
  actionText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
  },
  addBtn: {
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  addBtnText: {
    color: Colors.textWhite,
    fontSize: FontSize.lg,
    fontFamily: Fonts.semibold,
  },
});
