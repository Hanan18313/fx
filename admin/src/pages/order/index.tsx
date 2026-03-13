import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Form,
  Select,
  InputNumber,
  DatePicker,
  Button,
  Tag,
  Divider,
  Popconfirm,
  message,
  Space,
} from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { getOrderListApi, updateOrderStatusApi } from '../../api/order';

interface Order {
  id: number;
  userId: number;
  userPhone: string;
  userNickname: string;
  totalAmount: number;
  profitPool: number;
  status: string;
  paidAt: string | null;
  createdAt: string;
}

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: '待付款', color: 'orange' },
  paid: { label: '已付款', color: 'blue' },
  shipped: { label: '已发货', color: 'cyan' },
  done: { label: '已完成', color: 'green' },
  cancelled: { label: '已取消', color: 'red' },
};

const OrderPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchList = async (p = page, ps = pageSize) => {
    setLoading(true);
    try {
      const values = searchForm.getFieldsValue();
      const params: any = { page: p, pageSize: ps };
      if (values.status) params.status = values.status;
      if (values.userId) params.userId = values.userId;
      if (values.dateRange && values.dateRange.length === 2) {
        params.startDate = values.dateRange[0].format('YYYY-MM-DD');
        params.endDate = values.dateRange[1].format('YYYY-MM-DD');
      }
      const res: any = await getOrderListApi(params);
      const d = res.data ?? res;
      setList(d.list ?? d.items ?? d.rows ?? []);
      setTotal(d.total ?? 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleSearch = () => {
    setPage(1);
    fetchList(1, pageSize);
  };

  const handleReset = () => {
    searchForm.resetFields();
    setPage(1);
    fetchList(1, pageSize);
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    await updateOrderStatusApi(id, { status });
    message.success('状态已更新');
    fetchList();
  };

  const getNextStatus = (current: string): { label: string; value: string } | null => {
    const map: Record<string, { label: string; value: string }> = {
      paid: { label: '发货', value: 'shipped' },
      shipped: { label: '完成', value: 'done' },
    };
    return map[current] ?? null;
  };

  const columns: ColumnsType<Order> = [
    { title: '订单ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '用户手机', dataIndex: 'userPhone', key: 'userPhone', width: 120 },
    { title: '用户昵称', dataIndex: 'userNickname', key: 'userNickname', width: 100 },
    {
      title: '总金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 100,
      render: (v: number) => `¥${Number(v).toFixed(2)}`,
    },
    {
      title: '利润池',
      dataIndex: 'profitPool',
      key: 'profitPool',
      width: 100,
      render: (v: number) => `¥${Number(v).toFixed(2)}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (v: string) => {
        const s = statusMap[v] ?? { label: v, color: 'default' };
        return <Tag color={s.color}>{s.label}</Tag>;
      },
    },
    { title: '支付时间', dataIndex: 'paidAt', key: 'paidAt', width: 170 },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: unknown, record: Order) => {
        const next = getNextStatus(record.status);
        return (
          <>
            <Button type="link" size="small" onClick={() => navigate(`/orders/${record.id}`)}>
              详情
            </Button>
            {next && (
              <>
                <Divider type="vertical" />
                <Popconfirm
                  title={`确定将订单状态更新为"${next.label}"？`}
                  onConfirm={() => handleUpdateStatus(record.id, next.value)}
                >
                  <Button type="link" size="small">
                    {next.label}
                  </Button>
                </Popconfirm>
              </>
            )}
            {record.status === 'paid' && (
              <>
                <Divider type="vertical" />
                <Popconfirm
                  title="确定取消此订单？"
                  onConfirm={() => handleUpdateStatus(record.id, 'cancelled')}
                >
                  <Button type="link" size="small" danger>
                    取消
                  </Button>
                </Popconfirm>
              </>
            )}
          </>
        );
      },
    },
  ];

  return (
    <>
      <Card className="page-search-card" style={{ marginBottom: 16 }}>
        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择" allowClear style={{ width: 130 }}>
              <Select.Option value="pending">待付款</Select.Option>
              <Select.Option value="paid">已付款</Select.Option>
              <Select.Option value="shipped">已发货</Select.Option>
              <Select.Option value="done">已完成</Select.Option>
              <Select.Option value="cancelled">已取消</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="userId" label="用户ID">
            <InputNumber placeholder="请输入用户ID" style={{ width: 140 }} min={1} />
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

      <Card className="page-table-card" title="订单列表">
        <Table<Order>
          rowKey="id"
          size="middle"
          loading={loading}
          columns={columns}
          dataSource={list}
          scroll={{ x: 1100 }}
          pagination={{
            current: page,
            pageSize,
            total,
            showTotal: (t) => `共 ${t} 条`,
            showSizeChanger: true,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
              fetchList(p, ps);
            },
            style: { justifyContent: 'flex-end' },
          }}
        />
      </Card>
    </>
  );
};

export default OrderPage;
