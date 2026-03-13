import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ShopHomeScreen from '../screens/shop/ShopHomeScreen';
import CategoryScreen from '../screens/category/CategoryScreen';
import CartScreen from '../screens/cart/CartScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { useCartStore } from '../store/cartStore';
import { Colors, FontSize } from '../constants/theme';

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, string> = {
  Shop: '🏠',
  Category: '📋',
  Cart: '🛒',
  Profile: '👤',
};

export default function MainTabNavigator() {
  const totalCount = useCartStore((s) => s.totalCount);
  const cartCount = totalCount();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarIcon: () => (
          <Text style={{ fontSize: 22 }}>{TAB_ICONS[route.name]}</Text>
        ),
        tabBarBadge:
          route.name === 'Cart' && cartCount > 0 ? cartCount : undefined,
        tabBarBadgeStyle: styles.badge,
      })}
    >
      <Tab.Screen name="Shop" component={ShopHomeScreen} options={{ title: '商城' }} />
      <Tab.Screen name="Category" component={CategoryScreen} options={{ title: '分类' }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ title: '购物车' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: '我的' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: Colors.primary,
    fontSize: FontSize.xs,
  },
});
