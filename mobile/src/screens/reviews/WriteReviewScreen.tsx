import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import api from '../../services/api';
import { Colors, Spacing, FontSize, BorderRadius, Fonts } from '../../constants/theme';

type RouteParams = {
  WriteReview: {
    orderId: number;
    productId: number;
    productName: string;
    productImage?: string;
    productVariant?: string;
  };
};

const STAR_COLOR = '#F5A623';
const MAX_IMAGES = 4;

export default function WriteReviewScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, 'WriteReview'>>();
  const { orderId, productId, productName, productImage, productVariant } = route.params;

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [anonymous, setAnonymous] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handlePickImage = async () => {
    if (images.length >= MAX_IMAGES) {
      Alert.alert('提示', `最多上传 ${MAX_IMAGES} 张图片`);
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('提示', '需要相册权限才能上传图片');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsMultipleSelection: false,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('提示', '请先为商品评分');
      return;
    }
    if (content.trim().length < 5) {
      Alert.alert('提示', '评价内容至少 5 个字');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/reviews', {
        orderId,
        productId,
        rating,
        content: content.trim(),
        anonymous,
        images,
      });
      Alert.alert('发布成功', '您的评价已提交，感谢反馈！', [
        { text: '好的', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('提交失败', err.response?.data?.message || '网络错误');
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = rating > 0 && content.trim().length >= 5 && !submitting;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={56}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Product Summary */}
          <View style={styles.productRow}>
            <View style={styles.productImageWrap}>
              {productImage ? (
                <Image source={{ uri: productImage }} style={styles.productImage} resizeMode="cover" />
              ) : (
                <View style={styles.productImagePlaceholder} />
              )}
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>{productName}</Text>
              {productVariant ? (
                <Text style={styles.productVariant} numberOfLines={1}>{productVariant}</Text>
              ) : null}
            </View>
          </View>

          {/* Star Rating */}
          <View style={styles.ratingSection}>
            <Text style={styles.ratingLabel}>评分等级</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((n) => (
                <TouchableOpacity key={n} onPress={() => setRating(n)} activeOpacity={0.7} hitSlop={6}>
                  <Ionicons
                    name={n <= rating ? 'star' : 'star-outline'}
                    size={28}
                    color={n <= rating ? STAR_COLOR : '#C3C6D3'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Review Text */}
          <TextInput
            style={styles.textArea}
            value={content}
            onChangeText={setContent}
            placeholder="分享您的使用感受，帮助更多志趣相投的人..."
            placeholderTextColor="#737783"
            multiline
            maxLength={500}
            textAlignVertical="top"
          />

          {/* Photo Upload */}
          <View style={styles.photoRow}>
            {images.map((uri, index) => (
              <View key={index} style={styles.photoThumb}>
                <Image source={{ uri }} style={styles.photoThumbImage} resizeMode="cover" />
                <TouchableOpacity
                  style={styles.photoRemoveBtn}
                  onPress={() => handleRemoveImage(index)}
                  hitSlop={4}
                >
                  <Ionicons name="close-circle" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
            {images.length < MAX_IMAGES && (
              <TouchableOpacity
                style={styles.addPhotoBtn}
                onPress={handlePickImage}
                activeOpacity={0.7}
              >
                <Ionicons name="camera-outline" size={22} color={Colors.bodyGray} />
                <Text style={styles.addPhotoText}>添加图片</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Anonymous Toggle */}
          <TouchableOpacity
            style={styles.anonymousRow}
            onPress={() => setAnonymous((v) => !v)}
            activeOpacity={0.8}
          >
            <View style={styles.anonymousLeft}>
              <Ionicons
                name={anonymous ? 'checkmark-circle' : 'ellipse-outline'}
                size={18}
                color={anonymous ? Colors.navyButton : Colors.bodyGray}
              />
              <Text style={styles.anonymousLabel}>匿名评价</Text>
            </View>
            <Text style={styles.anonymousStatus}>{anonymous ? '已选择' : '未选择'}</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!canSubmit}
            activeOpacity={0.85}
          >
            <Text style={styles.submitBtnText}>
              {submitting ? '提交中...' : '提交评价'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scrollContent: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xxl,
    paddingBottom: 16,
  },

  // Product row
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  productImageWrap: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    backgroundColor: '#EEEEEE',
    flexShrink: 0,
  },
  productImage: {
    width: 80,
    height: 80,
  },
  productImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#EEEEEE',
  },
  productInfo: {
    flex: 1,
    gap: 4,
  },
  productName: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.medium,
    color: '#1a1c1c',
    lineHeight: 20,
  },
  productVariant: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
    lineHeight: 20,
  },

  // Rating
  ratingSection: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
  ratingLabel: {
    fontSize: FontSize.xs,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  starsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: Spacing.lg,
  },

  // Text area
  textArea: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.medium,
    color: '#1a1c1c',
    lineHeight: 24,
    minHeight: 160,
    padding: 0,
  },

  // Photo upload
  photoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  addPhotoBtn: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#C3C6D3',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addPhotoText: {
    fontSize: 10,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
    textAlign: 'center',
  },
  photoThumb: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.sm,
    overflow: 'visible',
    position: 'relative',
  },
  photoThumbImage: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.sm,
  },
  photoRemoveBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Anonymous
  anonymousRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
  },
  anonymousLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  anonymousLabel: {
    fontSize: FontSize.md,
    fontFamily: Fonts.medium,
    color: Colors.bodyGray,
  },
  anonymousStatus: {
    fontSize: FontSize.xs,
    fontFamily: Fonts.medium,
    color: '#737783',
  },

  // Footer
  footer: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xxl,
    backgroundColor: 'rgba(249,249,249,0.8)',
  },
  submitBtn: {
    backgroundColor: Colors.navyButton,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#002C66', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24 },
      android: { elevation: 4 },
    }),
  },
  submitBtnDisabled: {
    opacity: 0.45,
  },
  submitBtnText: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.medium,
    color: '#fff',
    letterSpacing: 0.4,
  },
});
