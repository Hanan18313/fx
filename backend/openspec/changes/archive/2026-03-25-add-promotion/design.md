## Context

当前系统已有完整的邀请码注册链路：`users.invite_code` + `users.parent_id` 在注册时建立一级推荐关系。但绑定后无任何激励行为——没有奖励发放、没有佣金计算、没有推广数据展示。分润引擎（`ProfitEngineService`）仅处理订单利润池的个人 30 天释放，不涉及推荐人佣金。

现有关键集成点：
- `AuthService.register()` — 注册时绑定 `parentId`，此处注入邀请奖励逻辑
- `OrderService.payOrder()` — 订单完成时，此处触发分享佣金计算
- `WalletService` — 余额/冻结/总收益，佣金入账复用此机制
- `ProfitRecordEntity` — 已有 `type` 枚举 (`personal` / `team`)，可扩展

## Goals / Non-Goals

**Goals:**
- 注册绑定推荐人后，推荐人即时获得固定奖励入账
- 被推荐人下单完成后，推荐人获得订单利润池按比例的佣金
- 一级推广（仅直接推荐人获益），规则简单透明
- 奖励参数可通过 Admin 后台配置，无需改代码
- C 端用户可查看推广统计和下级列表

**Non-Goals:**
- 多级分销 / 团队分红（不在此次范围）
- 分享链接的 URL 短链生成和追踪（客户端自行拼接邀请码即可）
- 推广排行榜 / 活动运营功能
- 推送通知（奖励到账通知等后续迭代）

## Decisions

### 1. 推广奖励流水单独建表，不复用 `profit_records`

**选择**：新建 `promotion_rewards` 表

**替代方案**：在 `profit_records` 的 `type` 枚举中新增 `referral` / `commission` 类型

**理由**：
- `profit_records` 与订单利润池强耦合（有 `order_id` + `day_index` 唯一索引），推广奖励不需要这些字段
- 邀请奖励无关联订单（注册触发），放 `profit_records` 里语义不对
- 独立表方便后续扩展（如多级分销、活动奖励等），不污染核心分润表

### 2. 奖励参数存数据库表，不写配置文件

**选择**：新建 `promotion_configs` 表，KV 结构

**替代方案**：写在 `.env` 或 `config` 模块

**理由**：
- Admin 后台可热更新，无需重启服务
- 可记录修改历史（通过 operation log 拦截器自动记录）
- 初始值通过 SQL seed 插入，有默认兜底

**参数项**：
| key | 默认值 | 说明 |
|-----|--------|------|
| `referral_reward_amount` | 5.00 | 邀请注册奖励金额（元） |
| `commission_rate` | 0.05 | 分享订单佣金比例（5% of profit_pool） |
| `referral_reward_enabled` | true | 邀请奖励开关 |
| `commission_enabled` | true | 分享佣金开关 |

### 3. 佣金在订单支付时同步计算并入账，不走定时任务

**选择**：在 `payOrder` 事务中同步处理佣金

**替代方案**：类似个人分润，放入定时任务异步释放

**理由**：
- 佣金是一次性的（不像个人分润分 30 天释放），没必要异步
- 同步处理保证事务一致性，避免漏发
- 金额计算简单（`profit_pool * commission_rate`），无性能顾虑

### 4. 推广模块独立，通过 Service 调用集成

**选择**：新建 `PromotionModule`，导出 `PromotionService`，在 `AuthModule` 和 `OrderModule` 中注入调用

**替代方案**：直接在 `AuthService` / `OrderService` 中内联逻辑

**理由**：
- 推广逻辑集中管理，方便关闭/调整
- 符合现有代码的模块化风格
- 避免核心模块膨胀

### 5. `promotion_rewards` 表结构设计

```
promotion_rewards
├── id (bigint PK)
├── user_id (bigint) — 获得奖励的用户（推荐人）
├── from_user_id (bigint) — 触发奖励的用户（被推荐人）
├── order_id (bigint, nullable) — 关联订单（佣金类型时有值）
├── type (enum: 'referral' | 'commission') — 奖励类型
├── amount (decimal 10,4) — 奖励金额
├── created_at (timestamp)
```

## Risks / Trade-offs

**[并发注册重复奖励]** → 在 `promotion_rewards` 表加唯一索引 `(user_id, from_user_id, type, order_id)` 防重；注册奖励额外限制同一 `from_user_id` + `type='referral'` 只能有一条

**[佣金计算精度]** → 使用 `toFixed(4)` 保留 4 位小数，与现有 `profit_records.amount` 精度一致

**[配置缓存一致性]** → 奖励参数从数据库读取时加 Redis 缓存（TTL 5 分钟），Admin 修改时主动清除缓存。窗口期内的旧值可接受

**[推荐人账户异常]** → 推荐人 `status != 1`（被封禁）时跳过奖励发放，不阻塞注册/支付流程
