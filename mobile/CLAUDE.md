# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 开发命令

```bash
npm start          # 启动开发服务器（自动关闭占用的 8081/8082 端口）
npm run android    # Android 启动
npm run ios        # iOS 启动
npm run tunnel     # ngrok 隧道（真机联调）
npm run format     # Prettier 格式化
npm run format:check
```

> 未配置 ESLint 和测试框架。

## 技术栈

- **框架**: Expo ~54.0.0 + React Native 0.81.5 + React 19
- **语言**: TypeScript 5.9（strict 模式）
- **路由**: `@react-navigation/native-stack` + `@react-navigation/bottom-tabs`
- **状态**: Zustand（`authStore`、`cartStore`）
- **HTTP**: Axios，baseURL `http://192.168.5.90:3000/api`（可通过 `EXPO_PUBLIC_API_URL` 覆盖）
- **图标**: `@expo/vector-icons`（Ionicons）
- **图表**: `victory-native`
- **渐变**: `expo-linear-gradient`
- **本地存储**: `@react-native-async-storage/async-storage`

## 项目架构

### 导航结构

```
AppNavigator（native-stack）
├── AuthNavigator                ← token 为空时
│   ├── SplashScreen
│   ├── LoginScreen
│   └── RegisterScreen
└── MainTabNavigator             ← token 存在时
    ├── Tab: Shop（首页）
    ├── Tab: Category（分类）
    ├── Tab: Cart（购物车）
    └── Tab: Profile（我的）
    + Stack.Group（push 页面，统一 AppHeader）
        商品: ProductDetail, Search
        订单: ConfirmOrder, OrderList, OrderDetail, PayResult
        地址: AddressList, AddressEdit
        钱包: Wallet, Withdraw
        推广: Promotion, Invite, InviteeList, RewardList
        分润: ProfitDashboard
        评价: ReviewList, WriteReview
        用户: UserInfo, Settings, Agreement
        通知: Notifications, NotificationDetail
        收藏: Favorites
```

新增页面需在 `AppNavigator.tsx` 的 `Stack.Group` 内注册并 import。

### 认证流程

- `token` 存于 AsyncStorage（key: `"token"`），`authStore` 仅作内存镜像
- App 启动时 `SplashScreen` 调用 `loadToken()` 初始化
- 所有请求由 `api.ts` 拦截器自动附加 `Authorization: Bearer <token>`
- 401 响应自动 `multiRemove(["token","role"])` 并调用 `authStore.logout()`

### 购物车

当前为纯本地 Zustand（`cartStore.ts`）管理，**待迁移为服务端同步**（见下方购物车 API）。

### 主题系统（`src/constants/theme.ts`）

| 常量 | 值 | 用途 |
|------|-----|------|
| `Colors.navyButton` | `#004191` | 主按钮、选中态、Tab 激活 |
| `Colors.navy` | `#002C66` | 深色强调、大金额数字 |
| `Colors.priceOrange` | `#FF9768` | 价格、橙色高亮 |
| `Colors.bodyGray` | `#434751` | 次要文字 |
| `Fonts.medium` | `NotoSansSC-Medium` | 中文正文 |
| `Fonts.numBlack` | `Inter-Black` | 大数字 |
| `Fonts.numBold` | `Inter-Bold` | 数字强调 |
| `Spacing.*` | xs=4 sm=8 md=12 lg=16 xl=20 xxl=24 xxxl=32 | 间距 |
| `Shadow.sm/md/lg` | — | 跨平台阴影 |

### 屏幕开发约定

```tsx
<SafeAreaView style={styles.container} edges={['bottom']}>
  <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView keyboardShouldPersistTaps="handled">
      {/* 内容 */}
    </ScrollView>
    <View style={styles.footer}>{/* 底部按钮 */}</View>
  </KeyboardAvoidingView>
</SafeAreaView>
```

- `edges={['bottom']}` — header 由导航器管理
- 数据请求用 `useCallback` 包裹，在 `useEffect` / `useFocusEffect` 中调用
- 路由参数用 `useRoute<RouteProp<RouteParams, 'ScreenName'>>()` 获取
- 类型定义放同目录 `types` 文件，不内联在业务文件中

### API 调用惯例

