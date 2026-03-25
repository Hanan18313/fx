## 1. 数据库层

- [x] 1.1 创建 `PromotionRewardEntity` 实体（`promotion_rewards` 表），包含 `id, user_id, from_user_id, order_id, type, amount, created_at`，加唯一索引 `(user_id, from_user_id, type, order_id)` 防重
- [x] 1.2 创建 `PromotionConfigEntity` 实体（`promotion_configs` 表），KV 结构 `(key, value, description, updated_at)`
- [x] 1.3 编写 SQL 初始化脚本：建表语句 + seed 默认配置项（`referral_reward_amount=5.00`, `commission_rate=0.05`, `referral_reward_enabled=true`, `commission_enabled=true`）
- [x] 1.4 在 `AppModule` 的 TypeORM entities 数组中注册两个新实体

## 2. 推广核心模块

- [x] 2.1 创建 `PromotionModule`，注册 `PromotionService` 和 `PromotionConfigService`
- [x] 2.2 实现 `PromotionConfigService`：从数据库读取配置项，Redis 缓存（TTL 5 分钟），提供 `getConfig(key)` 和 `setConfig(key, value)` 方法，修改时清除缓存
- [x] 2.3 实现 `PromotionService.grantReferralReward(parentId, fromUserId)`：检查开关 → 检查推荐人状态 → 检查防重 → 写入 promotion_rewards → 更新推荐人钱包余额和 total_earn
- [x] 2.4 实现 `PromotionService.grantCommission(parentId, fromUserId, orderId, profitPool)`：检查开关 → 检查推荐人状态 → 检查防重 → 计算佣金 → 事务中写入 promotion_rewards + 更新钱包

## 3. 集成到现有流程

- [x] 3.1 修改 `AuthService.register()`：注册成功且 `parentId` 有值时，调用 `PromotionService.grantReferralReward()`，用 try-catch 包裹确保不阻塞注册
- [x] 3.2 修改 `OrderService.payOrder()`：支付成功后查询用户 `parentId`，若有值则在同一事务中调用 `PromotionService.grantCommission()`
- [x] 3.3 在 `AuthModule` 和 `OrderModule` 中导入 `PromotionModule`

## 4. C 端推广 API

- [x] 4.1 创建 `PromotionController`（路由前缀 `promotion`），挂载 `JwtAuthGuard`
- [x] 4.2 实现 `GET /api/promotion/stats` — 查询推广统计概览（邀请人数、累计邀请奖励、累计佣金）
- [x] 4.3 实现 `GET /api/promotion/invitees` — 分页查询下级用户列表（nickname, avatar, created_at）
- [x] 4.4 实现 `GET /api/promotion/rewards` — 分页查询推广奖励流水
- [x] 4.5 实现 `GET /api/promotion/invite-code` — 返回当前用户的邀请码

## 5. Admin 推广管理

- [x] 5.1 创建 `PromotionMgmtModule`（Admin 端），放在 `admin/biz/promotion-mgmt/` 目录
- [x] 5.2 实现 `GET /api/admin/promotion/overview` — 平台推广数据概览（总邀请数、总奖励金额、今日数据）
- [x] 5.3 实现 `GET /api/admin/promotion/rewards` — 奖励流水列表（支持按 type、date_range 筛选，分页）
- [x] 5.4 实现 `GET /api/admin/promotion/config` — 查看当前推广配置
- [x] 5.5 实现 `PUT /api/admin/promotion/config` — 修改推广配置（参数校验 + 清除 Redis 缓存），挂载 `@OperationLog` 装饰器
- [x] 5.6 在 `AdminModule` / `BizModule` 中注册 `PromotionMgmtModule`
