# 商城分润 App — 产品需求文档（PRD）

> **产品名称**：Mall Profit App（商城分润）  
> **版本**：v1.0  
> **撰写日期**：2026-03-26  
> **技术栈**：Expo SDK 54 + React Native 0.81 + TypeScript + Zustand + Axios  

---

## 一、产品概述

### 1.1 产品定位

一款以"购物 + 分润 + 推广"为核心的移动电商应用。用户可浏览商品、下单购买；同时通过邀请码机制发展下级，获得邀请奖励和下级消费佣金。角色体系包括普通用户、分销商、区域代理、管理员，不同角色享受不同分润比例。

### 1.2 目标用户

| 用户角色 | 描述 |
|---------|------|
| 普通用户 | 浏览购物、参与分享获得基础奖励 |
| 分销商 | 积极推广商品、发展下线，获取佣金收入 |
| 区域代理 | 管理区域内分销网络，获取更高比例分润 |
| 管理员 | 平台运营管理 |

### 1.3 核心价值

- **对消费者**：价格优惠的商品 + 分享赚钱的机制
- **对分销商/代理**：低门槛创业，通过社交裂变获得持续收入
- **对平台**：社交化获客降低流量成本，利用分销网络快速扩张

---

## 二、现有功能清单（已实现）

> 以下为当前代码库中已实现的功能模块及其完成状态。

### 2.1 认证模块 ✅

| 功能 | 状态 | 说明 |
|------|------|------|
| 启动页（Splash） | ✅ 已完成 | 品牌动画 + 自动恢复登录态 |
| 短信验证码登录 | ✅ 已完成 | 手机号 + 验证码 |
| 密码登录 | ✅ 已完成 | 手机号 + 密码 |
| 注册 | ✅ 已完成 | 手机号 + 验证码 + 密码 + 可选邀请码 |
| 退出登录 | ✅ 已完成 | 清除 Token + 角色 |
| Token 持久化 | ✅ 已完成 | AsyncStorage |
| 第三方登录（微信/支付宝/Apple） | ⚠️ 占位 | 仅 Alert 提示"暂未开放" |
| 用户协议/隐私政策 | ⚠️ 占位 | 文字链接存在，但无跳转逻辑 |

### 2.2 商城首页 ✅

| 功能 | 状态 | 说明 |
|------|------|------|
| 搜索栏 | ✅ 已完成 | UI 完整，可输入关键词手动搜索 |
| Banner 轮播 | ⚠️ Mock | 始终使用本地 Mock 数据，无 API 对接；点击无响应 |
| 快捷分类入口 | ⚠️ Mock | 10 个图标分类，始终 Mock；点击无导航 |
| 商品列表 | ✅ 已完成 | 调用 `/products` API + 失败回退 Mock |
| 下拉刷新 / 上拉加载 | ✅ 已完成 | 分页逻辑完整 |

### 2.3 商品详情 ✅

| 功能 | 状态 | 说明 |
|------|------|------|
| 图片轮播 | ✅ 已完成 | 支持多图滑动 + 指示器 |
| 价格展示 | ✅ 已完成 | 现价 + 原价划线 |
| 分润比例标签 | ✅ 已完成 | 显示该商品的分润百分比 |
| 加入购物车 | ✅ 已完成 | 存入 Zustand Store |
| 立即购买 | ⚠️ 部分 | 加入购物车后跳转购物车页，无直接下单 |
| 商品描述 | ✅ 已完成 | 文字描述展示 |
| 购物车角标 | ✅ 已完成 | 实时显示购物车件数 |

### 2.4 分类页 ✅

| 功能 | 状态 | 说明 |
|------|------|------|
| 左侧一级分类 | ✅ 已完成 | 调用 `/categories` API + Mock 回退 |
| 右侧子分类网格 | ✅ 已完成 | 图标 + 名称展示 |
| 子分类跳转 | ❌ 未实现 | 子分类 `onPress` 为空 |

### 2.5 购物车 ✅