```ts
const { data } = await api.get('/endpoint');           // 直接解构 data
await api.post('/endpoint', { field1, field2 });
// 错误处理
Alert.alert('失败', err.response?.data?.message || '网络错误');
```

---

## 页面清单与接口

Base URL: `http://192.168.5.90:3000/api`

---

### 认证模块

#### SplashScreen `screens/auth/SplashScreen.tsx`
- 调用 `authStore.loadToken()` 决定跳转 Main 或 Auth

#### LoginScreen `screens/auth/LoginScreen.tsx`
| 接口 | 入参 | 出参 |
|------|------|------|
| POST `/auth/login` | `{ phone, password }` | `{ token, role }` |

#### RegisterScreen `screens/auth/RegisterScreen.tsx`
| 接口 | 入参 | 出参 |
|------|------|------|
| POST `/auth/sms/send` | `{ phone }` | `{}` |
| POST `/auth/register` | `{ phone, code, password, invite_code? }` | `{ token, role }` |

---

### 首页 Tab

#### ShopHomeScreen `screens/shop/ShopHomeScreen.tsx`
| 接口 | 入参 | 出参 |
|------|------|------|
| GET `/banners` | — | `{ data: Banner[] }` |
| GET `/categories/quick` | — | `{ data: { id, name }[] }` |
| GET `/products/flash-sale` ⚠️ | — | `{ data: Product[] }` |
| GET `/products` | `page, pageSize, keyword?, sort?, order?` | `{ data: Product[], total }` |

> ⚠️ `mockFlashSaleProducts` / `mockBanners` / `mockQuickCategories` / `mockProducts` 为降级 mock，待后端实现后删除。

跳转：`ProductDetail`（传商品对象）、`Search`

#### SearchScreen `screens/shop/SearchScreen.tsx`
| 接口 | 入参 | 出参 |
|------|------|------|
| GET `/products` | `keyword, page, pageSize` | `{ data: Product[], total }` |

跳转：`ProductDetail`

#### ProductDetailScreen `screens/shop/ProductDetailScreen.tsx`
- 路由参数：`product: Product`（从列表页传入，无独立接口）
- 操作：`cartStore.addItem(product, quantity, spec)`（本地）

跳转：`ConfirmOrder`（直接购买）、`Cart`

---

### 分类 Tab

#### CategoryScreen `screens/category/CategoryScreen.tsx`
| 接口 | 入参 | 出参 |
|------|------|------|
| GET `/categories` | — | `{ data: Category[] }` |
| GET `/products` | `categoryId` | `{ data: Product[], total }` |

> `mockCategories` / `mockProducts` 为降级 mock。

跳转：`ProductDetail`

---

### 购物车 Tab

#### CartScreen `screens/cart/CartScreen.tsx`
- 全部操作读写 `cartStore`（本地）；推荐区使用 `mockProducts`（待迁移）
- 待迁移接口（服务端同步后）：

| 接口 | 入参 | 出参 |
|------|------|------|
| GET `/cart` | — | `{ data: CartItem[] }` |
| POST `/cart` | `{ productId, quantity, spec? }` | `{ id, ... }` |
| PUT `/cart/:itemId` | `{ quantity }` | `{}` |
| DELETE `/cart/:itemId` | — | `{}` |
| DELETE `/cart` | — | `{}`（清空） |

跳转：`ConfirmOrder`（传 selectedItems）

---

### 我的 Tab

#### ProfileScreen `screens/profile/ProfileScreen.tsx`
| 接口 | 入参 | 出参 |
|------|------|------|
| GET `/user/profile` | — | `{ nickname, phone, avatar?, role, member_no?, member_expire? }` |
| GET `/wallet/info` | — | `{ balance, total_savings }` |

跳转：`UserInfo` `Wallet` `ProfitDashboard` `OrderList` `Promotion` `Favorites` `Notifications` `Settings`

---

### 订单模块

#### OrderListScreen `screens/order/OrderListScreen.tsx`
- 路由参数：`initialTab?: 'pending'|'paid'|'shipped'|'done'|'cancelled'`

| 接口 | 入参 | 出参 |
|------|------|------|
| GET `/orders` | `page, limit=10, status?` | `{ data: Order[], total }` |
| POST `/orders/:id/pay` | — | `{ payAmount, totalAmount }` |
| PUT `/orders/:id/confirm` | — | `{}` |
| PUT `/orders/:id/cancel` | — | `{}` |

