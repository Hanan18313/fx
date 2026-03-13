import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Form,
  Input,
  Select,
  Button,
  Tag,
  Modal,
  Switch,
  Divider,
  message,
  Space,
} from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getUserListApi, updateUserApi } from '../../api/user';

interface User {
  id: number;
  phone: string;
  nickname: string;
  role: string;
  inviteCode: string;
  status: number;
  createdAt: string;
}

const roleMap: Record<string, { label: string; color: string }> = {
  user: { label: '普通用户', color: 'default' },
  distributor: { label: '分销商', color: 'blue' },
  agent: { label: '代理商', color: 'purple' },
  admin: { label: '管理员', color: 'red' },
};

const UserPage: React.FC = () => {
  const [searchForm] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchList = async (p = page, ps = pageSize) => {
    setLoading(true);
    try {
      const values = searchForm.getFieldsValue();
      const res: any = await getUserListApi({ ...values, page: p, pageSize: ps });
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

  const openEditModal = (record: User) => {
    setEditingId(record.id);
    modalForm.setFieldsValue({
      status: record.status === 1,
      role: record.role,
    });
    setModalOpen(true);
  };

  const handleModalOk = async () => {
    if (!editingId) return;
    try {
      const values = await modalForm.validateFields();
      setSubmitting(true);
      await updateUserApi(editingId, {
        status: values.status ? 1 : 0,
        role: values.role,
      });
      message.success('更新成功');
      setModalOpen(false);
      fetchList();
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnsType<User> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
    { title: '手机号', dataIndex: 'phone', key: 'phone', width: 130 },
    { title: '昵称', dataIndex: 'nickname', key: 'nickname', width: 120 },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (v: string) => {
        const r = roleMap[v] ?? { label: v, color: 'default' };
        return <Tag color={r.color}>{r.label}</Tag>;
      },
    },
    { title: '邀请码', dataIndex: 'inviteCode', key: 'inviteCode', width: 110 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (v: number) =>
        v === 1 ? <Tag color="green">正常</Tag> : <Tag color="red">禁用</Tag>,
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 90,
      render: (_: unknown, record: User) => (
        <Button type="link" size="small" onClick={() => openEditModal(record)}>
          编辑
        </Button>
      ),
    },
  ];

  return (
    <>
      <Card className="page-search-card" style={{ marginBottom: 16 }}>
        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
          <Form.Item name="phone" label="手机号">
            <Input placeholder="请输入手机号" allowClear />
          </Form.Item>
          <Form.Item name="nickname" label="昵称">
            <Input placeholder="请输入昵称" allowClear />
          </Form.Item>
          <Form.Item name="role" label="角色">
            <Select placeholder="请选择" allowClear style={{ width: 120 }}>
              <Select.Option value="user">普通用户</Select.Option>
              <Select.Option value="distributor">分销商</Select.Option>
              <Select.Option value="agent">代理商</Select.Option>
              <Select.Option value="admin">管理员</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择" allowClear style={{ width: 100 }}>
              <Select.Option value={1}>正常</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
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

      <Card className="page-table-card" title="用户列表">
        <Table<User>
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
        title="编辑用户"
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        confirmLoading={submitting}
        width={600}
        forceRender
        afterClose={() => modalForm.resetFields()}
      >
        <Form form={modalForm} layout="vertical">
          <Form.Item name="status" label="状态" valuePropName="checked">
            <Switch checkedChildren="正常" unCheckedChildren="禁用" />
          </Form.Item>
          <Form.Item name="role" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
            <Select>
              <Select.Option value="user">普通用户</Select.Option>
              <Select.Option value="distributor">分销商</Select.Option>
              <Select.Option value="agent">代理商</Select.Option>
              <Select.Option value="admin">管理员</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserPage;