| 功能 | 状态 | 说明 |
|------|------|------|
| 商品增减 | ✅ 已完成 | 加减数量 |
| 单选/全选 | ✅ 已完成 | 勾选计算逻辑完整 |
| 侧滑删除 | ✅ 已完成 | 滑动显示删除按钮 |
| 编辑模式 | ✅ 已完成 | 批量删除选中商品 |
| 结算按钮 | ⚠️ 占位 | 仅 Alert 提示 + 清空选中，无订单流程 |
| 购物车持久化 | ❌ 未实现 | 仅内存存储，重启丢失 |

### 2.6 个人中心 ✅

| 功能 | 状态 | 说明 |
|------|------|------|
| 角色标签 | ✅ 已完成 | 根据 role 显示角色名 |
| 三大入口 | ✅ 已完成 | 分润看板/钱包/推广中心 |
| 用户信息展示 | ⚠️ 简略 | 固定 "用" 字头像，无昵称/手机号 |

### 2.7 分润看板 ✅

| 功能 | 状态 | 说明 |
|------|------|------|
| 收益数据 | ✅ 已完成 | 今日/本月/累计分润 |
| 分润规则说明 | ✅ 已完成 | 静态文案 |

### 2.8 钱包 ✅

| 功能 | 状态 | 说明 |
|------|------|------|
| 余额展示 | ✅ 已完成 | 可用余额/冻结/累计收益 |
| 申请提现 | ⚠️ 仅 iOS | 使用 `Alert.prompt`，Android 不支持 |

### 2.9 推广中心 ✅

| 功能 | 状态 | 说明 |
|------|------|------|
| 推广数据统计 | ✅ 已完成 | 邀请人数/邀请奖励/佣金收益 |
| 邀请码展示 | ✅ 已完成 | 但"复制"仅 Alert 提示，未接剪贴板 |
| 系统分享 | ✅ 已完成 | 调用原生 Share API |
| 我的下级列表 | ✅ 已完成 | 分页 + 下拉刷新 |
| 奖励流水列表 | ✅ 已完成 | 分页 + 下拉刷新 |

---

## 三、待实现功能需求（核心）

> 以下为产品角度必须补齐的功能模块，按优先级排列。

---

### P0 — 核心交易闭环（必须优先实现）

#### 3.1 订单模块

**业务背景**：当前购物车"结算"仅为 Alert 占位，用户无法真正完成交易。订单系统是电商 App 的核心闭环。

##### 3.1.1 创建订单页（ConfirmOrderScreen）

| 字段 | 说明 |
|------|------|
| 入口 | 购物车「去结算」/ 商品详情「立即购买」|
| 功能 | 收货地址选择、商品清单确认、运费计算、优惠券选择、支付方式选择、订单备注、提交订单 |
| 数据流 | 从购物车或商品详情带入商品信息 → 调用后端 `POST /orders` 创建订单 → 返回订单号跳转支付 |

**详细需求**：

- 顶部显示收货地址卡片，点击可进入地址管理页选择/新增
- 商品列表展示：商品图、名称、规格、单价、数量
- 费用明细：商品小计、运费（后端计算）、优惠券抵扣、实付金额
- 订单备注输入框（可选）
- 底部「提交订单」按钮，金额实时更新
- 提交前校验：地址不能为空、至少一件商品

##### 3.1.2 订单列表页（OrderListScreen）

| 字段 | 说明 |
|------|------|
| 入口 | 个人中心「我的订单」|
| 功能 | Tab 分类展示（全部/待付款/待发货/待收货/已完成/售后）、分页加载、下拉刷新 |
| API | `GET /orders?status={status}&page={page}` |

**订单状态流转**：

```
待付款 → (支付) → 待发货 → (商家发货) → 待收货 → (确认收货) → 已完成
  ↓                                          ↓              ↓
 取消订单                                  申请退款        评价
```

**每个订单卡片包含**：

- 订单号、下单时间
- 商品缩略图 + 名称 + 数量
- 订单金额
- 状态标签
- 操作按钮（根据状态动态变化）：
  - 待付款：「去支付」「取消订单」
  - 待发货：「提醒发货」
  - 待收货：「确认收货」「查看物流」
  - 已完成：「再次购买」「去评价」

