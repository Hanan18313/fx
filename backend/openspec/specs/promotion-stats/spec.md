## ADDED Requirements

### Requirement: 用户查看推广统计概览
C 端用户 SHALL 能查看自己的推广统计数据，包括邀请人数、累计邀请奖励、累计佣金收益。

#### Scenario: 查看推广概览
- **WHEN** 已登录用户请求 `GET /api/promotion/stats`
- **THEN** 返回 `{ invite_count, referral_total, commission_total, total_reward }`，其中 `invite_count` 为直接下级数量，`referral_total` 为邀请奖励累计，`commission_total` 为佣金累计，`total_reward` 为两者之和

#### Scenario: 无推广记录
- **WHEN** 用户从未推广过任何人
- **THEN** 返回所有数值为 0

### Requirement: 用户查看下级列表
C 端用户 SHALL 能查看自己邀请的直接下级用户列表。

#### Scenario: 查看下级列表
- **WHEN** 已登录用户请求 `GET /api/promotion/invitees?page=1&limit=20`
- **THEN** 返回分页的下级用户列表，每条记录包含 `{ nickname, avatar, created_at }`（注册时间），按注册时间倒序排列；不暴露手机号、ID 等敏感信息

#### Scenario: 无下级用户
- **WHEN** 用户没有任何直接下级
- **THEN** 返回空列表 `{ data: [], total: 0 }`

### Requirement: 用户查看推广奖励流水
C 端用户 SHALL 能查看自己的推广奖励明细列表。

#### Scenario: 查看奖励流水
- **WHEN** 已登录用户请求 `GET /api/promotion/rewards?page=1&limit=20`
- **THEN** 返回分页的奖励流水，每条记录包含 `{ type, amount, from_nickname, created_at }`，按时间倒序排列

### Requirement: 用户获取邀请码信息
C 端用户 SHALL 能获取自己的邀请码，用于分享。

#### Scenario: 获取邀请码
- **WHEN** 已登录用户请求 `GET /api/promotion/invite-code`
- **THEN** 返回 `{ invite_code }` 即该用户的邀请码
