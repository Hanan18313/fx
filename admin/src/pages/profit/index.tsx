import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Spin } from 'antd';
import {
  DollarOutlined,
  RiseOutlined,
  UserOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getProfitStatsApi } from '../../api/profit';

interface TopEarner {
  userId: number;
  phone: string;
  nickname: string;
  totalEarned: number;
}

interface ProfitStats {
  totalProfit: number;
  todayProfit: number;
  personalProfit: number;
  teamProfit: number;
  topEarners: TopEarner[];
}

const statItems = [
  { key: 'totalProfit', title: '总利润', icon: <DollarOutlined />, color: '#1677ff' },
  { key: 'todayProfit', title: '今日利润', icon: <RiseOutlined />, color: '#52c41a' },
  { key: 'personalProfit', title: '个人分润', icon: <UserOutlined />, color: '#fa8c16' },
  { key: 'teamProfit', title: '团队分润', icon: <TeamOutlined />, color: '#722ed1' },
] as const;

const ProfitPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ProfitStats>({
    totalProfit: 0,
    todayProfit: 0,
    personalProfit: 0,
    teamProfit: 0,
    topEarners: [],
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await getProfitStatsApi();
      setData(res.data ?? res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: ColumnsType<TopEarner> = [
    { title: '用户ID', dataIndex: 'userId', key: 'userId', width: 80 },
    { title: '手机号', dataIndex: 'phone', key: 'phone', width: 130 },
    { title: '昵称', dataIndex: 'nickname', key: 'nickname', width: 120 },
    {
      title: '总收益',
      dataIndex: 'totalEarned',
      key: 'totalEarned',
      width: 120,
      render: (v: number) => `¥${Number(v).toFixed(2)}`,
    },
  ];

  return (
    <Spin spinning={loading}>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {statItems.map((item) => (
          <Col xs={24} sm={12} md={6} key={item.key}>
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
                  prefix="¥"
                  precision={2}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="page-table-card" title="收益排行榜">
        <Table<TopEarner>
          rowKey="userId"
          size="middle"
          columns={columns}
          dataSource={data.topEarners}
          pagination={false}
        />
      </Card>
    </Spin>
  );
};

export default ProfitPage;