##### 3.1.3 订单详情页（OrderDetailScreen）

| 字段 | 说明 |
|------|------|
| 入口 | 订单列表点击订单卡片 |
| 功能 | 完整订单信息展示、物流信息、操作按钮 |

**页面内容**：

- 订单状态大标题 + 状态描述
- 收货地址信息
- 商品列表（可点击跳转商品详情）
- 费用明细（商品金额、运费、优惠、实付）
- 订单信息（订单号、创建时间、支付时间、支付方式）
- 物流信息摘要（可点击查看详细物流）
- 底部操作按钮（同订单列表逻辑）

##### 3.1.4 物流追踪页（LogisticsScreen）

- 展示物流公司、运单号（可复制）
- 时间轴形式展示物流节点
- API：`GET /orders/{orderId}/logistics`

---

#### 3.2 支付模块

**业务背景**：没有支付就没有交易闭环。

##### 3.2.1 支付方式选择

| 支付方式 | 优先级 | 说明 |
|---------|--------|------|
| 微信支付 | P0 | 国内主流支付，必须支持 |
| 支付宝支付 | P0 | 国内主流支付，必须支持 |
| 余额支付 | P1 | 使用钱包余额抵扣 |
| Apple Pay | P2 | iOS 用户可选 |

##### 3.2.2 支付流程

```
提交订单 → 选择支付方式 → 调用支付 SDK → 支付回调 → 支付结果页
                                               ↓
                                          支付成功 / 支付失败
                                               ↓
                                     跳转订单详情 / 重新支付
```

**支付结果页**：
- 成功：显示订单号、支付金额、预计收货时间、「查看订单」「继续购物」按钮
- 失败：显示失败原因、「重新支付」「查看订单」按钮
- 超时未支付：倒计时关闭订单（建议 30 分钟）

---

#### 3.3 收货地址管理

**业务背景**：下单必须填写收货地址。

##### 3.3.1 地址列表页（AddressListScreen）

- 展示所有收货地址，标注默认地址
- 支持新增、编辑、删除、设为默认
- API：`GET /addresses`、`DELETE /addresses/{id}`

##### 3.3.2 地址编辑页（AddressEditScreen）

| 字段 | 是否必填 | 说明 |
|------|---------|------|
| 收货人 | 是 | 2-20 个字符 |
| 手机号 | 是 | 11 位手机号校验 |
| 省市区 | 是 | 三级联动选择器 |
| 详细地址 | 是 | 门牌号等 |
| 设为默认 | 否 | 开关 |

- API：`POST /addresses`（新增）、`PUT /addresses/{id}`（编辑）

---

### P1 — 体验完善（交易闭环后紧接实现）

#### 3.4 商品规格选择（SKU）

**业务背景**：当前商品无规格选择，无法满足多 SKU 商品的需求。

**需求描述**：
- 商品详情页点击「规格」弹出底部 Sheet
- 展示规格属性（如颜色、尺码、口味等），可多维度组合
- 选择规格后显示对应价格、库存
- 库存为 0 的规格置灰不可选
- 确认后更新详情页价格和规格标签

**数据结构**：

```typescript
interface ProductSpec {
  id: number;
  name: string;         // 规格组名，如 "颜色"
  values: SpecValue[];  // 规格值列表
}

interface SpecValue {
  id: number;
  name: string;         // 如 "红色"
  image?: string;       // 规格图片（可选）
}

interface SKU {
  id: number;
  specIds: number[];    // 规格值 ID 组合
  price: string;
  originalPrice?: string;
  stock: number;
  image?: string;
}
```

---

#### 3.5 商品搜索增强

**当前问题**：搜索栏存在但功能不完整，`useEffect` 不随关键词变化自动搜索。

**需求描述**：
- 输入关键词实时联想（防抖 300ms）
- 搜索历史记录（本地持久化，最多保存 20 条）
- 热门搜索标签（后端接口 `GET /search/hot`）
- 搜索结果页支持排序：综合/销量/价格升/价格降
- 搜索结果页支持筛选：分类、价格区间
- 无结果时展示推荐商品

---

