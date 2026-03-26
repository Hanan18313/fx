import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../../services/api';
import { Colors, Spacing, FontSize, BorderRadius, Shadow, Fonts } from '../../constants/theme';

const QUICK_AMOUNTS = [50, 100, 500];

export default function WithdrawScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const balance: number = route.params?.balance ?? 0;

  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  const canSubmit = numAmount >= 10 && numAmount <= balance && !submitting;

  const handleQuickAmount = (val: number) => {
    if (val <= balance) {
      setAmount(String(val));
    } else {
      setAmount(String(balance));
    }
  };

  const handleWithdrawAll = () => {
    setAmount(balance > 0 ? String(balance) : '');
  };

  const handleSubmit = async () => {
    if (numAmount < 10) {
      Alert.alert('提示', '最低提现金额为 ¥10.00');
      return;
    }
    if (numAmount > balance) {
      Alert.alert('提示', '提现金额不能超过可用余额');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/wallet/withdraw', { amount: numAmount });
      Alert.alert('提交成功', '提现申请已提交，预计1-3个工作日到账', [
        { text: '好的', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('提现失败', err.response?.data?.message || '网络错误');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Balance Header */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>可用余额</Text>
            <Text style={styles.balanceValue}>¥{Number(balance).toFixed(2)}</Text>
          </View>

          {/* Amount Input */}
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>提现金额</Text>
            <View style={styles.inputRow}>
              <Text style={styles.currencySign}>¥</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={(text) => setAmount(text.replace(/[^0-9.]/g, ''))}
                placeholder="0.00"
                placeholderTextColor={Colors.textTertiary}
                keyboardType="decimal-pad"
                maxLength={10}
              />
            </View>
            <View style={styles.inputDivider} />

            {/* Quick Amounts */}
            <View style={styles.quickRow}>
              {QUICK_AMOUNTS.map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.quickBtn,
                    numAmount === val && styles.quickBtnActive,
                  ]}
                  onPress={() => handleQuickAmount(val)}
                >
                  <Text
                    style={[
                      styles.quickBtnText,
                      numAmount === val && styles.quickBtnTextActive,
                    ]}
                  >
                    ¥{val}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[
                  styles.quickBtn,
                  numAmount === balance && balance > 0 && styles.quickBtnActive,
                ]}
                onPress={handleWithdrawAll}
              >
                <Text
                  style={[
                    styles.quickBtnText,
                    numAmount === balance && balance > 0 && styles.quickBtnTextActive,
                  ]}
                >
                  全部提现
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.minNote}>最低提现金额 ¥10.00</Text>
          </View>
        </ScrollView>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          <Text style={styles.submitBtnText}>
            {submitting ? '提交中...' : '确认提现'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  balanceCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.lg,
    padding: Spacing.xxl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  balanceLabel: {
    fontSize: FontSize.md,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: Spacing.sm,
  },
  balanceValue: {
    fontSize: 36,
    fontFamily: Fonts.numBold,
    color: Colors.textWhite,
  },
  inputCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    ...Shadow.sm,
    marginHorizontal: Spacing.lg,
    padding: Spacing.xl,
  },
  inputLabel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySign: {
    fontSize: 28,
    fontFamily: Fonts.numBold,
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },
  amountInput: {
    flex: 1,
    fontSize: 36,
    fontFamily: Fonts.numBold,
    color: Colors.textPrimary,
    padding: 0,
  },
  inputDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.lg,
  },
  quickRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  quickBtn: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  quickBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: '#FFEBEE',
  },
  quickBtnText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: Fonts.medium,
  },
  quickBtnTextActive: {
    color: Colors.primary,
  },
  minNote: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: Colors.textWhite,
    fontSize: FontSize.lg,
    fontFamily: Fonts.semibold,
  },
});
