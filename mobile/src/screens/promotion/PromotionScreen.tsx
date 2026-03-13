import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PromotionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>推广中心</Text>
      <Text style={styles.placeholder}>功能开发中...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  placeholder: { fontSize: 14, color: '#999' },
});
