-- ============================================
-- 商城分润模型APP 数据库初始化脚本
-- 执行顺序：直接在 MySQL 中运行此文件
-- mysql -u root -p < init.sql
-- ============================================

CREATE DATABASE IF NOT EXISTS mall_profit
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mall_profit;

-- ============================================
-- 1. 用户表
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  phone         VARCHAR(20)  NOT NULL COMMENT '手机号',
  password      VARCHAR(255) NOT NULL COMMENT '加密密码',
  nickname      VARCHAR(50)  DEFAULT NULL COMMENT '昵称',
  avatar        VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
  role          ENUM('user','distributor','agent','admin') NOT NULL DEFAULT 'user' COMMENT '用户角色',
  invite_code   VARCHAR(10)  NOT NULL COMMENT '我的邀请码',
  member_no     VARCHAR(20)  DEFAULT NULL COMMENT '会员编号',
  member_expire DATE         DEFAULT NULL COMMENT '会员到期日',
  parent_id     BIGINT       DEFAULT NULL COMMENT '上级用户ID（通过邀请码绑定）',
  status        TINYINT      NOT NULL DEFAULT 1 COMMENT '状态 1正常 0禁用',
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_phone (phone),
  UNIQUE KEY uk_invite_code (invite_code),
  KEY idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- ============================================
