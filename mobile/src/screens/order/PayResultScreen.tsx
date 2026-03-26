import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors, Spacing, FontSize, BorderRadius, Shadow, Fonts } from '../../constants/theme';

export default function PayResultScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { orderId, success = true, amount = '0' } = route.params ?? {};

  const handleViewOrder = () => {
    navigation.replace('OrderDetail', { orderId });
  };

  const handleContinueShopping = () => {
    navigation.navigate('Main', { screen: 'ShopHome' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.backBtn}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>支付结果</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.content}>
        {/* Result Icon */}
        <View style={[styles.iconCircle, { backgroundColor: success ? '#E8F5E9' : '#FFEBEE' }]}>
          <Text style={[styles.iconText, { color: success ? Colors.success : Colors.error }]}>
            {success ? '✓' : '✗'}
          </Text>
        </View>

        {/* Result Text */}
        <Text style={[styles.resultText, { color: success ? Colors.success : Colors.error }]}>
          {success ? '支付成功' : '支付失败'}
        </Text>

        {/* Amount */}
        {success && (
          <Text style={styles.amount}>¥{amount}</Text>
        )}

        {!success && (
          <Text style={styles.failHint}>请稍后重试或联系客服</Text>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleViewOrder}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryBtnText}>查看订单</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={handleContinueShopping}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryBtnText}>继续购物</Text>
          </TouchableOpacity>
        </View>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxxl,
    paddingBottom: 80,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
    ...Shadow.sm,
  },
  iconText: {
    fontSize: 48,
    fontFamily: Fonts.bold,
  },
  resultText: {
    fontSize: FontSize.xxl,
    fontFamily: Fonts.bold,
    marginBottom: Spacing.md,
  },
  amount: {
    fontSize: FontSize.xxxl + 4,
    fontFamily: Fonts.numBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  failHint: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
    marginBottom: Spacing.lg,
  },
  buttonGroup: {
    width: '100%',
    marginTop: Spacing.xxxl,
    gap: Spacing.md,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    ...Shadow.sm,
  },
  primaryBtnText: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.bold,
    color: Colors.textWhite,
  },
  secondaryBtn: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryBtnText: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.semibold,
    color: Colors.textSecondary,
  },
});
