import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ShopHomeScreen from '../screens/shop/ShopHomeScreen';
import CategoryScreen from '../screens/category/CategoryScreen';
import CartScreen from '../screens/cart/CartScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { useCartStore } from '../store/cartStore';
import { Colors, FontSize, Shadow, Fonts } from '../constants/theme';

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, { outline: keyof typeof Ionicons.glyphMap; filled: keyof typeof Ionicons.glyphMap }> = {
  Shop: { outline: 'home-outline', filled: 'home' },
  Category: { outline: 'grid-outline', filled: 'grid' },
  Cart: { outline: 'cart-outline', filled: 'cart' },
  Profile: { outline: 'person-outline', filled: 'person' },
};

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons = TAB_ICONS[name];
  if (!icons) return null;
  return (
    <View style={styles.tabIconWrap}>
      <Ionicons
        name={focused ? icons.filled : icons.outline}
        size={22}
        color={focused ? Colors.tabActive : Colors.tabInactive}
      />
      {focused && <View style={styles.tabDot} />}
    </View>
  );
}

export default function MainTabNavigator() {
  const cartCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarBadge: route.name === 'Cart' && cartCount > 0 ? cartCount : undefined,
        tabBarBadgeStyle: styles.badge,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      })}
    >
      <Tab.Screen name="Shop" component={ShopHomeScreen} options={{ title: '首页' }} />
      <Tab.Screen name="Category" component={CategoryScreen} options={{ title: '分类' }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ title: '购物车' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: '我的' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 0,
    paddingTop: 4,
    height: 80,
    ...Shadow.md,
  },
  tabLabel: {
    fontSize: FontSize.xs,
    fontFamily: Fonts.medium,
    marginBottom: 4,
  },
  badge: {
    backgroundColor: Colors.navyButton,
    fontSize: FontSize.xs,
    minWidth: 18,
    height: 18,
  },
  tabIconWrap: {
    alignItems: 'center',
  },
  tabDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.tabActive,
    marginTop: 2,
  },
});
