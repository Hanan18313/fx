import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Form,
  Select,
  DatePicker,
  Button,
  Tag,
  Row,
  Col,
  Statistic,
  Spin,
  Space,
  InputNumber,
  Switch,
  Divider,
  message,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  TeamOutlined,
  GiftOutlined,
  DollarOutlined,
  RiseOutlined,
  CalendarOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import {
  getPromotionOverviewApi,
  getPromotionRewardsApi,
  getPromotionConfigApi,
  updatePromotionConfigApi,
} from '../../api/promotion';

interface OverviewData {
  total_invites: number;
  total_referral_amount: number;
  total_commission_amount: number;
  today_invites: number;
  today_referral_amount: number;
  today_commission_amount: number;
}

interface RewardRecord {
  id: number;
  user_name: string;
  from_user_name: string;
  type: 'referral' | 'commission';
  amount: string;
  order_id: number | null;
  created_at: string;
}

interface PromotionConfig {
  referral_reward_amount: string;
  commission_rate: string;
  referral_reward_enabled: string;
  commission_enabled: string;
}

const typeMap: Record<string, { label: string; color: string }> = {
  referral: { label: '邀请奖励', color: 'blue' },
  commission: { label: '订单佣金', color: 'green' },
};

const PromotionPage: React.FC = () => {
  const [searchForm] = Form.useForm();
  const [configForm] = Form.useForm();

  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overview, setOverview] = useState<OverviewData>({
    total_invites: 0,
    total_referral_amount: 0,
    total_commission_amount: 0,
    today_invites: 0,
    today_referral_amount: 0,
    today_commission_amount: 0,
  });

  const [rewardsLoading, setRewardsLoading] = useState(false);
  const [rewards, setRewards] = useState<RewardRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [configLoading, setConfigLoading] = useState(false);
  const [configSubmitLoading, setConfigSubmitLoading] = useState(false);

  const fetchOverview = async () => {
    setOverviewLoading(true);
    try {
      const res: any = await getPromotionOverviewApi();
      setOverview(res.data ?? res);
    } finally {
      setOverviewLoading(false);
    }
  };

  const fetchRewards = async (p = page, ps = pageSize) => {
    setRewardsLoading(true);
    try {
      const values = searchForm.getFieldsValue();
      const params: any = { page: p, limit: ps };
      if (values.type) params.type = values.type;
      if (values.dateRange && values.dateRange.length === 2) {
        params.start_date = values.dateRange[0].format('YYYY-MM-DD');
        params.end_date = values.dateRange[1].format('YYYY-MM-DD');
      }
      const res: any = await getPromotionRewardsApi(params);
      const d = res.data ?? res;
      setRewards(d.data ?? d.list ?? d.items ?? d.rows ?? []);
      setTotal(d.total ?? 0);
    } finally {
      setRewardsLoading(false);
    }
  };

  const fetchConfig = async () => {
    setConfigLoading(true);
    try {
      const res: any = await getPromotionConfigApi();
      const cfg: PromotionConfig = res.data ?? res;
      configForm.setFieldsValue({
        referral_reward_amount: Number(cfg.referral_reward_amount),
        commission_rate: Number(cfg.commission_rate),
        referral_reward_enabled: cfg.referral_reward_enabled === 'true',
        commission_enabled: cfg.commission_enabled === 'true',
      });
    } finally {
      setConfigLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
    fetchRewards();
    fetchConfig();
  }, []);

  const handleSearch = () => {
    setPage(1);
    fetchRewards(1, pageSize);
  };

  const handleReset = () => {
    searchForm.resetFields();
    setPage(1);
    fetchRewards(1, pageSize);
  };

  const handleConfigSubmit = async () => {
    try {
      const values = await configForm.validateFields();
      setConfigSubmitLoading(true);
      await updatePromotionConfigApi(values);
      message.success('推广配置已更新');
      fetchConfig();
    } finally {
      setConfigSubmitLoading(false);
    }
  };

  const columns: ColumnsType<RewardRecord> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
    { title: '推荐人', dataIndex: 'user_name', key: 'user_name', width: 120 },
    { title: '被推荐人', dataIndex: 'from_user_name', key: 'from_user_name', width: 120 },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (v: string) => {
        const t = typeMap[v] ?? { label: v, color: 'default' };
        return <Tag color={t.color}>{t.label}</Tag>;
      },
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (v: string) => `¥${Number(v).toFixed(2)}`,
    },
    {
      title: '关联订单',
      dataIndex: 'order_id',
      key: 'order_id',
      width: 100,
      render: (v: number | null) => (v ? `#${v}` : '-'),
    },
    {
      title: '时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (v: string) => (v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
  ];

  const statCards = [
    {
      title: '总邀请人数',
      value: overview.total_invites,
      icon: <TeamOutlined />,
      color: '#1677ff',
    },
    {
      title: '累计邀请奖励',
      value: overview.total_referral_amount,
      icon: <GiftOutlined />,
      color: '#52c41a',
      prefix: '¥',
      precision: 2,
    },
    {
      title: '累计佣金收益',
      value: overview.total_commission_amount,
      icon: <DollarOutlined />,
      color: '#722ed1',
      prefix: '¥',
      precision: 2,
    },
    {
      title: '今日邀请',
      value: overview.today_invites,
      icon: <UserAddOutlined />,
      color: '#fa8c16',
    },
    {
      title: '今日邀请奖励',
      value: overview.today_referral_amount,
      icon: <CalendarOutlined />,
      color: '#13c2c2',
      prefix: '¥',
      precision: 2,
    },
    {
      title: '今日佣金收益',
      value: overview.today_commission_amount,
      icon: <RiseOutlined />,
      color: '#f5222d',
      prefix: '¥',
      precision: 2,
    },
  ];

  return (
    <>
      {/* 数据概览 */}
      <Spin spinning={overviewLoading}>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          {statCards.map((item) => (
            <Col xs={24} sm={12} md={8} key={item.title}>
              <Card className="stat-card" hoverable>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
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
                    value={item.value}
                    prefix={item.prefix}
                    precision={item.precision ?? 0}
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Spin>

      {/* 奖励流水 */}
      <Card className="page-search-card" style={{ marginBottom: 16 }}>
        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
          <Form.Item name="type" label="奖励类型">
            <Select placeholder="全部" allowClear style={{ width: 130 }}>
              <Select.Option value="referral">邀请奖励</Select.Option>
              <Select.Option value="commission">订单佣金</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateRange" label="日期范围">
            <DatePicker.RangePicker />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button onClick={handleReset} icon={<ReloadOutlined />}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card className="page-table-card" title="奖励流水" style={{ marginBottom: 16 }}>
        <Table<RewardRecord>
          rowKey="id"
          size="middle"
          loading={rewardsLoading}
          columns={columns}
          dataSource={rewards}
          scroll={{ x: 900 }}
          pagination={{
            current: page,
            pageSize,
            total,
            showTotal: (t) => `共 ${t} 条`,
            showSizeChanger: true,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
              fetchRewards(p, ps);
            },
            style: { justifyContent: 'flex-end' },
          }}
        />
      </Card>

      {/* 推广配置 */}
      <Card title="推广配置" loading={configLoading}>
        <Form
          form={configForm}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="referral_reward_enabled"
            label="邀请奖励"
            valuePropName="checked"
          >
            <Switch checkedChildren="开启" unCheckedChildren="关闭" />
          </Form.Item>
          <Form.Item
            name="referral_reward_amount"
            label="邀请奖励金额"
            rules={[
              { required: true, message: '请输入邀请奖励金额' },
              { type: 'number', min: 0, message: '金额不能为负数' },
            ]}
          >
            <InputNumber
              addonBefore="¥"
              addonAfter="元/人"
              min={0}
              precision={2}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Divider />
          <Form.Item
            name="commission_enabled"
            label="佣金分成"
            valuePropName="checked"
          >
            <Switch checkedChildren="开启" unCheckedChildren="关闭" />
          </Form.Item>
          <Form.Item
            name="commission_rate"
            label="佣金比例"
            rules={[
              { required: true, message: '请输入佣金比例' },
              { type: 'number', min: 0, max: 1, message: '比例范围 0 ~ 1' },
            ]}
          >
            <InputNumber
              min={0}
              max={1}
              step={0.01}
              precision={2}
              style={{ width: '100%' }}
              addonAfter="(0~1)"
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
            <Button
              type="primary"
              loading={configSubmitLoading}
              onClick={handleConfigSubmit}
            >
              保存配置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default PromotionPage;
