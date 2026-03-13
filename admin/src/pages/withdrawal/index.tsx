import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Form,
  Select,
  InputNumber,
  Button,
  Tag,
  Modal,
  Input,
  Popconfirm,
  Divider,
  message,
  Space,
} from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  getWithdrawalListApi,
  approveWithdrawalApi,
  rejectWithdrawalApi,
} from '../../api/withdrawal';

interface Withdrawal {
  id: number;
  userId: number;
  userPhone: string;
  amount: number;
  bankName: string;
  bankAccount: string;
  realName: string;
  status: string;
  rejectReason?: string;
  appliedAt: string;
  processedAt: string | null;
}

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: '待审核', color: 'orange' },
  approved: { label: '已通过', color: 'green' },
  rejected: { label: '已驳回', color: 'red' },
};

const WithdrawalPage: React.FC = () => {
  const [searchForm] = Form.useForm();
  const [rejectForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Withdrawal[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchList = async (p = page, ps = pageSize) => {
    setLoading(true);
    try {
      const values = searchForm.getFieldsValue();
      const res: any = await getWithdrawalListApi({ ...values, page: p, pageSize: ps });
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

  const handleApprove = async (id: number) => {
    await approveWithdrawalApi(id);
    message.success('已通过');
    fetchList();
  };

  const openRejectModal = (id: number) => {
    setRejectingId(id);
    rejectForm.resetFields();
    setRejectModalOpen(true);
  };

  const handleReject = async () => {
    if (!rejectingId) return;
    try {
      const values = await rejectForm.validateFields();
      setSubmitting(true);
      await rejectWithdrawalApi(rejectingId, { rejectReason: values.rejectReason });
      message.success('已驳回');
      setRejectModalOpen(false);
      fetchList();
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnsType<Withdrawal> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
    { title: '用户ID', dataIndex: 'userId', key: 'userId', width: 80 },
    { title: '用户手机', dataIndex: 'userPhone', key: 'userPhone', width: 130 },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (v: number) => `¥${Number(v).toFixed(2)}`,
    },
    { title: '银行名称', dataIndex: 'bankName', key: 'bankName', width: 110 },
    { title: '银行账号', dataIndex: 'bankAccount', key: 'bankAccount', width: 160 },
    { title: '真实姓名', dataIndex: 'realName', key: 'realName', width: 100 },
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
    { title: '申请时间', dataIndex: 'appliedAt', key: 'appliedAt', width: 170 },
    { title: '处理时间', dataIndex: 'processedAt', key: 'processedAt', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (_: unknown, record: Withdrawal) => {
        if (record.status !== 'pending') {
          return <span style={{ color: '#999' }}>已处理</span>;
        }
        return (
          <>
            <Popconfirm title="确定通过该提现申请？" onConfirm={() => handleApprove(record.id)}>
              <Button type="link" size="small" style={{ color: '#52c41a' }}>
                通过
              </Button>
            </Popconfirm>
            <Divider type="vertical" />
            <Button
              type="link"
              size="small"
              danger
              onClick={() => openRejectModal(record.id)}
            >
              驳回
            </Button>
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
              <Select.Option value="pending">待审核</Select.Option>
              <Select.Option value="approved">已通过</Select.Option>
              <Select.Option value="rejected">已驳回</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="userId" label="用户ID">
            <InputNumber placeholder="请输入用户ID" style={{ width: 140 }} min={1} />
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

      <Card className="page-table-card" title="提现管理">
        <Table<Withdrawal>
          rowKey="id"
          size="middle"
          loading={loading}
          columns={columns}
          dataSource={list}
          scroll={{ x: 1400 }}
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
        title="驳回提现申请"
        open={rejectModalOpen}
        onOk={handleReject}
        onCancel={() => setRejectModalOpen(false)}
        confirmLoading={submitting}
        width={600}
        forceRender
        afterClose={() => rejectForm.resetFields()}
      >
        <Form form={rejectForm} layout="vertical">
          <Form.Item
            name="rejectReason"
            label="驳回原因"
            rules={[{ required: true, message: '请输入驳回原因' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入驳回原因" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default WithdrawalPage;
