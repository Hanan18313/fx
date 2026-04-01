import React, { useState } from 'react';
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
import Svg, { Defs, Filter, FeGaussianBlur, Ellipse } from 'react-native-svg';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { Colors, Spacing, FontSize, BorderRadius, Fonts } from '../../constants/theme';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!agreed) { Alert.alert('提示', '请先同意用户协议和隐私政策'); return; }
    if (!phone) { Alert.alert('提示', '请输入手机号/邮箱'); return; }
    if (!password) { Alert.alert('提示', '请输入密码'); return; }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { phone, password });
      setAuth(data.token, data.role);
    } catch (err: any) {
      Alert.alert('登录失败', err.response?.data?.message || '网络错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 背景装饰光晕 */}
      <Svg style={styles.bgBlobTop} viewBox="0 0 300 500" pointerEvents="none">
        <Defs>
          <Filter id="blurTop" x="-80%" y="-80%" width="260%" height="260%">
            <FeGaussianBlur stdDeviation="55" />
          </Filter>
        </Defs>
        <Ellipse cx="100" cy="150" rx="100" ry="150" fill="rgba(0,65,145,0.18)" filter="url(#blurTop)" />
      </Svg>
      <Svg style={styles.bgBlobBottom} viewBox="0 0 300 500" pointerEvents="none">
        <Defs>
          <Filter id="blurBottom" x="-80%" y="-80%" width="260%" height="260%">
            <FeGaussianBlur stdDeviation="55" />
          </Filter>
        </Defs>
        <Ellipse cx="200" cy="350" rx="120" ry="180" fill="rgba(180,90,30,0.12)" filter="url(#blurBottom)" />
      </Svg>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* 顶部 Logo 区域 */}
        <View style={styles.headerSection}>
          <View style={styles.logoBox}>
            <Ionicons name="sparkles" size={33} color="#004191" />
          </View>
          <Text style={styles.title}>欢迎回来</Text>
          <Text style={styles.subtitle}>请登录您的账户以继续</Text>
        </View>

        {/* 表单区域 */}
        <View style={styles.formSection}>
          {/* 手机号 */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputIconLeft}>
              <Ionicons name="phone-portrait-outline" size={16} color="#434751" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="请输入手机号"
              placeholderTextColor="rgba(67,71,81,0.5)"
              keyboardType="phone-pad"
              maxLength={11}
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* 密码 */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputIconLeft}>
              <Ionicons name="lock-closed-outline" size={18} color="#434751" />
            </View>
            <TextInput
              style={[styles.input, { paddingRight: 52 }]}
              placeholder="密码"
              placeholderTextColor="rgba(67,71,81,0.5)"
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

          {/* 忘记密码 */}
          <View style={styles.forgotRow}>
            <TouchableOpacity onPress={() => Alert.alert('提示', '忘记密码功能暂未开放')}>
              <Text style={styles.forgotText}>忘记密码</Text>
            </TouchableOpacity>
          </View>

          {/* 登录按钮 */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.loginBtnText}>{loading ? '登录中...' : '登录'}</Text>
            {!loading && (
              <Ionicons name="arrow-forward" size={14} color="#fff" style={styles.loginBtnIcon} />
            )}
          </TouchableOpacity>

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
        </View>

        {/* 底部区域 */}
        <View style={styles.footerSection}>
          {/* 分割线 */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <View style={styles.dividerLabelBox}>
              <Text style={styles.dividerLabel}>第三方账号登录</Text>
            </View>
            <View style={styles.dividerLine} />
          </View>

          {/* 第三方登录按钮 */}
          <View style={styles.socialRow}>
            {[
              { icon: 'chatbubble-outline' as const, label: '微信' },
              { icon: 'share-social-outline' as const, label: '支付宝' },
              { icon: 'at-outline' as const, label: '邮箱' },
            ].map(({ icon, label }) => (
              <TouchableOpacity
                key={label}
                style={styles.socialBtn}
                onPress={() => Alert.alert('提示', `${label}登录暂未开放`)}
              >
                <Ionicons name={icon} size={20} color="#434751" />
              </TouchableOpacity>
            ))}
          </View>

          {/* 注册链接 */}
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>
              {'还没有账号？ '}
              <Text style={styles.registerLink}>立即注册</Text>
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
  bgBlobTop: {
    position: 'absolute',
    width: 280,
    height: 380,
    top: -100,
    left: -80,
    pointerEvents: 'none',
  },
  bgBlobBottom: {
    position: 'absolute',
    width: 300,
    height: 420,
    bottom: -120,
    right: -80,
    pointerEvents: 'none',
  },
  scroll: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: 40,
    paddingBottom: 40,
  },
  // Header
  headerSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoBox: {
    width: 64,
    height: 57,
    borderRadius: BorderRadius.xl,
    backgroundColor: 'rgba(0,65,145,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.9,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
  },
  // Form
  formSection: {
    marginBottom: 48,
    gap: Spacing.lg,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#E2E2E2',
    borderRadius: BorderRadius.lg,
    height: 54,
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
    right: Spacing.lg,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginTop: -Spacing.sm,
  },
  forgotText: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: Colors.navyButton,
  },
  loginBtn: {
    backgroundColor: Colors.navyButton,
    height: 56,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.navyButton,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  loginBtnDisabled: {
    opacity: 0.7,
  },
  loginBtnText: {
    color: Colors.textWhite,
    fontSize: FontSize.xl,
    fontFamily: Fonts.bold,
  },
  loginBtnIcon: {
    marginLeft: Spacing.sm,
  },
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
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
  // Footer
  footerSection: {
    alignItems: 'center',
    gap: 40,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerLabelBox: {
    backgroundColor: '#F9F9F9',
    paddingHorizontal: Spacing.lg,
  },
  dividerLabel: {
    fontSize: FontSize.sm,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
    letterSpacing: 1.2,
  },
  socialRow: {
    flexDirection: 'row',
    gap: Spacing.xxl,
    justifyContent: 'center',
  },
  socialBtn: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerText: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
    textAlign: 'center',
  },
  registerLink: {
    color: Colors.navyButton,
    fontFamily: Fonts.bold,
  },
});
