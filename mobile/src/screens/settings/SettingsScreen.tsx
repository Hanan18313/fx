import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import { Colors, Spacing, FontSize, BorderRadius, Shadow, Fonts } from '../../constants/theme';

const APP_VERSION = '1.0.0';

interface MenuItem {
  key: string;
  label: string;
  icon: string;
  danger?: boolean;
  onPress?: () => void;
  screen?: string;
}

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const { logout } = useAuthStore();

  const handleChangePassword = () => {
    Alert.prompt?.('修改密码', '请输入新密码', (pwd) => {
      if (!pwd || pwd.length < 6) {
        Alert.alert('提示', '密码至少6位');
        return;
      }
      Alert.alert('提示', '密码修改功能开发中');
    }) ?? Alert.alert('修改密码', '密码修改功能开发中');
  };

  const handleClearCache = () => {
    Alert.alert('清除缓存', '确定要清除本地缓存数据吗？', [
      { text: '取消', style: 'cancel' },
      { text: '清除', onPress: () => Alert.alert('', '缓存已清除') },
    ]);
  };

  const handleAbout = () => {
    Alert.alert('关于我们', `当前版本：v${APP_VERSION}\n\n感谢您的使用！`);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '注销账号',
      '注销后账号数据将无法恢复，确定要注销吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认注销',
          style: 'destructive',
          onPress: () => {
            Alert.alert('提示', '账号注销功能开发中');
          },
        },
      ],
    );
  };

  const sections: MenuItem[][] = [
    [
      { key: 'userInfo', label: '个人信息', icon: '👤', screen: 'UserInfo' },
      { key: 'password', label: '修改密码', icon: '🔒', onPress: handleChangePassword },
    ],
    [
      { key: 'notification', label: '通知设置', icon: '🔔', onPress: () => Alert.alert('提示', '通知设置功能开发中') },
      { key: 'cache', label: '清除缓存', icon: '🧹', onPress: handleClearCache },
    ],
    [
      { key: 'about', label: '关于我们', icon: 'ℹ️', onPress: handleAbout },
      { key: 'agreement', label: '用户协议', icon: '📄', onPress: () => Alert.alert('提示', '用户协议页面开发中') },
      { key: 'privacy', label: '隐私政策', icon: '🔐', onPress: () => Alert.alert('提示', '隐私政策页面开发中') },
    ],
    [
      { key: 'deleteAccount', label: '注销账号', icon: '⚠️', danger: true, onPress: handleDeleteAccount },
    ],
  ];

  const handlePress = (item: MenuItem) => {
    if (item.screen) {
      navigation.navigate(item.screen);
    } else if (item.onPress) {
      item.onPress();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {sections.map((section, sIdx) => (
          <View key={sIdx} style={styles.card}>
            {section.map((item, iIdx) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.menuItem,
                  iIdx < section.length - 1 && styles.menuBorder,
                ]}
                onPress={() => handlePress(item)}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.menuLabel,
                    item.danger && styles.menuLabelDanger,
                  ]}
                >
                  {item.label}
                </Text>
                {item.key === 'about' ? (
                  <Text style={styles.versionText}>v{APP_VERSION}</Text>
                ) : null}
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    ...Shadow.sm,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  menuBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: Spacing.md,
    width: 28,
    textAlign: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontFamily: Fonts.medium,
  },
  menuLabelDanger: {
    color: Colors.error,
  },
  versionText: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    marginRight: Spacing.sm,
  },
  menuArrow: {
    fontSize: 20,
    color: Colors.textTertiary,
  },
});
