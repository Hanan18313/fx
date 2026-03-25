# 推广功能 API 对接文档

> 后端已实现，待前端对接。基础路径：`/api`

---

## 一、C 端接口（Mobile App 对接）

所有接口需要 `Authorization: Bearer <token>` 请求头。

### 1. 获取推广统计

```
GET /api/promotion/stats
```

**响应：**
```json
{
  "invite_count": 12,
  "referral_total": 60.00,
  "commission_total": 35.50,
  "total_reward": 95.50
}
```

| 字段 | 说明 |
|------|------|
| `invite_count` | 直接邀请人数 |
| `referral_total` | 累计邀请奖励（元） |
| `commission_total` | 累计佣金收益（元） |
| `total_reward` | 总奖励（两者之和） |

---

### 2. 获取下级用户列表

```
GET /api/promotion/invitees?page=1&limit=20
```

**响应：**
```json
{
  "data": [
    {
      "nickname": "用户A",
      "avatar": "https://...",
      "createdAt": "2026-03-20T10:00:00.000Z"
    }
  ],
  "total": 12,
  "page": 1
}
```

> 不暴露手机号和用户 ID，仅显示昵称、头像和注册时间。

---

### 3. 获取推广奖励流水

```
GET /api/promotion/rewards?page=1&limit=20
```

**响应：**
```json
{
  "data": [
    {
      "type": "referral",
      "amount": "5.0000",
      "from_nickname": "用户A",
      "created_at": "2026-03-20T10:00:00.000Z"
    },
    {
      "type": "commission",
      "amount": "2.3500",
      "from_nickname": "用户B",
      "created_at": "2026-03-19T15:30:00.000Z"
    }
  ],
  "total": 25,
  "page": 1
}
```

| type 值 | 含义 |
|---------|------|
| `referral` | 邀请注册奖励 |
| `commission` | 分享订单佣金 |

---

### 4. 获取邀请码

```
GET /api/promotion/invite-code
```

**响应：**
```json
{
  "invite_code": "A3X9K2"
}
```

> 用于生成分享链接或分享海报。

---

## 二、Admin 端接口（管理后台对接）

所有接口需要 Admin JWT Token，且受权限控制。

### 1. 推广数据概览

```
GET /api/admin/promotion/overview
```

**权限：** `promotion:overview`

**响应：**
```json
{
  "total_invites": 156,
  "total_referral_amount": 780.00,
  "total_commission_amount": 1250.35,
  "today_invites": 5,
  "today_referral_amount": 25.00,
  "today_commission_amount": 42.80
}
```

---

### 2. 推广奖励流水列表

```
GET /api/admin/promotion/rewards?page=1&limit=20&type=referral&start_date=2026-03-01&end_date=2026-03-25
```

**权限：** `promotion:rewards`

| 参数 | 必填 | 说明 |
|------|------|------|
| `page` | 否 | 页码，默认 1 |
| `limit` | 否 | 每页条数，默认 20 |
| `type` | 否 | 筛选类型：`referral` / `commission` |
| `start_date` | 否 | 开始日期 YYYY-MM-DD |
| `end_date` | 否 | 结束日期 YYYY-MM-DD |

**响应：**
```json
{
  "data": [
    {
      "id": 1,
      "user_name": "推荐人昵称",
      "from_user_name": "被推荐人昵称",
      "type": "referral",
      "amount": "5.0000",
      "order_id": null,
      "created_at": "2026-03-20T10:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1
}
```

---

### 3. 查看推广配置

```
GET /api/admin/promotion/config
```

**权限：** `promotion:config`

**响应：**
```json
{
  "referral_reward_amount": "5.00",
  "commission_rate": "0.05",
  "referral_reward_enabled": "true",
  "commission_enabled": "true"
}
```

---

### 4. 修改推广配置

```
PUT /api/admin/promotion/config
Content-Type: application/json
```

**权限：** `promotion:config:edit`

**请求体（部分更新，只传要改的字段）：**
```json
{
  "referral_reward_amount": 10,
  "commission_rate": 0.08,
  "referral_reward_enabled": true,
  "commission_enabled": true
}
```

| 字段 | 类型 | 校验 |
|------|------|------|
| `referral_reward_amount` | number | >= 0 |
| `commission_rate` | number | 0 ~ 1 |
| `referral_reward_enabled` | boolean | - |
| `commission_enabled` | boolean | - |

**响应：** 返回更新后的完整配置（同查看配置）。

---

## 三、前端对接要点

### Mobile App 端
- 推广中心页面：展示统计数据 + 邀请码 + 分享按钮
- 下级列表页面：分页列表
- 奖励流水页面：分页列表，区分 referral/commission 显示不同标签
- 分享功能：拼接邀请码生成分享链接或海报

### Admin 管理后台
- 推广管理页面（新增菜单）
  - 数据概览卡片（总数据 + 今日数据）
  - 奖励流水表格（支持类型和日期筛选）
  - 配置管理表单（带校验）
- 需要在菜单管理中添加推广管理相关菜单和权限标识
