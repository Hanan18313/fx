import { Platform, ViewStyle } from 'react-native';

export const Colors = {
  primary: '#E53935',
  primaryLight: '#FF6F60',
  primaryDark: '#AB000D',

  accent: '#F57C00',
  success: '#2E7D32',
  warning: '#F9A825',
  error: '#D32F2F',
  info: '#1565C0',
  memberGold: '#D4A854',

  navy: '#002C66',
  navyButton: '#004191',
  priceOrange: '#FF9768',
  bodyGray: '#434751',

  textPrimary: '#1A1C1C',
  textSecondary: '#555555',
  textTertiary: '#999999',
  textWhite: '#FFFFFF',
  textLink: '#1565C0',

  background: '#F4F5F7',
  surface: '#FFFFFF',
  surfaceSecondary: '#F0F0F0',

  border: '#E8E8E8',
  divider: '#F0F0F0',

  tabActive: '#004191',
  tabInactive: '#BDBDBD',

  skeleton: '#E0E0E0',
  overlay: 'rgba(0,0,0,0.5)',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 999,
} as const;

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  title: 20,
} as const;

/**
 * Noto Sans SC (OFL) — 中英文通用正文字体
 * Inter (OFL) — 拉丁文/数字专用 UI 字体
 */
export const Fonts = {
  regular: 'NotoSansSC-Regular',
  medium: 'NotoSansSC-Medium',
  semibold: 'NotoSansSC-SemiBold',
  bold: 'NotoSansSC-Bold',
  black: 'NotoSansSC-Black',
  numRegular: 'Inter-Regular',
  numMedium: 'Inter-Medium',
  numSemiBold: 'Inter-SemiBold',
  numBold: 'Inter-Bold',
  numExtraBold: 'Inter-ExtraBold',
  numBlack: 'Inter-Black',
} as const;

export const Shadow = {
  sm: Platform.select<ViewStyle>({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3 },
    android: { elevation: 2 },
  }) ?? {},
  md: Platform.select<ViewStyle>({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
    android: { elevation: 4 },
  }) ?? {},
  lg: Platform.select<ViewStyle>({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 16 },
    android: { elevation: 8 },
  }) ?? {},
} as const;
