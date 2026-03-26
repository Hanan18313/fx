import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Tag,
  Modal,
  Popconfirm,
  message,
  Space,
} from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  getNotificationListApi,
  createNotificationApi,
  deleteNotificationApi,
} from '../../api/notification';

interface Notification {
  id: number;
  userPhone?: string;
  type: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

const typeOptions = [
  { label: '系统', value: 'system' },
  { label: '订单', value: 'order' },
  { label: '收益', value: 'profit' },
];

const typeColorMap: Record<string, string> = {
  system: 'blue',
  order: 'orange',
  profit: 'green',
};

const NotificationPage: React.FC = () => {
  const [searchForm] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Notification[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchList = async (p = page, ps = pageSize) => {
    setLoading(true);
    try {
      const values = searchForm.getFieldsValue();
      const res: any = await getNotificationListApi({ ...values, page: p, pageSize: ps });
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

  const openCreateModal = () => {
    modalForm.resetFields();
    setModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await modalForm.validateFields();
      setSubmitting(true);
      await createNotificationApi(values);
      message.success('发送成功');
      setModalOpen(false);
      fetchList();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteNotificationApi(id);
    message.success('删除成功');
    fetchList();
  };

  const columns: ColumnsType<Notification> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
    { title: '用户手机', dataIndex: 'userPhone', key: 'userPhone', width: 130 },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 90,
      render: (v: string) => {
        const opt = typeOptions.find((o) => o.value === v);
        return <Tag color={typeColorMap[v] ?? 'default'}>{opt?.label ?? v}</Tag>;
      },
    },
    { title: '标题', dataIndex: 'title', key: 'title', width: 180 },
    { title: '内容', dataIndex: 'content', key: 'content', width: 240, ellipsis: true },
    {
      title: '已读',
      dataIndex: 'isRead',
      key: 'isRead',
      width: 70,
      render: (v: boolean) => (v ? <Tag color="green">已读</Tag> : <Tag color="default">未读</Tag>),
    },
    { title: '时间', dataIndex: 'createdAt', key: 'createdAt', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: unknown, record: Notification) => (
        <Popconfirm title="确定删除此通知？" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" size="small" danger>
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Card className="page-search-card" style={{ marginBottom: 16 }}>
        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
          <Form.Item name="type" label="类型">
            <Select placeholder="请选择" allowClear style={{ width: 120 }} options={typeOptions} />
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

      <Card
        className="page-table-card"
        title="通知管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            发送通知
          </Button>
        }
      >
        <Table<Notification>
          rowKey="id"
          size="middle"
          loading={loading}
          columns={columns}
          dataSource={list}
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

      <Modal
        title="发送通知"
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        confirmLoading={submitting}
        width={500}
        forceRender
        afterClose={() => modalForm.resetFields()}
      >
        <Form form={modalForm} layout="vertical">
          <Form.Item
            name="userId"
            label="目标用户ID"
            tooltip="输入 0 表示发送给全部用户"
            initialValue={0}
          >
            <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="0 = 全部用户" />
          </Form.Item>
          <Form.Item name="type" label="类型" rules={[{ required: true, message: '请选择类型' }]}>
            <Select placeholder="请选择类型" options={typeOptions} />
          </Form.Item>
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="请输入通知标题" />
          </Form.Item>
          <Form.Item name="content" label="内容" rules={[{ required: true, message: '请输入内容' }]}>
            <Input.TextArea rows={4} placeholder="请输入通知内容" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default NotificationPage;