#### 3.6 用户信息管理

**当前问题**：个人中心仅显示"用"字头像和角色标签，无用户详细信息。

##### 3.6.1 个人信息页（UserInfoScreen）

| 字段 | 可编辑 | 说明 |
|------|--------|------|
| 头像 | 是 | 从相册选择或拍照，上传裁剪 |
| 昵称 | 是 | 2-16 个字符 |
| 手机号 | 只读 | 脱敏显示，支持换绑 |
| 角色 | 只读 | 从后端获取 |
| 注册时间 | 只读 | 从后端获取 |

- API：`GET /user/profile`、`PUT /user/profile`、`POST /user/avatar`

##### 3.6.2 修改密码

- 旧密码 + 新密码 + 确认新密码
- API：`PUT /user/password`

##### 3.6.3 换绑手机号

- 原手机验证码 → 新手机号 + 验证码
- API：`POST /user/change-phone`

---

#### 3.7 购物车持久化

**当前问题**：购物车数据仅存内存，App 重启后丢失。

**方案**：
- 已登录用户：同步至后端 `POST /cart/sync`，拉取 `GET /cart`
- 未登录用户：使用 AsyncStorage 本地持久化
- 登录时自动合并本地与远端购物车

---

#### 3.8 钱包提现增强

**当前问题**：`Alert.prompt` 在 Android 不可用。

**需求描述**：
- 自定义提现页面（WithdrawScreen），替代 `Alert.prompt`
- 支持绑定提现账户（银行卡/支付宝/微信）
- 提现金额输入 + 快捷金额标签（50/100/500/全部提现）
- 最低提现金额限制（如 10 元起）
- 提现手续费说明
- 提现记录列表
- API：`GET /wallet/withdraw-records`、`POST /wallet/bindAccount`

---

#### 3.9 Banner 与快捷分类对接

**当前问题**：始终使用 Mock 数据，点击无响应。

**需求描述**：
- Banner 数据从 API 获取：`GET /banners`
- Banner 点击跳转：支持跳转商品详情、分类页、活动页、外部链接
- 快捷分类从 API 获取：`GET /categories/quick`
- 点击快捷分类跳转至对应分类的商品列表

**Banner 数据结构**：

```typescript
interface Banner {
  id: number;
  imageUrl: string;
  title: string;
  linkType: 'product' | 'category' | 'activity' | 'url';
  linkValue: string;    // 商品ID / 分类ID / 活动ID / URL
  sort: number;
}
```

---

### P2 — 增长与留存

#### 3.10 消息通知中心

**业务背景**：`expo-notifications` 已安装但未使用。

##### 3.10.1 推送通知

| 通知类型 | 触发条件 | 说明 |
|---------|---------|------|
| 订单状态变更 | 支付成功/发货/签收 | 系统自动推送 |
| 分润到账 | 产生分润收入 | 实时通知 |
| 推广奖励 | 下级注册/消费 | 实时通知 |
| 促销活动 | 运营配置 | 定时推送 |
| 系统公告 | 运营配置 | 重要信息通知 |

##### 3.10.2 消息列表页（NotificationScreen）

- Tab 分类：系统通知 / 订单消息 / 收益消息
- 未读/已读标记
- 点击跳转对应详情页
- API：`GET /notifications?type={type}&page={page}`、`PUT /notifications/{id}/read`

---

#### 3.11 商品收藏

**需求描述**：
- 商品详情页增加「收藏」按钮（爱心图标）
- 个人中心增加「我的收藏」入口
- 收藏列表页，支持取消收藏
- API：`POST /favorites/{productId}`、`DELETE /favorites/{productId}`、`GET /favorites`

---

#### 3.12 商品评价

##### 3.12.1 评价入口

- 已完成订单的「去评价」按钮
- 商品详情页展示评价摘要

##### 3.12.2 发布评价页

- 星级评分（1-5 星）
- 文字评价（10-500 字）
- 图片上传（最多 9 张）
- 匿名评价选项

##### 3.12.3 评价列表

