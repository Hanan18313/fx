import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../components/common/AppHeader';
import { Colors, Spacing, FontSize, BorderRadius, Fonts } from '../../constants/theme';

type Tab = 'agreement' | 'privacy';

export default function AgreementScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<Tab>('agreement');

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <AppHeader title="法律中心" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero 标题区 */}
        <View style={styles.heroSection}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>更新于 2024年8月</Text>
          </View>
          <Text style={styles.mainTitle}>
            {activeTab === 'agreement' ? '用户协议' : '隐私政策'}
          </Text>
          <View style={styles.accentBar} />
        </View>

        {activeTab === 'agreement' ? <AgreementContent /> : <PrivacyContent />}
      </ScrollView>

      {/* 底部 Tab 栏 */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('agreement')}
        >
          <Ionicons
            name="document-text-outline"
            size={18}
            color={activeTab === 'agreement' ? Colors.navyButton : Colors.bodyGray}
          />
          <Text style={[styles.navLabel, activeTab === 'agreement' && styles.navLabelActive]}>
            协议
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('privacy')}
        >
          <Ionicons
            name="shield-outline"
            size={18}
            color={activeTab === 'privacy' ? Colors.navyButton : Colors.bodyGray}
          />
          <Text style={[styles.navLabel, activeTab === 'privacy' && styles.navLabelActive]}>
            隐私
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function AgreementContent() {
  return (
    <>
      {/* 摘要卡片 */}
      <View style={styles.cardGrid}>
        <View style={styles.summaryCard}>
          <Ionicons name="lock-closed-outline" size={20} color={Colors.navyButton} style={styles.cardIcon} />
          <Text style={styles.cardTitle}>您的隐私</Text>
          <Text style={styles.cardBody}>
            我们通过端到端加密保护您的数据，绝不会将您的个人信息出售给第三方。
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="document-outline" size={20} color={Colors.navyButton} style={styles.cardIcon} />
          <Text style={styles.cardTitle}>我们的条款</Text>
          <Text style={styles.cardBody}>
            通过使用我们的服务，即表示您同意遵守我们的社区标准和当地法规。
          </Text>
        </View>
      </View>

      {/* 详细条款 */}
      <View style={styles.sectionsContainer}>
        <Section num="01" title="接受条款">
          <Text style={styles.bodyText}>
            欢迎来到我们的平台。这些条款规定了您对我们的软件、网站和服务的使用。通过访问或使用我们的服务，您确认已阅读、理解并同意受本协议的约束。如果您不同意，请立即停止使用。
          </Text>
        </Section>

        <Section num="02" title="用户准入">
          <Text style={styles.bodyText}>
            您必须年满 18 周岁或达到您所在司法管辖区的法定成年年龄才能创建账户。通过注册，您声明所提供的所有信息均准确无误，且法律未禁止您使用我们的服务。
          </Text>
          <View style={styles.blockquote}>
            <Text style={styles.blockquoteText}>
              所有内容，包括但不限于徽标、视觉设计、源代码和编辑内容，均为公司的专有财产。我们授予您有限的、非排他性的、不可转让的许可，允许您出于个人非商业目的访问和使用本平台。
            </Text>
          </View>
        </Section>

        <Section num="03" title="知识产权">
          <Text style={styles.bodyText}>
            所有内容，包括但不限于徽标、视觉设计、源代码和编辑内容，均为公司的专有财产。我们授予您有限的、非排他性的、不可转让的许可，允许您出于个人非商业目的访问和使用本平台。
          </Text>
          <View style={styles.listContainer}>
            <ListItem icon="checkmark-circle" color="#22C55E" text="您可以下载官方文档进行个人记录保存。" />
            <ListItem icon="close-circle" color="#EF4444" text="您不得对我们的专有代码进行反向工程、抓取或分发。" />
          </View>
        </Section>

        <Section num="04" title="账号终止">
          <Text style={styles.bodyText}>
            我们保留在不事先通知的情况下，根据我们的自行判断，对我们认为违反这些条款或对其他用户、我们或第三方有害的行为，或出于任何其他原因，暂停或终止访问我们服务的权利。
          </Text>
        </Section>
      </View>

      {/* 底部装饰图 */}
      <View style={styles.footerImageBox}>
        <View style={styles.footerImagePlaceholder} />
        <View style={styles.footerGradient} />
        <View style={styles.footerTextBox}>
          <Text style={styles.footerTitle}>致力于透明化</Text>
          <Text style={styles.footerSubtitle}>我们的法律框架建立在信任和相互尊重的基础上。</Text>
        </View>
      </View>
    </>
  );
}

