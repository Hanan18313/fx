import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/theme';

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [secure, setSecure] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPhoneValid = /^1\d{10}$/.test(phone);

  const startCountdown = useCallback(() => {
    setCountdown(60);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleSendCode = async () => {
    if (!isPhoneValid) return Alert.alert('提示', '请输入正确的手机号');
    try {
      await api.post('/auth/sms/send', { phone });
      startCountdown();
      Alert.alert('成功', '验证码已发送');
    } catch (err: any) {
      Alert.alert('发送失败', err.response?.data?.message || '网络错误');
    }
  };

  const handleRegister = async () => {
    if (!agreed) return Alert.alert('提示', '请先同意用户协议和隐私政策');
    if (!isPhoneValid) return Alert.alert('提示', '请输入正确的手机号');
    if (!code) return Alert.alert('提示', '请输入验证码');
    if (password.length < 6) return Alert.alert('提示', '密码至少6位');
    if (password !== confirmPassword) return Alert.alert('提示', '两次密码不一致');

    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        phone,
        code,
        password,
        invite_code: inviteCode || undefined,
      });
      Alert.alert('注册成功', `你的邀请码：${data.invite_code}`);
      await setAuth(data.token, data.role || 'user');
    } catch (err: any) {
      Alert.alert('注册失败', err.response?.data?.message || '网络错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* 顶部 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← 返回</Text>
          </TouchableOpacity>
          <Text style={styles.title}>注册账号</Text>
        </View>

        {/* 手机号 */}
        <View style={[styles.inputRow, phone.length > 0 && !isPhoneValid && styles.inputError]}>
          <Text style={styles.prefix}>+86</Text>
          <View style={styles.inputDivider} />
          <TextInput
            style={styles.input}
            placeholder="请输入手机号"
            placeholderTextColor={Colors.textTertiary}
            keyboardType="phone-pad"
            maxLength={11}
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* 验证码 */}
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="请输入验证码"
            placeholderTextColor={Colors.textTertiary}
            keyboardType="number-pad"
            maxLength={6}
            value={code}
            onChangeText={setCode}
          />
          <TouchableOpacity
            style={[styles.codeBtn, (countdown > 0 || !isPhoneValid) && styles.codeBtnDisabled]}
            onPress={handleSendCode}
            disabled={countdown > 0 || !isPhoneValid}
          >
            <Text style={[styles.codeBtnText, (countdown > 0 || !isPhoneValid) && styles.codeBtnTextDisabled]}>
              {countdown > 0 ? `${countdown}s后重新发送` : '发送验证码'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 密码 */}
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="设置密码（至少6位）"
            placeholderTextColor={Colors.textTertiary}
            secureTextEntry={secure}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Text style={styles.eyeIcon}>{secure ? '👁️‍🗨️' : '👁️'}</Text>
          </TouchableOpacity>
        </View>

        {/* 确认密码 */}
        <View style={[styles.inputRow, confirmPassword.length > 0 && password !== confirmPassword && styles.inputError]}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="确认密码"
            placeholderTextColor={Colors.textTertiary}
            secureTextEntry={secureConfirm}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
            <Text style={styles.eyeIcon}>{secureConfirm ? '👁️‍🗨️' : '👁️'}</Text>
          </TouchableOpacity>
        </View>

        {/* 邀请码 */}
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="邀请码（选填）"
            placeholderTextColor={Colors.textTertiary}
            value={inviteCode}
            onChangeText={setInviteCode}
          />
        </View>

        {/* 注册按钮 */}
        <TouchableOpacity
          style={[styles.registerBtn, loading && styles.registerBtnDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.registerBtnText}>
            {loading ? '注册中...' : '立即注册'}
          </Text>
        </TouchableOpacity>

        {/* 协议 */}
        <View style={styles.agreementRow}>
          <TouchableOpacity onPress={() => setAgreed(!agreed)}>
            <View style={[styles.agreeCheckbox, agreed && styles.agreeCheckboxChecked]}>
              {agreed && <Text style={styles.agreeCheckmark}>✓</Text>}
            </View>
          </TouchableOpacity>
          <Text style={styles.agreementText}>
            我已阅读并同意 <Text style={styles.agreementLink}>《用户协议》</Text> 和 <Text style={styles.agreementLink}>《隐私政策》</Text>
          </Text>
        </View>

        {/* 登录链接 */}
        <TouchableOpacity style={styles.loginLink} onPress={() => navigation.goBack()}>
          <Text style={styles.loginLinkText}>
            已有账号？<Text style={styles.loginHighlight}>去登录</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  scroll: { paddingHorizontal: Spacing.xxl },
  header: { paddingTop: Spacing.lg, marginBottom: 30 },
  backBtn: { fontSize: FontSize.lg, color: Colors.textSecondary, marginBottom: Spacing.lg },
  title: { fontSize: FontSize.xxl + 2, fontWeight: 'bold', color: Colors.textPrimary },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg, height: 50, marginBottom: Spacing.lg,
  },
  inputError: { borderColor: Colors.primary },
  prefix: { fontSize: FontSize.lg, color: Colors.textPrimary, fontWeight: '500' },
  inputDivider: { width: 1, height: 20, backgroundColor: Colors.border, marginHorizontal: Spacing.md },
  input: { flex: 1, fontSize: FontSize.lg, color: Colors.textPrimary, padding: 0 },
  codeBtn: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderLeftWidth: 1, borderLeftColor: Colors.border, marginLeft: Spacing.sm },
  codeBtnDisabled: { opacity: 0.5 },
  codeBtnText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: 'bold' },
  codeBtnTextDisabled: { color: Colors.textTertiary },
  eyeIcon: { fontSize: 20, paddingLeft: Spacing.sm },
  registerBtn: {
    backgroundColor: Colors.primary, height: 50, borderRadius: BorderRadius.full,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xxl,
  },
  registerBtnDisabled: { opacity: 0.6 },
  registerBtnText: { color: Colors.textWhite, fontSize: FontSize.lg, fontWeight: 'bold' },
  agreementRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.lg },
  agreeCheckbox: {
    width: 18, height: 18, borderRadius: 9, borderWidth: 1.5,
    borderColor: Colors.textTertiary, alignItems: 'center', justifyContent: 'center',
    marginRight: Spacing.sm, marginTop: 2,
  },
  agreeCheckboxChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  agreeCheckmark: { color: Colors.textWhite, fontSize: 12, fontWeight: 'bold' },
  agreementText: { flex: 1, fontSize: FontSize.sm, color: Colors.textTertiary, lineHeight: 20 },
  agreementLink: { color: Colors.primary },
  loginLink: { alignItems: 'center', paddingBottom: 30 },
  loginLinkText: { fontSize: FontSize.md, color: Colors.textSecondary },
  loginHighlight: { color: Colors.primary, fontWeight: 'bold' },
});
