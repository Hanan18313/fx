## ADDED Requirements

### Requirement: 订单完成触发推荐人佣金
当用户完成订单支付后，若该用户有推荐人（`parent_id` 不为空），系统 SHALL 从订单利润池（`profit_pool`）中按比例计算佣金，入账推荐人钱包。

#### Scenario: 正常佣金发放
- **WHEN** 用户支付订单成功，该用户存在推荐人（`parent_id` 有值），推荐人状态正常（status=1），且佣金开关开启
- **THEN** 系统在同一事务中：创建 `promotion_rewards` 记录（`type='commission'`，`order_id` 关联该订单），金额为 `profit_pool * commission_rate`；推荐人钱包余额和累计收益增加对应金额

#### Scenario: 用户无推荐人
- **WHEN** 用户支付订单成功，但 `parent_id` 为 null
- **THEN** 不触发任何佣金逻辑，订单流程正常完成

#### Scenario: 推荐人已封禁
- **WHEN** 用户支付订单成功，推荐人存在但 `status != 1`
- **THEN** 跳过佣金发放，订单流程正常完成

#### Scenario: 佣金开关关闭
- **WHEN** `promotion_configs` 中 `commission_enabled` 为 false
- **THEN** 跳过佣金发放，订单流程正常完成

#### Scenario: 防止同一订单重复发佣金
- **WHEN** 同一 `order_id` + `type='commission'` 的记录已存在于 `promotion_rewards`
- **THEN** 跳过此次佣金发放，不报错

### Requirement: 佣金在支付事务中同步处理
佣金计算和入账 SHALL 在 `payOrder` 的数据库事务中同步执行，保证与订单状态变更的原子性。

#### Scenario: 事务一致性
- **WHEN** 佣金入账过程中数据库异常
- **THEN** 整个支付事务回滚，订单状态不变为 'done'，前端收到错误响应
