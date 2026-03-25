import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import ProfitDashboardScreen from '../screens/profit/ProfitDashboardScreen';
import WalletScreen from '../screens/wallet/WalletScreen';
import PromotionScreen from '../screens/promotion/PromotionScreen';
import InviteeListScreen from '../screens/promotion/InviteeListScreen';
import RewardListScreen from '../screens/promotion/RewardListScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const token = useAuthStore((s) => s.token);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen
            name="ProfitDashboard"
            component={ProfitDashboardScreen}
            options={{ headerShown: true, title: '我的分润' }}
          />
          <Stack.Screen
            name="Wallet"
            component={WalletScreen}
            options={{ headerShown: true, title: '我的钱包' }}
          />
          <Stack.Screen
            name="Promotion"
            component={PromotionScreen}
            options={{ headerShown: true, title: '推广中心' }}
          />
          <Stack.Screen
            name="InviteeList"
            component={InviteeListScreen}
            options={{ headerShown: true, title: '我的下级' }}
          />
          <Stack.Screen
            name="RewardList"
            component={RewardListScreen}
            options={{ headerShown: true, title: '奖励流水' }}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