- 商品详情页内嵌评价区
- 支持按评分筛选（好评/中评/差评）
- 展示评价者昵称（脱敏）、时间、内容、图片
- API：`POST /reviews`、`GET /products/{id}/reviews`

---

#### 3.13 优惠券系统

##### 3.13.1 优惠券类型

| 类型 | 说明 |
|------|------|
| 满减券 | 满 X 元减 Y 元 |
| 折扣券 | 指定商品/分类 N 折 |
| 新人券 | 注册后自动发放 |
| 邀请券 | 被邀请人注册后双方获得 |

##### 3.13.2 优惠券页面

- 领券中心（CouponCenterScreen）：展示可领取的优惠券
- 我的优惠券（MyCouponsScreen）：未使用/已使用/已过期
- 下单选券弹窗：自动推荐最优券 + 手动切换
- API：`GET /coupons/available`、`POST /coupons/{id}/claim`、`GET /coupons/mine`

---

#### 3.14 第三方登录

**当前问题**：微信/支付宝/Apple 登录按钮为占位。

| 登录方式 | SDK | 优先级 |
|---------|-----|--------|
| 微信登录 | `expo-auth-session` / 微信开放平台 SDK | P1 |
| 支付宝登录 | 支付宝 SDK | P2 |
| Apple 登录 | `expo-apple-authentication`（iOS 必须） | P1 |

---

#### 3.15 分享功能增强

**当前问题**：仅有文字分享，缺乏图片分享和海报生成。

**需求描述**：
- 商品详情页「分享」按钮
- 生成商品分享海报（含商品图、价格、邀请码二维码）
- 分享渠道：微信好友、微信朋友圈、保存图片、复制链接
- 邀请码复制功能接入 `expo-clipboard`

---

### P3 — 运营支撑与体验优化

#### 3.16 设置页（SettingsScreen）

| 功能项 | 说明 |
|--------|------|
| 账号安全 | 修改密码、换绑手机 |
| 通知设置 | 推送开关、分类订阅 |
| 隐私设置 | 数据使用授权管理 |
| 清除缓存 | 清除图片/数据缓存 |
| 关于我们 | 版本号、公司信息 |
| 用户协议 | WebView 展示 |
| 隐私政策 | WebView 展示 |
| 检查更新 | 对比远端版本号 |
| 注销账号 | 二次确认 + 验证码 |

---

#### 3.17 客服与帮助

- 在线客服入口（商品详情/订单详情/个人中心）
- 常见问题 FAQ 列表
- 意见反馈表单（文字 + 图片 + 联系方式）
- API：`POST /feedback`、`GET /faq`

---

#### 3.18 分润体系增强

##### 3.18.1 分润明细页

- 时间范围筛选（今日/本周/本月/自定义）
- 分润来源分类：直推佣金 / 间推佣金 / 邀请奖励
- 列表展示：来源订单、金额、时间、状态（待结算/已结算）
- API：`GET /profit/records?type={type}&startDate={}&endDate={}`

##### 3.18.2 团队管理

- 下级成员数据汇总（人数、贡献金额）
- 成员活跃度排名
- 团队层级树形展示

##### 3.18.3 等级升级

- 展示当前等级和升级条件
- 进度条展示距下一等级的差距
- 各等级权益对比表

---

#### 3.19 活动专题页

- 运营可配置的活动专题页（限时秒杀、满减活动、新人专区）
- 倒计时组件
- 专题商品列表
- API：`GET /activities/{id}`

---

#### 3.20 图片与资源

**当前问题**：App 图标、启动图尚未配置实际资源。

**需求**：
- App Icon（1024x1024，含自适应图标）
- 启动页（Splash Screen）品牌设计
- 底栏 Tab 图标（替换当前 emoji 文本为 SVG 图标）
- 空状态插画（购物车为空、订单为空、网络异常等）

---

## 四、数据类型补充定义

> 以下为待实现功能需要新增的核心数据类型。

