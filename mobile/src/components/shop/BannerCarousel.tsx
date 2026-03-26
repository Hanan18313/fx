import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Spacing, Fonts } from '../../constants/theme';
import type { BannerCarouselProps } from './types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BANNER_MARGIN = Spacing.xxl;
const BANNER_WIDTH = SCREEN_WIDTH - BANNER_MARGIN * 2;
const BANNER_HEIGHT = 214;

export default function BannerCarousel({ banners, onBannerPress }: BannerCarouselProps) {
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % banners.length;
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);
  }, [banners.length]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (banners.length > 1) startAutoPlay();
    return stopAutoPlay;
  }, [banners.length, startAutoPlay, stopAutoPlay]);

  if (banners.length === 0) return null;

  const renderBannerSlide = ({ item }: { item: (typeof banners)[0] }) => (
    <View style={styles.slide}>
      <Image source={{ uri: item.imageUrl }} style={styles.bannerImage} resizeMode="cover" />
      <LinearGradient
        colors={['rgba(0,44,102,0.85)', 'rgba(0,44,102,0)']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradient}
      >
        <View style={styles.overlayContent}>
          {item.badge && (
            <View style={styles.badgeWrap}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}

          {item.title && <Text style={styles.heroTitle}>{item.title}</Text>}

          {item.buttonText && (
            <TouchableOpacity
              style={styles.heroButton}
              onPress={() => onBannerPress?.(item)}
              activeOpacity={0.8}
            >
              <Text style={styles.heroButtonText}>{item.buttonText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => String(item.id)}
        onScrollBeginDrag={stopAutoPlay}
        onScrollEndDrag={startAutoPlay}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / BANNER_WIDTH);
          setActiveIndex(index);
        }}
        renderItem={renderBannerSlide}
        getItemLayout={(_, index) => ({
          length: BANNER_WIDTH,
          offset: BANNER_WIDTH * index,
          index,
        })}
      />

      <View style={styles.dots}>
        {banners.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: BANNER_MARGIN,
    paddingTop: Spacing.lg,
    gap: Spacing.lg,
  },
  slide: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 32,
  },
  overlayContent: {
    gap: 8,
  },
  badgeWrap: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(85,28,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 4,
  },
  badgeText: {
    color: Colors.priceOrange,
    fontSize: 10,
    fontFamily: Fonts.medium,
    letterSpacing: 1,
  },
  heroTitle: {
    color: Colors.textWhite,
    fontSize: 30,
    fontFamily: Fonts.medium,
    lineHeight: 38,
    maxWidth: 220,
  },
  heroButton: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  heroButtonText: {
    color: Colors.navy,
    fontSize: 14,
    fontFamily: Fonts.medium,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#E2E2E2',
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.navyButton,
  },
});
