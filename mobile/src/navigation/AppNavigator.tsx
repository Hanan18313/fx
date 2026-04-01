import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import AppHeader from '../components/common/AppHeader';
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
import AgreementScreen from '../screens/legal/AgreementScreen';
import NotificationDetailScreen from '../screens/notifications/NotificationDetailScreen';
import ReviewListScreen from '../screens/reviews/ReviewListScreen';
import WriteReviewScreen from '../screens/reviews/WriteReviewScreen';
import InviteScreen from '../screens/promotion/InviteScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const token = useAuthStore((s) => s.token);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Group
            screenOptions={{
              headerShown: true,
              header: ({ navigation, options }) => (
                <AppHeader
                  title={options.title ?? ''}
                  onBack={() => navigation.goBack()}
                />
              ),
            }}
          >
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: '商品详情' }} />
            <Stack.Screen name="ProfitDashboard" component={ProfitDashboardScreen} options={{ title: '我的分润' }} />
            <Stack.Screen name="Wallet" component={WalletScreen} options={{ title: '我的钱包' }} />
            <Stack.Screen name="Promotion" component={PromotionScreen} options={{ title: '推广中心' }} />
            <Stack.Screen name="InviteeList" component={InviteeListScreen} options={{ title: '我的下级' }} />
            <Stack.Screen name="RewardList" component={RewardListScreen} options={{ title: '奖励流水' }} />
            <Stack.Screen name="ConfirmOrder" component={ConfirmOrderScreen} options={{ title: '确认订单' }} />
            <Stack.Screen name="OrderList" component={OrderListScreen} options={{ title: '我的订单' }} />
            <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: '订单详情' }} />
            <Stack.Screen name="PayResult" component={PayResultScreen} options={{ title: '支付结果' }} />
            <Stack.Screen name="Withdraw" component={WithdrawScreen} options={{ title: '申请提现' }} />
            <Stack.Screen name="AddressList" component={AddressListScreen} options={{ title: '收货地址' }} />
            <Stack.Screen name="AddressEdit" component={AddressEditScreen} options={{ title: '编辑地址' }} />
            <Stack.Screen name="UserInfo" component={UserInfoScreen} options={{ title: '个人信息' }} />
            <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: '我的收藏' }} />
            <Stack.Screen name="Notifications" component={NotificationScreen} options={{ title: '消息通知' }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: '设置' }} />
            <Stack.Screen name="Agreement" component={AgreementScreen} options={{ title: '法律中心' }} />
            <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} options={{ title: '通知详情' }} />
            <Stack.Screen name="ReviewList" component={ReviewListScreen} options={{ title: '历史评价' }} />
            <Stack.Screen name="WriteReview" component={WriteReviewScreen} options={{ title: '发表评价' }} />
            <Stack.Screen name="Invite" component={InviteScreen} options={{ title: '邀请好友' }} />
          </Stack.Group>
          <Stack.Screen name="Search" component={SearchScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
