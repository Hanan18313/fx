import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Form,
  Input,
  Select,
  Button,
  Space,
  Tag,
  Modal,
  Switch,
  TreeSelect,
  Divider,
  Radio,
  InputNumber,
  Popconfirm,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import * as Icons from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  getMenuListApi,
  createMenuApi,
  updateMenuApi,
  deleteMenuApi,
} from "../../../api/menu";
import PermButton from "../../../components/PermButton";

interface MenuItem {
  id: number;
  parentId: number;
  name: string;
  type: number;
  permission: string;
  path: string;
  component: string;
  icon: string;
  sort: number;
  visible: number;
  status: number;
  children?: MenuItem[];
  createdAt: string;
}

const typeMap: Record<number, { text: string; color: string }> = {
  1: { text: "目录", color: "blue" },
  2: { text: "菜单", color: "green" },
  3: { text: "按钮", color: "orange" },
};

const buildMenuTreeSelect = (list: MenuItem[], includeRoot = true): any[] => {
  const nodes = list.map((item) => ({
    value: item.id,
    title: item.name,
    children: item.children ? buildMenuTreeSelect(item.children, false) : [],
  }));
  if (includeRoot) {
    return [{ value: 0, title: "顶级菜单", children: nodes }];
  }
  return nodes;
};

const renderIcon = (iconName: string) => {
  if (!iconName) return "-";
  const IconComponent = (Icons as any)[iconName];
  return IconComponent ? <IconComponent /> : <span>{iconName}</span>;
};

const MenuPage: React.FC = () => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<MenuItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<MenuItem | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [menuType, setMenuType] = useState(1);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res: any = await getMenuListApi();
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
    setMenuType(1);
    setModalOpen(true);
    setTimeout(() => form.resetFields());
  };

  const openEdit = (record: MenuItem) => {
    setIsEdit(true);
    setCurrentRecord(record);
    setMenuType(record.type);
    setModalOpen(true);
    setTimeout(() => {
      form.setFieldsValue({
        ...record,
        parentId: record.parentId || 0,
        visible: record.visible === 1,
        status: record.status === 1,
      });
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitLoading(true);
      const payload = {
        ...values,
        visible: values.visible ? 1 : 0,
        status: values.status ? 1 : 0,
      };
      if (isEdit && currentRecord) {
        await updateMenuApi(currentRecord.id, payload);
        message.success("更新成功");
      } else {
        await createMenuApi(payload);
        message.success("创建成功");
      }
      setModalOpen(false);
      fetchList();
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteMenuApi(id);
    message.success("删除成功");
    fetchList();
  };

  const columns: ColumnsType<MenuItem> = [
    { title: "菜单名称", dataIndex: "name", width: 180 },
    {
      title: "图标",
      dataIndex: "icon",
      width: 60,
      render: (icon: string) => renderIcon(icon),
    },
    {
      title: "类型",
      dataIndex: "type",
      width: 80,
      render: (type: number) => {
        const cfg = typeMap[type];
        return cfg ? <Tag color={cfg.color}>{cfg.text}</Tag> : "-";
      },
    },
    { title: "权限标识", dataIndex: "permission", width: 180, ellipsis: true },
    { title: "路由路径", dataIndex: "path", width: 160, ellipsis: true },
    { title: "组件路径", dataIndex: "component", width: 160, ellipsis: true },
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
    {
      title: "可见",
      dataIndex: "visible",
      width: 80,
      render: (visible: number) =>
        visible === 1 ? (
          <Tag color="green">显示</Tag>
        ) : (
          <Tag color="red">隐藏</Tag>
        ),
    },
    {
      title: "操作",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space split={<Divider type="vertical" />}>
          <PermButton
            type="link"
            size="small"
            permission="system:menu:update"
            onClick={() => openEdit(record)}
          >
            编辑
          </PermButton>
          <Popconfirm
            title="确定要删除该菜单吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <PermButton
              type="link"
              size="small"
              danger
              permission="system:menu:delete"
            >
              删除
            </PermButton>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const isButton = menuType === 3;

  return (
    <>
      <Card
        className="page-table-card"
        title="菜单列表"
        extra={
          <PermButton
            type="primary"
            icon={<PlusOutlined />}
            permission="system:menu:create"
            onClick={openCreate}
          >
            新增菜单
          </PermButton>
        }
      >
        <Table<MenuItem>
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
        title={isEdit ? "编辑菜单" : "新增菜单"}
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
          initialValues={{
            parentId: 0,
            type: 1,
            sort: 0,
            visible: true,
            status: true,
          }}
        >
          <Form.Item label="上级菜单" name="parentId">
            <TreeSelect
              placeholder="请选择上级菜单"
              treeData={buildMenuTreeSelect(list)}
              treeDefaultExpandAll
            />
          </Form.Item>
          <Form.Item
            label="菜单名称"
            name="name"
            rules={[{ required: true, message: "请输入菜单名称" }]}
          >
            <Input placeholder="请输入菜单名称" />
          </Form.Item>
          <Form.Item
            label="菜单类型"
            name="type"
            rules={[{ required: true, message: "请选择菜单类型" }]}
          >
            <Radio.Group onChange={(e) => setMenuType(e.target.value)}>
              <Radio value={1}>目录</Radio>
              <Radio value={2}>菜单</Radio>
              <Radio value={3}>按钮</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="权限标识" name="permission">
            <Input placeholder="请输入权限标识，如 system:menu:create" />
          </Form.Item>
          {!isButton && (
            <>
              <Form.Item label="路由路径" name="path">
                <Input placeholder="请输入路由路径" />
              </Form.Item>
              <Form.Item label="组件路径" name="component">
                <Input placeholder="请输入组件路径" />
              </Form.Item>
              <Form.Item label="图标" name="icon">
                <Input placeholder="请输入图标名称" />
              </Form.Item>
            </>
          )}
          <Form.Item label="排序" name="sort">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="是否可见" name="visible" valuePropName="checked">
            <Switch checkedChildren="显示" unCheckedChildren="隐藏" />
          </Form.Item>
          <Form.Item label="状态" name="status" valuePropName="checked">
            <Switch checkedChildren="正常" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MenuPage;
