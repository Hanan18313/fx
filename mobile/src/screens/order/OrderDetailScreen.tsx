import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import api from '../../services/api';
import { Colors, Spacing, FontSize, BorderRadius, Shadow, Fonts } from '../../constants/theme';
import type { Order, OrderStatus } from '../../types/order';
import { ORDER_STATUS_MAP } from '../../types/order';

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  pending: { bg: '#FFF3E0', text: Colors.accent },
  paid: { bg: '#E3F2FD', text: Colors.info },
  shipped: { bg: '#FFEBEE', text: Colors.primary },
  done: { bg: '#E8F5E9', text: Colors.success },
  cancelled: { bg: Colors.surfaceSecondary, text: Colors.textTertiary },
};

export default function OrderDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const orderId: number = route.params?.orderId;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      setOrder(res.data?.data ?? res.data);
    } catch {
      Alert.alert('提示', '获取订单详情失败');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleCopyOrderNo = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('', '订单号已复制');
  };

  const handleCancel = () => {
    Alert.alert('取消订单', '确定要取消这笔订单吗？', [
      { text: '再想想' },
      {
        text: '确定取消',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.put(`/orders/${orderId}/cancel`);
            fetchOrder();
          } catch {
            Alert.alert('提示', '取消失败');
          }
        },
      },
    ]);
  };

  const handlePay = async () => {
    try {
      const res = await api.post(`/orders/${orderId}/pay`);
      const data = res.data?.data ?? res.data;
      navigation.navigate('PayResult', {
        orderId,
        success: true,
        amount: data?.payAmount ?? data?.totalAmount ?? order?.payAmount ?? '0',
      });
    } catch {
      navigation.navigate('PayResult', {
        orderId,
        success: false,
        amount: '0',
      });
    }
  };

  const handleRemind = () => {
    Alert.alert('提示', '已提醒商家尽快发货');
  };

  const handleConfirm = () => {
    Alert.alert('确认收货', '确认已收到商品？', [
      { text: '取消' },
      {
        text: '确认',
        onPress: async () => {
          try {
            await api.put(`/orders/${orderId}/confirm`);
            fetchOrder();
          } catch {
            Alert.alert('提示', '操作失败');
          }
        },
      },
    ]);
  };

  const handleRebuy = () => {
    navigation.navigate('Main', { screen: 'ShopHome' });
  };

  const formatTime = (t?: string) =>
    t ? t.replace('T', ' ').substring(0, 19) : '-';

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={[]}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container} edges={[]}>
        <View style={styles.loadingWrap}>
          <Text style={styles.errorText}>订单不存在</Text>
        </View>
      </SafeAreaView>
    );
  }

  const colors = STATUS_COLORS[order.status] ?? STATUS_COLORS.cancelled;
  const addr = order.addressSnapshot;

  const renderActionButtons = () => {
    const buttons: { label: string; primary?: boolean; onPress: () => void }[] = [];

    switch (order.status) {
      case 'pending':
        buttons.push({ label: '取消订单', onPress: handleCancel });
        buttons.push({ label: '去支付', primary: true, onPress: handlePay });
        break;
      case 'paid':
        buttons.push({ label: '提醒发货', onPress: handleRemind });
        break;
      case 'shipped':
        buttons.push({ label: '确认收货', primary: true, onPress: handleConfirm });
        break;
      case 'done':
        buttons.push({ label: '再次购买', primary: true, onPress: handleRebuy });
        break;
    }

    if (buttons.length === 0) return null;

    return (
      <View style={styles.bottomBar}>
        {buttons.map((btn, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.bottomBtn,
              btn.primary ? styles.bottomBtnPrimary : styles.bottomBtnOutline,
            ]}
            onPress={btn.onPress}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.bottomBtnText,
                btn.primary ? styles.bottomBtnTextPrimary : styles.bottomBtnTextOutline,
              ]}
            >
              {btn.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: colors.bg }]}>
          <Text style={[styles.statusText, { color: colors.text }]}>
            {ORDER_STATUS_MAP[order.status]}
          </Text>
          <Text style={[styles.statusHint, { color: colors.text }]}>
            {order.status === 'pending' && '请尽快完成支付'}
            {order.status === 'paid' && '商家正在准备发货'}
            {order.status === 'shipped' && '商品正在配送中'}
            {order.status === 'done' && '感谢您的购买'}
            {order.status === 'cancelled' && '订单已取消'}
          </Text>
        </View>

        {/* Address Card */}
        {addr && (
          <View style={styles.card}>
            <View style={styles.addrRow}>
              <Text style={{ fontSize: 20 }}>📍</Text>
              <View style={styles.addrInfo}>
                <View style={styles.addrNameRow}>
                  <Text style={styles.addrName}>{addr.name}</Text>
                  <Text style={styles.addrPhone}>{addr.phone}</Text>
                </View>
                <Text style={styles.addrDetail} numberOfLines={2}>
                  {addr.province}{addr.city}{addr.district}{addr.detail}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Product Items */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>商品信息</Text>
          {order.items?.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.productRow}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('ProductDetail', {
                  product: {
                    id: item.productId,
                    name: item.productName,
                    price: item.price,
                    images: item.productImage ? [item.productImage] : [],
                  },
                })
              }
            >
              <Image
                source={{ uri: item.productImage }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {item.productName}
                </Text>
                <View style={styles.productPriceRow}>
                  <Text style={styles.productPrice}>¥{item.price}</Text>
                  <Text style={styles.productQty}>×{item.quantity}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Fee Breakdown */}
        <View style={styles.card}>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>商品小计</Text>
            <Text style={styles.feeValue}>¥{order.totalAmount}</Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>运费</Text>
            <Text style={styles.feeValue}>¥{order.freightAmount ?? '0.00'}</Text>
          </View>
          {order.discountAmount && Number(order.discountAmount) > 0 && (
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>优惠</Text>
              <Text style={[styles.feeValue, { color: Colors.primary }]}>
                -¥{order.discountAmount}
              </Text>
            </View>
          )}
          <View style={[styles.feeRow, styles.feeTotalRow]}>
            <Text style={styles.feeTotalLabel}>实付款</Text>
            <Text style={styles.feeTotalValue}>
              ¥{order.payAmount ?? order.totalAmount}
            </Text>
          </View>
        </View>

        {/* Order Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>订单信息</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>订单编号</Text>
            <View style={styles.infoValueRow}>
              <Text style={styles.infoValue} selectable>
                {order.orderNo ?? order.id}
              </Text>
              <TouchableOpacity
                onPress={() => handleCopyOrderNo(String(order.orderNo ?? order.id))}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.copyBtn}>复制</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>创建时间</Text>
            <Text style={styles.infoValue}>{formatTime(order.createdAt)}</Text>
          </View>
          {order.paidAt && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>支付时间</Text>
              <Text style={styles.infoValue}>{formatTime(order.paidAt)}</Text>
            </View>
          )}
          {order.shippedAt && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>发货时间</Text>
              <Text style={styles.infoValue}>{formatTime(order.shippedAt)}</Text>
            </View>
          )}
          {order.completedAt && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>完成时间</Text>
              <Text style={styles.infoValue}>{formatTime(order.completedAt)}</Text>
            </View>
          )}
          {order.remark ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>备注</Text>
              <Text style={[styles.infoValue, { flex: 1 }]} numberOfLines={3}>
                {order.remark}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {renderActionButtons()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: FontSize.lg,
    color: Colors.textTertiary,
  },
  statusBanner: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  statusText: {
    fontSize: FontSize.xxl,
    fontFamily: Fonts.bold,
    marginBottom: Spacing.xs,
  },
  statusHint: {
    fontSize: FontSize.md,
    opacity: 0.8,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  addrRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addrInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  addrNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  addrName: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.semibold,
    color: Colors.textPrimary,
    marginRight: Spacing.md,
  },
  addrPhone: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  addrDetail: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  productRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.divider,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceSecondary,
  },
  productInfo: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  productPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.numSemiBold,
    color: Colors.textPrimary,
  },
  productQty: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  feeLabel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  feeValue: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  feeTotalRow: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.divider,
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
  },
  feeTotalLabel: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.semibold,
    color: Colors.textPrimary,
  },
  feeTotalValue: {
    fontSize: FontSize.xl,
    fontFamily: Fonts.numBold,
    color: Colors.primary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  infoLabel: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
    marginRight: Spacing.lg,
  },
  infoValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoValue: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  copyBtn: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    marginLeft: Spacing.sm,
    fontFamily: Fonts.semibold,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  bottomBtn: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    minWidth: 100,
    alignItems: 'center',
  },
  bottomBtnPrimary: {
    backgroundColor: Colors.primary,
  },
  bottomBtnOutline: {
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bottomBtnText: {
    fontSize: FontSize.md,
    fontFamily: Fonts.semibold,
  },
  bottomBtnTextPrimary: {
    color: Colors.textWhite,
  },
  bottomBtnTextOutline: {
    color: Colors.textSecondary,
  },
});
