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
  message,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  getAdminListApi,
  createAdminApi,
  updateAdminApi,
  resetPasswordApi,
} from "../../../api/admin";
import { getRoleListApi } from "../../../api/role";
import { getDeptListApi } from "../../../api/dept";
import PermButton from "../../../components/PermButton";

interface AdminItem {
  id: number;
  username: string;
  realName: string;
  phone: string;
  email: string;
  status: number;
  deptId: number;
  dept?: { id: number; name: string };
  roles?: { id: number; name: string }[];
  createdAt: string;
}

interface RoleOption {
  id: number;
  name: string;
}

interface DeptNode {
  id: number;
  name: string;
  children?: DeptNode[];
}

const buildDeptTreeSelect = (list: DeptNode[]): any[] =>
  list.map((item) => ({
    value: item.id,
    title: item.name,
    children: item.children ? buildDeptTreeSelect(item.children) : [],
  }));

const AdminPage: React.FC = () => {
  const [searchForm] = Form.useForm();
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [resetPwdForm] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<AdminItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [resetPwdOpen, setResetPwdOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<AdminItem | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [deptTree, setDeptTree] = useState<any[]>([]);

  const fetchList = async (p = page, ps = pageSize) => {
    setLoading(true);
    try {
      const params = { page: p, pageSize: ps, ...searchForm.getFieldsValue() };
      const res: any = await getAdminListApi(params);
      setList(res.data?.list || res.list || []);
      setTotal(res.data?.total || res.total || 0);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    setRolesLoading(true);
    try {
      const res: any = await getRoleListApi({ pageSize: 999 });
      setRoles(res);
    } finally {
      setRolesLoading(false);
    }
  };

  const fetchDeptTree = async () => {
    try {
      const res: any = await getDeptListApi();
      const data = res;
      setDeptTree(buildDeptTreeSelect(data));
    } catch {
      /* empty */
    }
  };

  useEffect(() => {
    fetchList();
    fetchRoles();
    fetchDeptTree();
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

  const handlePageChange = (p: number, ps: number) => {
    setPage(p);
    setPageSize(ps);
    fetchList(p, ps);
  };

  /* Create */
  const handleCreate = async () => {
    try {
      const values = await createForm.validateFields();
      setSubmitLoading(true);
      await createAdminApi({ ...values, status: values.status ? 1 : 0 });
      message.success("创建成功");
      setCreateOpen(false);
      fetchList();
    } finally {
      setSubmitLoading(false);
    }
  };

  /* Edit */
  const openEdit = (record: AdminItem) => {
    setCurrentRecord(record);
    setEditOpen(true);
    setTimeout(() => {
      editForm.setFieldsValue({
        ...record,
        roleIds: record.roles?.map((r) => r.id),
        status: record.status === 1,
      });
    });
  };

  const handleEdit = async () => {
    if (!currentRecord) return;
    try {
      const values = await editForm.validateFields();
      setSubmitLoading(true);
      await updateAdminApi(currentRecord.id, {
        ...values,
        status: values.status ? 1 : 0,
      });
      message.success("更新成功");
      setEditOpen(false);
      fetchList();
    } finally {
      setSubmitLoading(false);
    }
  };

  /* Reset Password */
  const openResetPwd = (record: AdminItem) => {
    setCurrentRecord(record);
    setResetPwdOpen(true);
  };

  const handleResetPwd = async () => {
    if (!currentRecord) return;
    try {
      const values = await resetPwdForm.validateFields();
      setSubmitLoading(true);
      await resetPasswordApi(currentRecord.id, values);
      message.success("密码重置成功");
      setResetPwdOpen(false);
    } finally {
      setSubmitLoading(false);
    }
  };

  const columns: ColumnsType<AdminItem> = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "用户名", dataIndex: "username", width: 120 },
    { title: "真实姓名", dataIndex: "realName", width: 100 },
    { title: "手机号", dataIndex: "phone", width: 120 },
    { title: "邮箱", dataIndex: "email", width: 160, ellipsis: true },
    {
      title: "部门",
      dataIndex: "dept",
      width: 100,
      render: (dept) => dept?.name || "-",
    },
    {
      title: "角色",
      dataIndex: "roles",
      width: 160,
      render: (roles: RoleOption[]) =>
        roles?.map((r) => (
          <Tag key={r.id} color="blue">
            {r.name}
          </Tag>
        )) || "-",
    },
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
            permission="system:admin:update"
            onClick={() => openEdit(record)}
          >
            编辑
          </PermButton>
          <PermButton
            type="link"
            size="small"
            permission="system:admin:reset-pwd"
            onClick={() => openResetPwd(record)}
          >
            重置密码
          </PermButton>
        </Space>
      ),
    },
  ];

  const renderFormFields = (isEdit: boolean) => (
    <>
      <Form.Item
        label="用户名"
        name="username"
        rules={[{ required: true, message: "请输入用户名" }]}
      >
        <Input placeholder="请输入用户名" disabled={isEdit} />
      </Form.Item>
      {!isEdit && (
        <Form.Item
          label="密码"
          name="password"
          rules={[
            { required: true, message: "请输入密码" },
            { min: 6, message: "密码至少6位" },
          ]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
      )}
      <Form.Item label="真实姓名" name="realName">
        <Input placeholder="请输入真实姓名" />
      </Form.Item>
      <Form.Item label="邮箱" name="email">
        <Input placeholder="请输入邮箱" />
      </Form.Item>
      <Form.Item label="手机号" name="phone">
        <Input placeholder="请输入手机号" />
      </Form.Item>
      <Form.Item label="部门" name="deptId">
        <TreeSelect
          placeholder="请选择部门"
          treeData={deptTree}
          allowClear
          treeDefaultExpandAll
        />
      </Form.Item>
      <Form.Item
        label="角色"
        name="roleIds"
        rules={[{ required: true, message: "请选择角色" }]}
      >
        <Select
          mode="multiple"
          placeholder="请选择角色"
          loading={rolesLoading}
          options={roles.map((r) => ({ label: r.name, value: r.id }))}
        />
      </Form.Item>
      <Form.Item label="状态" name="status" valuePropName="checked">
        <Switch checkedChildren="正常" unCheckedChildren="禁用" />
      </Form.Item>
    </>
  );

  return (
    <>
      {/* Search Card */}
      <Card className="page-search-card" style={{ marginBottom: 16 }}>
        <Form form={searchForm} layout="inline">
          <Row gutter={[16, 16]} style={{ width: "100%" }}>
            <Col>
              <Form.Item name="username" label="用户名">
                <Input placeholder="请输入用户名" allowClear />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="realName" label="真实姓名">
                <Input placeholder="请输入真实姓名" allowClear />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="phone" label="手机号">
                <Input placeholder="请输入手机号" allowClear />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择" allowClear style={{ width: 120 }}>
                  <Select.Option value={1}>正常</Select.Option>
                  <Select.Option value={0}>禁用</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="deptId" label="部门">
                <TreeSelect
                  placeholder="请选择部门"
                  treeData={deptTree}
                  allowClear
                  treeDefaultExpandAll
                  style={{ width: 180 }}
                />
              </Form.Item>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                >
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

      {/* Table Card */}
      <Card
        className="page-table-card"
        title="管理员列表"
        extra={
          <PermButton
            type="primary"
            icon={<PlusOutlined />}
            permission="system:admin:create"
            onClick={() => setCreateOpen(true)}
          >
            新增管理员
          </PermButton>
        }
      >
        <Table<AdminItem>
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
            style: { justifyContent: "flex-end" },
          }}
        />
      </Card>

      {/* Create Modal */}
      <Modal
        title="新增管理员"
        open={createOpen}
        width={600}
        forceRender
        onOk={handleCreate}
        confirmLoading={submitLoading}
        onCancel={() => setCreateOpen(false)}
        afterClose={() => createForm.resetFields()}
      >
        <Form
          form={createForm}
          layout="vertical"
          initialValues={{ status: true }}
        >
          {renderFormFields(false)}
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="编辑管理员"
        open={editOpen}
        width={600}
        forceRender
        onOk={handleEdit}
        confirmLoading={submitLoading}
        onCancel={() => setEditOpen(false)}
        afterClose={() => editForm.resetFields()}
      >
        <Form form={editForm} layout="vertical">
          {renderFormFields(true)}
        </Form>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        title={`重置密码 - ${currentRecord?.username || ""}`}
        open={resetPwdOpen}
        width={600}
        forceRender
        onOk={handleResetPwd}
        confirmLoading={submitLoading}
        onCancel={() => setResetPwdOpen(false)}
        afterClose={() => resetPwdForm.resetFields()}
      >
        <Form form={resetPwdForm} layout="vertical">
          <Form.Item
            label="新密码"
            name="password"
            rules={[
              { required: true, message: "请输入新密码" },
              { min: 6, message: "密码至少6位" },
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AdminPage;
