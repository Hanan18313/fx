import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';
import { Colors, Spacing, FontSize, BorderRadius, Shadow, Fonts } from '../../constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = Spacing.md;
const CARD_WIDTH = (SCREEN_WIDTH - Spacing.lg * 2 - CARD_GAP) / 2;

interface FavoriteItem {
  id: number;
  productId: number;
  product?: {
    id: number;
    name: string;
    price: string;
    images: string[];
  };
}

export default function FavoritesScreen() {
  const navigation = useNavigation<any>();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    try {
      const { data } = await api.get('/favorites');
      setFavorites(data.data ?? data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [fetchFavorites]),
  );

  const handleRemove = (item: FavoriteItem) => {
    Alert.alert('取消收藏', '确定要取消收藏吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确定',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/favorites/${item.productId}`);
            setFavorites((prev) => prev.filter((f) => f.id !== item.id));
          } catch (err: any) {
            Alert.alert('失败', err.response?.data?.message || '操作失败');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: FavoriteItem }) => {
    const product = item.product;
    if (!product) return null;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ProductDetail', { product })}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: product.images?.[0] }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.cardBody}>
          <Text style={styles.cardName} numberOfLines={2}>
            {product.name}
          </Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardPrice}>¥{product.price}</Text>
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => handleRemove(item)}
            >
              <Text style={styles.removeBtnText}>取消收藏</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>💔</Text>
            <Text style={styles.emptyTitle}>还没有收藏</Text>
            <Text style={styles.emptySubtitle}>去逛逛商城，发现心仪商品吧</Text>
            <TouchableOpacity
              style={styles.goShopBtn}
              onPress={() => navigation.navigate('Main', { screen: 'Shop' })}
            >
              <Text style={styles.goShopText}>去逛逛</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
  list: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    ...Shadow.sm,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: CARD_WIDTH,
    backgroundColor: Colors.surfaceSecondary,
  },
  cardBody: {
    padding: Spacing.md,
  },
  cardName: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
    height: 40,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPrice: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.numBold,
    color: Colors.primary,
  },
  removeBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  removeBtnText: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 120,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    fontFamily: Fonts.semibold,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
    marginBottom: Spacing.xxl,
  },
  goShopBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  goShopText: {
    color: Colors.textWhite,
    fontSize: FontSize.md,
    fontFamily: Fonts.semibold,
  },
});
