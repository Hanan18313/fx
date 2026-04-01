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
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { Colors, Spacing, FontSize, BorderRadius, Fonts } from '../../constants/theme';

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
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
    if (password.length < 8) return Alert.alert('提示', '密码至少8位');

    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { phone, code, password });
      Alert.alert('注册成功', `你的邀请码：${data.invite_code}`);
      setAuth(data.token, data.role || 'user');
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
        showsVerticalScrollIndicator={false}
      >
        {/* 标题区域 */}
        <View style={styles.heroSection}>
          <Text style={styles.title}>创建账号</Text>
          <Text style={styles.subtitle}>欢迎加入我们，开启您的专业旅程。</Text>
        </View>

        {/* 表单区域 */}
        <View style={styles.formSection}>

          {/* 手机号 */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>手机号</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconLeft}>
                <Ionicons name="phone-portrait-outline" size={18} color="#434751" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="请输入手机号码"
                placeholderTextColor="rgba(115,119,131,0.4)"
                keyboardType="phone-pad"
                maxLength={11}
                value={phone}
                onChangeText={setPhone}
              />
            </View>
          </View>

          {/* 短信验证码 */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>短信验证码</Text>
            <View style={styles.codeRow}>
              <View style={[styles.inputWrapper, styles.codeInputWrapper]}>
                <View style={styles.inputIconLeft}>
                  <Ionicons name="shield-checkmark-outline" size={18} color="#434751" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="验证码"
                  placeholderTextColor="rgba(115,119,131,0.4)"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={code}
                  onChangeText={setCode}
                />
              </View>
              <TouchableOpacity
                style={[styles.codeBtn, (countdown > 0 || !isPhoneValid) && styles.codeBtnDisabled]}
                onPress={handleSendCode}
                disabled={countdown > 0 || !isPhoneValid}
                activeOpacity={0.8}
              >
                <Text style={[styles.codeBtnText, (countdown > 0 || !isPhoneValid) && styles.codeBtnTextDisabled]}>
                  {countdown > 0 ? `${countdown}s后重发` : '获取验证码'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 设置密码 */}
          <View style={[styles.fieldGroup, { marginBottom: 40 }]}>
            <Text style={styles.fieldLabel}>设置密码</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconLeft}>
                <Ionicons name="lock-closed-outline" size={18} color="#434751" />
              </View>
              <TextInput
                style={[styles.input, { paddingRight: 52 }]}
                placeholder="建议8-16位字母和数字结合"
                placeholderTextColor="rgba(115,119,131,0.4)"
                secureTextEntry={secure}
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity style={styles.inputIconRight} onPress={() => setSecure(!secure)}>
                <Ionicons
                  name={secure ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#434751"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* 注册按钮 */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.submitBtnText}>{loading ? '注册中...' : '立即注册'}</Text>
          </TouchableOpacity>
        </View>

        {/* 底部区域 */}
        <View style={styles.footerSection}>
          {/* 协议勾选 */}
          <View style={styles.agreementRow}>
            <TouchableOpacity onPress={() => setAgreed(!agreed)} hitSlop={8}>
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed && <Ionicons name="checkmark" size={12} color="#fff" />}
              </View>
            </TouchableOpacity>
            <Text style={styles.agreementText}>
              {'我已阅读并同意 '}
              <Text style={styles.agreementLink} onPress={() => navigation.navigate('Agreement')}>用户协议</Text>
              {' 与 '}
              <Text style={styles.agreementLink} onPress={() => navigation.navigate('Agreement')}>隐私政策</Text>
            </Text>
          </View>

          {/* 已有账号 */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.loginText}>
              {'已有账号？ '}
              <Text style={styles.loginLink}>直接登录</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scroll: {
    paddingHorizontal: 32,
    paddingTop: 8,
    paddingBottom: 48,
  },
  // Hero
  heroSection: {
    marginBottom: 30,
    gap: Spacing.md,
  },
  title: {
    fontSize: 36,
    fontFamily: Fonts.bold,
    color: '#002C66',
    letterSpacing: -0.9,
  },
  subtitle: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
    lineHeight: 26,
  },
  // Form
  formSection: {
    gap: 32,
    marginBottom: Spacing.lg,
  },
  fieldGroup: {
    gap: 10,
  },
  fieldLabel: {
    fontSize: FontSize.sm,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  codeRow: {
    flexDirection: 'row',
    gap: 14,
  },
  inputWrapper: {
    position: 'relative',
  },
  codeInputWrapper: {
    flex: 1,
  },
  input: {
    backgroundColor: '#E2E2E2',
    borderRadius: BorderRadius.xl,
    height: 62,
    paddingLeft: 48,
    paddingRight: Spacing.lg,
    fontSize: FontSize.lg,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
  },
  inputIconLeft: {
    position: 'absolute',
    left: Spacing.lg,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  inputIconRight: {
    position: 'absolute',
    right: Spacing.xl,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  codeBtn: {
    width: 140,
    height: 62,
    backgroundColor: '#E8E8E8',
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  codeBtnDisabled: {
    opacity: 0.6,
  },
  codeBtnText: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: Colors.navyButton,
    textAlign: 'center',
  },
  codeBtnTextDisabled: {
    color: Colors.textTertiary,
  },
  submitBtn: {
    backgroundColor: Colors.navyButton,
    height: 56,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.navyButton,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: Colors.textWhite,
    fontSize: FontSize.xl,
    fontFamily: Fonts.bold,
  },
  // Footer
  footerSection: {
    paddingTop: 24,
    gap: 40,
    alignItems: 'center',
  },
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    width: '100%',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#C3C6D3',
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: Colors.navyButton,
    borderColor: Colors.navyButton,
  },
  agreementText: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
    lineHeight: 22,
  },
  agreementLink: {
    color: Colors.navyButton,
  },
  loginText: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
    textAlign: 'center',
  },
  loginLink: {
    color: Colors.navyButton,
    fontFamily: Fonts.bold,
  },
});