跳转：`OrderDetail`（传 orderId）、`PayResult`（传 orderId/success/amount）

#### OrderDetailScreen `screens/order/OrderDetailScreen.tsx`
- 路由参数：`orderId: number`

| 接口 | 入参 | 出参 |
|------|------|------|
| GET `/orders/:id` | — | 完整订单，含 `items[], address, remark, logistics?` |
| POST `/orders/:id/pay` | — | `{ payAmount, totalAmount }` |
| PUT `/orders/:id/confirm` | — | `{}` |
| PUT `/orders/:id/cancel` | — | `{}` |

跳转：`PayResult`、`WriteReview`（传 orderId/productId/productName 等）

#### ConfirmOrderScreen `screens/order/ConfirmOrderScreen.tsx`
- 路由参数：`items: CartItem[]`

| 接口 | 入参 | 出参 |
|------|------|------|
| GET `/addresses` | — | `{ data: Address[] }` |
| POST `/orders` | `{ items, address_id, remark? }` | `{ id, payAmount, totalAmount }` |

跳转：`AddressList`（选地址）→ `PayResult`（replace）

#### PayResultScreen `screens/order/PayResultScreen.tsx`
- 路由参数：`orderId: number, success?: boolean, amount?: string`
- 无接口调用

跳转：`OrderDetail`、`Main`（继续购物）

---

### 地址模块

#### AddressListScreen `screens/address/AddressListScreen.tsx`
| 接口 | 入参 | 出参 |
|------|------|------|
| GET `/addresses` | — | `{ data: Address[] }` |
| PUT `/addresses/:id` | `{ isDefault: 1 }` | `{}` |
| DELETE `/addresses/:id` | — | `{}` |

跳转：`AddressEdit`（新建/编辑）

#### AddressEditScreen `screens/address/AddressEditScreen.tsx`
- 路由参数：`address?: Address`（编辑时传入）

| 接口 | 入参 | 出参 |
|------|------|------|
| POST `/addresses` | `{ name, phone, province, city, district, detail, isDefault }` | `{}` |
| PUT `/addresses/:id` | 同上 | `{}` |

---

### 钱包模块

#### WalletScreen `screens/wallet/WalletScreen.tsx`
| 接口 | 入参 | 出参 |
|------|------|------|
| GET `/wallet` | — | `{ balance, frozen, total_earn }` |
| GET `/wallet/bank-cards` ⚠️ | — | `{ data: BankCard[] }` |
| GET `/wallet/transactions` ⚠️ | `page, limit` | `{ data: Transaction[], total }` |

> ⚠️ `MOCK_BANK_CARDS` / `MOCK_TRANSACTIONS` 待迁移。

跳转：`Withdraw`（传 balance）

#### WithdrawScreen `screens/wallet/WithdrawScreen.tsx`
- 路由参数：`balance: number`

| 接口 | 入参 | 出参 |
|------|------|------|
| GET `/wallet/bank-card` | — | `{ bankName, lastFour }` |
| POST `/wallet/withdraw` | `{ amount, method: 'bank'|'alipay' }` | `{}` |

约束：`amount >= 10`，不超过余额

---

### 推广模块

#### PromotionScreen `screens/promotion/PromotionScreen.tsx`
| 接口 | 入参 | 出参 |
|------|------|------|
| GET `/promotion/stats` | — | `{ invite_count, total_reward, monthly_estimate?, yesterday_earning?, referral_total, commission_total }` |
| GET `/promotion/invitees` | `page=1, limit=4` | `{ data: Invitee[], total }` |

跳转：`Withdraw`、`Invite`、`InviteeList`

#### InviteScreen `screens/promotion/InviteScreen.tsx`
| 接口 | 入参 | 出参 |
|------|------|------|
| GET `/promotion/invite-code` | — | `{ invite_code: string }` |
| GET `/promotion/stats` | — | `{ invite_count }` |

跳转：`Agreement`（活动细则）

#### InviteeListScreen `screens/promotion/InviteeListScreen.tsx`
| 接口 | 入参 | 出参 |
|------|------|------|
| GET `/promotion/invitees` | `page, limit=20` | `{ data: { nickname, avatar?, createdAt, todayEarning?, level? }[], total }` |

