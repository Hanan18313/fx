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
  id          BIGINT      NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  phone       VARCHAR(20) NOT NULL COMMENT '手机号',
  password    VARCHAR(255) NOT NULL COMMENT '加密密码',
  nickname    VARCHAR(50)  DEFAULT NULL COMMENT '昵称',
  avatar      VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
  role        ENUM('user','distributor','agent','admin') NOT NULL DEFAULT 'user' COMMENT '用户角色',
  invite_code VARCHAR(10)  NOT NULL COMMENT '我的邀请码',
  parent_id   BIGINT       DEFAULT NULL COMMENT '上级用户ID（通过邀请码绑定）',
  status      TINYINT      NOT NULL DEFAULT 1 COMMENT '状态 1正常 0禁用',
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_phone (phone),
  UNIQUE KEY uk_invite_code (invite_code),
  KEY idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- ============================================
-- 2. 商品表
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id          BIGINT          NOT NULL AUTO_INCREMENT COMMENT '商品ID',
  name        VARCHAR(200)    NOT NULL COMMENT '商品名称',
  description TEXT            DEFAULT NULL COMMENT '商品描述',
  price       DECIMAL(10,2)   NOT NULL COMMENT '售价（元）',
  profit_rate DECIMAL(5,4)    NOT NULL DEFAULT 0.2500 COMMENT '分润比例（如0.25=25%）',
  stock       INT             NOT NULL DEFAULT 0 COMMENT '库存数量',
  images      JSON            DEFAULT NULL COMMENT '商品图片URL列表',
  category    VARCHAR(50)     DEFAULT NULL COMMENT '分类',
  status      ENUM('on','off') NOT NULL DEFAULT 'on' COMMENT '上架状态',
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_status (status),
  KEY idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

-- ============================================
-- 3. 订单表
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id           BIGINT        NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  user_id      BIGINT        NOT NULL COMMENT '购买用户ID',
  total_amount DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
  profit_pool  DECIMAL(10,2) NOT NULL COMMENT '分润池金额（进入分润系统的金额）',
  status       ENUM('pending','paid','shipped','done','cancelled') NOT NULL DEFAULT 'pending' COMMENT '订单状态',
  pay_type     VARCHAR(20)   DEFAULT NULL COMMENT '支付方式 wechat/alipay',
  pay_trade_no VARCHAR(100)  DEFAULT NULL COMMENT '第三方支付流水号',
  remark       VARCHAR(500)  DEFAULT NULL COMMENT '备注',
  paid_at      TIMESTAMP     DEFAULT NULL COMMENT '支付时间',
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_user_id (user_id),
  KEY idx_status (status),
  KEY idx_paid_at (paid_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- ============================================
-- 4. 订单商品明细表
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id          BIGINT        NOT NULL AUTO_INCREMENT,
  order_id    BIGINT        NOT NULL COMMENT '订单ID',
  product_id  BIGINT        NOT NULL COMMENT '商品ID',
  product_name VARCHAR(200) NOT NULL COMMENT '下单时商品名称快照',
  price       DECIMAL(10,2) NOT NULL COMMENT '下单时单价快照',
  quantity    INT           NOT NULL DEFAULT 1 COMMENT '购买数量',
  subtotal    DECIMAL(10,2) NOT NULL COMMENT '小计金额',
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
  id           BIGINT        NOT NULL AUTO_INCREMENT COMMENT '申请ID',
  user_id      BIGINT        NOT NULL COMMENT '申请用户',
  amount       DECIMAL(10,2) NOT NULL COMMENT '提现金额',
  bank_name    VARCHAR(50)   DEFAULT NULL COMMENT '收款银行',
  bank_account VARCHAR(50)   DEFAULT NULL COMMENT '收款账号',
  real_name    VARCHAR(50)   DEFAULT NULL COMMENT '收款人姓名',
  status       ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending' COMMENT '审核状态',
  reject_reason VARCHAR(200) DEFAULT NULL COMMENT '驳回原因',
  applied_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '申请时间',
  processed_at TIMESTAMP     DEFAULT NULL COMMENT '审核时间',
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