function PrivacyContent() {
  return (
    <View style={pStyles.container}>
      {/* Hero 卡片 */}
      <View style={pStyles.heroCard}>
        {/* <View style={pStyles.heroGradientOverlay} /> */}
        <View style={pStyles.badge}>
          <Text style={pStyles.badgeText}>法律文件</Text>
        </View>
        <Text style={pStyles.heroTitle}>隐私政策</Text>
        <Text style={pStyles.heroBody}>
          我们重视您的隐私。本政策详细说明了我们如何收集、使用和保护您的个人信息，旨在为您提供最安全的使用体验。
        </Text>
        <View style={pStyles.heroDateRow}>
          <Ionicons name="calendar-outline" size={12} color={Colors.bodyGray} />
          <Text style={pStyles.heroDateText}>最后更新日期：2023年10月24日</Text>
        </View>
      </View>

      {/* 第1节：信息收集 */}
      <View style={pStyles.whiteCard}>
        <View style={pStyles.sectionHeader}>
          <View style={pStyles.iconBox}>
            <Ionicons name="server-outline" size={18} color={Colors.navyButton} />
          </View>
          <Text style={pStyles.sectionTitle}>1. 信息收集</Text>
        </View>
        <Text style={pStyles.sectionBody}>
          我们收集信息是为了向所有用户提供更好的服务。我们收集信息的方式如下：
        </Text>
        <View style={pStyles.bulletList}>
          <BulletItem text="您向我们提供的信息：例如，当您注册帐户时，我们会要求您提供姓名、电子邮件地址、电话号码或付款详细信息。" />
          <BulletItem text="我们在您使用服务时获取的信息：我们会收集关于您使用的服务以及使用方式的信息，例如您何时查看我们的内容。" />
        </View>
      </View>

      {/* 高亮卡片：安全保障 */}
      <View style={pStyles.highlightCard}>
        <Ionicons name="shield-checkmark-outline" size={30} color={Colors.textWhite} />
        <Text style={pStyles.highlightTitle}>安全保障</Text>
        <Text style={pStyles.highlightBody}>
          您的数据通过 256 位 SSL 加密进行传输，并存储在受高度保护的数据中心。
        </Text>
        <TouchableOpacity style={pStyles.highlightBtn}>
          <Text style={pStyles.highlightBtnText}>了解加密技术</Text>
        </TouchableOpacity>
      </View>

      {/* 第2节：信息的使用（左边框卡） */}
      <View style={pStyles.borderedCard}>
        <Text style={pStyles.sectionTitle}>2. 信息的使用</Text>
        <Text style={pStyles.sectionBody}>
          我们将收集到的信息用于提供、维护、保护和改进我们的服务，同时开发新的服务并保护我们的用户。我们还会使用此类信息为您提供定制内容，例如向您提供相关度更高的搜索结果和广告。
        </Text>
        <Text style={pStyles.sectionBody}>
          在将信息用于本隐私政策未涵盖的用途之前，我们会征求您的同意。我们处理个人信息时，会严格遵守适用的法律法规。
        </Text>
      </View>

      {/* 第3节：信息共享 */}
      <View style={pStyles.whiteCard}>
        <Text style={pStyles.sectionTitle}>3. 信息共享</Text>
        <Text style={[pStyles.sectionBody, { fontSize: FontSize.md, lineHeight: 22 }]}>
          除非符合以下情形之一，否则我们不会与本公司以外的任何公司、组织和个人分享您的个人信息：
        </Text>
        <View style={pStyles.tagList}>
          {['征得您的明确同意', '用于外部处理（服务提供商）', '法律原因或配合政府调查'].map((tag) => (
            <View key={tag} style={pStyles.tag}>
              <Text style={pStyles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 图片氛围区 */}
      <View style={pStyles.moodBox}>
        <View style={pStyles.moodBg} />
        <View style={pStyles.moodOverlay} />
        <View style={pStyles.moodTextBox}>
          <Text style={pStyles.moodLabel}>透明度声明</Text>
          <Text style={pStyles.moodTitle}>我们承诺对数据的透明处理</Text>
        </View>
      </View>

      {/* 第4节：您的权利 */}
      <View style={pStyles.whiteCard}>
        <Text style={pStyles.sectionTitle}>4. 您的权利与选择</Text>
        <View style={pStyles.rightsGrid}>
          <RightsCard icon="person-outline" title="访问与更正" desc="您可以随时在账户设置中查看或修改您的个人资料信息。" />
          <RightsCard icon="trash-outline" title="删除权" desc="符合法定条件时，您可以请求注销账号并删除您的所有个人信息。" />
          <RightsCard icon="toggle-outline" title="撤回同意" desc="您可以随时调整隐私设置，拒绝接收营销推广信息或撤回权限。" />
        </View>
      </View>

      {/* 页脚联系区 */}
      <View style={pStyles.footer}>
        <Text style={pStyles.footerBody}>
          如果您对本隐私政策有任何疑问，请联系我们的法律团队：
        </Text>
        <Text style={pStyles.footerEmail}>privacy@brand.com</Text>
        <View style={pStyles.footerDivider} />
        <Text style={pStyles.footerCopy}>© 2023 数字管家法律团队</Text>
      </View>
    </View>
  );
}

function BulletItem({ text }: { text: string }) {
  return (
    <View style={pStyles.bulletItem}>
      <Text style={pStyles.bulletDot}>•</Text>
      <Text style={pStyles.bulletText}>{text}</Text>
    </View>
  );
}

function RightsCard({
  icon,
  title,
  desc,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  desc: string;
}) {
  return (
    <View style={pStyles.rightsCard}>
      <Ionicons name={icon} size={18} color={Colors.navyButton} style={pStyles.rightsIcon} />
      <Text style={pStyles.rightsTitle}>{title}</Text>
      <Text style={pStyles.rightsDesc}>{desc}</Text>
    </View>
  );
}

const pStyles = StyleSheet.create({
  container: {
    gap: 24,
  },
  // Hero
  heroCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: 32,
    overflow: 'hidden',
    gap: 12,
  },
  heroGradientOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: '34%',
    backgroundColor: 'rgba(0,65,145,0.06)',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#C8D7FE',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: FontSize.sm,
    fontFamily: Fonts.bold,
    color: '#384666',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 36,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    letterSpacing: -1.8,
    marginTop: 4,
  },
  heroBody: {
    fontSize: FontSize.xl,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
    lineHeight: 29,
  },
  heroDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: 4,
  },
  heroDateText: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
  },
  // White card
  whiteCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: 32,
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: FontSize.title,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  sectionBody: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
    lineHeight: 28,
  },
  // Bullet list
  bulletList: {
    gap: 12,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bulletDot: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.numBold,
    color: Colors.navyButton,
    lineHeight: 28,
  },
  bulletText: {
    flex: 1,
    fontSize: FontSize.lg,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
    lineHeight: 28,
  },
  // Highlight card
  highlightCard: {
    backgroundColor: Colors.navyButton,
    borderRadius: BorderRadius.lg,
    padding: 32,
    gap: 8,
  },
  highlightTitle: {
    fontSize: FontSize.xl,
    fontFamily: Fonts.bold,
    color: Colors.textWhite,
    marginTop: Spacing.lg,
  },
  highlightBody: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: '#8DB1FF',
    lineHeight: 19,
  },
  highlightBtn: {
    alignSelf: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#8DB1FF',
    paddingBottom: 5,
    marginTop: Spacing.xxl,
  },
  highlightBtnText: {
    fontSize: FontSize.sm,
    fontFamily: Fonts.medium,
    color: Colors.textWhite,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  // Bordered card (left blue border)
  borderedCard: {
    backgroundColor: '#F3F3F3',
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.navyButton,
    paddingLeft: 36,
    paddingRight: 32,
    paddingVertical: 32,
    gap: 16,
  },
  // Tags
  tagList: {
    gap: Spacing.sm,
  },
  tag: {
    backgroundColor: '#EEEEEE',
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  tagText: {
    fontSize: FontSize.sm,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
  },
  // Mood image box
  moodBox: {
    height: 300,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  moodBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#001F4D',
  },
  moodOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  moodTextBox: {
    position: 'absolute',
    bottom: 32,
    left: 32,
    right: 32,
    gap: 4,
  },
  moodLabel: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: 'rgba(255,255,255,0.8)',
  },
  moodTitle: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.textWhite,
    lineHeight: 32,
  },
  // Rights grid
  rightsGrid: {
    gap: Spacing.xxl,
  },
  rightsCard: {
    backgroundColor: '#EEEEEE',
    borderRadius: BorderRadius.lg,
    padding: 24,
    minHeight: 148,
  },
  rightsIcon: {
    marginBottom: Spacing.xl,
  },
  rightsTitle: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  rightsDesc: {
    fontSize: FontSize.sm,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
    lineHeight: 16,
  },
  // Footer
  footer: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: 0,
  },
  footerBody: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  footerEmail: {
    fontSize: FontSize.xl,
    fontFamily: Fonts.numBold,
    color: Colors.navyButton,
    textAlign: 'center',
  },
  footerDivider: {
    width: 96,
    height: 1,
    backgroundColor: '#E2E2E2',
    marginVertical: 48,
  },
  footerCopy: {
    fontSize: FontSize.xs,
    fontFamily: Fonts.medium,
    color: 'rgba(67,71,81,0.5)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});

function Section({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeading}>
        <Text style={styles.sectionNum}>{num}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function ListItem({
  icon,
  color,
  text,
}: {
  icon: 'checkmark-circle' | 'close-circle';
  color: string;
  text: string;
}) {
  return (
    <View style={styles.listItem}>
      <Ionicons name={icon} size={17} color={color} style={styles.listIcon} />
      <Text style={styles.listText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  // Scroll
  scroll: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xxl,
    paddingBottom: 32,
  },
  // Hero
  heroSection: {
    gap: Spacing.lg,
    marginBottom: 32,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#C8D7FE',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: FontSize.sm,
    fontFamily: Fonts.bold,
    color: '#384666',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  mainTitle: {
    fontSize: 36,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    letterSpacing: -1.8,
  },
  accentBar: {
    width: 64,
    height: 4,
    backgroundColor: Colors.navyButton,
    borderRadius: BorderRadius.full,
  },
  // Summary cards
  cardGrid: {
    gap: Spacing.lg,
    marginBottom: 40,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxl,
    borderWidth: 1,
    borderColor: 'rgba(195,198,211,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    minHeight: 160,
    justifyContent: 'center',
  },
  cardIcon: {
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  cardBody: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
    lineHeight: 22,
  },
  // Sections
  sectionsContainer: {
    gap: 40,
    marginBottom: 40,
  },
  section: {
    gap: 15,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
  },
  sectionNum: {
    fontSize: 24,
    fontFamily: Fonts.numExtraBold,
    color: Colors.navyButton,
    opacity: 0.3,
    lineHeight: 32,
  },
  sectionTitle: {
    fontSize: FontSize.title,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  bodyText: {
    fontSize: FontSize.xl,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
    lineHeight: 32,
  },
  blockquote: {
    backgroundColor: '#F3F3F3',
    borderLeftWidth: 4,
    borderLeftColor: Colors.navyButton,
    borderRadius: BorderRadius.lg,
    paddingLeft: 28,
    paddingRight: Spacing.xxl,
    paddingTop: 32,
    paddingBottom: 48,
  },
  blockquoteText: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
    lineHeight: 25,
  },
  listContainer: {
    gap: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.lg,
  },
  listIcon: {
    marginTop: 5,
  },
  listText: {
    flex: 1,
    fontSize: FontSize.xl,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
    lineHeight: 28,
  },
  // Footer image
  footerImageBox: {
    height: 272,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  footerImagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.navyButton,
    opacity: 0.85,
  },
  footerGradient: {
    ...StyleSheet.absoluteFillObject,
    top: '40%',
    backgroundColor: 'rgba(0,65,145,0.5)',
  },
  footerTextBox: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
  },
  footerTitle: {
    fontSize: FontSize.title,
    fontFamily: Fonts.bold,
    color: Colors.textWhite,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  footerSubtitle: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: 'rgba(255,255,255,0.8)',
  },
  // Bottom nav
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: 40,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    shadowColor: '#002C66',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
  },
  navItem: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    gap: 2,
  },
  navLabel: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
    letterSpacing: 0.275,
  },
  navLabelActive: {
    color: Colors.navyButton,
    fontFamily: Fonts.bold,
  },
});
