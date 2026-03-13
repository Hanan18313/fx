import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Spin } from 'antd';
import {
  UserOutlined,
  UserAddOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  DollarOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { getDashboardApi } from '../../api/dashboard';

interface DashboardData {
  totalUsers: number;
  todayNewUsers: number;
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  pendingWithdrawals: number;
}

const statItems = [
  { key: 'totalUsers', title: '总用户数', icon: <UserOutlined />, color: '#1677ff' },
  { key: 'todayNewUsers', title: '今日新增用户', icon: <UserAddOutlined />, color: '#52c41a' },
  { key: 'totalOrders', title: '总订单数', icon: <ShoppingCartOutlined />, color: '#fa8c16' },
  { key: 'todayOrders', title: '今日订单', icon: <ShoppingOutlined />, color: '#f5222d' },
  { key: 'totalRevenue', title: '总收入', icon: <DollarOutlined />, color: '#722ed1', prefix: '¥' },
  { key: 'pendingWithdrawals', title: '待处理提现', icon: <WalletOutlined />, color: '#13c2c2' },
] as const;

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DashboardData>({
    totalUsers: 0,
    todayNewUsers: 0,
    totalOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
    pendingWithdrawals: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await getDashboardApi();
      setData(res.data ?? res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Spin spinning={loading}>
      <Row gutter={[16, 16]}>
        {statItems.map((item) => (
          <Col xs={24} sm={12} md={8} key={item.key}>
            <Card className="stat-card" hoverable>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  className="stat-icon"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    backgroundColor: item.color + '1a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    color: item.color,
                    marginRight: 16,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <Statistic
                  title={item.title}
                  value={data[item.key]}
                  prefix={(item as any).prefix}
                  precision={(item as any).prefix ? 2 : 0}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Spin>
  );
};

export default DashboardPage;