#### RewardListScreen `screens/promotion/RewardListScreen.tsx`
| 接口 | 入参 | 出参 |
|------|------|------|
| GET `/promotion/rewards` | `page, limit=20` | `{ data: { type: 'referral'|'commission', amount, from_nickname, created_at }[], total }` |

---

### 分润模块

#### ProfitDashboardScreen `screens/profit/ProfitDashboardScreen.tsx`
| 接口 | 入参 | 出参 |
|------|------|------|
| GET `/profit/dashboard` | — | `{ released_total, today_amount, pending_total }` |

---

### 评价模块

#### ReviewListScreen `screens/reviews/ReviewListScreen.tsx`
- 路由参数：`productId?: number`

| 接口 | 入参 | 出参 |
|------|------|------|
| GET `/reviews/stats` | `productId?` | `{ avgRating, total, withImage, positive, withFollowup }` |
| GET `/reviews` | `page, limit=20, productId?, hasImage?, minRating?, hasFollowup?` | `{ data: Review[], total }` |

#### WriteReviewScreen `screens/reviews/WriteReviewScreen.tsx`
- 路由参数：`{ orderId, productId, productName, productImage?, productVariant? }`

| 接口 | 入参 | 出参 |
|------|------|------|
| POST `/reviews` | `{ orderId, productId, rating(1-5), content(≥5字), anonymous, images?[] }` | `{}` |

---

### 通知模块

#### NotificationScreen `screens/notifications/NotificationScreen.tsx`
| 接口 | 入参 | 出参 |
|------|------|------|
| GET `/notifications` | `page, limit=20, type?` | `{ data: { id, type, title, content, isRead, linkType?, linkValue?, createdAt }[], total }` |
| PUT `/notifications/:id/read` | — | `{}` |
| PUT `/notifications/read-all` | — | `{}` |

跳转：`OrderDetail`（linkType=order）、`NotificationDetail`

#### NotificationDetailScreen `screens/notifications/NotificationDetailScreen.tsx`
- 路由参数：`item: Notification`

| 接口 | 入参 | 出参 |
|------|------|------|
| PUT `/notifications/:id/read` | — | `{}` |

---

### 用户模块

#### UserInfoScreen `screens/profile/UserInfoScreen.tsx`
| 接口 | 入参 | 出参 |
|------|------|------|
| GET `/user/profile` | — | `{ nickname, phone, avatar?, role, createdAt }` |
| PUT `/user/profile` | `{ nickname }` | `{}` |

#### SettingsScreen `screens/settings/SettingsScreen.tsx`
- 无 API，操作：`authStore.logout()`

#### AgreementScreen `screens/legal/AgreementScreen.tsx`
- 静态页面，无 API

---

### 收藏模块

#### FavoritesScreen `screens/favorites/FavoritesScreen.tsx`
| 接口 | 入参 | 出参 |
|------|------|------|
| GET `/favorites` | — | `{ data: { productId, name, price, originalPrice?, images[], tag? }[] }` |
| DELETE `/favorites/:productId` | — | `{}` |

待补充（商品详情页收藏按钮）：

| 接口 | 入参 | 出参 |
|------|------|------|
| POST `/favorites/:productId` | — | `{}` |

---

## 本地 Mock 待迁移清单

| Mock 变量 | 所在文件 | 对应接口 | 优先级 |
|-----------|---------|---------|--------|
| `mockFlashSaleProducts` | `ShopHomeScreen` | `GET /products/flash-sale` | 高 |
| `MOCK_BANK_CARDS` | `WalletScreen` | `GET /wallet/bank-cards` | 高 |
| `MOCK_TRANSACTIONS` | `WalletScreen` | `GET /wallet/transactions` | 高 |
| 购物车（Zustand 本地） | `cartStore.ts` | `GET/POST/PUT/DELETE /cart` | 高 |
| `mockBanners`（降级） | `ShopHomeScreen` | `GET /banners` | 中 |
| `mockQuickCategories`（降级） | `ShopHomeScreen` | `GET /categories/quick` | 中 |
| `mockProducts`（降级） | `ShopHomeScreen` / `CategoryScreen` | `GET /products` | 中 |
| `mockCategories`（降级） | `CategoryScreen` | `GET /categories` | 中 |
