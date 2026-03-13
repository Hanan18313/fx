import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import { Colors, FontSize } from '../../constants/theme';

export default function SplashScreen() {
  const navigation = useNavigation<any>();
  const loadToken = useAuthStore((s) => s.loadToken);
  const token = useAuthStore((s) => s.token);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    const init = async () => {
      await loadToken();
      await new Promise((resolve) => setTimeout(resolve, 1500));
    };

    init().then(() => {
      const currentToken = useAuthStore.getState().token;
      if (currentToken) {
        navigation.replace('Main');
      } else {
        navigation.replace('Login');
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY }] },
        ]}
      >
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>商</Text>
        </View>
        <Text style={styles.appName}>商城分润</Text>
        <Text style={styles.slogan}>品质好物 分享赚钱</Text>
      </Animated.View>
      <ActivityIndicator
        style={styles.loading}
        size="small"
        color="rgba(255,255,255,0.8)"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.textWhite,
  },
  appName: {
    fontSize: FontSize.xxl + 4,
    fontWeight: 'bold',
    color: Colors.textWhite,
    marginBottom: 8,
  },
  slogan: {
    fontSize: FontSize.md,
    color: 'rgba(255,255,255,0.8)',
  },
  loading: {
    position: 'absolute',
    bottom: 80,
  },
});
