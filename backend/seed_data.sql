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
