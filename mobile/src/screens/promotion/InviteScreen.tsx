import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import api from '../../services/api';
import { Colors, Spacing, BorderRadius, FontSize, Fonts } from '../../constants/theme';

interface InviteStats {
  invite_count: number;
  invite_code: string;
}

export default function InviteScreen() {
  const navigation = useNavigation<any>();
  const [inviteCode, setInviteCode] = useState('');
  const [inviteCount, setInviteCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [codeRes, statsRes] = await Promise.all([
        api.get('/promotion/invite-code'),
        api.get('/promotion/stats'),
      ]);
      setInviteCode(codeRes.data.invite_code ?? '');
      setInviteCount(statsRes.data.invite_count ?? 0);
    } catch (err: any) {
      Alert.alert('加载失败', err.response?.data?.message || '网络错误');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `我在用这款超值购物App，输入邀请码 ${inviteCode} 注册即可获得专属权益礼包！`,
      });
    } catch { /* user cancelled */ }
  };

  const handleCopyLink = async () => {
    if (!inviteCode) return;
    await Clipboard.setStringAsync(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={Colors.navyButton} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>

        {/* Illustration Section */}
        <View style={styles.illustrationSection}>
          <View style={styles.illustrationContainer}>
            <View style={styles.illustrationBlob} />
            <View style={styles.illustrationCard}>
              <Ionicons name="share-social-outline" size={72} color="#004191" />
            </View>
          </View>

          <View style={styles.textBlock}>
            <Text style={styles.headline}>邀请好友，共享好礼</Text>
            <Text style={styles.subheadline}>
              您的好友在注册后，您与好友都将获得专属{'\n'}权益礼包
            </Text>
          </View>
        </View>

        {/* Invite Code Card */}
        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>我的邀请码</Text>
          <Text style={styles.codeValue}>{inviteCode || '------'}</Text>
          {inviteCount > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>已成功邀请 {inviteCount} 人</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleShare}
            activeOpacity={0.85}
          >
            <Ionicons name="arrow-redo-outline" size={18} color="#fff" />
            <Text style={styles.primaryBtnText}>立即分享</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={handleCopyLink}
            activeOpacity={0.85}
          >
            <Ionicons name="copy-outline" size={18} color="#002C66" />
            <Text style={styles.secondaryBtnText}>{copied ? '已复制！' : '复制链接'}</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <TouchableOpacity
          style={styles.footerLink}
          onPress={() => navigation.navigate('Agreement')}
          activeOpacity={0.7}
        >
          <Text style={styles.footerLinkText}>查看活动细则</Text>
          <Ionicons name="chevron-forward" size={12} color="rgba(67,71,81,0.6)" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xxxl,
    paddingBottom: 48,
  },

  // Illustration
  illustrationSection: {
    alignItems: 'center',
    paddingBottom: Spacing.xxl,
  },
  illustrationContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationBlob: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(0,65,145,0.05)',
  },
  illustrationCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: '#002C66', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 24 },
      android: { elevation: 4 },
    }),
  },
  textBlock: {
    alignItems: 'center',
    paddingTop: Spacing.xxxl,
    gap: Spacing.md,
  },
  headline: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: '#002C66',
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  subheadline: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Code Card
  codeCard: {
    backgroundColor: '#F3F3F3',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(195,198,211,0.1)',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: 33,
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  codeLabel: {
    fontSize: FontSize.xs,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  codeValue: {
    fontSize: 36,
    fontFamily: Fonts.numBlack,
    color: '#002C66',
    letterSpacing: 7.2,
    textAlign: 'center',
  },
  countBadge: {
    backgroundColor: '#FFDBCD',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: Spacing.sm,
  },
  countBadgeText: {
    fontSize: 10,
    fontFamily: Fonts.medium,
    color: '#7C2E02',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // Buttons
  buttonSection: {
    gap: Spacing.lg,
    marginTop: Spacing.xxxl,
  },
  primaryBtn: {
    backgroundColor: '#004191',
    borderRadius: BorderRadius.lg,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  primaryBtnText: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.medium,
    color: '#fff',
  },
  secondaryBtn: {
    backgroundColor: '#E2E2E2',
    borderRadius: BorderRadius.lg,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  secondaryBtnText: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.medium,
    color: '#002C66',
  },

  // Footer
  footerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: Spacing.xxxl,
    paddingBottom: Spacing.xxxl,
  },
  footerLinkText: {
    fontSize: FontSize.xs,
    fontFamily: Fonts.medium,
    color: 'rgba(67,71,81,0.6)',
  },
});