-- 2. 商品表
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id             BIGINT          NOT NULL AUTO_INCREMENT COMMENT '商品ID',
  name           VARCHAR(200)    NOT NULL COMMENT '商品名称',
  description    TEXT            DEFAULT NULL COMMENT '商品描述',
  price          DECIMAL(10,2)   NOT NULL COMMENT '售价（元）',
  original_price DECIMAL(10,2)   DEFAULT NULL COMMENT '原价/划线价',
  profit_rate    DECIMAL(5,4)    NOT NULL DEFAULT 0.2500 COMMENT '分润比例（如0.25=25%）',
  stock          INT             NOT NULL DEFAULT 0 COMMENT '库存数量',
  sales          INT             NOT NULL DEFAULT 0 COMMENT '累计销量',
  tag            ENUM('promotion','new','hot','member_exclusive') DEFAULT NULL COMMENT '商品标签',
  images         JSON            DEFAULT NULL COMMENT '商品图片URL列表',
  category       VARCHAR(50)     DEFAULT NULL COMMENT '分类',
  category_id    BIGINT          DEFAULT NULL COMMENT '分类ID (FK categories.id)',
  status         ENUM('on','off') NOT NULL DEFAULT 'on' COMMENT '上架状态',
  created_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_status (status),
  KEY idx_category (category),
  KEY idx_category_id (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

-- ============================================
-- 3. 订单表
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id               BIGINT        NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  order_no         VARCHAR(32)   DEFAULT NULL COMMENT '订单编号',
  user_id          BIGINT        NOT NULL COMMENT '购买用户ID',
  total_amount     DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
  freight_amount   DECIMAL(10,2) DEFAULT 0.00 COMMENT '运费',
  discount_amount  DECIMAL(10,2) DEFAULT 0.00 COMMENT '优惠金额',
  pay_amount       DECIMAL(10,2) DEFAULT NULL COMMENT '实付金额',
  profit_pool      DECIMAL(10,2) NOT NULL COMMENT '分润池金额（进入分润系统的金额）',
  status           ENUM('pending','paid','shipped','done','cancelled') NOT NULL DEFAULT 'pending' COMMENT '订单状态',
  pay_type         VARCHAR(20)   DEFAULT NULL COMMENT '支付方式 wechat/alipay',
  pay_trade_no     VARCHAR(100)  DEFAULT NULL COMMENT '第三方支付流水号',
  remark           VARCHAR(500)  DEFAULT NULL COMMENT '备注',
  address_id       BIGINT        DEFAULT NULL COMMENT '收货地址ID',
  address_snapshot JSON          DEFAULT NULL COMMENT '下单时地址快照',
  paid_at          TIMESTAMP     DEFAULT NULL COMMENT '支付时间',
  shipped_at       TIMESTAMP     DEFAULT NULL COMMENT '发货时间',
  completed_at     TIMESTAMP     DEFAULT NULL COMMENT '完成时间',
  created_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_user_id (user_id),
  KEY idx_status (status),
  KEY idx_paid_at (paid_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- ============================================
-- 4. 订单商品明细表
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id            BIGINT        NOT NULL AUTO_INCREMENT,
  order_id      BIGINT        NOT NULL COMMENT '订单ID',
  product_id    BIGINT        NOT NULL COMMENT '商品ID',
  product_name  VARCHAR(200)  NOT NULL COMMENT '下单时商品名称快照',
  product_image VARCHAR(500)  DEFAULT NULL COMMENT '商品图片',
  price         DECIMAL(10,2) NOT NULL COMMENT '下单时单价快照',
  quantity      INT           NOT NULL DEFAULT 1 COMMENT '购买数量',
  subtotal      DECIMAL(10,2) NOT NULL COMMENT '小计金额',
  PRIMARY KEY (id),
  KEY idx_order_id (order_id),
  KEY idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单商品明细表';

-- ============================================
-- 5. 分润记录表（每日释放记录）
-- ============================================
CREATE TABLE IF NOT EXISTS profit_records (
  id          BIGINT         NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  user_id     BIGINT         NOT NULL COMMENT '收益归属用户',
  order_id    BIGINT         NOT NULL COMMENT '来源订单',
  type        ENUM('personal','team') NOT NULL COMMENT '分润类型：个人释放/团队分红',
  day_index   TINYINT        NOT NULL COMMENT '第几天释放（1~30个人，1~36团队）',
  amount      DECIMAL(10,4)  NOT NULL COMMENT '当日释放金额',
  released_at DATE           NOT NULL COMMENT '释放日期',
  created_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_order_day_type (order_id, day_index, type) COMMENT '防止重复释放',
  KEY idx_user_id (user_id),
  KEY idx_released_at (released_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分润释放记录表';

-- ============================================
-- 6. 钱包表
-- ============================================
CREATE TABLE IF NOT EXISTS wallets (
  user_id    BIGINT        NOT NULL COMMENT '用户ID',
  balance    DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '可用余额',
  frozen     DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '冻结余额（提现审核中）',
  total_earn DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '累计收益',
  updated_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户钱包表';

-- ============================================
-- 7. 提现申请表
-- ============================================
CREATE TABLE IF NOT EXISTS withdrawals (
  id            BIGINT        NOT NULL AUTO_INCREMENT COMMENT '申请ID',
  user_id       BIGINT        NOT NULL COMMENT '申请用户',
  amount        DECIMAL(10,2) NOT NULL COMMENT '提现金额',
  method        ENUM('bank','alipay') NOT NULL DEFAULT 'bank' COMMENT '提现方式',
  bank_card_id  BIGINT        DEFAULT NULL COMMENT '关联银行卡ID (FK bank_cards.id)',
  bank_name     VARCHAR(50)   DEFAULT NULL COMMENT '收款银行',
  bank_account  VARCHAR(50)   DEFAULT NULL COMMENT '收款账号',
  real_name     VARCHAR(50)   DEFAULT NULL COMMENT '收款人姓名',
  status        ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending' COMMENT '审核状态',
  reject_reason VARCHAR(200)  DEFAULT NULL COMMENT '驳回原因',
  applied_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '申请时间',
  processed_at  TIMESTAMP     DEFAULT NULL COMMENT '审核时间',
  PRIMARY KEY (id),
  KEY idx_user_id (user_id),
  KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='提现申请表';

-- ============================================
-- 初始化测试数据（可选）
-- ============================================

-- 创建管理员账号（密码: admin123，bcrypt hash）
-- 注意：实际使用时请通过代码注册，或使用 bcrypt 重新生成 hash
INSERT IGNORE INTO users (phone, password, role, invite_code, nickname)
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'ADMIN0', '管理员');

-- 创建示例商品
INSERT IGNORE INTO products (id, name, description, price, profit_rate, stock, images, category, status)
VALUES
  (1, '示例商品A', '这是一个测试商品', 100.00, 0.25, 999, '["https://placeholder.com/300x300"]', '通用', 'on'),
  (2, '示例商品B', '高分润测试商品', 200.00, 0.30, 999, '["https://placeholder.com/300x300"]', '通用', 'on');

-- 管理员钱包初始化
INSERT IGNORE INTO wallets (user_id) VALUES (1);

-- ============================================
-- ========== 后台管理系统 RBAC 表 ==========
-- ============================================

-- 8. 管理员表（独立于 C 端 users）
CREATE TABLE IF NOT EXISTS sys_admin (
  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
  username      VARCHAR(50) UNIQUE NOT NULL  COMMENT '登录账号',
  password      VARCHAR(255) NOT NULL,
  real_name     VARCHAR(50) DEFAULT NULL     COMMENT '真实姓名',
  email         VARCHAR(100) DEFAULT NULL,
  phone         VARCHAR(20) DEFAULT NULL,
  avatar        VARCHAR(500) DEFAULT NULL,
  dept_id       BIGINT DEFAULT NULL          COMMENT '所属部门',
  status        TINYINT NOT NULL DEFAULT 1   COMMENT '1正常 0禁用',
  last_login_at TIMESTAMP DEFAULT NULL,
  last_login_ip VARCHAR(50) DEFAULT NULL,
  created_by    BIGINT DEFAULT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at    TIMESTAMP DEFAULT NULL       COMMENT '软删除',
  KEY idx_dept_id (dept_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统管理员';

-- 9. 角色表
CREATE TABLE IF NOT EXISTS sys_role (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(50) NOT NULL           COMMENT '角色名称',
  code        VARCHAR(50) UNIQUE NOT NULL    COMMENT '角色编码',
  description VARCHAR(200) DEFAULT NULL,
  data_scope  TINYINT NOT NULL DEFAULT 4     COMMENT '数据权限：1全部 2本部门及子部门 3本部门 4仅本人 5自定义',
  sort        INT DEFAULT 0,
  status      TINYINT NOT NULL DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- 10. 管理员-角色关联
CREATE TABLE IF NOT EXISTS sys_admin_role (
  admin_id BIGINT NOT NULL,
  role_id  BIGINT NOT NULL,
  PRIMARY KEY (admin_id, role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员-角色关联';

-- 11. 菜单/权限表（树形）
CREATE TABLE IF NOT EXISTS sys_menu (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  parent_id   BIGINT NOT NULL DEFAULT 0      COMMENT '父级ID，0=顶级',
  name        VARCHAR(50) NOT NULL           COMMENT '菜单名称',
  type        TINYINT NOT NULL               COMMENT '1目录 2菜单 3按钮/API权限',
  permission  VARCHAR(100) DEFAULT NULL      COMMENT '权限标识如 order:list',
  path        VARCHAR(200) DEFAULT NULL      COMMENT '前端路由',
  component   VARCHAR(200) DEFAULT NULL      COMMENT '前端组件路径',
  icon        VARCHAR(50) DEFAULT NULL,
  sort        INT NOT NULL DEFAULT 0,
  visible     TINYINT NOT NULL DEFAULT 1     COMMENT '菜单是否可见',
  status      TINYINT NOT NULL DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_permission (permission),
  KEY idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜单与权限表';

-- 12. 角色-菜单关联
CREATE TABLE IF NOT EXISTS sys_role_menu (
  role_id BIGINT NOT NULL,
  menu_id BIGINT NOT NULL,
  PRIMARY KEY (role_id, menu_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色-菜单关联';

-- 13. 部门表（树形）
CREATE TABLE IF NOT EXISTS sys_dept (
  id        BIGINT PRIMARY KEY AUTO_INCREMENT,
  parent_id BIGINT NOT NULL DEFAULT 0,
  ancestors VARCHAR(500) DEFAULT ''          COMMENT '祖级路径，用于 LIKE 查子部门',
  name      VARCHAR(50) NOT NULL,
  leader    VARCHAR(50) DEFAULT NULL,
  phone     VARCHAR(20) DEFAULT NULL,
  sort      INT NOT NULL DEFAULT 0,
  status    TINYINT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='部门表';

-- 14. 角色-部门数据权限
CREATE TABLE IF NOT EXISTS sys_role_dept (
  role_id BIGINT NOT NULL,
  dept_id BIGINT NOT NULL,
  PRIMARY KEY (role_id, dept_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色-部门数据权限';

-- 15. 操作日志
CREATE TABLE IF NOT EXISTS sys_operation_log (
  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
  admin_id      BIGINT DEFAULT NULL,
  admin_name    VARCHAR(50) DEFAULT NULL,
  module        VARCHAR(50) NOT NULL         COMMENT '模块',
  action        VARCHAR(50) NOT NULL         COMMENT '动作 CREATE/UPDATE/DELETE/EXPORT',
  method        VARCHAR(10) NOT NULL,
  url           VARCHAR(500) NOT NULL,
  request_body  JSON DEFAULT NULL,
  response_code INT DEFAULT NULL,
  ip            VARCHAR(50) DEFAULT NULL,
  user_agent    VARCHAR(500) DEFAULT NULL,
  duration_ms   INT DEFAULT NULL,
  status        TINYINT NOT NULL DEFAULT 1   COMMENT '1成功 0失败',
  error_msg     TEXT DEFAULT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_admin_id (admin_id),
  KEY idx_module (module),
  KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作日志';

-- 16. 登录日志
CREATE TABLE IF NOT EXISTS sys_login_log (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  admin_id   BIGINT DEFAULT NULL,
  username   VARCHAR(50) NOT NULL,
  ip         VARCHAR(50) DEFAULT NULL,
  user_agent VARCHAR(500) DEFAULT NULL,
  status     TINYINT NOT NULL               COMMENT '1成功 0失败',
  message    VARCHAR(200) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='登录日志';

-- ============================================
-- ========== RBAC 种子数据 ==========
-- ============================================

-- 部门
INSERT IGNORE INTO sys_dept (id, parent_id, ancestors, name, leader, sort) VALUES
  (1, 0, '0',   '总公司', NULL, 0),
  (2, 1, '0,1', '技术部', NULL, 1),
  (3, 1, '0,1', '运营部', NULL, 2),
  (4, 1, '0,1', '销售部', NULL, 3),
  (5, 1, '0,1', '财务部', NULL, 4),
  (6, 3, '0,1,3', '电商运营组', NULL, 1);

-- 角色
INSERT IGNORE INTO sys_role (id, name, code, description, data_scope, sort) VALUES
  (1, '超级管理员', 'super_admin', '拥有全部权限', 1, 0),
  (2, '管理员',     'admin',       '系统管理员',   1, 1),
  (3, '销售组长',   'sales_leader','销售团队负责人', 2, 2),
  (4, '销售',       'sales',       '销售人员',     4, 3),
  (5, '运营组长',   'ops_leader',  '运营团队负责人', 2, 4),
  (6, '运营',       'ops',         '运营人员',     4, 5),
  (7, '财务',       'finance',     '财务人员',     3, 6);

-- 菜单（type: 1=目录 2=菜单 3=按钮）
INSERT IGNORE INTO sys_menu (id, parent_id, name, type, permission, path, component, icon, sort) VALUES
  -- 系统管理
  (1,  0,  '系统管理',   1, NULL,                   '/system',           NULL,                          'Setting',   1),
  (2,  1,  '管理员管理', 2, 'system:admin:list',     '/system/admins',    'system/admin/index',          'User',      1),
  (3,  2,  '新增管理员', 3, 'system:admin:create',   NULL,                NULL,                          NULL,        1),
  (4,  2,  '编辑管理员', 3, 'system:admin:update',   NULL,                NULL,                          NULL,        2),
  (5,  2,  '重置密码',   3, 'system:admin:reset-pwd', NULL,               NULL,                          NULL,        3),
  (6,  1,  '角色管理',   2, 'system:role:list',      '/system/roles',     'system/role/index',           'Stamp',     2),
  (7,  6,  '新增角色',   3, 'system:role:create',    NULL,                NULL,                          NULL,        1),
  (8,  6,  '编辑角色',   3, 'system:role:update',    NULL,                NULL,                          NULL,        2),
  (9,  1,  '菜单管理',   2, 'system:menu:list',      '/system/menus',     'system/menu/index',           'Menu',      3),
  (10, 9,  '新增菜单',   3, 'system:menu:create',    NULL,                NULL,                          NULL,        1),
  (11, 9,  '编辑菜单',   3, 'system:menu:update',    NULL,                NULL,                          NULL,        2),
  (12, 1,  '部门管理',   2, 'system:dept:list',      '/system/depts',     'system/dept/index',           'OfficeBuilding', 4),
  (13, 12, '新增部门',   3, 'system:dept:create',    NULL,                NULL,                          NULL,        1),
  (14, 12, '编辑部门',   3, 'system:dept:update',    NULL,                NULL,                          NULL,        2),
  (15, 1,  '操作日志',   2, 'system:log:list',       '/system/logs',      'system/log/index',            'Document',  5),
  -- 用户管理
  (16, 0,  '用户管理',   2, 'user:list',             '/users',            'user/index',                  'UserFilled', 2),
  (17, 16, '编辑用户',   3, 'user:update',           NULL,                NULL,                          NULL,        1),
  -- 商品管理
  (18, 0,  '商品管理',   2, 'product:list',          '/products',         'product/index',               'Goods',     3),
  (19, 18, '新增商品',   3, 'product:create',        NULL,                NULL,                          NULL,        1),
  (20, 18, '编辑商品',   3, 'product:update',        NULL,                NULL,                          NULL,        2),
  -- 订单管理
  (21, 0,  '订单管理',   2, 'order:list',            '/orders',           'order/index',                 'List',      4),
  (22, 21, '编辑订单',   3, 'order:update',          NULL,                NULL,                          NULL,        1),
  (23, 21, '导出订单',   3, 'order:export',          NULL,                NULL,                          NULL,        2),
  -- 财务管理
  (24, 0,  '财务管理',   1, NULL,                    '/finance',          NULL,                          'Money',     5),
  (25, 24, '提现审核',   2, 'withdrawal:list',       '/finance/withdrawals','finance/withdrawal/index',  'Wallet',    1),
  (26, 25, '审核通过',   3, 'withdrawal:approve',    NULL,                NULL,                          NULL,        1),
  (27, 25, '审核驳回',   3, 'withdrawal:reject',     NULL,                NULL,                          NULL,        2),
  -- 分润管理
  (28, 0,  '分润管理',   2, 'profit:stats',          '/profit',           'profit/index',                'TrendCharts', 6);

-- 超级管理员拥有全部菜单
INSERT IGNORE INTO sys_role_menu (role_id, menu_id)
SELECT 1, id FROM sys_menu;

-- 管理员拥有除系统管理外的全部菜单
INSERT IGNORE INTO sys_role_menu (role_id, menu_id)
SELECT 2, id FROM sys_menu WHERE id >= 16;

-- 销售角色：用户管理 + 订单管理
INSERT IGNORE INTO sys_role_menu (role_id, menu_id) VALUES
  (3, 16),(3, 17),(3, 21),(3, 22),(3, 23),
  (4, 16),(4, 21);

-- 运营角色：商品管理 + 订单管理
INSERT IGNORE INTO sys_role_menu (role_id, menu_id) VALUES
  (5, 18),(5, 19),(5, 20),(5, 21),(5, 22),(5, 23),
  (6, 18),(6, 21);

-- 财务角色：财务管理 + 分润管理
INSERT IGNORE INTO sys_role_menu (role_id, menu_id) VALUES
  (7, 24),(7, 25),(7, 26),(7, 27),(7, 28);

-- ============================================
-- 推广奖励流水表
-- ============================================
CREATE TABLE IF NOT EXISTS promotion_rewards (
  id            BIGINT        NOT NULL AUTO_INCREMENT,
  user_id       BIGINT        NOT NULL COMMENT '获得奖励的用户（推荐人）',
  from_user_id  BIGINT        NOT NULL COMMENT '触发奖励的用户（被推荐人）',
  order_id      BIGINT        DEFAULT NULL COMMENT '关联订单ID（佣金类型时有值）',
  type          ENUM('referral','commission') NOT NULL COMMENT '奖励类型',
  amount        DECIMAL(10,4) NOT NULL COMMENT '奖励金额',
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_reward_unique (user_id, from_user_id, type, order_id),
  KEY idx_user_id (user_id),
  KEY idx_from_user_id (from_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='推广奖励流水';

-- ============================================
-- 推广配置表
-- ============================================
CREATE TABLE IF NOT EXISTS promotion_configs (
  config_key    VARCHAR(50)  NOT NULL COMMENT '配置键',
  config_value  VARCHAR(200) NOT NULL COMMENT '配置值',
  description   VARCHAR(200) DEFAULT NULL COMMENT '配置说明',
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='推广配置';

INSERT IGNORE INTO promotion_configs (config_key, config_value, description) VALUES
  ('referral_reward_amount', '5.00', '邀请注册奖励金额（元）'),
  ('commission_rate', '0.05', '分享订单佣金比例（占利润池比例）'),
  ('referral_reward_enabled', 'true', '邀请奖励开关'),
  ('commission_enabled', 'true', '分享佣金开关');

-- 超级管理员账号（密码: admin123, bcrypt hash）
INSERT IGNORE INTO sys_admin (id, username, password, real_name, dept_id, created_by) VALUES
  (1, 'admin', '$2a$10$ou/o5EN6Ft0UTfq9mUdcEOJ81P5ImXb46/6vMMEHdlXi5LVycsydu', '超级管理员', 1, NULL);

-- 超级管理员绑定角色
INSERT IGNORE INTO sys_admin_role (admin_id, role_id) VALUES (1, 1);

-- ============================================
-- 收货地址表
-- ============================================
CREATE TABLE IF NOT EXISTS addresses (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id     BIGINT NOT NULL,
  name        VARCHAR(50) NOT NULL COMMENT '收货人',
  phone       VARCHAR(20) NOT NULL,
  province    VARCHAR(50) NOT NULL,
  city        VARCHAR(50) NOT NULL,
  district    VARCHAR(50) NOT NULL,
  detail      VARCHAR(200) NOT NULL COMMENT '详细地址',
  is_default  TINYINT NOT NULL DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收货地址';

-- ============================================
-- 分类表
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id        BIGINT PRIMARY KEY AUTO_INCREMENT,
  name      VARCHAR(50) NOT NULL,
  icon      VARCHAR(50) DEFAULT NULL,
  parent_id BIGINT DEFAULT NULL,
  sort      INT DEFAULT 0,
  status    TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品分类';

-- ============================================
-- Banner表
-- ============================================
CREATE TABLE IF NOT EXISTS banners (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  image_url  VARCHAR(500) NOT NULL,
  title      VARCHAR(100) DEFAULT NULL,
  link_type  VARCHAR(20) DEFAULT NULL COMMENT 'product/category/url',
  link_value VARCHAR(200) DEFAULT NULL,
  sort       INT DEFAULT 0,
  status     TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='轮播图';

-- ============================================
-- 收藏表
-- ============================================
CREATE TABLE IF NOT EXISTS favorites (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id    BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_product (user_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品收藏';

-- ============================================
-- 评价表
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id               BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id          BIGINT NOT NULL,
  product_id       BIGINT NOT NULL,
  order_id         BIGINT NOT NULL,
  rating           TINYINT NOT NULL DEFAULT 5,
  content          TEXT DEFAULT NULL,
  images           JSON DEFAULT NULL,
  is_anonymous     TINYINT DEFAULT 0,
  has_followup     TINYINT NOT NULL DEFAULT 0 COMMENT '是否有追评 0无 1有',
  followup_content TEXT DEFAULT NULL COMMENT '追评内容',
  followup_images  JSON DEFAULT NULL COMMENT '追评图片列表',
  followup_at      TIMESTAMP DEFAULT NULL COMMENT '追评时间',
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_product_id (product_id),
  KEY idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品评价';

-- ============================================
-- 通知表
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id    BIGINT NOT NULL,
  type       ENUM('system','order','profit') NOT NULL DEFAULT 'system',
  title      VARCHAR(100) NOT NULL,
  content    TEXT NOT NULL,
  is_read    TINYINT DEFAULT 0,
  link_type  VARCHAR(20) DEFAULT NULL,
  link_value VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_user_id (user_id),
  KEY idx_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息通知';

-- ============================================
-- 分类种子数据
-- ============================================
INSERT IGNORE INTO categories (id, name, icon, parent_id, sort) VALUES
  (1, '新鲜果蔬', 'leaf', NULL, 1),
  (2, '肉禽蛋奶', 'food-steak', NULL, 2),
  (3, '休闲零食', 'cookie', NULL, 3),
  (4, '酒水饮料', 'cup-water', NULL, 4),
  (5, '粮油调味', 'grain', NULL, 5),
  (6, '个人护理', 'face-woman-shimmer', NULL, 6),
  (7, '家居清洁', 'spray-bottle', NULL, 7),
  (8, '母婴用品', 'baby-bottle-outline', NULL, 8),
  (11, '新鲜水果', 'fruit-cherries', 1, 1),
  (12, '新鲜蔬菜', 'carrot', 1, 2),
  (13, '菌菇豆制', 'mushroom', 1, 3),
  (21, '猪肉', 'pig-variant', 2, 1),
  (22, '牛羊肉', 'cow', 2, 2),
  (23, '鸡鸭鹅', 'food-drumstick', 2, 3),
  (24, '蛋类', 'egg', 2, 4),
  (31, '坚果炒货', 'peanut', 3, 1),
  (32, '饼干糕点', 'cupcake', 3, 2),
  (33, '糖果巧克力', 'candy', 3, 3),
  (41, '白酒', 'bottle-wine', 4, 1),
  (42, '啤酒', 'beer', 4, 2),
  (43, '果汁饮料', 'cup', 4, 3),
  (44, '茶饮', 'tea', 4, 4),
  (51, '大米', 'rice', 5, 1),
  (52, '食用油', 'bottle-tonic', 5, 2),
  (53, '调味品', 'shaker', 5, 3),
  (61, '洗发护发', 'hair-dryer', 6, 1),
  (62, '口腔护理', 'toothbrush', 6, 2),
  (63, '面部护肤', 'lotion-outline', 6, 3),
  (71, '衣物清洁', 'tshirt-crew', 7, 1),
  (72, '纸品', 'paper-roll', 7, 2),
  (81, '奶粉', 'baby-bottle', 8, 1),
  (82, '纸尿裤', 'baby-face-outline', 8, 2),
  (83, '辅食', 'food-apple', 8, 3);

-- ============================================
-- Banner种子数据
-- ============================================
INSERT IGNORE INTO banners (id, image_url, title, link_type, sort) VALUES
  (1, 'https://via.placeholder.com/750x300/E53935/fff?text=新品上市', '新品上市', NULL, 1),
  (2, 'https://via.placeholder.com/750x300/F57C00/fff?text=限时特惠', '限时特惠', NULL, 2),
  (3, 'https://via.placeholder.com/750x300/388E3C/fff?text=会员专享', '会员专享', NULL, 3);

-- ============================================
-- 新增管理菜单
-- ============================================
INSERT IGNORE INTO sys_menu (id, parent_id, name, type, permission, path, component, icon, sort) VALUES
  (29, 0,  '内容管理', 1, NULL, '/content', NULL, 'Picture', 7),
  (30, 29, '分类管理', 2, 'category:list', '/content/categories', 'content/category/index', 'Folder', 1),
  (31, 30, '新增分类', 3, 'category:create', NULL, NULL, NULL, 1),
  (32, 30, '编辑分类', 3, 'category:update', NULL, NULL, NULL, 2),
  (33, 30, '删除分类', 3, 'category:delete', NULL, NULL, NULL, 3),
  (34, 29, 'Banner管理', 2, 'banner:list', '/content/banners', 'content/banner/index', 'PictureFilled', 2),
  (35, 34, '新增Banner', 3, 'banner:create', NULL, NULL, NULL, 1),
  (36, 34, '编辑Banner', 3, 'banner:update', NULL, NULL, NULL, 2),
  (37, 34, '删除Banner', 3, 'banner:delete', NULL, NULL, NULL, 3),
  (38, 0,  '评价管理', 2, 'review:list', '/reviews', 'review/index', 'MessageBox', 8),
  (39, 38, '删除评价', 3, 'review:delete', NULL, NULL, NULL, 1),
  (40, 0,  '通知管理', 2, 'notification:list', '/notifications', 'notification/index', 'Bell', 9),
  (41, 40, '发送通知', 3, 'notification:create', NULL, NULL, NULL, 1),
  (42, 40, '删除通知', 3, 'notification:delete', NULL, NULL, NULL, 2);

-- 超级管理员获得新菜单权限
INSERT IGNORE INTO sys_role_menu (role_id, menu_id)
SELECT 1, id FROM sys_menu WHERE id >= 29;

-- 管理员获得新菜单权限
INSERT IGNORE INTO sys_role_menu (role_id, menu_id)
SELECT 2, id FROM sys_menu WHERE id >= 29;

-- 运营获得内容管理+评价
INSERT IGNORE INTO sys_role_menu (role_id, menu_id) VALUES
  (5, 29),(5, 30),(5, 31),(5, 32),(5, 33),(5, 34),(5, 35),(5, 36),(5, 37),(5, 38),(5, 39),
  (6, 29),(6, 30),(6, 34),(6, 38);

-- ============================================
-- 补充表
-- ============================================

-- 短信验证码表
CREATE TABLE IF NOT EXISTS sms_codes (
  id         BIGINT      NOT NULL AUTO_INCREMENT,
  phone      VARCHAR(20) NOT NULL COMMENT '手机号',
  code       VARCHAR(10) NOT NULL COMMENT '验证码',
  scene      VARCHAR(20) NOT NULL DEFAULT 'register' COMMENT '使用场景 register/reset_pwd',
  used       TINYINT     NOT NULL DEFAULT 0 COMMENT '0未使用 1已使用',
  expired_at TIMESTAMP   NOT NULL COMMENT '过期时间（建议5分钟）',
  created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_phone_scene (phone, scene)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='短信验证码';

-- 用户绑定银行卡表
CREATE TABLE IF NOT EXISTS bank_cards (
  id          BIGINT      NOT NULL AUTO_INCREMENT,
  user_id     BIGINT      NOT NULL COMMENT '用户ID',
  bank_name   VARCHAR(50) NOT NULL COMMENT '银行名称，如"招商银行"',
  card_no     VARCHAR(30) NOT NULL COMMENT '银行卡号（完整，建议加密存储）',
  last_four   CHAR(4)     NOT NULL COMMENT '卡号后四位（展示用）',
  real_name   VARCHAR(50) NOT NULL COMMENT '持卡人姓名',
  is_default  TINYINT     NOT NULL DEFAULT 0 COMMENT '是否默认卡 0否 1是',
  status      TINYINT     NOT NULL DEFAULT 1 COMMENT '1正常 0禁用',
  created_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_user_card (user_id, card_no),
  KEY idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户绑定银行卡';

-- 钱包流水表
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id            BIGINT        NOT NULL AUTO_INCREMENT,
  user_id       BIGINT        NOT NULL COMMENT '用户ID',
  type          ENUM('income','expense') NOT NULL COMMENT '收入/支出',
  amount        DECIMAL(10,2) NOT NULL COMMENT '金额（正数）',
  name          VARCHAR(100)  NOT NULL COMMENT '流水名称，如"订单分润"、"申请提现"',
  ref_type      VARCHAR(30)   DEFAULT NULL COMMENT '来源类型 order/withdrawal/reward/refund',
  ref_id        BIGINT        DEFAULT NULL COMMENT '来源记录ID',
  balance_after DECIMAL(10,2) NOT NULL COMMENT '交易后余额快照',
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_user_id (user_id),
  KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='钱包流水';

-- 购物车表
CREATE TABLE IF NOT EXISTS cart_items (
  id         BIGINT       NOT NULL AUTO_INCREMENT,
  user_id    BIGINT       NOT NULL COMMENT '用户ID',
  product_id BIGINT       NOT NULL COMMENT '商品ID',
  quantity   INT          NOT NULL DEFAULT 1 COMMENT '数量',
  spec       VARCHAR(100) DEFAULT NULL COMMENT '规格描述，如"颜色:红 尺寸:XL"',
  selected   TINYINT      NOT NULL DEFAULT 1 COMMENT '是否勾选 1是 0否',
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_user_product_spec (user_id, product_id, spec),
  KEY idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物车';

-- 闪购/限时特惠活动表
CREATE TABLE IF NOT EXISTS flash_sales (
  id          BIGINT        NOT NULL AUTO_INCREMENT,
  product_id  BIGINT        NOT NULL COMMENT '关联商品ID',
  flash_price DECIMAL(10,2) NOT NULL COMMENT '闪购价',
  stock_limit INT           DEFAULT NULL COMMENT '活动库存限制，NULL=不限',
  start_at    TIMESTAMP     NOT NULL COMMENT '活动开始时间',
  end_at      TIMESTAMP     NOT NULL COMMENT '活动结束时间',
  sort        INT           NOT NULL DEFAULT 0 COMMENT '排序权重',
  status      TINYINT       NOT NULL DEFAULT 1 COMMENT '1启用 0禁用',
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_product_id (product_id),
  KEY idx_end_at (end_at),
  KEY idx_status_end (status, end_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='闪购/限时特惠活动';
-- ============================================
-- 测试种子数据（完整版）
-- 密码统一为 test123，bcrypt hash
-- ============================================

-- ============================================
-- 测试用户（构建三级邀请链）
-- 层级：admin(1) 独立
--       u2(distributor) 顶级推广员
--         └─ u3(distributor) 被u2邀请
--               ├─ u4(user) 被u3邀请
--               └─ u5(user) 被u3邀请
--         └─ u6(user) 被u2邀请
-- ============================================
INSERT IGNORE INTO users (id, phone, password, nickname, avatar, role, invite_code, parent_id, member_no, member_expire, status) VALUES
  (2, '13800000002', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', '张推广', NULL, 'distributor', 'ZPG001', NULL, 'VIP00002', '2025-12-31', 1),
  (3, '13800000003', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', '李分销', NULL, 'distributor', 'LFS002', 2,    'VIP00003', '2025-06-30', 1),
  (4, '13800000004', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', '王小明', NULL, 'user',        'WXM003', 3,    NULL,       NULL,        1),
  (5, '13800000005', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', '赵小红', NULL, 'user',        'ZXH004', 3,    NULL,       NULL,        1),
  (6, '13800000006', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', '陈小丽', NULL, 'user',        'CXL005', 2,    NULL,       NULL,        1);

-- ============================================
-- 商品（含新字段：original_price/sales/tag/category_id）
-- ============================================
INSERT IGNORE INTO products (id, name, description, price, original_price, profit_rate, stock, sales, images, category, category_id, tag, status) VALUES
  (3,  '智利车厘子 2斤装',  '进口特级车厘子，颗粒饱满，鲜甜多汁',    89.90, 129.00, 0.25, 500,  1280, '["https://via.placeholder.com/400x400/E53935/fff?text=车厘子"]', '新鲜水果', 11, 'hot',              'on'),
  (4,  '草莓 500g',         '丹东草莓，新鲜直发，酸甜适口',           39.90,  59.00, 0.20, 800,  3200, '["https://via.placeholder.com/400x400/E91E63/fff?text=草莓"]',   '新鲜水果', 11, 'promotion',        'on'),
  (5,  '有机菠菜 500g',     '基地直供有机菠菜，无农残',               12.90,  18.00, 0.22, 1200,  890, '["https://via.placeholder.com/400x400/388E3C/fff?text=菠菜"]',   '新鲜蔬菜', 12, 'new',              'on'),
  (6,  '澳洲牛腱肉 500g',   '进口谷饲牛腱，肉质细嫩，适合炖煮',      68.00,  89.00, 0.28, 300,  2100, '["https://via.placeholder.com/400x400/795548/fff?text=牛腱肉"]', '牛羊肉',   22, 'hot',              'on'),
  (7,  '土鸡蛋 30枚',       '散养土鸡蛋，蛋黄金黄，营养丰富',        38.00,  48.00, 0.20, 600,  4500, '["https://via.placeholder.com/400x400/FFC107/fff?text=土鸡蛋"]', '蛋类',     24, 'hot',              'on'),
  (8,  '混合坚果 500g',     '每日坚果精选，腰果+巴旦木+核桃+榛子',   49.90,  69.00, 0.25, 400,  6700, '["https://via.placeholder.com/400x400/FF9800/fff?text=坚果"]',   '坚果炒货', 31, 'promotion',        'on'),
  (9,  '金龙鱼大米 5kg',    '东北长粒香米，颗粒饱满，香气浓郁',      39.90,  49.00, 0.18, 1000, 8900, '["https://via.placeholder.com/400x400/FFEB3B/333?text=大米"]',   '大米',     51, NULL,               'on'),
  (10, '海天老抽 500ml',    '酱香浓郁，上色效果好',                   12.90,  16.00, 0.20, 2000, 5600, '["https://via.placeholder.com/400x400/4E342E/fff?text=老抽"]',   '调味品',   53, NULL,               'on'),
  (11, '会员专享礼盒',      '精选商品组合，仅限会员购买',            199.00, 299.00, 0.35, 100,   320, '["https://via.placeholder.com/400x400/9C27B0/fff?text=礼盒"]',   '通用',     NULL,'member_exclusive', 'on'),
  (12, '新品尝鲜装 蓝莓',   '云南高山蓝莓，新品上市，甜度高，颗粒大', 45.00,  60.00, 0.22, 300,   180, '["https://via.placeholder.com/400x400/3F51B5/fff?text=蓝莓"]',   '新鲜水果', 11, 'new',              'on');

-- ============================================
-- 收货地址
-- ============================================
INSERT IGNORE INTO addresses (id, user_id, name, phone, province, city, district, detail, is_default) VALUES
  (1, 2, '张推广', '13800000002', '广东省', '深圳市', '南山区',   '科技园南区8栋302',       1),
  (2, 2, '张推广', '13800000002', '广东省', '深圳市', '福田区',   '华强北路66号',           0),
  (3, 3, '李分销', '13800000003', '浙江省', '杭州市', '西湖区',   '文三路互联网小镇A座',   1),
  (4, 4, '王小明', '13800000004', '上海市', '上海市', '浦东新区', '张江高科技园区88号',     1),
  (5, 5, '赵小红', '13800000005', '北京市', '北京市', '朝阳区',   '望京SOHO T3-1501',      1),
  (6, 6, '陈小丽', '13800000006', '江苏省', '南京市', '鼓楼区',   '汉中路1号新街口广场',   1);

-- ============================================
-- 钱包初始化（新用户）
-- ============================================
INSERT IGNORE INTO wallets (user_id, balance, frozen, total_earn) VALUES
  (2, 1280.50, 200.00, 3560.80),
  (3,  680.20,   0.00, 1240.60),
  (4,   45.00,   0.00,   45.00),
  (5,  120.30,   0.00,  120.30),
  (6,    5.00,   0.00,    5.00);

-- ============================================
-- 银行卡
-- ============================================
INSERT IGNORE INTO bank_cards (id, user_id, bank_name, card_no, last_four, real_name, is_default) VALUES
  (1, 2, '招商银行',     '6225880188888881', '8881', '张推广', 1),
  (2, 2, '中国工商银行', '6222021302888882', '8882', '张推广', 0),
  (3, 3, '中国建设银行', '6227003882888883', '8883', '李分销', 1),
  (4, 4, '支付宝',       '13800000004',       '0004', '王小明', 1);

-- ============================================
-- 订单
-- ============================================
INSERT IGNORE INTO orders (id, order_no, user_id, total_amount, freight_amount, discount_amount, pay_amount, profit_pool, status, pay_type, address_id, address_snapshot, remark, paid_at, shipped_at, completed_at) VALUES
  (1, '20240315001001', 4, 89.90,  0, 0,  89.90,  22.48, 'done',    'alipay', 4, '{"name":"王小明","phone":"13800000004","address":"上海市浦东新区张江高科技园区88号"}', NULL,       '2024-03-15 10:00:00', '2024-03-16 09:00:00', '2024-03-18 15:00:00'),
  (2, '20240316002001', 4, 49.90,  0, 0,  49.90,  12.48, 'done',    'wechat', 4, '{"name":"王小明","phone":"13800000004","address":"上海市浦东新区张江高科技园区88号"}', NULL,       '2024-03-16 14:00:00', '2024-03-17 10:00:00', '2024-03-19 11:00:00'),
  (3, '20240320003001', 5, 68.00,  0, 0,  68.00,  19.04, 'shipped', 'alipay', 5, '{"name":"赵小红","phone":"13800000005","address":"北京市朝阳区望京SOHO T3-1501"}',   NULL,       '2024-03-20 09:30:00', '2024-03-21 08:00:00', NULL),
  (4, '20240322004001', 6, 38.00,  0, 0,  38.00,   7.60, 'paid',    'wechat', 6, '{"name":"陈小丽","phone":"13800000006","address":"江苏省南京市鼓楼区汉中路1号"}',     NULL,       '2024-03-22 16:00:00', NULL,                  NULL),
  (5, '20240323005001', 4, 199.00, 0, 0, 199.00,  69.65, 'pending', NULL,     4, '{"name":"王小明","phone":"13800000004","address":"上海市浦东新区张江高科技园区88号"}', '尽快发货', NULL,                  NULL,                  NULL),
  (6, '20240310006001', 3, 127.90, 0, 0, 127.90,  31.98, 'done',    'alipay', 3, '{"name":"李分销","phone":"13800000003","address":"浙江省杭州市西湖区文三路互联网小镇A座"}', NULL, '2024-03-10 11:00:00', '2024-03-11 09:00:00', '2024-03-13 14:00:00');

-- ============================================
-- 订单明细
-- ============================================
INSERT IGNORE INTO order_items (id, order_id, product_id, product_name, product_image, price, quantity, subtotal) VALUES
  (1, 1, 3,  '智利车厘子 2斤装', 'https://via.placeholder.com/400x400/E53935/fff?text=车厘子', 89.90,  1,  89.90),
  (2, 2, 8,  '混合坚果 500g',    'https://via.placeholder.com/400x400/FF9800/fff?text=坚果',   49.90,  1,  49.90),
  (3, 3, 6,  '澳洲牛腱肉 500g',  'https://via.placeholder.com/400x400/795548/fff?text=牛腱肉', 68.00,  1,  68.00),
  (4, 4, 7,  '土鸡蛋 30枚',      'https://via.placeholder.com/400x400/FFC107/fff?text=土鸡蛋', 38.00,  1,  38.00),
  (5, 5, 11, '会员专享礼盒',     'https://via.placeholder.com/400x400/9C27B0/fff?text=礼盒',  199.00,  1, 199.00),
  (6, 6, 4,  '草莓 500g',        'https://via.placeholder.com/400x400/E91E63/fff?text=草莓',   39.90,  1,  39.90),
  (7, 6, 9,  '金龙鱼大米 5kg',   'https://via.placeholder.com/400x400/FFEB3B/333?text=大米',   39.90,  1,  39.90),
  (8, 6, 10, '海天老抽 500ml',   'https://via.placeholder.com/400x400/4E342E/fff?text=老抽',   12.90,  1,  12.90);

-- ============================================
-- 分润记录（已完成订单的每日释放）
-- ============================================
INSERT IGNORE INTO profit_records (user_id, order_id, type, day_index, amount, released_at) VALUES
  -- 订单1 王小明购买，个人分润归 u3 李分销
  (3, 1, 'personal', 1, 0.7493, DATE_SUB(CURDATE(), INTERVAL 4 DAY)),
  (3, 1, 'personal', 2, 0.7493, DATE_SUB(CURDATE(), INTERVAL 3 DAY)),
  (3, 1, 'personal', 3, 0.7493, DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
  (3, 1, 'personal', 4, 0.7493, DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
  (3, 1, 'personal', 5, 0.7493, CURDATE()),
  -- 订单1 团队分润归 u2 张推广
  (2, 1, 'team', 1, 0.3746, DATE_SUB(CURDATE(), INTERVAL 4 DAY)),
  (2, 1, 'team', 2, 0.3746, DATE_SUB(CURDATE(), INTERVAL 3 DAY)),
  (2, 1, 'team', 3, 0.3746, DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
  (2, 1, 'team', 4, 0.3746, DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
  (2, 1, 'team', 5, 0.3746, CURDATE()),
  -- 订单2 王小明购买，分润归 u3
  (3, 2, 'personal', 1, 0.4160, DATE_SUB(CURDATE(), INTERVAL 3 DAY)),
  (3, 2, 'personal', 2, 0.4160, DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
  (3, 2, 'personal', 3, 0.4160, DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
  (3, 2, 'personal', 4, 0.4160, CURDATE()),
  -- 订单6 李分销自购，分润归 u2
  (2, 6, 'personal', 1, 1.0660, DATE_SUB(CURDATE(), INTERVAL 8 DAY)),
  (2, 6, 'personal', 2, 1.0660, DATE_SUB(CURDATE(), INTERVAL 7 DAY)),
  (2, 6, 'personal', 3, 1.0660, DATE_SUB(CURDATE(), INTERVAL 6 DAY)),
  (2, 6, 'personal', 4, 1.0660, DATE_SUB(CURDATE(), INTERVAL 5 DAY)),
  (2, 6, 'personal', 5, 1.0660, DATE_SUB(CURDATE(), INTERVAL 4 DAY));

-- ============================================
-- 推广奖励流水
-- ============================================
INSERT IGNORE INTO promotion_rewards (user_id, from_user_id, order_id, type, amount) VALUES
  (2, 3, NULL, 'referral',   5.0000),
  (2, 6, NULL, 'referral',   5.0000),
  (3, 4, NULL, 'referral',   5.0000),
  (3, 5, NULL, 'referral',   5.0000),
  (3, 4, 1,    'commission', 1.1240),
  (3, 4, 2,    'commission', 0.6240),
  (2, 3, 6,    'commission', 0.7993);

-- ============================================
-- 钱包流水
-- ============================================
INSERT IGNORE INTO wallet_transactions (user_id, type, amount, name, ref_type, ref_id, balance_after) VALUES
  (2, 'income',  5.00,   '邀请注册奖励 - 李分销',   'reward',     1,    5.00),
  (2, 'income',  5.00,   '邀请注册奖励 - 陈小丽',   'reward',     2,   10.00),
  (2, 'income',  0.3746, '分润到账 - 订单1 第1天',  'order',      1,   10.37),
  (2, 'income',  0.3746, '分润到账 - 订单1 第2天',  'order',      1,   10.75),
  (2, 'income',  0.3746, '分润到账 - 订单1 第3天',  'order',      1,   11.12),
  (2, 'income',  0.7993, '佣金收入 - 订单6',        'reward',     7,   11.92),
  (2, 'expense', 200.00, '申请提现',                'withdrawal', 1, 1280.50),
  (3, 'income',  5.00,   '邀请注册奖励 - 王小明',   'reward',     3,    5.00),
  (3, 'income',  5.00,   '邀请注册奖励 - 赵小红',   'reward',     4,   10.00),
  (3, 'income',  0.7493, '分润到账 - 订单1 第1天',  'order',      1,   10.75),
  (3, 'income',  1.1240, '佣金收入 - 订单1',        'reward',     5,   11.87),
  (4, 'income',  45.00,  '分润到账',                'order',      1,   45.00),
  (5, 'income',  120.30, '分润到账',                'order',      3,  120.30),
  (6, 'income',  5.00,   '首单奖励',                'reward',     NULL, 5.00);

-- ============================================
-- 购物车
-- ============================================
INSERT IGNORE INTO cart_items (user_id, product_id, quantity, spec, selected) VALUES
  (4, 4,  2, NULL, 1),
  (4, 5,  1, NULL, 1),
  (4, 12, 1, NULL, 0),
  (5, 6,  1, NULL, 1),
  (5, 8,  2, NULL, 1);

-- ============================================
-- 收藏
-- ============================================
INSERT IGNORE INTO favorites (user_id, product_id) VALUES
  (4, 3), (4, 6), (4, 8), (4, 11),
  (5, 3), (5, 4), (5, 7),
  (6, 8), (6, 9);

-- ============================================
-- 闪购活动（当日有效）
-- ============================================
INSERT IGNORE INTO flash_sales (id, product_id, flash_price, stock_limit, start_at, end_at, sort, status) VALUES
  (1,  3, 69.90, 100, DATE_FORMAT(NOW(), '%Y-%m-%d 00:00:00'), DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 DAY), '%Y-%m-%d 23:59:59'), 1, 1),
  (2,  4, 29.90, 200, DATE_FORMAT(NOW(), '%Y-%m-%d 00:00:00'), DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 DAY), '%Y-%m-%d 23:59:59'), 2, 1),
  (3,  8, 39.90, 150, DATE_FORMAT(NOW(), '%Y-%m-%d 00:00:00'), DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 DAY), '%Y-%m-%d 23:59:59'), 3, 1),
  (4,  6, 55.00,  50, DATE_FORMAT(NOW(), '%Y-%m-%d 00:00:00'), DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 DAY), '%Y-%m-%d 23:59:59'), 4, 1);

-- ============================================
-- 评价（已完成订单 1、2、6）
-- ============================================
INSERT IGNORE INTO reviews (user_id, product_id, order_id, rating, content, images, is_anonymous, has_followup, followup_content, followup_at) VALUES
  (4, 3, 1, 5, '车厘子非常新鲜，颗粒大、甜度高，快递也很快，下次还会购买！', '["https://via.placeholder.com/300x300/E53935/fff?text=好评图"]', 0, 1, '吃完再买了一单，品质稳定，推荐！', DATE_SUB(NOW(), INTERVAL 1 DAY)),
  (4, 8, 2, 4, '坚果很新鲜，量也足，就是包装有点破损，不影响食用。',          NULL,                                                            1, 0, NULL, NULL),
  (3, 4, 6, 5, '草莓超级甜，一点都不酸，比超市买的好吃多了！',               '["https://via.placeholder.com/300x300/E91E63/fff?text=草莓好评"]', 0, 0, NULL, NULL),
  (3, 9, 6, 4, '大米煮出来很香，就是快递慢了一天。',                          NULL,                                                            0, 0, NULL, NULL);

-- ============================================
-- 消息通知
-- ============================================
INSERT IGNORE INTO notifications (user_id, type, title, content, is_read, link_type, link_value) VALUES
  (4, 'order',  '订单已发货',     '您的订单 #20240323005001 正在配送中，请保持手机畅通。',            0, 'order', '5'),
  (4, 'order',  '订单完成',       '订单 #20240316002001 已确认收货，感谢您的购买！',                 1, 'order', '2'),
  (4, 'system', '新人专享优惠',   '欢迎加入！领取新人礼包，首单立减10元，限时48小时。',              1, NULL,    NULL),
  (2, 'profit', '今日分润到账',   '您今日共获得分润收益 ¥0.75，请在钱包查看详情。',                  0, NULL,    NULL),
  (2, 'order',  '下级成员新订单', '您的下级成员 王小明 刚刚完成了一笔购买，您将获得相应佣金。',      0, NULL,    NULL),
  (3, 'profit', '邀请奖励到账',   '恭喜！您邀请的好友 赵小红 已成功注册，奖励 ¥5.00 已到账。',      1, NULL,    NULL),
  (5, 'order',  '您的订单已发货', '订单 #20240320003001 已由商家发出，预计2-3天送达。',              0, 'order', '3'),
  (5, 'system', '会员权益提醒',   '开通会员可享受专属折扣和更高分润比例，立即了解。',                0, NULL,    NULL);

-- ============================================
-- 提现申请
-- ============================================
INSERT IGNORE INTO withdrawals (id, user_id, amount, method, bank_card_id, bank_name, bank_account, real_name, status, applied_at, processed_at) VALUES
  (1, 2, 200.00, 'bank', 1, '招商银行',     '6225880188888881', '张推广', 'approved', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
  (2, 3,  50.00, 'bank', 3, '中国建设银行', '6227003882888883', '李分销', 'pending',  DATE_SUB(NOW(), INTERVAL 1 DAY), NULL);
-- ============================================
-- 补充测试种子数据 v2
-- 新增：订单、订单明细、分润记录、评价、通知、钱包流水
-- ============================================

-- ============================================
-- 新增订单（orders 7-11，覆盖更多场景）
-- ============================================
INSERT IGNORE INTO orders (id, order_no, user_id, total_amount, freight_amount, discount_amount, pay_amount, profit_pool, status, pay_type, address_id, address_snapshot, remark, paid_at, shipped_at, completed_at) VALUES
  -- u5 赵小红，蓝莓，已完成
  (7,  '20240325007001', 5,  45.00, 0, 0,  45.00,  9.90, 'done',      'alipay', 5, '{"name":"赵小红","phone":"13800000005","address":"北京市朝阳区望京SOHO T3-1501"}',   NULL,         '2024-03-25 09:00:00', '2024-03-26 10:00:00', '2024-03-28 16:00:00'),
  -- u6 陈小丽，菠菜+大米，已完成
  (8,  '20240312008001', 6,  52.80, 0, 0,  52.80, 10.02, 'done',      'wechat', 6, '{"name":"陈小丽","phone":"13800000006","address":"江苏省南京市鼓楼区汉中路1号新街口广场"}', NULL,      '2024-03-12 11:00:00', '2024-03-13 08:00:00', '2024-03-15 14:00:00'),
  -- u4 王小明，草莓，已取消
  (9,  '20240329009001', 4,  39.90, 0, 0,  39.90,  7.98, 'cancelled', NULL,     4, '{"name":"王小明","phone":"13800000004","address":"上海市浦东新区张江高科技园区88号"}',  NULL,         NULL,                  NULL,                  NULL),
  -- u5 赵小红，会员礼盒，已付款待发货
  (10, '20240330010001', 5, 199.00, 0, 0, 199.00, 69.65, 'paid',      'alipay', 5, '{"name":"赵小红","phone":"13800000005","address":"北京市朝阳区望京SOHO T3-1501"}',   NULL,         '2024-03-30 15:00:00', NULL,                  NULL),
  -- u3 李分销自购，车厘子+坚果，已发货
  (11, '20240328011001', 3, 139.80, 0, 0, 139.80, 33.06, 'shipped',   'wechat', 3, '{"name":"李分销","phone":"13800000003","address":"浙江省杭州市西湖区文三路互联网小镇A座"}', NULL,   '2024-03-28 10:00:00', '2024-03-29 09:00:00', NULL);

-- ============================================
-- 新增订单明细
-- ============================================
INSERT IGNORE INTO order_items (id, order_id, product_id, product_name, product_image, price, quantity, subtotal) VALUES
  (9,  7,  12, '新品尝鲜装 蓝莓',    'https://via.placeholder.com/400x400/3F51B5/fff?text=蓝莓',  45.00,  1,  45.00),
  (10, 8,  5,  '有机菠菜 500g',      'https://via.placeholder.com/400x400/388E3C/fff?text=菠菜',  12.90,  1,  12.90),
  (11, 8,  9,  '金龙鱼大米 5kg',     'https://via.placeholder.com/400x400/FFEB3B/333?text=大米',  39.90,  1,  39.90),
  (12, 9,  4,  '草莓 500g',          'https://via.placeholder.com/400x400/E91E63/fff?text=草莓',  39.90,  1,  39.90),
  (13, 10, 11, '会员专享礼盒',       'https://via.placeholder.com/400x400/9C27B0/fff?text=礼盒', 199.00,  1, 199.00),
  (14, 11, 3,  '智利车厘子 2斤装',   'https://via.placeholder.com/400x400/E53935/fff?text=车厘子', 89.90, 1,  89.90),
  (15, 11, 8,  '混合坚果 500g',      'https://via.placeholder.com/400x400/FF9800/fff?text=坚果',  49.90,  1,  49.90);

-- ============================================
-- 新增分润记录（订单7、8 已完成，释放中）
-- ============================================
INSERT IGNORE INTO profit_records (user_id, order_id, type, day_index, amount, released_at) VALUES
  -- 订单7 赵小红购买，个人分润归 u3 李分销（parent_id=3）
  (3, 7, 'personal', 1, 0.3300, DATE_SUB(CURDATE(), INTERVAL 3 DAY)),
  (3, 7, 'personal', 2, 0.3300, DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
  (3, 7, 'personal', 3, 0.3300, DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
  (3, 7, 'personal', 4, 0.3300, CURDATE()),
  -- 订单7 团队分润归 u2 张推广
  (2, 7, 'team',     1, 0.1650, DATE_SUB(CURDATE(), INTERVAL 3 DAY)),
  (2, 7, 'team',     2, 0.1650, DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
  (2, 7, 'team',     3, 0.1650, DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
  (2, 7, 'team',     4, 0.1650, CURDATE()),
  -- 订单8 陈小丽购买，个人分润归 u2 张推广（parent_id=2）
  (2, 8, 'personal', 1, 0.3340, DATE_SUB(CURDATE(), INTERVAL 12 DAY)),
  (2, 8, 'personal', 2, 0.3340, DATE_SUB(CURDATE(), INTERVAL 11 DAY)),
  (2, 8, 'personal', 3, 0.3340, DATE_SUB(CURDATE(), INTERVAL 10 DAY)),
  (2, 8, 'personal', 4, 0.3340, DATE_SUB(CURDATE(), INTERVAL 9 DAY)),
  (2, 8, 'personal', 5, 0.3340, DATE_SUB(CURDATE(), INTERVAL 8 DAY)),
  (2, 8, 'personal', 6, 0.3340, DATE_SUB(CURDATE(), INTERVAL 7 DAY)),
  (2, 8, 'personal', 7, 0.3340, DATE_SUB(CURDATE(), INTERVAL 6 DAY)),
  (2, 8, 'personal', 8, 0.3340, DATE_SUB(CURDATE(), INTERVAL 5 DAY)),
  (2, 8, 'personal', 9, 0.3340, DATE_SUB(CURDATE(), INTERVAL 4 DAY)),
  (2, 8, 'personal',10, 0.3340, DATE_SUB(CURDATE(), INTERVAL 3 DAY)),
  (2, 8, 'personal',11, 0.3340, DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
  (2, 8, 'personal',12, 0.3340, DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
  (2, 8, 'personal',13, 0.3340, CURDATE());

-- ============================================
-- 新增推广奖励流水
-- ============================================
INSERT IGNORE INTO promotion_rewards (user_id, from_user_id, order_id, type, amount) VALUES
  (3, 5, 7, 'commission', 0.4950),  -- u3 从订单7 u5 购买获佣金
  (2, 3, 7, 'commission', 0.2475),  -- u2 从订单7 团队佣金
  (2, 6, 8, 'commission', 0.5010);  -- u2 从订单8 u6 购买获佣金

-- ============================================
-- 新增评价（含多种评分分布，用于测试 reviews/stats）
-- ============================================
INSERT IGNORE INTO reviews (user_id, product_id, order_id, rating, content, images, is_anonymous, has_followup, followup_content, followup_at) VALUES
  -- u5 评价订单7（蓝莓）
  (5, 12, 7, 5, '云南蓝莓！超级好吃，颗粒饱满，甜度高，发货速度也很快，强烈推荐！',
   '["https://via.placeholder.com/300x300/3F51B5/fff?text=蓝莓图1","https://via.placeholder.com/300x300/5C6BC0/fff?text=蓝莓图2"]',
   0, 1, '又下单了第二箱，品质一如既往，好评！', DATE_SUB(NOW(), INTERVAL 2 DAY)),
  -- u6 评价订单8（菠菜）
  (6, 5, 8, 4, '有机菠菜叶子很嫩，确实没有农药味，炒出来很香，就是量稍微少了点。',
   NULL, 0, 0, NULL, NULL),
  -- u6 评价订单8（大米）
  (6, 9, 8, 3, '大米一般，没有明显的香味，跟平时超市买的差不多，性价比不算高。',
   NULL, 1, 0, NULL, NULL),
  -- u4 评价，低评分（2星，用于测试差评场景）
  (4, 5, NULL, 2, '商品质量比较一般，叶子有些发黄，和描述不太一致，希望商家改进。',
   '["https://via.placeholder.com/300x300/388E3C/333?text=差评图"]',
   1, 0, NULL, NULL);

-- ============================================
-- 新增钱包流水（补充 u3、u5、u6 的收益记录）
-- ============================================
INSERT IGNORE INTO wallet_transactions (user_id, type, amount, name, ref_type, ref_id, balance_after) VALUES
  -- u3 李分销：订单7 分润
  (3, 'income',  0.3300, '分润到账 - 订单7 第1天',  'order', 7,  12.20),
  (3, 'income',  0.3300, '分润到账 - 订单7 第2天',  'order', 7,  12.55),
  (3, 'income',  0.3300, '分润到账 - 订单7 第3天',  'order', 7,  12.88),
  (3, 'income',  0.4950, '佣金收入 - 订单7',        'reward', 8, 13.38),
  -- u2 张推广：订单7 团队 + 订单8 个人
  (2, 'income',  0.1650, '分润到账 - 订单7 团队第1天', 'order', 7, 1280.67),
  (2, 'income',  0.3340, '分润到账 - 订单8 第1天',  'order', 8,  1281.00),
  (2, 'income',  0.5010, '佣金收入 - 订单8',        'reward', 9, 1281.50),
  -- u5 赵小红：首单分润（订单7自己买）
  (5, 'income',  9.90,   '订单分润池 - 订单7',       'order', 7,  130.20),
  -- u6 陈小丽：订单8 完成奖励
  (6, 'income', 10.02,   '订单分润池 - 订单8',       'order', 8,   15.02);

-- ============================================
-- 新增消息通知（补充更多场景）
-- ============================================
INSERT IGNORE INTO notifications (user_id, type, title, content, is_read, link_type, link_value) VALUES
  -- u4 王小明：订单取消
  (4, 'order',  '订单已取消',       '您的订单 #20240329009001 已成功取消，如有疑问请联系客服。',       1, 'order',  '9'),
  -- u5 赵小红：订单完成 + 评价提醒
  (5, 'order',  '订单已完成',       '订单 #20240325007001 已确认收货，记得给我们留下评价哦！',          0, 'order',  '7'),
  (5, 'profit', '分润收益到账',     '订单 #20240325007001 今日分润 ¥0.33 已到账，累计收益持续增加。',   0, NULL,     NULL),
  (5, 'system', '限时闪购来袭',     '今日限时闪购，草莓、车厘子等热门商品低至7折，速来抢购！',           0, NULL,     NULL),
  -- u6 陈小丽：分润到账
  (6, 'order',  '订单已完成',       '订单 #20240312008001 已确认收货，感谢您的购买！',                  1, 'order',  '8'),
  (6, 'profit', '分润收益到账',     '您的分润收益 ¥10.02 已到账，查看钱包了解详情。',                    0, NULL,     NULL),
  -- u3 李分销：下级订单提醒
  (3, 'order',  '下级成员新订单',   '您的下级成员 赵小红 刚刚完成了一笔购买，您将获得相应分润收益。',    0, NULL,     NULL),
  (3, 'profit', '今日分润汇总',     '今日共获得分润收益 ¥0.99，累计已获 ¥13.38，继续加油！',            0, NULL,     NULL),
  -- u2 张推广：系统公告
  (2, 'system', '推广活动升级',     '平台推广奖励计划升级，邀请新用户奖励提升至 ¥8.00，快来邀请好友！',  0, NULL,     NULL),
  (2, 'profit', '团队收益汇总',     '本周团队总分润 ¥5.23，比上周增长 12%，再接再厉！',                 1, NULL,     NULL);
-- ============================================
-- 补充测试种子数据 v3 — 补全所有空表
-- 密码统一 test123，bcrypt hash 同上
-- ============================================

-- ============================================
-- sys_admin：补充多名管理员
-- ============================================
INSERT IGNORE INTO sys_admin (id, username, password, real_name, email, phone, dept_id, status, last_login_at, last_login_ip, created_by) VALUES
  (2, 'ops_leader',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', '王芳',    'wangfang@mall.com',  '13900001001', 3, 1, DATE_SUB(NOW(), INTERVAL 1  HOUR),  '192.168.5.11', 1),
  (3, 'sales_zhang', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', '张伟',    'zhangwei@mall.com',  '13900001002', 4, 1, DATE_SUB(NOW(), INTERVAL 2  HOUR),  '192.168.5.12', 1),
  (4, 'finance_liu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', '刘洋',    'liuyang@mall.com',   '13900001003', 5, 1, DATE_SUB(NOW(), INTERVAL 12 HOUR),  '192.168.5.13', 1),
  (5, 'ops_chen',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', '陈晓',    'chenxiao@mall.com',  '13900001004', 6, 1, DATE_SUB(NOW(), INTERVAL 3  HOUR),  '192.168.5.14', 1),
  (6, 'tech_li',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y', '李明',    'liming@mall.com',    '13900001005', 2, 0, DATE_SUB(NOW(), INTERVAL 7  DAY),   '192.168.5.15', 1);
  -- tech_li status=0，用于测试禁用账号

-- ============================================
-- sys_admin_role：绑定角色
-- ============================================
INSERT IGNORE INTO sys_admin_role (admin_id, role_id) VALUES
  (2, 5),  -- 王芳  -> 运营组长
  (3, 4),  -- 张伟  -> 销售
  (4, 7),  -- 刘洋  -> 财务
  (5, 6),  -- 陈晓  -> 运营
  (6, 2);  -- 李明  -> 管理员（已禁用）

-- ============================================
-- sys_role_dept：角色数据权限绑定部门（data_scope=5 自定义时生效）
-- ============================================
INSERT IGNORE INTO sys_role_dept (role_id, dept_id) VALUES
  (3, 4),  -- 销售组长可查销售部数据
  (3, 6),  -- 销售组长可查电商运营组数据
  (5, 3),  -- 运营组长可查运营部数据
  (5, 6),  -- 运营组长可查电商运营组数据
  (7, 5);  -- 财务只查财务部数据

-- ============================================
-- sys_login_log：登录日志（成功 + 失败场景）
-- ============================================
INSERT IGNORE INTO sys_login_log (admin_id, username, ip, user_agent, status, message, created_at) VALUES
  -- 成功登录
  (1, 'admin',       '192.168.5.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/123',   1, NULL,          DATE_SUB(NOW(), INTERVAL 10 MINUTE)),
  (2, 'ops_leader',  '192.168.5.11', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',            1, NULL,          DATE_SUB(NOW(), INTERVAL 1  HOUR)),
  (3, 'sales_zhang', '192.168.5.12', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/123',   1, NULL,          DATE_SUB(NOW(), INTERVAL 2  HOUR)),
  (4, 'finance_liu', '192.168.5.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/123.0',                       1, NULL,          DATE_SUB(NOW(), INTERVAL 12 HOUR)),
  (5, 'ops_chen',    '192.168.5.14', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',1, NULL,          DATE_SUB(NOW(), INTERVAL 3  HOUR)),
  -- 失败登录
  (NULL, 'admin',    '203.0.113.88', 'curl/7.88.1',                                                                0, '密码错误',    DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
  (NULL, 'admin',    '203.0.113.88', 'curl/7.88.1',                                                                0, '密码错误',    DATE_SUB(NOW(), INTERVAL 29 MINUTE)),
  (NULL, 'admin',    '203.0.113.88', 'curl/7.88.1',                                                                0, '账号已被锁定', DATE_SUB(NOW(), INTERVAL 28 MINUTE)),
  (6,    'tech_li',  '192.168.5.15', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/123',   0, '账号已禁用',  DATE_SUB(NOW(), INTERVAL 7  DAY)),
  -- 历史登录
  (1, 'admin',       '192.168.5.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/123',   1, NULL,          DATE_SUB(NOW(), INTERVAL 1  DAY)),
  (1, 'admin',       '192.168.5.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/123',   1, NULL,          DATE_SUB(NOW(), INTERVAL 2  DAY)),
  (2, 'ops_leader',  '192.168.5.11', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',            1, NULL,          DATE_SUB(NOW(), INTERVAL 1  DAY));

-- ============================================
-- sys_operation_log：操作日志（模拟后台各类操作）
-- ============================================
INSERT IGNORE INTO sys_operation_log (admin_id, admin_name, module, action, method, url, request_body, response_code, ip, duration_ms, status, created_at) VALUES
  -- 商品管理
  (1, '超级管理员', '商品管理', 'CREATE', 'POST', '/api/admin/products',
   '{"name":"智利车厘子 2斤装","price":89.90,"stock":500}',
   200, '192.168.5.10', 128, 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),
  (1, '超级管理员', '商品管理', 'UPDATE', 'PUT', '/api/admin/products/3',
   '{"stock":450,"status":"on"}',
   200, '192.168.5.10', 85, 1, DATE_SUB(NOW(), INTERVAL 4 DAY)),
  (5, '陈晓', '商品管理', 'UPDATE', 'PUT', '/api/admin/products/4',
   '{"price":39.90,"original_price":59.00}',
   200, '192.168.5.14', 72, 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
  -- 订单管理
  (1, '超级管理员', '订单管理', 'UPDATE', 'PUT', '/api/admin/orders/3/ship',
   '{"tracking_no":"SF1234567890","company":"顺丰速运"}',
   200, '192.168.5.10', 95, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
  (2, '王芳', '订单管理', 'UPDATE', 'PUT', '/api/admin/orders/4/ship',
   '{"tracking_no":"YT9876543210","company":"圆通快递"}',
   200, '192.168.5.11', 88, 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),
  -- 用户管理
  (1, '超级管理员', '用户管理', 'UPDATE', 'PUT', '/api/admin/users/6',
   '{"status":1,"remark":"用户申诉通过"}',
   200, '192.168.5.10', 65, 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
  -- 提现审核
  (4, '刘洋', '提现管理', 'UPDATE', 'PUT', '/api/admin/withdrawals/1/approve',
   '{"remark":"审核通过"}',
   200, '192.168.5.13', 112, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
  (4, '刘洋', '提现管理', 'UPDATE', 'PUT', '/api/admin/withdrawals/2/reject',
   '{"remark":"银行卡信息不符"}',
   200, '192.168.5.13', 98, 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),
  -- 分类管理
  (2, '王芳', '分类管理', 'CREATE', 'POST', '/api/admin/categories',
   '{"name":"进口水果","parent_id":11,"sort":1}',
   200, '192.168.5.11', 78, 1, DATE_SUB(NOW(), INTERVAL 6 DAY)),
  -- Banner 管理
  (5, '陈晓', '轮播图管理', 'UPDATE', 'PUT', '/api/admin/banners/1',
   '{"status":1,"sort":1}',
   200, '192.168.5.14', 55, 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),
  -- 失败操作（权限不足）
  (3, '张伟', '系统管理', 'UPDATE', 'PUT', '/api/admin/system/roles/1',
   '{"name":"超级管理员"}',
   403, '192.168.5.12', 12, 0, DATE_SUB(NOW(), INTERVAL 4 DAY)),
  -- 数据导出
  (4, '刘洋', '财务报表', 'EXPORT', 'GET', '/api/admin/finance/export',
   NULL, 200, '192.168.5.13', 2340, 1, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- ============================================
-- sms_codes：短信验证码（已使用、已过期、有效）
-- ============================================
INSERT IGNORE INTO sms_codes (phone, code, scene, used, expired_at, created_at) VALUES
  -- 已使用（注册）
  ('13800000004', '183742', 'register',  1, DATE_SUB(NOW(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 30 DAY)),
  ('13800000005', '926415', 'register',  1, DATE_SUB(NOW(), INTERVAL 25 DAY), DATE_SUB(NOW(), INTERVAL 25 DAY)),
  ('13800000006', '734891', 'register',  1, DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 20 DAY)),
  -- 已使用（重置密码）
  ('13800000002', '561024', 'reset_pwd', 1, DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY)),
  ('13800000003', '398271', 'reset_pwd', 1, DATE_SUB(NOW(), INTERVAL 5  DAY), DATE_SUB(NOW(), INTERVAL 5  DAY)),
  -- 已过期未使用（模拟发了但没填）
  ('13900009901', '204867', 'register',  0, DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_SUB(NOW(), INTERVAL 3 HOUR)),
  ('13900009902', '771430', 'register',  0, DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 2 HOUR)),
  -- 当前有效（用于测试验证码校验接口）
  ('13900009903', '123456', 'register',  0, DATE_ADD(NOW(), INTERVAL 4 MINUTE), NOW()),
  ('13900009904', '654321', 'reset_pwd', 0, DATE_ADD(NOW(), INTERVAL 3 MINUTE), NOW());
