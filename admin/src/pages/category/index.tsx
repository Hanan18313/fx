import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Form,
  Input,
  InputNumber,
  TreeSelect,
  Button,
  Modal,
  Popconfirm,
  Divider,
  Tag,
  message,
  Space,
} from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  getCategoryListApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from '../../api/category';

interface Category {
  id: number;
  name: string;
  icon?: string;
  sort: number;
  status?: number;
  parentId?: number | null;
  children?: Category[];
}

const buildTreeSelectData = (list: Category[], excludeId?: number): any[] =>
  list
    .filter((c) => c.id !== excludeId)
    .map((c) => ({
      title: c.name,
      value: c.id,
      children: c.children ? buildTreeSelectData(c.children, excludeId) : [],
    }));

const CategoryPage: React.FC = () => {
  const [modalForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res: any = await getCategoryListApi();
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

  const openEditModal = (record: Category) => {
    setEditingId(record.id);
    modalForm.setFieldsValue({
      name: record.name,
      icon: record.icon,
      parentId: record.parentId ?? null,
      sort: record.sort,
    });
    setModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await modalForm.validateFields();
      setSubmitting(true);
      if (editingId) {
        await updateCategoryApi(editingId, values);
        message.success('更新成功');
      } else {
        await createCategoryApi(values);
        message.success('创建成功');
      }
      setModalOpen(false);
      fetchList();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (record: Category) => {
    if (record.children && record.children.length > 0) {
      message.warning('该分类下有子分类，无法删除');
      return;
    }
    await deleteCategoryApi(record.id);
    message.success('删除成功');
    fetchList();
  };

  const columns: ColumnsType<Category> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
    { title: '名称', dataIndex: 'name', key: 'name', width: 160 },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: 80,
      render: (v: string) => v || '-',
    },
    { title: '排序', dataIndex: 'sort', key: 'sort', width: 80 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (v: number) =>
        v === 0 ? <Tag color="red">禁用</Tag> : <Tag color="green">正常</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      render: (_: unknown, record: Category) => (
        <>
          <Button type="link" size="small" onClick={() => openEditModal(record)}>
            编辑
          </Button>
          <Divider type="vertical" />
          <Popconfirm title="确定删除此分类？" onConfirm={() => handleDelete(record)}>
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
        title="分类管理"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchList}>
              刷新
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
              新增分类
            </Button>
          </Space>
        }
      >
        <Table<Category>
          rowKey="id"
          size="middle"
          loading={loading}
          columns={columns}
          dataSource={list}
          pagination={false}
          expandable={{ defaultExpandAllRows: true }}
        />
      </Card>

      <Modal
        title={editingId ? '编辑分类' : '新增分类'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        confirmLoading={submitting}
        width={500}
        forceRender
        afterClose={() => modalForm.resetFields()}
      >
        <Form form={modalForm} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入分类名称' }]}>
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          <Form.Item name="icon" label="图标">
            <Input placeholder="请输入图标（如 emoji）" />
          </Form.Item>
          <Form.Item name="parentId" label="上级分类">
            <TreeSelect
              placeholder="无（顶级分类）"
              allowClear
              treeDefaultExpandAll
              treeData={buildTreeSelectData(list, editingId ?? undefined)}
            />
          </Form.Item>
          <Form.Item name="sort" label="排序" initialValue={0}>
            <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="数字越小越靠前" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CategoryPage;
