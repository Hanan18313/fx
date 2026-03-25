## ADDED Requirements

### Requirement: Admin 查看推广数据概览
Admin 用户 SHALL 能查看平台级推广数据汇总。

#### Scenario: 查看推广概览
- **WHEN** Admin 请求 `GET /api/admin/promotion/overview`
- **THEN** 返回 `{ total_invites, total_referral_amount, total_commission_amount, today_invites, today_referral_amount, today_commission_amount }`

### Requirement: Admin 查看推广奖励列表
Admin 用户 SHALL 能查看所有推广奖励流水，支持按类型和时间筛选。

#### Scenario: 查看奖励列表
- **WHEN** Admin 请求 `GET /api/admin/promotion/rewards?page=1&limit=20&type=referral`
- **THEN** 返回分页的奖励流水，每条记录包含 `{ id, user_name, from_user_name, type, amount, order_id, created_at }`，支持按 `type`（referral/commission）和 `date_range` 筛选

#### Scenario: 无筛选条件
- **WHEN** Admin 请求不带筛选参数
- **THEN** 返回全部类型的奖励流水，按时间倒序

### Requirement: Admin 配置奖励参数
Admin 用户 SHALL 能查看和修改推广奖励参数。

#### Scenario: 查看当前配置
- **WHEN** Admin 请求 `GET /api/admin/promotion/config`
- **THEN** 返回所有推广配置项的当前值：`referral_reward_amount`、`commission_rate`、`referral_reward_enabled`、`commission_enabled`

#### Scenario: 修改配置
- **WHEN** Admin 请求 `PUT /api/admin/promotion/config` 并携带要修改的参数
- **THEN** 更新数据库中对应配置项的值，清除 Redis 缓存，返回更新后的完整配置；操作通过 OperationLogInterceptor 自动记录日志

#### Scenario: 参数校验
- **WHEN** Admin 提交的 `referral_reward_amount` 为负数或 `commission_rate` 超出 [0, 1] 范围
- **THEN** 返回 400 错误，配置不变
