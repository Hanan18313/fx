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
