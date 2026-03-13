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
  Divider,
  Drawer,
  Tree,
  Spin,
  InputNumber,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  getRoleListApi,
  createRoleApi,
  updateRoleApi,
  assignMenusApi,
} from "../../../api/role";
import { getMenuListApi } from "../../../api/menu";
import PermButton from "../../../components/PermButton";

interface RoleItem {
  id: number;
  name: string;
  code: string;
  description: string;
  dataScope: number;
  sort: number;
  status: number;
  menuIds?: number[];
  createdAt: string;
}

interface MenuNode {
  id: number;
  name: string;
  children?: MenuNode[];
}

const dataScopeMap: Record<number, string> = {
  1: "全部数据",
  2: "本部门及子部门",
  3: "本部门",
  4: "仅本人",
  5: "自定义",
};

const flattenMenuIds = (menus: MenuNode[]): number[] => {
  const ids: number[] = [];
  const walk = (list: MenuNode[]) => {
    list.forEach((m) => {
      ids.push(m.id);
      if (m.children) walk(m.children);
    });
  };
  walk(menus);
  return ids;
};

const buildTreeData = (list: MenuNode[]): any[] =>
  list.map((item) => ({
    key: item.id,
    title: item.name,
    children: item.children ? buildTreeData(item.children) : [],
  }));

const RolePage: React.FC = () => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<RoleItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<RoleItem | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Assign menus drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuTree, setMenuTree] = useState<any[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<number[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignRoleId, setAssignRoleId] = useState<number | null>(null);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res: any = await getRoleListApi({ pageSize: 999 });
      setList(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  /* Create / Edit */
  const openCreate = () => {
    setIsEdit(false);
    setCurrentRecord(null);
    setModalOpen(true);
    setTimeout(() => form.resetFields());
  };

  const openEdit = (record: RoleItem) => {
    setIsEdit(true);
    setCurrentRecord(record);
    setModalOpen(true);
    setTimeout(() => {
      form.setFieldsValue({ ...record, status: record.status === 1 });
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitLoading(true);
      const payload = { ...values, status: values.status ? 1 : 0 };
      if (isEdit && currentRecord) {
        await updateRoleApi(currentRecord.id, payload);
        message.success("更新成功");
      } else {
        await createRoleApi(payload);
        message.success("创建成功");
      }
      setModalOpen(false);
      fetchList();
    } finally {
      setSubmitLoading(false);
    }
  };

  /* Assign Menus */
  const openAssignMenus = async (record: RoleItem) => {
    setAssignRoleId(record.id);
    setDrawerOpen(true);
    setMenuLoading(true);
    try {
      const res: any = await getMenuListApi();
      const menus = res.data?.list || res.list || res.data || [];
      setMenuTree(buildTreeData(menus));
      // Pre-check existing menuIds
      setCheckedKeys(record.menuIds || []);
    } finally {
      setMenuLoading(false);
    }
  };

  const handleAssign = async () => {
    if (assignRoleId === null) return;
    setAssignLoading(true);
    try {
      await assignMenusApi(assignRoleId, { menuIds: checkedKeys });
      message.success("权限分配成功");
      setDrawerOpen(false);
      fetchList();
    } finally {
      setAssignLoading(false);
    }
  };

  const columns: ColumnsType<RoleItem> = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "角色名称", dataIndex: "name", width: 120 },
    { title: "角色标识", dataIndex: "code", width: 120 },
    { title: "描述", dataIndex: "description", width: 200, ellipsis: true },
    {
      title: "数据范围",
      dataIndex: "dataScope",
      width: 130,
      render: (val: number) => dataScopeMap[val] || "-",
    },
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
      title: "操作",
      key: "action",
      width: 220,
      render: (_, record) => (
        <Space split={<Divider type="vertical" />}>
          <PermButton
            type="link"
            size="small"
            permission="system:role:update"
            onClick={() => openEdit(record)}
          >
            编辑
          </PermButton>
          <PermButton
            type="link"
            size="small"
            permission="system:role:update"
            onClick={() => openAssignMenus(record)}
          >
            分配权限
          </PermButton>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        className="page-table-card"
        title="角色列表"
        extra={
          <PermButton
            type="primary"
            icon={<PlusOutlined />}
            permission="system:role:create"
            onClick={openCreate}
          >
            新增角色
          </PermButton>
        }
      >
        <Table<RoleItem>
          rowKey="id"
          size="middle"
          loading={loading}
          columns={columns}
          dataSource={list}
          pagination={false}
        />
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        title={isEdit ? "编辑角色" : "新增角色"}
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
          initialValues={{ status: true, sort: 0, dataScope: 1 }}
        >
          <Form.Item
            label="角色名称"
            name="name"
            rules={[{ required: true, message: "请输入角色名称" }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            label="角色标识"
            name="code"
            rules={[{ required: true, message: "请输入角色标识" }]}
          >
            <Input placeholder="请输入角色标识" />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea placeholder="请输入描述" rows={3} />
          </Form.Item>
          <Form.Item label="数据范围" name="dataScope">
            <Select>
              {Object.entries(dataScopeMap).map(([k, v]) => (
                <Select.Option key={k} value={Number(k)}>
                  {v}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="排序" name="sort">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="状态" name="status" valuePropName="checked">
            <Switch checkedChildren="正常" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Assign Menus Drawer */}
      <Drawer
        title="分配权限"
        width={500}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        extra={
          <Button type="primary" loading={assignLoading} onClick={handleAssign}>
            保存
          </Button>
        }
      >
        {menuLoading ? (
          <div style={{ textAlign: "center", paddingTop: 60 }}>
            <Spin />
          </div>
        ) : (
          <Tree
            checkable
            checkStrictly
            defaultExpandAll
            treeData={menuTree}
            checkedKeys={checkedKeys}
            onCheck={(checked: any) => {
              const keys = Array.isArray(checked) ? checked : checked.checked;
              setCheckedKeys(keys as number[]);
            }}
          />
        )}
      </Drawer>
    </>
  );
};

export default RolePage;
