# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概览

NestJS 电商分润后端，提供 REST API。依赖 MySQL + Redis。

## 常用命令

```bash
# 开发（热重载）
npm run start:dev

# 构建
npm run build

# 生产启动
npm run start:prod
```

## 环境配置

复制 `.env.example` 创建 `.env`，配置以下必填项：

```
DB_HOST / DB_PORT / DB_USER / DB_PASSWORD / DB_NAME=mall_profit
REDIS_HOST / REDIS_PORT
JWT_SECRET
```

数据库 schema 通过 `init.sql` 手动管理（TypeORM `synchronize: false`）。

## 架构概览

**技术栈：** NestJS v10 + TypeORM + MySQL + Redis + JWT/Passport

**入口：** `src/main.ts` → 全局前缀 `/api`，端口 3000，启用 CORS 和 `ValidationPipe`。

**模块结构：**

```
src/
  auth/              # 注册/登录，JWT 颁发
  admin/             # 后台管理，独立 JWT + 权限守卫
  common/            # 全局守卫、Redis 模块、TokenBlacklistService
  database/entities/ # 23 个 TypeORM 实体（统一存放）
  shop/              # 商品
  order/             # 订单
  user/              # 用户信息
  wallet/            # 钱包 + 提现
  profit/            # 分润记录
  promotion/         # 推广邀请 + 奖励
  category/ / banner/ / address/ / favorite/ / review/ / notification/
```

## 认证与授权

- **用户**：Bearer JWT，7 天有效期，注销时写入 Redis 黑名单
- **管理员**：独立 `AdminJwtAuthGuard`，基于角色 (`SysRoleEntity`) + 菜单权限
- JWT 策略提取 `{ id, role }` 注入请求上下文
- 用户角色枚举：`user` / `distributor` / `agent` / `admin`

## 数据库实体规范

所有实体位于 `src/database/entities/`，在 `app.module.ts` 的 `TypeOrmModule` 中统一注册。新增实体需手动加入该数组，并同步更新 `init.sql`。

## 分润逻辑

`PromotionService` 处理多级邀请返佣。用户注册时通过 `invite_code` 关联上级，订单完成后触发分润计算写入 `ProfitRecordEntity`。

## 关键约束

- TypeORM `synchronize: false`，schema 变更必须手动修改 `init.sql`
- BigInt 字段序列化为字符串（防 JSON 溢出），前端需注意解析
- Redis 全局模块，跨模块直接注入 `RedisService` / `TokenBlacklistService`
- DTO 使用 `class-validator` 装饰器，配合全局 `ValidationPipe(whitelist: true, transform: true)`
