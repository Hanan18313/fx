import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../../services/api';
import { Colors, Spacing, FontSize, BorderRadius, Shadow, Fonts } from '../../constants/theme';
import type { Address } from '../../types/order';

export default function AddressEditScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const existing: Address | undefined = route.params?.address;
  const isEdit = !!existing;

  const [name, setName] = useState(existing?.name || '');
  const [phone, setPhone] = useState(existing?.phone || '');
  const [province, setProvince] = useState(existing?.province || '');
  const [city, setCity] = useState(existing?.city || '');
  const [district, setDistrict] = useState(existing?.district || '');
  const [detail, setDetail] = useState(existing?.detail || '');
  const [isDefault, setIsDefault] = useState(existing?.isDefault === 1);
  const [saving, setSaving] = useState(false);

  const validate = (): boolean => {
    if (!name.trim()) { Alert.alert('提示', '请输入收货人姓名'); return false; }
    if (!/^1\d{10}$/.test(phone)) { Alert.alert('提示', '请输入正确的11位手机号'); return false; }
    if (!province.trim()) { Alert.alert('提示', '请输入省份'); return false; }
    if (!city.trim()) { Alert.alert('提示', '请输入城市'); return false; }
    if (!district.trim()) { Alert.alert('提示', '请输入区/县'); return false; }
    if (!detail.trim()) { Alert.alert('提示', '请输入详细地址'); return false; }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      province: province.trim(),
      city: city.trim(),
      district: district.trim(),
      detail: detail.trim(),
      isDefault: isDefault ? 1 : 0,
    };
    try {
      if (isEdit) {
        await api.put(`/addresses/${existing!.id}`, payload);
      } else {
        await api.post('/addresses', payload);
      }
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('保存失败', err.response?.data?.message || '网络错误');
    } finally {
      setSaving(false);
    }
  };

  const renderField = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    options?: { placeholder?: string; keyboardType?: any; multiline?: boolean; maxLength?: number },
  ) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, options?.multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChange}
        placeholder={options?.placeholder || `请输入${label}`}
        placeholderTextColor={Colors.textTertiary}
        keyboardType={options?.keyboardType}
        multiline={options?.multiline}
        maxLength={options?.maxLength}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            {renderField('收货人', name, setName, { maxLength: 20 })}
            {renderField('手机号', phone, setPhone, { keyboardType: 'phone-pad', maxLength: 11 })}

            <View style={styles.regionRow}>
              <View style={styles.regionField}>
                <Text style={styles.label}>省</Text>
                <TextInput
                  style={styles.regionInput}
                  value={province}
                  onChangeText={setProvince}
                  placeholder="省份"
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>
              <View style={styles.regionField}>
                <Text style={styles.label}>市</Text>
                <TextInput
                  style={styles.regionInput}
                  value={city}
                  onChangeText={setCity}
                  placeholder="城市"
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>
              <View style={styles.regionField}>
                <Text style={styles.label}>区</Text>
                <TextInput
                  style={styles.regionInput}
                  value={district}
                  onChangeText={setDistrict}
                  placeholder="区/县"
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>
            </View>

            {renderField('详细地址', detail, setDetail, {
              placeholder: '街道、楼牌号等',
              multiline: true,
              maxLength: 100,
            })}

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>设为默认地址</Text>
              <Switch
                value={isDefault}
                onValueChange={setIsDefault}
                trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                thumbColor={isDefault ? Colors.primary : '#f4f3f4'}
              />
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>
            {saving ? '保存中...' : '保存地址'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    ...Shadow.sm,
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
  },
  field: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    fontFamily: Fonts.medium,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  regionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  regionField: {
    flex: 1,
  },
  regionInput: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.divider,
  },
  switchLabel: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: Colors.textWhite,
    fontSize: FontSize.lg,
    fontFamily: Fonts.semibold,
  },
});
