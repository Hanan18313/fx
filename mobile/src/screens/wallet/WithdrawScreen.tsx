import React, { useState, useEffect, useCallback } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { Colors, Spacing, BorderRadius, FontSize, Fonts } from '../../constants/theme';

type WithdrawMethod = 'bank' | 'alipay';

interface BankCard {
  bankName: string;
  lastFour: string;
}

export default function WithdrawScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const balance: number = route.params?.balance ?? 0;

  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<WithdrawMethod>('bank');
  const [bankCard, setBankCard] = useState<BankCard | null>(null);
  const [loadingCard, setLoadingCard] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  const canSubmit = numAmount >= 10 && numAmount <= balance && !submitting;

  const fetchBankCard = useCallback(async () => {
    try {
      const { data } = await api.get('/wallet/bank-card');
      setBankCard(data);
    } catch {
      setBankCard(null);
    } finally {
      setLoadingCard(false);
    }
  }, []);

  useEffect(() => { fetchBankCard(); }, [fetchBankCard]);

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
      await api.post('/wallet/withdraw', { amount: numAmount, method: selectedMethod });
      Alert.alert('提交成功', '提现申请已提交，预计 2 小时内到账', [
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
          showsVerticalScrollIndicator={false}
        >
          {/* Balance Display */}
          <View style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>当前余额 (元)</Text>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceCurrency}>¥</Text>
              <Text style={styles.balanceValue}>
                {Number(balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
          </View>

          {/* Amount Input */}
          <View style={styles.formSection}>
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>提现金额</Text>
              <View style={styles.amountInputWrap}>
                <Text style={styles.amountCurrency}>¥</Text>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={(text) => setAmount(text.replace(/[^0-9.]/g, ''))}
                  placeholder="0.00"
                  placeholderTextColor="rgba(195,198,211,0.7)"
                  keyboardType="decimal-pad"
                  maxLength={10}
                />
                <TouchableOpacity
                  style={styles.allBtn}
                  onPress={handleWithdrawAll}
                  activeOpacity={0.7}
                >
                  <Text style={styles.allBtnText}>全部</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Payment Method */}
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>到账方式</Text>
              <View style={styles.methodList}>
                {/* Bank Card */}
                <TouchableOpacity
                  style={[styles.methodCard, selectedMethod === 'bank' && styles.methodCardSelected]}
                  onPress={() => bankCard && setSelectedMethod('bank')}
                  activeOpacity={0.85}
                >
                  <View style={styles.methodLeft}>
                    <View style={[styles.methodIconWrap, { backgroundColor: 'rgba(216,226,255,0.5)' }]}>
                      <Ionicons name="card-outline" size={18} color="#004191" />
                    </View>
                    <View style={styles.methodInfo}>
                      {loadingCard ? (
                        <ActivityIndicator size="small" color={Colors.navyButton} />
                      ) : bankCard ? (
                        <>
                          <Text style={styles.methodName}>{bankCard.bankName}</Text>
                          <Text style={styles.methodSub}>尾号 {bankCard.lastFour}</Text>
                        </>
                      ) : (
                        <>
                          <Text style={[styles.methodName, styles.methodNameMuted]}>银行卡</Text>
                          <Text style={styles.methodSubMuted}>未绑定账户</Text>
                        </>
                      )}
                    </View>
                  </View>
                  {selectedMethod === 'bank' && bankCard ? (
                    <Ionicons name="checkmark-circle" size={20} color="#004191" />
                  ) : (
                    <Ionicons name="chevron-forward" size={14} color="rgba(67,71,81,0.4)" />
                  )}
                </TouchableOpacity>

                {/* Alipay */}
                <TouchableOpacity
                  style={[styles.methodCard, styles.methodCardMuted, selectedMethod === 'alipay' && styles.methodCardSelected]}
                  onPress={() => setSelectedMethod('alipay')}
                  activeOpacity={0.85}
                >
                  <View style={styles.methodLeft}>
                    <View style={[styles.methodIconWrap, { backgroundColor: 'rgba(232,232,232,0.6)' }]}>
                      <Ionicons name="wallet-outline" size={18} color="rgba(67,71,81,0.6)" />
                    </View>
                    <View style={styles.methodInfo}>
                      <Text style={[styles.methodName, styles.methodNameMuted]}>支付宝支付</Text>
                      <Text style={styles.methodSubMuted}>未绑定账户</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={14} color="rgba(67,71,81,0.4)" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Footer note */}
          <View style={styles.noteSection}>
            <Text style={styles.noteText}>
              提现手续费由平台承担。预计 2 小时内到账，{'\n'}具体到账时间取决于银行处理进度。
            </Text>
          </View>
        </ScrollView>

        {/* Bottom Button */}
        <View style={styles.bottomArea}>
          <TouchableOpacity
            style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!canSubmit}
            activeOpacity={0.85}
          >
            <Text style={styles.submitBtnText}>
              {submitting ? '提交中...' : '确认提现'}
            </Text>
            {!submitting && (
              <Ionicons name="arrow-forward" size={14} color="#fff" style={{ marginLeft: 8 }} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scrollContent: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: 32,
  },

  // Balance
  balanceSection: {
    alignItems: 'center',
    paddingTop: Spacing.xxxl,
    paddingBottom: 56,
  },
  balanceLabel: {
    fontSize: FontSize.xs,
    fontFamily: Fonts.medium,
    color: 'rgba(67,71,81,0.6)',
    letterSpacing: 0.3,
    marginBottom: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  balanceCurrency: {
    fontSize: 20,
    fontFamily: Fonts.numBold,
    color: '#002C66',
    opacity: 0.7,
    letterSpacing: -0.9,
  },
  balanceValue: {
    fontSize: 36,
    fontFamily: Fonts.numBlack,
    color: '#002C66',
    letterSpacing: -0.9,
    lineHeight: 44,
  },

  // Form
  formSection: {
    gap: 48,
  },
  fieldBlock: {
    gap: 14,
  },
  fieldLabel: {
    fontSize: 10,
    fontFamily: Fonts.medium,
    color: 'rgba(67,71,81,0.5)',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginLeft: 4,
  },

  // Amount input
  amountInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(226,226,226,0.6)',
    borderRadius: 16,
    height: 72,
    paddingHorizontal: Spacing.xxl,
  },
  amountCurrency: {
    fontSize: 20,
    fontFamily: Fonts.numBold,
    color: '#1a1c1c',
    marginRight: Spacing.sm,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontFamily: Fonts.numBold,
    color: '#1a1c1c',
    padding: 0,
  },
  allBtn: {
    backgroundColor: 'rgba(0,44,102,0.05)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  allBtnText: {
    fontSize: FontSize.xs,
    fontFamily: Fonts.medium,
    color: '#002C66',
  },

  // Payment methods
  methodList: {
    gap: 12,
  },
  methodCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
      android: { elevation: 1 },
    }),
  },
  methodCardSelected: {
    borderColor: 'rgba(0,65,145,0.2)',
    backgroundColor: '#fff',
  },
  methodCardMuted: {
    backgroundColor: 'rgba(243,243,243,0.5)',
    borderColor: 'transparent',
    ...Platform.select({ ios: { shadowOpacity: 0 }, android: { elevation: 0 } }),
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  methodIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  methodInfo: {
    gap: 2,
  },
  methodName: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: '#1a1c1c',
    lineHeight: 20,
  },
  methodNameMuted: {
    color: 'rgba(67,71,81,0.8)',
  },
  methodSub: {
    fontSize: FontSize.xs,
    fontFamily: Fonts.numRegular,
    color: 'rgba(67,71,81,0.6)',
    lineHeight: 16,
  },
  methodSubMuted: {
    fontSize: FontSize.xs,
    fontFamily: Fonts.medium,
    color: 'rgba(115,119,131,0.6)',
    lineHeight: 16,
  },

  // Note
  noteSection: {
    marginTop: 56,
    paddingHorizontal: Spacing.xxxl,
    alignItems: 'center',
  },
  noteText: {
    fontSize: 10,
    fontFamily: Fonts.medium,
    color: 'rgba(67,71,81,0.4)',
    textAlign: 'center',
    lineHeight: 16,
  },

  // Submit
  bottomArea: {
    paddingHorizontal: 40,
    paddingBottom: Spacing.xxl,
    paddingTop: Spacing.lg,
  },
  submitBtn: {
    backgroundColor: '#002C66',
    borderRadius: BorderRadius.full,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: '#002C66', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 15 },
      android: { elevation: 6 },
    }),
  },
  submitBtnDisabled: {
    opacity: 0.45,
  },
  submitBtnText: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.medium,
    color: '#fff',
  },
});
