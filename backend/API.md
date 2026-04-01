# API 接口文档

> **Base URL**: `http://<host>:3000/api`
>
> **认证方式**: `Authorization: Bearer <token>`（通过 `POST /auth/login` 或 `POST /auth/register` 获取）
>
> **响应格式**: 接口直接返回业务数据，无统一包装层。错误时返回 `{ statusCode, message }` 的 HTTP 错误响应。

---

## 1. 认证 `/auth`

### POST `/auth/sms/send`
发送短信验证码（无需认证）

**Body**
```json
{ "phone": "13800138000" }
```
**响应**
```json
{ "code": "123456" }
```
> 生产环境仅发送短信，不返回 `code`；开发模式返回验证码方便调试。

---

### POST `/auth/register`
注册（无需认证）

**Body**
```json
{
  "phone": "13800138000",
  "code": "123456",
  "password": "明文密码",
  "invite_code": "可选邀请码"
}
```
**响应**
```json
{ "token": "jwt_token", "role": "user" }
```

---

### POST `/auth/login`
登录（无需认证）

**Body**
```json
{ "phone": "13800138000", "password": "明文密码" }
```
**响应**
```json
{ "token": "jwt_token", "role": "user" }
```

---

### POST `/auth/logout`
退出登录（**需认证**）

**响应**
```json
{}
```

---

## 2. 轮播图 `/banners`

### GET `/banners`
获取首页轮播图（无需认证）

**响应**
```json
{
  "data": [
    { "id": 1, "imageUrl": "...", "linkType": "product", "linkValue": "123" }
  ]
}
```

---

## 3. 分类 `/categories`

### GET `/categories`
获取全部分类（含子分类）（无需认证）

**响应**
```json
{
  "data": [
    {
      "id": 1,
      "name": "家居",
      "iconName": "home-outline",
      "description": "...",
      "children": [
        { "id": 11, "name": "床品", "imageUrl": "...", "productCount": 50 }
      ]
    }
  ]
}
```

---

### GET `/categories/quick`
首页快捷分类（无需认证）

**响应**
```json
{ "data": [{ "id": 1, "name": "家居" }] }
```

---

## 4. 商品 `/products`

### GET `/products`
商品列表（无需认证）

**Query**
| 参数 | 类型 | 说明 |
|------|------|------|
| `page` | number | 页码，默认 1 |
| `limit` | number | 每页数量，默认 20 |
| `keyword` | string | 搜索关键词 |
| `categoryId` | number | 按分类筛选 |

**响应**
```json
{
  "data": [
    {
      "id": 1, "name": "商品名称", "price": "99.00", "originalPrice": "129.00",
      "sales": 200, "tag": "hot", "categoryId": 1,
      "images": ["https://..."], "profitRate": "0.15"
    }
  ],
  "total": 100,
  "page": 1
}
```

---

### GET `/products/:id`
商品详情（无需认证）

**响应**: 同商品列表单项，含完整 `description`、`stock` 等字段。

---

### GET `/products/flash-sale`
限时秒杀商品（无需认证）

**响应**
```json
{
  "data": [
    {
      "id": 1, "name": "商品名称", "price": "99.00", "originalPrice": "129.00",
      "flashPrice": "59.00", "images": ["https://..."],
      "tag": "promotion", "sales": 500,
      "flashSaleId": 1, "stockLimit": 100,
      "endAt": "2025-12-31T23:59:59.000Z"
    }
  ]
}
```

---

## 5. 购物车 `/cart`（需认证）

### GET `/cart`
获取购物车列表

**响应**
```json
{
  "data": [
    {
      "id": 1, "productId": 10, "quantity": 2, "spec": "颜色:红色",
      "selected": 1,
      "product": { "id": 10, "name": "...", "price": "99.00", "images": ["..."] }
    }
  ]
}
```

---

### POST `/cart`
添加商品到购物车（商品已存在则累加数量）

**Body**
```json
{ "productId": 10, "quantity": 1, "spec": "颜色:红色（可选）" }
```
**响应**
```json
{ "id": 1, "productId": 10, "quantity": 1 }
```

---

### PUT `/cart/:itemId`
更新购物车商品数量

**Body**
```json
{ "quantity": 3 }
```
**响应**: `{}`

---

