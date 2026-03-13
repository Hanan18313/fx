import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TAB_WIDTH = (SCREEN_WIDTH - Spacing.xxl * 2) / 2;

type LoginTab = 'sms' | 'password';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [activeTab, setActiveTab] = useState<LoginTab>('sms');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const indicatorX = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const switchTab = (tab: LoginTab) => {
    setActiveTab(tab);
    Animated.spring(indicatorX, {
      toValue: tab === 'sms' ? 0 : TAB_WIDTH,
      useNativeDriver: true,
    }).start();
  };

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

  const handleLogin = async () => {
    if (!agreed) { Alert.alert('提示', '请先同意用户协议和隐私政策'); return; }
    if (!isPhoneValid) { Alert.alert('提示', '请输入正确的手机号'); return; }
    if (activeTab === 'sms' && !code) { Alert.alert('提示', '请输入验证码'); return; }
    if (activeTab === 'password' && !password) { Alert.alert('提示', '请输入密码'); return; }

    setLoading(true);
    try {
      if (activeTab === 'sms') {
        const { data } = await api.post('/auth/sms/login', { phone, code });
        await setAuth(data.token, data.role);
      } else {
        const { data } = await api.post('/auth/login', { phone, password });
        await setAuth(data.token, data.role);
      }
    } catch (err: any) {
      Alert.alert('登录失败', err.response?.data?.message || '网络错误');
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
        {/* Logo */}
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>商</Text>
          </View>
          <Text style={styles.welcome}>欢迎来到商城分润</Text>
        </View>

        {/* Tab 切换 */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => switchTab('sms')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'sms' && styles.tabTextActive,
              ]}
            >
              验证码登录
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => switchTab('password')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'password' && styles.tabTextActive,
              ]}
            >
              密码登录
            </Text>
          </TouchableOpacity>
          <Animated.View
            style={[
              styles.tabIndicator,
              { transform: [{ translateX: indicatorX }] },
            ]}
          />
        </View>

        {/* 手机号输入 */}
        <View
          style={[
            styles.inputRow,
            phone.length > 0 && !isPhoneValid && styles.inputError,
          ]}
        >
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

        {/* 验证码 或 密码 */}
        {activeTab === 'sms' ? (
          <View key="sms-input" style={styles.inputRow}>
            <TextInput
              key="code-field"
              style={[styles.input, { flex: 1 }]}
              placeholder="请输入验证码"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="number-pad"
              maxLength={6}
              value={code}
              onChangeText={setCode}
            />
            <TouchableOpacity
              style={[
                styles.codeBtn,
                (countdown > 0 || !isPhoneValid) && styles.codeBtnDisabled,
              ]}
              onPress={handleSendCode}
              disabled={countdown > 0 || !isPhoneValid}
            >
              <Text
                style={[
                  styles.codeBtnText,
                  (countdown > 0 || !isPhoneValid) &&
                    styles.codeBtnTextDisabled,
                ]}
              >
                {countdown > 0 ? `${countdown}s后重新发送` : '发送验证码'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View key="password-input" style={styles.inputRow}>
            <TextInput
              key="password-field"
              style={[styles.input, { flex: 1 }]}
              placeholder="请输入密码"
              placeholderTextColor={Colors.textTertiary}
              secureTextEntry={secure}
              keyboardType="default"
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setSecure(!secure)}>
              <Text style={styles.eyeIcon}>{secure ? '👁️‍🗨️' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 登录按钮 */}
        <TouchableOpacity
          style={[styles.loginBtn, (!isPhoneValid || loading) && styles.loginBtnDisabled]}
          onPress={handleLogin}
          disabled={!isPhoneValid || loading}
        >
          <Text style={styles.loginBtnText}>
            {loading ? '登录中...' : '登录'}
          </Text>
        </TouchableOpacity>

        {/* 分隔线 */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>其他方式</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* 第三方登录 */}
        <View style={styles.socialRow}>
          {[
            { icon: '💬', name: '微信' },
            { icon: '💰', name: '支付宝' },
            { icon: '🍎', name: 'Apple' },
          ].map((item) => (
            <TouchableOpacity
              key={item.name}
              style={styles.socialItem}
              onPress={() => Alert.alert('提示', `${item.name}登录暂未开放`)}
            >
              <View style={styles.socialIcon}>
                <Text style={{ fontSize: 24 }}>{item.icon}</Text>
              </View>
              <Text style={styles.socialName}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 注册链接 */}
        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerText}>
            没有账号？<Text style={styles.registerHighlight}>立即注册</Text>
          </Text>
        </TouchableOpacity>

        {/* 协议 */}
        <View style={styles.agreementRow}>
          <TouchableOpacity onPress={() => setAgreed(!agreed)}>
            <View
              style={[
                styles.agreeCheckbox,
                agreed && styles.agreeCheckboxChecked,
              ]}
            >
              {agreed && <Text style={styles.agreeCheckmark}>✓</Text>}
            </View>
          </TouchableOpacity>
          <Text style={styles.agreementText}>
            我已阅读并同意{' '}
            <Text style={styles.agreementLink}>《用户协议》</Text> 和{' '}
            <Text style={styles.agreementLink}>《隐私政策》</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scroll: {
    paddingHorizontal: Spacing.xxl,
  },
  logoArea: {
    alignItems: 'center',
    paddingTop: 50,
    marginBottom: 40,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textWhite,
  },
  welcome: {
    fontSize: FontSize.xl,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.xxl,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    width: TAB_WIDTH,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  tabText: {
    fontSize: FontSize.lg,
    color: Colors.textTertiary,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 40,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    left: (TAB_WIDTH - 40) / 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    height: 50,
    marginBottom: Spacing.lg,
  },
  inputError: {
    borderColor: Colors.primary,
  },
  prefix: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  inputDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    padding: 0,
  },
  codeBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderLeftWidth: 1,
    borderLeftColor: Colors.border,
    marginLeft: Spacing.sm,
  },
  codeBtnDisabled: {
    opacity: 0.5,
  },
  codeBtnText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  codeBtnTextDisabled: {
    color: Colors.textTertiary,
  },
  eyeIcon: {
    fontSize: 20,
    paddingLeft: Spacing.sm,
  },
  loginBtn: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
  },
  loginBtnDisabled: {
    opacity: 0.6,
  },
  loginBtnText: {
    color: Colors.textWhite,
    fontSize: FontSize.lg,
    fontWeight: 'bold',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    marginHorizontal: Spacing.lg,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
  },
  socialItem: {
    alignItems: 'center',
    marginHorizontal: Spacing.xl,
  },
  socialIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  socialName: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  registerLink: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  registerText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  registerHighlight: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 30,
  },
  agreeCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: Colors.textTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  agreeCheckboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  agreeCheckmark: {
    color: Colors.textWhite,
    fontSize: 12,
    fontWeight: 'bold',
  },
  agreementText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    lineHeight: 20,
  },
  agreementLink: {
    color: Colors.primary,
  },
});
