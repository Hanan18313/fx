import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import { useCartStore } from '../../store/cartStore';
import { Colors, Spacing, Fonts } from '../../constants/theme';
import CartItemCard from '../../components/cart/CartItemCard';
import CartBottomBar from '../../components/cart/CartBottomBar';

function PromoBanner() {
  return (
    <View style={promoStyles.card}>
      <View style={promoStyles.badge}>
        <Text style={promoStyles.badgeText}>会员专享</Text>
      </View>
      <Text style={promoStyles.title}>家居生活用品立减 ¥15</Text>
      <Text style={promoStyles.subtitle}>消费满 ¥50 即可享受优惠。结账时自动抵扣。</Text>
      <View style={promoStyles.decorIcon}>
        <Ionicons name="gift-outline" size={56} color="rgba(255,255,255,0.15)" />
      </View>
    </View>
  );
}

export default function CartScreen() {
  const navigation = useNavigation<any>();
  const [editing, setEditing] = React.useState(false);

  const items = useCartStore((s) => s.items);
  const loadFromServer = useCartStore((s) => s.loadFromServer);
  const toggleSelect = useCartStore((s) => s.toggleSelect);
  const toggleSelectAll = useCartStore((s) => s.toggleSelectAll);
  const isAllSelected = useCartStore((s) => s.isAllSelected);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const totalCount = useCartStore((s) => s.totalCount);
  const selectedCount = useCartStore((s) => s.selectedCount);
  const clearSelected = useCartStore((s) => s.clearSelected);
  const selectedItems = useCartStore((s) => s.selectedItems);

  useFocusEffect(
    React.useCallback(() => {
      api.get('/cart').then((res) => {
        const list = res.data?.data ?? res.data ?? [];
        loadFromServer(list);
      }).catch(() => { /* keep local state */ });
    }, [loadFromServer]),
  );

  const handleUpdateQuantity = async (id: number, quantity: number) => {
    updateQuantity(id, quantity);
    if (quantity <= 0) {
      await api.delete(`/cart/${id}`).catch(() => {});
    } else {
      await api.put(`/cart/${id}`, { quantity }).catch(() => {});
    }
  };

  const handleRemoveItem = async (id: number) => {
    removeItem(id);
    await api.delete(`/cart/${id}`).catch(() => {});
  };

  const handleSettle = () => {
    const count = selectedCount();
    if (count === 0) return;
    const selected = selectedItems();
    navigation.navigate('ConfirmOrder', { items: selected });
  };

  const handleDeleteSelected = () => {
    const count = selectedCount();
    if (count === 0) return;
    const selected = selectedItems();
    Alert.alert('确认删除', `删除所选 ${count} 件商品？`, [
      { text: '取消' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          clearSelected();
          await Promise.all(selected.map((item) => api.delete(`/cart/${item.id}`).catch(() => {})));
        },
      },
    ]);
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>购物车</Text>
        </View>
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="cart-outline" size={48} color={Colors.navyButton} />
          </View>
          <Text style={styles.emptyMsg}>购物车是空的</Text>
          <Text style={styles.emptySub}>快去挑选心仪的商品吧</Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => navigation.navigate('Shop')}
            activeOpacity={0.8}
          >
            <Text style={styles.emptyBtnText}>去逛逛</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <View style={styles.cartHeader}>
        <View>
          <Text style={styles.headerTitle}>购物车</Text>
          <Text style={styles.headerSub}>
            已选 {selectedCount()} 件商品
          </Text>
        </View>
      </View>

      <PromoBanner />

      {items.map((item) => (
        <CartItemCard
          key={item.id}
          item={item}
          onToggleSelect={() => toggleSelect(item.id)}
          onUpdateQuantity={(qty) => handleUpdateQuantity(item.id, qty)}
          onRemove={() => handleRemoveItem(item.id)}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={[]}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        renderItem={null}
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
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  headerRow: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerContent: {
    gap: 0,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 30,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    letterSpacing: -0.75,
    lineHeight: 36,
  },
  headerSub: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
    lineHeight: 20,
    marginTop: 2,
  },
  recTitle: {
    fontSize: 20,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    lineHeight: 28,
    marginTop: 24,
    marginBottom: 16,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#EBF0F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyMsg: {
    fontSize: 18,
    fontFamily: Fonts.semibold,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 14,
    color: Colors.bodyGray,
    marginBottom: 28,
  },
  emptyBtn: {
    backgroundColor: Colors.navyButton,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12,
  },
  emptyBtnText: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: Colors.textWhite,
  },
});

const promoStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.navyButton,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
      },
      android: { elevation: 6 },
    }),
  },
  badge: {
    backgroundColor: Colors.priceOrange,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 10,
    color: Colors.navy,
    fontFamily: Fonts.medium,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.medium,
    color: Colors.textWhite,
    lineHeight: 23,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#BFDBFE',
    lineHeight: 16,
  },
  decorIcon: {
    position: 'absolute',
    right: -8,
    bottom: -8,
  },
});
