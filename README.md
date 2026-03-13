# 商城分润模型APP

## 项目结构

```
application/
├── backend/          # Node.js + Express 后端
└── mobile/           # Expo React Native 移动端
```

---

## 快速启动

### 1. 数据库初始化

确保 MySQL 已启动，执行建表脚本：

```bash
mysql -u root -p < backend/init.sql
```

### 2. 启动后端

```bash
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env，填入 MySQL/Redis 连接信息和 JWT_SECRET

# 启动开发服务器
npm run dev
```

后端启动后访问 `http://localhost:3000/health` 验证。

### 3. 启动移动端

```bash
cd mobile

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 修改 EXPO_PUBLIC_API_URL 为你的后端地址
# 本机调试时用 http://你的IP:3000/api（不能用 localhost）

# 启动 Expo
npm start
```

扫描二维码用 Expo Go App 查看，或按 `a` 打开 Android 模拟器。

---

## 环境要求

| 工具 | 版本 |
|------|------|
| Node.js | >= 18 |
| MySQL | >= 8.0 |
| Redis | >= 6.0 |
| Expo Go App | 最新版 |

---

## 分润算法说明

### 个人释放（30天衰减）

```
R(t) = profitPool × (0.55^t / S1)
S1 = Σ(0.55^t), t=1..30
```

每日凌晨 00:05 自动执行，写入 `profit_records`，更新 `wallets`。

### 团队分红权重

```
weight(d) = 1.06^d, d=1..36
```

---

## 后续迭代计划

- [ ] 商品详情页 + 购物车完整流程
- [ ] 订单列表与状态跟踪
- [ ] 分润明细列表（带日历视图）
- [ ] 团队分销树查看
- [ ] 微信支付 / 支付宝接入
- [ ] Push 消息通知
- [ ] 管理后台（Web）
