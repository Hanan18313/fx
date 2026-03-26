import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { Colors, Spacing, FontSize, BorderRadius, Shadow, Fonts } from '../../constants/theme';

interface UserProfile {
  nickname?: string;
  phone?: string;
  avatar?: string;
  role?: string;
  createdAt?: string;
}

const ROLE_LABEL: Record<string, string> = {
  user: '普通会员',
  distributor: '分销商',
  agent: '区域代理',
  admin: '管理员',
};

export default function UserInfoScreen() {
  const navigation = useNavigation<any>();
  const { role } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/user/profile')
      .then(({ data }) => {
        const p = data.data ?? data;
        setProfile(p);
        setNickname(p.nickname || '');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!nickname.trim()) {
      Alert.alert('提示', '昵称不能为空');
      return;
    }
    setSaving(true);
    try {
      await api.put('/user/profile', { nickname: nickname.trim() });
      setProfile((prev) => prev ? { ...prev, nickname: nickname.trim() } : prev);
      setEditing(false);
      Alert.alert('', '保存成功');
    } catch (err: any) {
      Alert.alert('失败', err.response?.data?.message || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const maskedPhone = profile?.phone
    ? profile.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    : '—';
  const regDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('zh-CN')
    : '—';

  const avatarChar = profile?.nickname?.charAt(0) || '用';

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatar} activeOpacity={0.7}>
            <Text style={styles.avatarText}>{avatarChar}</Text>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>点击更换头像</Text>
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          {/* Nickname */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>昵称</Text>
            {editing ? (
              <View style={styles.editRow}>
                <TextInput
                  style={styles.editInput}
                  value={nickname}
                  onChangeText={setNickname}
                  maxLength={20}
                  autoFocus
                  placeholderTextColor={Colors.textTertiary}
                />
                <TouchableOpacity
                  style={styles.saveSmallBtn}
                  onPress={handleSave}
                  disabled={saving}
                >
                  <Text style={styles.saveSmallText}>
                    {saving ? '...' : '保存'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelSmallBtn}
                  onPress={() => {
                    setEditing(false);
                    setNickname(profile?.nickname || '');
                  }}
                >
                  <Text style={styles.cancelSmallText}>取消</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.valueRow}
                onPress={() => setEditing(true)}
              >
                <Text style={styles.rowValue}>{profile?.nickname || '—'}</Text>
                <Text style={styles.editHint}>修改 ›</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.divider} />

          {/* Phone */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>手机号</Text>
            <Text style={styles.rowValue}>{maskedPhone}</Text>
          </View>

          <View style={styles.divider} />

          {/* Role */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>身份</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{ROLE_LABEL[role || 'user']}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Registration Date */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>注册时间</Text>
            <Text style={styles.rowValue}>{regDate}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  content: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  avatarText: {
    color: Colors.textWhite,
    fontSize: 32,
    fontFamily: Fonts.bold,
  },
  avatarHint: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    ...Shadow.sm,
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
  },
  rowLabel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    width: 72,
  },
  rowValue: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  valueRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  editHint: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    marginLeft: Spacing.sm,
  },
  editRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },
  editInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  saveSmallBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  saveSmallText: {
    color: Colors.textWhite,
    fontSize: FontSize.sm,
    fontFamily: Fonts.semibold,
  },
  cancelSmallBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  cancelSmallText: {
    color: Colors.textTertiary,
    fontSize: FontSize.sm,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.xs,
  },
  roleBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  roleText: {
    fontSize: FontSize.sm,
    color: Colors.accent,
    fontFamily: Fonts.semibold,
  },
});
