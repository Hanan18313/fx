## ADDED Requirements

### Requirement: 邀请注册触发推荐人奖励
当新用户携带有效邀请码注册成功后，系统 SHALL 自动向推荐人发放固定金额的邀请奖励，金额入账推荐人钱包余额。

#### Scenario: 正常邀请注册奖励发放
- **WHEN** 新用户携带有效邀请码完成注册，推荐人账户状态正常（status=1），且邀请奖励开关开启
- **THEN** 系统在 `promotion_rewards` 表创建一条 `type='referral'` 记录，金额为 `promotion_configs.referral_reward_amount` 的当前值；同时推荐人钱包余额和累计收益增加对应金额

#### Scenario: 推荐人账户被封禁
- **WHEN** 新用户携带有效邀请码完成注册，但推荐人账户状态异常（status!=1）
- **THEN** 注册流程正常完成，上下级关系正常绑定，但不发放奖励，不创建 `promotion_rewards` 记录

#### Scenario: 邀请奖励开关关闭
- **WHEN** `promotion_configs` 中 `referral_reward_enabled` 为 false
- **THEN** 注册流程正常完成，上下级关系正常绑定，但不发放奖励

#### Scenario: 防止重复发放
- **WHEN** 同一 `from_user_id` + `type='referral'` 的记录已存在
- **THEN** 系统 SHALL 跳过此次奖励发放，不报错，注册流程正常完成

### Requirement: 邀请奖励不阻塞注册
邀请奖励的发放 SHALL NOT 阻塞注册流程。若奖励发放过程中出现异常（如数据库写入失败），注册 MUST 正常完成，奖励异常记录日志。

#### Scenario: 奖励发放异常
- **WHEN** 注册成功后，奖励写入数据库失败（如唯一索引冲突之外的异常）
- **THEN** 注册正常返回 token 和 invite_code，异常写入 error log，不影响用户体验
