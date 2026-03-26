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
import ConfirmOrderScreen from '../screens/order/ConfirmOrderScreen';
import OrderListScreen from '../screens/order/OrderListScreen';
import OrderDetailScreen from '../screens/order/OrderDetailScreen';
import PayResultScreen from '../screens/order/PayResultScreen';
import WithdrawScreen from '../screens/wallet/WithdrawScreen';
import AddressListScreen from '../screens/address/AddressListScreen';
import AddressEditScreen from '../screens/address/AddressEditScreen';
import UserInfoScreen from '../screens/profile/UserInfoScreen';
import FavoritesScreen from '../screens/favorites/FavoritesScreen';
import NotificationScreen from '../screens/notifications/NotificationScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import SearchScreen from '../screens/shop/SearchScreen';

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
          <Stack.Screen name="ConfirmOrder" component={ConfirmOrderScreen} />
          <Stack.Screen name="OrderList" component={OrderListScreen} />
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
          <Stack.Screen name="PayResult" component={PayResultScreen} />
          <Stack.Screen
            name="Withdraw"
            component={WithdrawScreen}
            options={{ headerShown: true, title: '申请提现' }}
          />
          <Stack.Screen
            name="AddressList"
            component={AddressListScreen}
            options={{ headerShown: true, title: '收货地址' }}
          />
          <Stack.Screen
            name="AddressEdit"
            component={AddressEditScreen}
            options={{ headerShown: true, title: '编辑地址' }}
          />
          <Stack.Screen
            name="UserInfo"
            component={UserInfoScreen}
            options={{ headerShown: true, title: '个人信息' }}
          />
          <Stack.Screen
            name="Favorites"
            component={FavoritesScreen}
            options={{ headerShown: true, title: '我的收藏' }}
          />
          <Stack.Screen
            name="Notifications"
            component={NotificationScreen}
            options={{ headerShown: true, title: '消息通知' }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ headerShown: true, title: '设置' }}
          />
          <Stack.Screen name="Search" component={SearchScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
