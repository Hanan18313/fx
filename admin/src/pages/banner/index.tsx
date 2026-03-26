import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Image,
  Modal,
  Popconfirm,
  Divider,
  message,
  Space,
} from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  getBannerListApi,
  createBannerApi,
  updateBannerApi,
  deleteBannerApi,
} from '../../api/banner';

interface Banner {
  id: number;
  imageUrl: string;
  title?: string;
  linkType?: string;
  linkValue?: string;
  sort: number;
}

const linkTypeOptions = [
  { label: '商品', value: 'product' },
  { label: '分类', value: 'category' },
  { label: '链接', value: 'url' },
  { label: '无', value: '' },
];

const BannerPage: React.FC = () => {
  const [modalForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Banner[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res: any = await getBannerListApi();
      const d = res.data ?? res;
      setList(Array.isArray(d) ? d : d.list ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    modalForm.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (record: Banner) => {
    setEditingId(record.id);
    modalForm.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await modalForm.validateFields();
      setSubmitting(true);
      if (editingId) {
        await updateBannerApi(editingId, values);
        message.success('更新成功');
      } else {
        await createBannerApi(values);
        message.success('创建成功');
      }
      setModalOpen(false);
      fetchList();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteBannerApi(id);
    message.success('删除成功');
    fetchList();
  };

  const columns: ColumnsType<Banner> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
    {
      title: '图片',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 120,
      render: (v: string) => (
        <Image src={v} width={80} height={40} style={{ objectFit: 'cover', borderRadius: 4 }} fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F/PQAJpAN4kMq8swAAAABJRU5ErkJggg==" />
      ),
    },
    { title: '标题', dataIndex: 'title', key: 'title', width: 160 },
    {
      title: '链接类型',
      dataIndex: 'linkType',
      key: 'linkType',
      width: 100,
      render: (v: string) => linkTypeOptions.find((o) => o.value === v)?.label ?? v ?? '-',
    },
    { title: '链接值', dataIndex: 'linkValue', key: 'linkValue', width: 160, ellipsis: true },
    { title: '排序', dataIndex: 'sort', key: 'sort', width: 80 },
    {
      title: '操作',
      key: 'action',
      width: 140,
      render: (_: unknown, record: Banner) => (
        <>
          <Button type="link" size="small" onClick={() => openEditModal(record)}>
            编辑
          </Button>
          <Divider type="vertical" />
          <Popconfirm title="确定删除此Banner？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Card
        className="page-table-card"
        title="Banner管理"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchList}>
              刷新
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
              新增Banner
            </Button>
          </Space>
        }
      >
        <Table<Banner>
          rowKey="id"
          size="middle"
          loading={loading}
          columns={columns}
          dataSource={list}
          pagination={false}
        />
      </Card>

      <Modal
        title={editingId ? '编辑Banner' : '新增Banner'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        confirmLoading={submitting}
        width={500}
        forceRender
        afterClose={() => modalForm.resetFields()}
      >
        <Form form={modalForm} layout="vertical">
          <Form.Item name="imageUrl" label="图片URL" rules={[{ required: true, message: '请输入图片URL' }]}>
            <Input placeholder="请输入图片URL" />
          </Form.Item>
          <Form.Item name="title" label="标题">
            <Input placeholder="请输入标题" />
          </Form.Item>
          <Form.Item name="linkType" label="链接类型">
            <Select placeholder="请选择链接类型" allowClear options={linkTypeOptions} />
          </Form.Item>
          <Form.Item name="linkValue" label="链接值">
            <Input placeholder="请输入链接值" />
          </Form.Item>
          <Form.Item name="sort" label="排序" initialValue={0}>
            <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="数字越小越靠前" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default BannerPage;
