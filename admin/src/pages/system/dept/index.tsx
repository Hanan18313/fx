import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Form,
  Input,
  Button,
  Space,
  Tag,
  Modal,
  Switch,
  TreeSelect,
  Divider,
  InputNumber,
  Popconfirm,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  getDeptListApi,
  createDeptApi,
  updateDeptApi,
  deleteDeptApi,
} from "../../../api/dept";
import PermButton from "../../../components/PermButton";

interface DeptItem {
  id: number;
  parentId: number;
  name: string;
  leader: string;
  phone: string;
  sort: number;
  status: number;
  children?: DeptItem[];
  createdAt: string;
}

const buildDeptTreeSelect = (list: DeptItem[], includeRoot = true): any[] => {
  const nodes = list.map((item) => ({
    value: item.id,
    title: item.name,
    children: item.children ? buildDeptTreeSelect(item.children, false) : [],
  }));
  if (includeRoot) {
    return [{ value: 0, title: "顶级部门", children: nodes }];
  }
  return nodes;
};

const DeptPage: React.FC = () => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<DeptItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<DeptItem | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res: any = await getDeptListApi();
      setList(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const openCreate = () => {
    setIsEdit(false);
    setCurrentRecord(null);
    setModalOpen(true);
    setTimeout(() => form.resetFields());
  };

  const openEdit = (record: DeptItem) => {
    setIsEdit(true);
    setCurrentRecord(record);
    setModalOpen(true);
    setTimeout(() => {
      form.setFieldsValue({
        ...record,
        parentId: record.parentId || 0,
        status: record.status === 1,
      });
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitLoading(true);
      const payload = { ...values, status: values.status ? 1 : 0 };
      if (isEdit && currentRecord) {
        await updateDeptApi(currentRecord.id, payload);
        message.success("更新成功");
      } else {
        await createDeptApi(payload);
        message.success("创建成功");
      }
      setModalOpen(false);
      fetchList();
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteDeptApi(id);
    message.success("删除成功");
    fetchList();
  };

  const columns: ColumnsType<DeptItem> = [
    { title: "部门名称", dataIndex: "name", width: 200 },
    { title: "负责人", dataIndex: "leader", width: 120 },
    { title: "联系电话", dataIndex: "phone", width: 130 },
    { title: "排序", dataIndex: "sort", width: 70 },
    {
      title: "状态",
      dataIndex: "status",
      width: 80,
      render: (status: number) =>
        status === 1 ? (
          <Tag color="green">正常</Tag>
        ) : (
          <Tag color="red">禁用</Tag>
        ),
    },
    { title: "创建时间", dataIndex: "createdAt", width: 170 },
    {
      title: "操作",
      key: "action",
      width: 180,
      render: (_, record) => (
        <Space split={<Divider type="vertical" />}>
          <PermButton
            type="link"
            size="small"
            permission="system:dept:update"
            onClick={() => openEdit(record)}
          >
            编辑
          </PermButton>
          <Popconfirm
            title="确定要删除该部门吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <PermButton
              type="link"
              size="small"
              danger
              permission="system:dept:delete"
            >
              删除
            </PermButton>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        className="page-table-card"
        title="部门列表"
        extra={
          <PermButton
            type="primary"
            icon={<PlusOutlined />}
            permission="system:dept:create"
            onClick={openCreate}
          >
            新增部门
          </PermButton>
        }
      >
        <Table<DeptItem>
          rowKey="id"
          size="middle"
          loading={loading}
          columns={columns}
          dataSource={list}
          pagination={false}
          defaultExpandAllRows
        />
      </Card>

      <Modal
        title={isEdit ? "编辑部门" : "新增部门"}
        open={modalOpen}
        width={600}
        forceRender
        onOk={handleSubmit}
        confirmLoading={submitLoading}
        onCancel={() => setModalOpen(false)}
        afterClose={() => form.resetFields()}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ parentId: 0, sort: 0, status: true }}
        >
          <Form.Item label="上级部门" name="parentId">
            <TreeSelect
              placeholder="请选择上级部门"
              treeData={buildDeptTreeSelect(list)}
              treeDefaultExpandAll
            />
          </Form.Item>
          <Form.Item
            label="部门名称"
            name="name"
            rules={[{ required: true, message: "请输入部门名称" }]}
          >
            <Input placeholder="请输入部门名称" />
          </Form.Item>
          <Form.Item label="负责人" name="leader">
            <Input placeholder="请输入负责人" />
          </Form.Item>
          <Form.Item label="联系电话" name="phone">
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item label="排序" name="sort">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="状态" name="status" valuePropName="checked">
            <Switch checkedChildren="正常" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DeptPage;