### DELETE `/cart/:itemId`
删除购物车单项

**响应**: `{}`

---

### DELETE `/cart`
清空当前用户购物车

**响应**: `{}`

---

## 6. 订单 `/orders`（需认证）

### GET `/orders`
订单列表

**Query**
| 参数 | 类型 | 说明 |
|------|------|------|
| `page` | number | 页码，默认 1 |
| `limit` | number | 每页数量，默认 10 |
| `status` | string | `pending/paid/shipped/done/cancelled` |

**响应**
```json
{
  "data": [
    { "id": 1, "status": "paid", "totalAmount": "199.00", "payAmount": "199.00", "createdAt": "...", "items": [] }
  ],
  "total": 20
}
```

---

### POST `/orders`
创建订单

**Body**
```json
{
  "items": [{ "productId": 10, "quantity": 2, "spec": "红色" }],
  "address_id": 1,
  "remark": "备注（可选）"
}
```
**响应**
```json
{ "id": 1, "payAmount": "198.00", "totalAmount": "198.00" }
```

---

### GET `/orders/:id`
订单详情

**响应**: 完整订单，含 `items[]`、`address`、`remark`、`logistics?`。

---

### POST `/orders/:id/pay`
支付订单

**响应**
```json
{ "payAmount": "198.00", "totalAmount": "198.00" }
```

---

### PUT `/orders/:id/confirm`
确认收货

**响应**: `{}`

---

### PUT `/orders/:id/cancel`
取消订单

**响应**: `{}`

---

## 7. 收货地址 `/addresses`（需认证）

### GET `/addresses`
地址列表

**响应**
```json
{
  "data": [
    { "id": 1, "name": "张三", "phone": "138...", "province": "广东", "city": "深圳", "district": "南山", "detail": "科技园", "isDefault": 1 }
  ]
}
```

---

### POST `/addresses`
新增地址

**Body**
```json
{ "name": "张三", "phone": "138...", "province": "广东", "city": "深圳", "district": "南山", "detail": "科技园", "isDefault": 0 }
```
**响应**: `{}`

---

### PUT `/addresses/:id`
编辑地址（字段同新增，可只传需修改的字段）

**响应**: `{}`

---

### DELETE `/addresses/:id`
删除地址

**响应**: `{}`

---

## 8. 钱包 `/wallet`（需认证）

### GET `/wallet`
钱包余额信息

**响应**
```json
{ "balance": "500.00", "frozen": "100.00", "totalEarn": "1200.00" }
```

---

### POST `/wallet/withdraw`
申请提现

**Body**
```json
{ "amount": 100, "method": "bank" }
```
> `method`: `bank`（银行卡）或 `alipay`（支付宝）；最低提现 10 元。

**响应**
```json
{ "message": "提现申请已提交，预计 1-3 个工作日到账" }
```

---

### GET `/wallet/bank-cards`
银行卡列表

**响应**
```json
{
  "data": [
    { "id": 1, "bankName": "招商银行", "lastFour": "1234", "realName": "张三", "isDefault": 1 }
  ]
}
```

---

### GET `/wallet/bank-card`
默认银行卡（用于提现页展示）

**响应**
```json
{ "bankName": "招商银行", "lastFour": "1234" }
```
> 无默认卡时返回 `null`。

---

### GET `/wallet/transactions`
账单流水

**Query**
| 参数 | 类型 | 说明 |
|------|------|------|
| `page` | number | 页码，默认 1 |
| `limit` | number | 每页数量，默认 20 |

**响应**
```json
{
  "data": [
    { "id": 1, "type": "income", "amount": "50.00", "name": "邀请奖励", "createdAt": "..." }
  ],
  "total": 30
}
```
> `type`: `income`（收入）或 `expense`（支出）

---

## 9. 推广 `/promotion`（需认证）

### GET `/promotion/stats`
推广统计数据

**响应**
```json
{
  "invite_count": 12,
  "total_reward": "360.00",
  "referral_total": "60.00",
  "commission_total": "300.00",
  "monthly_estimate": "45.00",
  "yesterday_earning": "8.50"
}
```

---

### GET `/promotion/invitees`
邀请人列表

**Query**: `page`（默认 1）、`limit`（默认 20）