```typescript
// ============ 订单相关 ============
type OrderStatus = 'pending_payment' | 'pending_shipment' | 'shipped' | 'completed' | 'cancelled' | 'refunding';

interface Order {
  id: string;
  orderNo: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: string;
  freightAmount: string;
  discountAmount: string;
  payAmount: string;
  address: Address;
  payMethod?: 'wechat' | 'alipay' | 'balance';
  payTime?: string;
  shipTime?: string;
  completeTime?: string;
  remark?: string;
  createdAt: string;
}

interface OrderItem {
  productId: number;
  productName: string;
  productImage: string;
  specDesc?: string;      // 规格描述，如 "红色 / XL"
  price: string;
  quantity: number;
}

// ============ 地址相关 ============
interface Address {
  id: number;
  name: string;           // 收货人
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;         // 详细地址
  isDefault: boolean;
}

// ============ 优惠券相关 ============
type CouponType = 'full_reduction' | 'discount' | 'newbie' | 'invite';
type CouponStatus = 'available' | 'used' | 'expired';

interface Coupon {
  id: number;
  type: CouponType;
  title: string;
  description: string;
  discount: number;       // 满减金额或折扣比例
  minAmount: number;      // 最低消费
  startTime: string;
  endTime: string;
  status: CouponStatus;
  applicableCategories?: number[];
  applicableProducts?: number[];
}

// ============ 评价相关 ============
interface Review {
  id: number;
  userId: number;
  userName: string;
  avatar?: string;
  rating: number;         // 1-5
  content: string;
  images?: string[];
  isAnonymous: boolean;
  createdAt: string;
}

// ============ 通知相关 ============
type NotificationType = 'system' | 'order' | 'profit';

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  content: string;
  isRead: boolean;
  linkType?: string;
  linkValue?: string;
  createdAt: string;
}

// ============ 物流相关 ============
interface LogisticsInfo {
  company: string;
  trackingNo: string;
  status: string;
  nodes: LogisticsNode[];
}

interface LogisticsNode {
  time: string;
  description: string;
  location?: string;
}
```

---

## 五、API 路由汇总

> 已有 API（✅）与待实现 API（🔲）的完整清单。

### 认证

| 方法 | 路径 | 状态 | 说明 |
|------|------|------|------|
| POST | `/auth/sms/send` | ✅ | 发送验证码 |
| POST | `/auth/sms/login` | ✅ | 验证码登录 |
| POST | `/auth/login` | ✅ | 密码登录 |
| POST | `/auth/register` | ✅ | 注册 |
| POST | `/auth/wechat` | 🔲 | 微信登录 |
| POST | `/auth/alipay` | 🔲 | 支付宝登录 |
| POST | `/auth/apple` | 🔲 | Apple 登录 |

### 用户

| 方法 | 路径 | 状态 | 说明 |
|------|------|------|------|
| GET | `/user/profile` | 🔲 | 获取个人信息 |
| PUT | `/user/profile` | 🔲 | 更新个人信息 |
| POST | `/user/avatar` | 🔲 | 上传头像 |
| PUT | `/user/password` | 🔲 | 修改密码 |
| POST | `/user/change-phone` | 🔲 | 换绑手机 |

### 商品

| 方法 | 路径 | 状态 | 说明 |
|------|------|------|------|
| GET | `/products` | ✅ | 商品列表 |
| GET | `/products/{id}` | 🔲 | 商品详情（含规格） |
| GET | `/products/{id}/reviews` | 🔲 | 商品评价列表 |
| GET | `/categories` | ✅ | 分类列表 |
| GET | `/categories/quick` | 🔲 | 快捷分类 |
| GET | `/banners` | 🔲 | 轮播图 |
| GET | `/search/hot` | 🔲 | 热门搜索 |

### 购物车

| 方法 | 路径 | 状态 | 说明 |
|------|------|------|------|
| GET | `/cart` | 🔲 | 获取购物车 |
| POST | `/cart/sync` | 🔲 | 同步购物车 |

### 订单

| 方法 | 路径 | 状态 | 说明 |
|------|------|------|------|
| POST | `/orders` | 🔲 | 创建订单 |
| GET | `/orders` | 🔲 | 订单列表 |
| GET | `/orders/{id}` | 🔲 | 订单详情 |
| PUT | `/orders/{id}/cancel` | 🔲 | 取消订单 |
| PUT | `/orders/{id}/confirm` | 🔲 | 确认收货 |
| GET | `/orders/{id}/logistics` | 🔲 | 物流查询 |

