import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Tag,
  Modal,
  InputNumber,
  Divider,
  Popconfirm,
  message,
  Space,
} from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  getProductListApi,
  createProductApi,
  updateProductApi,
  toggleProductStatusApi,
} from '../../api/product';

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  profitRate: number;
  stock: number;
  category: string;
  status: string;
  createdAt: string;
}

const ProductPage: React.FC = () => {
  const [searchForm] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Product[]>([]);
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
      const res: any = await getProductListApi({ ...values, page: p, pageSize: ps });
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
    setEditingId(null);
    modalForm.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (record: Product) => {
    setEditingId(record.id);
    modalForm.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await modalForm.validateFields();
      setSubmitting(true);
      if (editingId) {
        await updateProductApi(editingId, values);
        message.success('更新成功');
      } else {
        await createProductApi(values);
        message.success('创建成功');
      }
      setModalOpen(false);
      fetchList();
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: number) => {
    await toggleProductStatusApi(id);
    message.success('状态已更新');
    fetchList();
  };

  const columns: ColumnsType<Product> = [
    { title: '商品名称', dataIndex: 'name', key: 'name', width: 160 },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (v: number) => `¥${Number(v).toFixed(2)}`,
    },
    {
      title: '分润比例',
      dataIndex: 'profitRate',
      key: 'profitRate',
      width: 100,
      render: (v: number) => `${(Number(v) * 100).toFixed(1)}%`,
    },
    { title: '库存', dataIndex: 'stock', key: 'stock', width: 80 },
    { title: '分类', dataIndex: 'category', key: 'category', width: 100 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (v: string) =>
        v === 'on' ? <Tag color="green">上架</Tag> : <Tag color="red">下架</Tag>,
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_: unknown, record: Product) => (
        <>
          <Button type="link" size="small" onClick={() => openEditModal(record)}>
            编辑
          </Button>
          <Divider type="vertical" />
          <Popconfirm
            title={`确定${record.status === 'on' ? '下架' : '上架'}此商品？`}
            onConfirm={() => handleToggleStatus(record.id)}
          >
            <Button type="link" size="small" danger={record.status === 'on'}>
              {record.status === 'on' ? '下架' : '上架'}
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Card className="page-search-card" style={{ marginBottom: 16 }}>
        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
          <Form.Item name="name" label="商品名称">
            <Input placeholder="请输入商品名称" allowClear />
          </Form.Item>
          <Form.Item name="category" label="分类">
            <Input placeholder="请输入分类" allowClear />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择" allowClear style={{ width: 120 }}>
              <Select.Option value="on">上架</Select.Option>
              <Select.Option value="off">下架</Select.Option>
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

      <Card
        className="page-table-card"
        title="商品列表"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            新增商品
          </Button>
        }
      >
        <Table<Product>
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
        title={editingId ? '编辑商品' : '新增商品'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        confirmLoading={submitting}
        width={600}
        forceRender
        afterClose={() => modalForm.resetFields()}
      >
        <Form form={modalForm} layout="vertical">
          <Form.Item name="name" label="商品名称" rules={[{ required: true, message: '请输入商品名称' }]}>
            <Input placeholder="请输入商品名称" />
          </Form.Item>
          <Form.Item name="description" label="商品描述">
            <Input.TextArea rows={3} placeholder="请输入商品描述" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="price" label="价格" rules={[{ required: true, message: '请输入价格' }]}>
                <InputNumber min={0} precision={2} prefix="¥" style={{ width: '100%' }} placeholder="请输入价格" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="profitRate"
                label="分润比例"
                rules={[{ required: true, message: '请输入分润比例' }]}
              >
                <InputNumber min={0} max={1} step={0.01} precision={2} style={{ width: '100%' }} placeholder="0-1" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="stock" label="库存" rules={[{ required: true, message: '请输入库存' }]}>
                <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="请输入库存" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="category" label="分类">
                <Input placeholder="请输入分类" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="status" label="状态" initialValue="on">
            <Select>
              <Select.Option value="on">上架</Select.Option>
              <Select.Option value="off">下架</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProductPage;
