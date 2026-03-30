import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import { Fonts } from '../../constants/theme';

export default function SplashScreen() {
  const navigation = useNavigation<any>();
  const loadToken = useAuthStore((s) => s.loadToken);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.94)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 80, friction: 12, useNativeDriver: true }),
    ]).start();

    const init = async () => {
      await loadToken();
      await new Promise((resolve) => setTimeout(resolve, 1500));
    };

    init().then(() => {
      const currentToken = useAuthStore.getState().token;
      navigation.replace(currentToken ? 'Main' : 'Login');
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Decorative blueish overlay — top-left */}
      <View style={styles.decorTopLeft} />
      {/* Decorative blueish overlay — bottom-right */}
      <View style={styles.decorBottomRight} />

      {/* Central branding block */}
      <Animated.View style={[styles.central, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        {/* Logo mark */}
        <View style={styles.logoWrapper}>
          {/* Accent square — top-right offset */}
          <View style={styles.accentSquare} />

          <LinearGradient
            colors={['#00418E', '#002B66']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoGradient}
          >
            {/* Abstract icon mark */}
            <View style={styles.iconMark}>
              <View style={styles.iconBar} />
              <View style={[styles.iconBar, styles.iconBarCross]} />
            </View>
          </LinearGradient>
        </View>

        {/* App name */}
        <View style={styles.brandBlock}>
          <Text style={styles.heading}>DIGITAL{'\n'}CONCIERGE</Text>
          <Text style={styles.subheading}>智慧尊享 · 极致生活</Text>
        </View>
      </Animated.View>

      {/* Bottom branding — golden-ratio positioned */}
      <Animated.View style={[styles.bottomBlock, { opacity: fadeAnim }]}>
        <View style={styles.divider} />
        <View style={styles.bottomLabelRow}>
          <Text style={styles.minimalistLabel}>MINIMALIST</Text>
          <Text style={styles.tagline}>PURE DESIGN, PURE LIFE.</Text>
        </View>
        <Text style={styles.edition}>Global Edition / 全球版</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Decorative overlays
  decorTopLeft: {
    position: 'absolute',
    top: 88,
    left: -20,
    width: 192,
    height: 192,
    backgroundColor: 'rgba(216,226,255,0.10)',
    borderRadius: 96,
  },
  decorBottomRight: {
    position: 'absolute',
    bottom: 60,
    right: -50,
    width: 256,
    height: 256,
    backgroundColor: 'rgba(216,226,255,0.10)',
    borderRadius: 128,
  },

  // Central section
  central: {
    alignItems: 'center',
    marginBottom: 40,
  },

  // Logo
  logoWrapper: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  accentSquare: {
    position: 'absolute',
    top: -16,
    right: -16,
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255,219,205,0.30)',
    borderRadius: 8,
  },
  logoGradient: {
    width: 65,
    height: 65,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconMark: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBar: {
    position: 'absolute',
    width: 18,
    height: 2.5,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  iconBarCross: {
    transform: [{ rotate: '90deg' }],
  },

  // Brand name
  brandBlock: {
    alignItems: 'center',
    gap: 10,
  },
  heading: {
    fontFamily: Fonts.numBlack,
    fontSize: 36,
    color: '#1A1C1C',
    textAlign: 'center',
    letterSpacing: 7.2,
    lineHeight: 40,
    textTransform: 'uppercase',
  },
  subheading: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: '#434750',
    textAlign: 'center',
    letterSpacing: 7,
  },

  // Bottom block
  bottomBlock: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
    gap: 6,
  },
  divider: {
    width: 32,
    height: 1,
    backgroundColor: 'rgba(194,198,211,0.30)',
    marginBottom: 10,
  },
  bottomLabelRow: {
    alignItems: 'center',
    gap: 4,
  },
  minimalistLabel: {
    fontFamily: Fonts.numBold,
    fontSize: 12,
    color: '#002B66',
    letterSpacing: 9.6,
    textTransform: 'uppercase',
  },
  tagline: {
    fontFamily: Fonts.numMedium,
    fontSize: 10,
    color: 'rgba(67,71,80,0.60)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  edition: {
    fontFamily: Fonts.numSemiBold,
    fontSize: 9,
    color: '#737784',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    marginTop: 16,
  },
});
