import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../../services/api';
import { useCartStore } from '../../store/cartStore';
import { Colors, Spacing, FontSize, BorderRadius, Shadow, Fonts } from '../../constants/theme';
import type { CartItem } from '../../types/cart';
import type { Address } from '../../types/order';

export default function ConfirmOrderScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const items: CartItem[] = route.params?.items ?? [];

  const [address, setAddress] = useState<Address | null>(null);
  const [loadingAddr, setLoadingAddr] = useState(true);
  const [remark, setRemark] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const clearSelected = useCartStore((s) => s.clearSelected);

  const fetchDefaultAddress = useCallback(async () => {
    try {
      const res = await api.get('/addresses');
      const list: Address[] = res.data?.data ?? res.data ?? [];
      const def = list.find((a) => a.isDefault === 1) ?? list[0] ?? null;
      setAddress(def);
    } catch {
      setAddress(null);
    } finally {
      setLoadingAddr(false);
    }
  }, []);

  useEffect(() => {
    fetchDefaultAddress();
  }, [fetchDefaultAddress]);

  const subtotal = items.reduce(
    (sum, i) => sum + Number(i.product.price) * i.quantity,
    0,
  );
  const freight = 0;
  const total = subtotal + freight;

  const handleSubmit = async () => {
    if (!address) {
      Alert.alert('提示', '请先选择收货地址');
      return;
    }
    if (items.length === 0) {
      Alert.alert('提示', '没有可下单的商品');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
        })),
        address_id: address.id,
        remark: remark.trim() || undefined,
      };
      const res = await api.post('/orders', payload);
      const order = res.data?.data ?? res.data;

      clearSelected();

      navigation.replace('PayResult', {
        orderId: order.id,
        success: true,
        amount: order.payAmount ?? order.totalAmount ?? total.toFixed(2),
      });
    } catch (err: any) {
      Alert.alert('下单失败', err?.response?.data?.message ?? '请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.backBtn}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>确认订单</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Address Card */}
        <TouchableOpacity
          style={[styles.card, styles.addressCard]}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('AddressList')}
        >
          <View style={styles.addressIcon}>
            <Text style={{ fontSize: 22 }}>📍</Text>
          </View>
          {loadingAddr ? (
            <ActivityIndicator size="small" color={Colors.primary} style={{ flex: 1 }} />
          ) : address ? (
            <View style={styles.addressInfo}>
              <View style={styles.addressNameRow}>
                <Text style={styles.addressName}>{address.name}</Text>
                <Text style={styles.addressPhone}>{address.phone}</Text>
              </View>
              <Text style={styles.addressDetail} numberOfLines={2}>
                {address.province}{address.city}{address.district}{address.detail}
              </Text>
            </View>
          ) : (
            <View style={styles.addressInfo}>
              <Text style={styles.noAddress}>请添加收货地址</Text>
            </View>
          )}
          <Text style={styles.arrowRight}>›</Text>
        </TouchableOpacity>

        {/* Product List */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>商品清单</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.productRow}>
              <Image
                source={{ uri: item.product.images?.[0] }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {item.product.name}
                </Text>
                {item.spec ? (
                  <Text style={styles.productSpec}>{item.spec}</Text>
                ) : null}
                <View style={styles.productPriceRow}>
                  <Text style={styles.productPrice}>¥{item.product.price}</Text>
                  <Text style={styles.productQty}>×{item.quantity}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Remark */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>订单备注</Text>
          <TextInput
            style={styles.remarkInput}
            placeholder="选填，请先和商家协商一致"
            placeholderTextColor={Colors.textTertiary}
            value={remark}
            onChangeText={setRemark}
            maxLength={200}
            multiline
          />
        </View>

        {/* Fee Breakdown */}
        <View style={styles.card}>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>商品小计</Text>
            <Text style={styles.feeValue}>¥{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>运费</Text>
            <Text style={styles.feeValue}>¥{freight.toFixed(2)}</Text>
          </View>
          <View style={[styles.feeRow, styles.feeTotalRow]}>
            <Text style={styles.feeTotalLabel}>合计</Text>
            <Text style={styles.feeTotalValue}>¥{total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomLeft}>
          <Text style={styles.bottomLabel}>实付款</Text>
          <Text style={styles.bottomTotal}>¥{total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator size="small" color={Colors.textWhite} />
          ) : (
            <Text style={styles.submitText}>提交订单</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    width: 50,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressIcon: {
    width: 40,
    alignItems: 'center',
  },
  addressInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  addressNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  addressName: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.semibold,
    color: Colors.textPrimary,
    marginRight: Spacing.md,
  },
  addressPhone: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  addressDetail: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  noAddress: {
    fontSize: FontSize.lg,
    color: Colors.textTertiary,
    paddingVertical: Spacing.sm,
  },
  arrowRight: {
    fontSize: 24,
    color: Colors.textTertiary,
    marginLeft: Spacing.sm,
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
  productSpec: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },
  productPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
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
  remarkInput: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    minHeight: 60,
    textAlignVertical: 'top',
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
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  bottomLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bottomLabel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginRight: Spacing.xs,
  },
  bottomTotal: {
    fontSize: FontSize.xxl,
    fontFamily: Fonts.numBold,
    color: Colors.primary,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    minWidth: 140,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitText: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.bold,
    color: Colors.textWhite,
  },
});
