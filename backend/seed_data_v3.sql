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
