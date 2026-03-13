import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useCartStore } from '../../store/cartStore';
import { Colors, Spacing, FontSize } from '../../constants/theme';
import CartItemCard from '../../components/cart/CartItemCard';
import CartBottomBar from '../../components/cart/CartBottomBar';
import EmptyState from '../../components/common/EmptyState';

export default function CartScreen() {
  const navigation = useNavigation<any>();
  const [editing, setEditing] = useState(false);

  const items = useCartStore((s) => s.items);
  const toggleSelect = useCartStore((s) => s.toggleSelect);
  const toggleSelectAll = useCartStore((s) => s.toggleSelectAll);
  const isAllSelected = useCartStore((s) => s.isAllSelected);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const totalCount = useCartStore((s) => s.totalCount);
  const selectedCount = useCartStore((s) => s.selectedCount);
  const clearSelected = useCartStore((s) => s.clearSelected);

  const handleSettle = () => {
    const count = selectedCount();
    const price = totalPrice();
    if (count === 0) return;
    Alert.alert('确认结算', `共 ${count} 件商品，合计 ¥${price.toFixed(2)}`, [
      { text: '取消' },
      {
        text: '确认下单',
        onPress: () => {
          clearSelected();
          Alert.alert('', '下单成功！');
        },
      },
    ]);
  };

  const handleDeleteSelected = () => {
    const count = selectedCount();
    if (count === 0) return;
    Alert.alert('确认删除', `删除所选 ${count} 件商品？`, [
      { text: '取消' },
      { text: '删除', style: 'destructive', onPress: clearSelected },
    ]);
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>购物车</Text>
        </View>
        <EmptyState
          icon="🛒"
          message="购物车是空的"
          actionText="去逛逛"
          onAction={() => navigation.navigate('Shop')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>购物车({totalCount()})</Text>
        <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(!editing)}>
          <Text style={styles.editText}>{editing ? '完成' : '编辑'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CartItemCard
            item={item}
            onToggleSelect={() => toggleSelect(item.id)}
            onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
            onRemove={() => removeItem(item.id)}
          />
        )}
      />

      <CartBottomBar
        isAllSelected={isAllSelected()}
        onToggleSelectAll={toggleSelectAll}
        totalPrice={totalPrice()}
        selectedCount={selectedCount()}
        editing={editing}
        onSettle={handleSettle}
        onDeleteSelected={handleDeleteSelected}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    backgroundColor: Colors.surface, paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: FontSize.xl, fontWeight: 'bold', color: Colors.textPrimary },
  editBtn: { position: 'absolute', right: Spacing.lg },
  editText: { fontSize: FontSize.md, color: Colors.primary },
  list: { padding: Spacing.lg },
});