**响应**
```json
{
  "data": [
    { "nickname": "用户A", "avatar": "...", "createdAt": "...", "todayEarning": 5.0, "level": 1 }
  ],
  "total": 12,
  "page": 1
}
```

---

### GET `/promotion/rewards`
奖励记录

**Query**: `page`（默认 1）、`limit`（默认 20）

**响应**
```json
{
  "data": [
    { "type": "referral", "amount": "5.00", "from_nickname": "用户A", "created_at": "..." }
  ],
  "total": 30,
  "page": 1
}
```
> `type`: `referral`（邀请奖励）或 `commission`（订单佣金）

---

### GET `/promotion/invite-code`
获取我的邀请码

**响应**
```json
{ "invite_code": "ABC123" }
```

---

## 10. 分润 `/profit`（需认证）

### GET `/profit/dashboard`
分润概览

**响应**
```json
{
  "released_total": "1200.00",
  "today_amount": "25.00",
  "pending_total": "80.00"
}
```

---

## 11. 用户 `/user`（需认证）

### GET `/user/profile`
用户信息

**响应**
```json
{
  "nickname": "张三",
  "phone": "138****8000",
  "avatar": "https://...",
  "role": "user",
  "memberNo": "M202412001",
  "memberExpire": "2025-12-31",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### PUT `/user/profile`
修改用户信息

**Body**
```json
{ "nickname": "新昵称" }
```
**响应**: `{}`

---

## 12. 通知 `/notifications`（需认证）

### GET `/notifications`
通知列表

**Query**
| 参数 | 类型 | 说明 |
|------|------|------|
| `page` | number | 页码，默认 1 |
| `limit` | number | 每页数量，默认 20 |
| `type` | string | 可选，按类型筛选 |

**响应**
```json
{
  "data": [
    {
      "id": 1, "type": "order", "title": "订单已发货", "content": "...",
      "isRead": 0, "linkType": "order", "linkValue": "123",
      "createdAt": "..."
    }
  ],
  "total": 5
}
```

---

### PUT `/notifications/:id/read`
标记单条通知已读

**响应**: `{}`

---

### PUT `/notifications/read-all`
全部标记已读

**响应**: `{}`

---

## 13. 收藏 `/favorites`（需认证）

### GET `/favorites`
收藏列表

**响应**
```json
{
  "data": [
    {
      "productId": 10, "name": "商品名称", "price": "99.00",
      "originalPrice": "129.00", "images": ["https://..."], "tag": "hot"
    }
  ]
}
```

---

### POST `/favorites/:productId`
收藏商品

**响应**
```json
{ "message": "收藏成功" }
```

---

### DELETE `/favorites/:productId`
取消收藏

**响应**
```json
{ "message": "取消收藏" }
```

---

## 14. 评价 `/reviews`

### GET `/reviews/stats`
评价统计（无需认证）

**Query**: `productId`（可选，不传则统计全部）

**响应**
```json
{
  "avgRating": 4.8,
  "total": 256,
  "withImage": 88,
  "positive": 240,
  "withFollowup": 32
}
```

---

### GET `/reviews`
评价列表（无需认证）

**Query**
| 参数 | 类型 | 说明 |
|------|------|------|
| `page` | number | 页码，默认 1 |
| `limit` | number | 每页数量，默认 20 |
| `productId` | number | 可选，按商品筛选 |
| `hasImage` | boolean | 可选，只看有图评价 |
| `minRating` | number | 可选，最低评分 |
| `hasFollowup` | boolean | 可选，只看有追评 |

**响应**
```json
{
  "data": [
    {
      "id": 1, "rating": 5, "content": "很好用！", "images": ["https://..."],
      "nickname": "张三", "avatar": "https://...",
      "hasFollowup": 1, "followupContent": "追评内容", "followupAt": "...",
      "createdAt": "..."
    }
  ],
  "total": 256
}
```
> 匿名评价时 `nickname` 固定返回 `"匿名用户"`，`avatar` 为 `null`。

---

### POST `/reviews`
提交评价（**需认证**）

**Body**
```json
{
  "order_id": 1,
  "product_id": 10,
  "rating": 5,
  "content": "评价内容（不少于5字）",
  "anonymous": false,
  "images": ["https://...（可选）"]
}
```
**响应**: `{}`