### 支付

| 方法 | 路径 | 状态 | 说明 |
|------|------|------|------|
| POST | `/pay/wechat` | 🔲 | 发起微信支付 |
| POST | `/pay/alipay` | 🔲 | 发起支付宝支付 |
| POST | `/pay/balance` | 🔲 | 余额支付 |

### 地址

| 方法 | 路径 | 状态 | 说明 |
|------|------|------|------|
| GET | `/addresses` | 🔲 | 地址列表 |
| POST | `/addresses` | 🔲 | 新增地址 |
| PUT | `/addresses/{id}` | 🔲 | 编辑地址 |
| DELETE | `/addresses/{id}` | 🔲 | 删除地址 |

### 收藏

| 方法 | 路径 | 状态 | 说明 |
|------|------|------|------|
| GET | `/favorites` | 🔲 | 收藏列表 |
| POST | `/favorites/{productId}` | 🔲 | 添加收藏 |
| DELETE | `/favorites/{productId}` | 🔲 | 取消收藏 |

### 评价

| 方法 | 路径 | 状态 | 说明 |
|------|------|------|------|
| POST | `/reviews` | 🔲 | 发布评价 |

### 优惠券

| 方法 | 路径 | 状态 | 说明 |
|------|------|------|------|
| GET | `/coupons/available` | 🔲 | 可领取优惠券 |
| POST | `/coupons/{id}/claim` | 🔲 | 领取优惠券 |
| GET | `/coupons/mine` | 🔲 | 我的优惠券 |

### 钱包

| 方法 | 路径 | 状态 | 说明 |
|------|------|------|------|
| GET | `/wallet` | ✅ | 钱包信息 |
| POST | `/wallet/withdraw` | ✅ | 申请提现 |
| GET | `/wallet/withdraw-records` | 🔲 | 提现记录 |
| POST | `/wallet/bindAccount` | 🔲 | 绑定提现账户 |

### 分润

| 方法 | 路径 | 状态 | 说明 |
|------|------|------|------|
| GET | `/profit/dashboard` | ✅ | 分润看板 |
| GET | `/profit/records` | 🔲 | 分润明细 |

### 推广

| 方法 | 路径 | 状态 | 说明 |
|------|------|------|------|
| GET | `/promotion/stats` | ✅ | 推广统计 |
| GET | `/promotion/invite-code` | ✅ | 邀请码 |
| GET | `/promotion/invitees` | ✅ | 下级列表 |
| GET | `/promotion/rewards` | ✅ | 奖励列表 |

### 通知

| 方法 | 路径 | 状态 | 说明 |
|------|------|------|------|
| GET | `/notifications` | 🔲 | 通知列表 |
| PUT | `/notifications/{id}/read` | 🔲 | 标记已读 |
| POST | `/notifications/register-token` | 🔲 | 注册推送 Token |

### 其它

| 方法 | 路径 | 状态 | 说明 |
|------|------|------|------|
| GET | `/activities/{id}` | 🔲 | 活动详情 |
| POST | `/feedback` | 🔲 | 意见反馈 |
| GET | `/faq` | 🔲 | 常见问题 |
| GET | `/app/version` | 🔲 | 检查更新 |

---

## 六、页面导航结构（目标状态）

