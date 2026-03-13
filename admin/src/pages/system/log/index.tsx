import React, { useState } from 'react';
import {
  Card,
  Table,
  Form,
  Input,
  Select,
  Button,
  Space,
  Tag,
  Tabs,
  DatePicker,
  Row,
  Col,
} from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getOperationLogsApi, getLoginLogsApi } from '../../../api/log';

const { RangePicker } = DatePicker;

interface OperationLog {
  id: number;
  adminName: string;
  module: string;
  action: string;
  method: string;
  url: string;
  ip: string;
  durationMs: number;
  status: number;
  createdAt: string;
}

interface LoginLog {
  id: number;
  username: string;
  ip: string;
  userAgent: string;
  status: number;
  message: string;
  createdAt: string;
}

const methodColorMap: Record<string, string> = {
  GET: 'green',
  POST: 'blue',
  PUT: 'orange',
  PATCH: 'cyan',
  DELETE: 'red',
};

/* ===== Operation Logs Tab ===== */
const OperationLogTab: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<OperationLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchList = async (p = page, ps = pageSize) => {
    setLoading(true);
    try {
      const values = form.getFieldsValue();
      const params: any = {
        page: p,
        pageSize: ps,
        module: values.module || undefined,
        action: values.action || undefined,
        adminName: values.adminName || undefined,
      };
      if (values.dateRange?.length === 2) {
        params.startDate = values.dateRange[0].format('YYYY-MM-DD');
        params.endDate = values.dateRange[1].format('YYYY-MM-DD');
      }
      const res: any = await getOperationLogsApi(params);
      setList(res.data?.list || res.list || []);
      setTotal(res.data?.total || res.total || 0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchList(1, pageSize);
  };

  const handleReset = () => {
    form.resetFields();
    setPage(1);
    fetchList(1, pageSize);
  };

  const handlePageChange = (p: number, ps: number) => {
    setPage(p);
    setPageSize(ps);
    fetchList(p, ps);
  };

  React.useEffect(() => {
    fetchList();
  }, []);

  const columns: ColumnsType<OperationLog> = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '操作人', dataIndex: 'adminName', width: 100 },
    { title: '模块', dataIndex: 'module', width: 100 },
    { title: '操作', dataIndex: 'action', width: 120 },
    {
      title: '请求方式',
      dataIndex: 'method',
      width: 90,
      render: (method: string) => (
        <Tag color={methodColorMap[method?.toUpperCase()] || 'default'}>{method}</Tag>
      ),
    },
    { title: '请求地址', dataIndex: 'url', width: 200, ellipsis: true },
    { title: 'IP', dataIndex: 'ip', width: 130 },
    { title: '耗时(ms)', dataIndex: 'durationMs', width: 90 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status: number) =>
        status === 1 ? <Tag color="green">成功</Tag> : <Tag color="red">失败</Tag>,
    },
    { title: '操作时间', dataIndex: 'createdAt', width: 170 },
  ];

  return (
    <>
      <Card className="page-search-card" style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline">
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            <Col>
              <Form.Item name="module" label="模块">
                <Input placeholder="请输入模块" allowClear />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="action" label="操作">
                <Input placeholder="请输入操作" allowClear />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="adminName" label="操作人">
                <Input placeholder="请输入操作人" allowClear />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="dateRange" label="日期范围">
                <RangePicker />
              </Form.Item>
            </Col>
            <Col>
              <Space>
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                  搜索
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card className="page-table-card" title="操作日志">
        <Table<OperationLog>
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
            onChange: handlePageChange,
            style: { justifyContent: 'flex-end' },
          }}
        />
      </Card>
    </>
  );
};

/* ===== Login Logs Tab ===== */
const LoginLogTab: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<LoginLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchList = async (p = page, ps = pageSize) => {
    setLoading(true);
    try {
      const values = form.getFieldsValue();
      const params: any = {
        page: p,
        pageSize: ps,
        username: values.username || undefined,
        status: values.status,
      };
      if (values.dateRange?.length === 2) {
        params.startDate = values.dateRange[0].format('YYYY-MM-DD');
        params.endDate = values.dateRange[1].format('YYYY-MM-DD');
      }
      const res: any = await getLoginLogsApi(params);
      setList(res.data?.list || res.list || []);
      setTotal(res.data?.total || res.total || 0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchList(1, pageSize);
  };

  const handleReset = () => {
    form.resetFields();
    setPage(1);
    fetchList(1, pageSize);
  };

  const handlePageChange = (p: number, ps: number) => {
    setPage(p);
    setPageSize(ps);
    fetchList(p, ps);
  };

  React.useEffect(() => {
    fetchList();
  }, []);

  const columns: ColumnsType<LoginLog> = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '用户名', dataIndex: 'username', width: 120 },
    { title: 'IP', dataIndex: 'ip', width: 130 },
    { title: 'User Agent', dataIndex: 'userAgent', width: 250, ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status: number) =>
        status === 1 ? <Tag color="green">成功</Tag> : <Tag color="red">失败</Tag>,
    },
    { title: '消息', dataIndex: 'message', width: 200, ellipsis: true },
    { title: '登录时间', dataIndex: 'createdAt', width: 170 },
  ];

  return (
    <>
      <Card className="page-search-card" style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline">
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            <Col>
              <Form.Item name="username" label="用户名">
                <Input placeholder="请输入用户名" allowClear />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择" allowClear style={{ width: 120 }}>
                  <Select.Option value={1}>成功</Select.Option>
                  <Select.Option value={0}>失败</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="dateRange" label="日期范围">
                <RangePicker />
              </Form.Item>
            </Col>
            <Col>
              <Space>
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                  搜索
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card className="page-table-card" title="登录日志">
        <Table<LoginLog>
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
            onChange: handlePageChange,
            style: { justifyContent: 'flex-end' },
          }}
        />
      </Card>
    </>
  );
};

/* ===== Main Log Page ===== */
const LogPage: React.FC = () => {
  const items = [
    { key: 'operation', label: '操作日志', children: <OperationLogTab /> },
    { key: 'login', label: '登录日志', children: <LoginLogTab /> },
  ];

  return <Tabs items={items} />;
};

export default LogPage;
