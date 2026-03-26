import React, { useEffect, useState } from 'react';
import {
  Card,
  Descriptions,
  Table,
  Tag,
  Button,
  Spin,
  Popconfirm,
  message,
  Space,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { getOrderDetailApi, updateOrderStatusApi } from '../../api/order';

interface OrderItem {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface OrderDetail {
  id: number;
  orderNo?: string;
  userId: number;
  userPhone: string;
  userNickname: string;
  totalAmount: number;
  freightAmount?: number;
  discountAmount?: number;
  payAmount?: number;
  profitPool: number;
  status: string;
  addressSnapshot?: {
    name: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    detail: string;
  };
  remark?: string;
  paidAt: string | null;
  shippedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  items: OrderItem[];
}

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: '待付款', color: 'orange' },
  paid: { label: '已付款', color: 'blue' },
  shipped: { label: '已发货', color: 'cyan' },
  done: { label: '已完成', color: 'green' },
  cancelled: { label: '已取消', color: 'red' },
};

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<OrderDetail | null>(null);

  const fetchDetail = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res: any = await getOrderDetailApi(Number(id));
      setDetail(res.data ?? res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleUpdateStatus = async (status: string) => {
    if (!id) return;
    await updateOrderStatusApi(Number(id), { status });
    message.success('状态已更新');
    fetchDetail();
  };

  const itemColumns: ColumnsType<OrderItem> = [
    { title: '商品名称', dataIndex: 'productName', key: 'productName' },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      render: (v: number) => `¥${Number(v).toFixed(2)}`,
    },
    { title: '数量', dataIndex: 'quantity', key: 'quantity' },
    {
      title: '小计',
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (v: number) => `¥${Number(v).toFixed(2)}`,
    },
  ];

  const s = detail ? statusMap[detail.status] ?? { label: detail.status, color: 'default' } : null;

  return (
    <Spin spinning={loading}>
      <Card
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate(-1)} />
            <span>订单详情</span>
          </Space>
        }
        extra={
          detail && (
            <Space>
              {detail.status === 'paid' && (
                <>
                  <Popconfirm title="确定发货？" onConfirm={() => handleUpdateStatus('shipped')}>
                    <Button type="primary">发货</Button>
                  </Popconfirm>
                  <Popconfirm title="确定取消此订单？" onConfirm={() => handleUpdateStatus('cancelled')}>
                    <Button danger>取消订单</Button>
                  </Popconfirm>
                </>
              )}
              {detail.status === 'shipped' && (
                <Popconfirm title="确定完成订单？" onConfirm={() => handleUpdateStatus('done')}>
                  <Button type="primary">完成订单</Button>
                </Popconfirm>
              )}
            </Space>
          )
        }
        style={{ marginBottom: 16 }}
      >
        {detail && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="订单编号">{detail.orderNo ?? detail.id}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={s!.color}>{s!.label}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="用户手机">{detail.userPhone}</Descriptions.Item>
            <Descriptions.Item label="用户昵称">{detail.userNickname}</Descriptions.Item>
            <Descriptions.Item label="收货人">
              {detail.addressSnapshot?.name ?? '-'}
            </Descriptions.Item>
            <Descriptions.Item label="联系电话">
              {detail.addressSnapshot?.phone ?? '-'}
            </Descriptions.Item>
            <Descriptions.Item label="收货地址" span={2}>
              {detail.addressSnapshot
                ? `${detail.addressSnapshot.province}${detail.addressSnapshot.city}${detail.addressSnapshot.district}${detail.addressSnapshot.detail}`
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="总金额">¥{Number(detail.totalAmount).toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="运费">
              {detail.freightAmount != null ? `¥${Number(detail.freightAmount).toFixed(2)}` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="实付金额">
              {detail.payAmount != null ? `¥${Number(detail.payAmount).toFixed(2)}` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="利润池">¥{Number(detail.profitPool).toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{detail.createdAt}</Descriptions.Item>
            <Descriptions.Item label="支付时间">{detail.paidAt ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="发货时间">{detail.shippedAt ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="完成时间">{detail.completedAt ?? '-'}</Descriptions.Item>
          </Descriptions>
        )}
      </Card>

      <Card title="订单商品">
        <Table<OrderItem>
          rowKey="id"
          size="middle"
          columns={itemColumns}
          dataSource={detail?.items ?? []}
          pagination={false}
        />
      </Card>
    </Spin>
  );
};

export default OrderDetailPage;