```
App
├── AuthNavigator（未登录）
│   ├── Splash
│   ├── Login
│   └── Register
│
├── MainTabNavigator（已登录）
│   ├── Shop（商城首页）
│   ├── Category（分类）
│   ├── Cart（购物车）
│   └── Profile（我的）
│
└── Stack Screens（已登录堆叠页）
    ├── ProductDetail          ← 已有
    ├── ProfitDashboard        ← 已有
    ├── Wallet                 ← 已有
    ├── Promotion              ← 已有
    ├── InviteeList            ← 已有
    ├── RewardList             ← 已有
    ├── ConfirmOrder           ← 🔲 新增
    ├── PayResult              ← 🔲 新增
    ├── OrderList              ← 🔲 新增
    ├── OrderDetail            ← 🔲 新增
    ├── Logistics              ← 🔲 新增
    ├── AddressList            ← 🔲 新增
    ├── AddressEdit            ← 🔲 新增
    ├── UserInfo               ← 🔲 新增
    ├── Withdraw               ← 🔲 新增
    ├── WithdrawRecords        ← 🔲 新增
    ├── ProfitRecords          ← 🔲 新增
    ├── Favorites              ← 🔲 新增
    ├── CouponCenter           ← 🔲 新增
    ├── MyCoupons              ← 🔲 新增
    ├── Notifications          ← 🔲 新增
    ├── ReviewPublish          ← 🔲 新增
    ├── Settings               ← 🔲 新增
    ├── Feedback               ← 🔲 新增
    ├── FAQ                    ← 🔲 新增
    ├── WebViewPage            ← 🔲 新增（用户协议/隐私政策）
    └── Activity               ← 🔲 新增
```

---

## 七、已知技术问题与修复建议

| # | 问题 | 优先级 | 建议 |
|---|------|--------|------|
| 1 | 401 拦截器未清除 `role`，未跳转登录页 | P0 | api.ts 拦截器中同时清 token + role，并通过 store 触发导航切换 |
| 2 | Splash 页 `navigation.replace('Main')` 在 AuthNavigator 内无效 | P0 | 移除该行，依赖 token 变化让 AppNavigator 自动切换 |
| 3 | Wallet 使用 `Alert.prompt`，Android 不支持 | P0 | 改为自定义 WithdrawScreen |
| 4 | Category 左侧宽度 `10%` 过窄 | P1 | 改为固定宽度 90-100px |
| 5 | ProductDetail 不通过 ID 请求 API | P1 | 增加 `GET /products/{id}` 调用 |
| 6 | 推广中心"复制"未接剪贴板 | P1 | 安装 `expo-clipboard` 替代 Alert |
| 7 | API 响应结构不统一（`res.data` vs `res.data.data`） | P1 | 统一封装为 `{ code, data, message }` |
| 8 | 部分页面主题色硬编码 | P2 | 统一使用 `theme.ts` 常量 |
| 9 | Tab 图标使用 emoji 文字 | P2 | 替换为 `@expo/vector-icons` 或自定义 SVG |
| 10 | `victory-native`、`expo-notifications` 依赖未使用 | P2 | 使用或移除，避免包体积浪费 |

---

## 八、里程碑规划

| 里程碑 | 周期 | 核心交付 |
|--------|------|---------|
| **M1 — 交易闭环** | 2-3 周 | 地址管理 + 创建订单 + 支付（模拟）+ 订单列表/详情 + 购物车持久化 + 已知 Bug 修复 |
| **M2 — 体验完善** | 2 周 | SKU 规格选择 + 搜索增强 + 用户信息管理 + 提现页改造 + Banner/分类 API 对接 |
| **M3 — 增长功能** | 2-3 周 | 推送通知 + 收藏 + 评价系统 + 优惠券 + 分享海报 + 分润明细 |
| **M4 — 运营体验** | 1-2 周 | 设置页 + 客服反馈 + 活动专题 + 第三方登录 + 图标资源 + 全面样式统一 |

---

## 九、非功能性需求

| 类别 | 要求 |
|------|------|
| **性能** | 首屏加载 < 2s；列表滚动 60fps；图片懒加载 + 缓存 |
| **安全** | Token 安全存储；接口 HTTPS；敏感操作二次验证；支付签名验证 |
| **兼容性** | iOS 14+ / Android 8+；适配刘海屏、折叠屏 |
| **国际化** | 当前仅中文，预留 i18n 架构 |
| **埋点** | 关键页面 PV/UV；核心转化漏斗（浏览→加购→下单→支付） |
| **错误监控** | 接入 Sentry 或同类服务，上报崩溃与 API 异常 |
| **无障碍** | 核心操作组件添加 `accessibilityLabel` |

---

*文档结束。如需对某个模块进一步细化交互稿或技术方案，请随时告知。*
