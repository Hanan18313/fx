import React, { useEffect, useMemo } from "react";
import { Layout, Menu, Dropdown, Avatar, Breadcrumb, Button, App } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  TeamOutlined,
  ShoppingOutlined,
  OrderedListOutlined,
  MoneyCollectOutlined,
  BarChartOutlined,
  DashboardOutlined,
  FileTextOutlined,
  ApartmentOutlined,
  SafetyOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useAppStore } from "../stores/useAppStore";

const { Sider, Header, Content, Footer } = Layout;

const iconMap: Record<string, React.ReactNode> = {
  Setting: <SettingOutlined />,
  User: <UserOutlined />,
  UserFilled: <TeamOutlined />,
  Goods: <ShoppingOutlined />,
  List: <OrderedListOutlined />,
  Money: <MoneyCollectOutlined />,
  Wallet: <MoneyCollectOutlined />,
  TrendCharts: <BarChartOutlined />,
  Stamp: <SafetyOutlined />,
  Menu: <AppstoreOutlined />,
  OfficeBuilding: <ApartmentOutlined />,
  Document: <FileTextOutlined />,
};

function buildMenuItems(menus: any[]): any[] {
  return menus
    .filter((m: any) => m.visible !== 0 && m.type !== 3)
    .map((m: any) => {
      const item: any = {
        key: m.path || String(m.id),
        icon: m.icon ? iconMap[m.icon] || <AppstoreOutlined /> : undefined,
        label: m.name,
      };
      if (m.children?.length) {
        const children = buildMenuItems(m.children);
        if (children.length > 0) item.children = children;
      }
      return item;
    });
}

function findBreadcrumb(
  menus: any[],
  path: string,
  trail: any[] = [],
): any[] | null {
  for (const m of menus) {
    const current = [...trail, { title: m.name }];
    if (m.path === path) return current;
    if (m.children?.length) {
      const found = findBreadcrumb(m.children, path, current);
      if (found) return found;
    }
  }
  return null;
}

function findOpenKeys(
  menus: any[],
  path: string,
  parents: string[] = [],
): string[] {
  for (const m of menus) {
    const key = m.path || String(m.id);
    if (m.path === path) return parents;
    if (m.children?.length) {
      const result = findOpenKeys(m.children, path, [...parents, key]);
      if (result.length) return result;
    }
  }
  return [];
}

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminInfo, menus, fetchProfile, logout } = useAuthStore();
  const { collapsed, toggleCollapsed } = useAppStore();

  useEffect(() => {
    if (!adminInfo) fetchProfile().catch(() => navigate("/login"));
  }, []);

  const menuItems = useMemo(() => buildMenuItems(menus), [menus]);
  const breadcrumbItems = useMemo(() => {
    const items = findBreadcrumb(menus, location.pathname);
    return [{ title: <DashboardOutlined /> }, ...(items || [])];
  }, [menus, location.pathname]);
  const openKeys = useMemo(
    () => findOpenKeys(menus, location.pathname),
    [menus, location.pathname],
  );

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key.startsWith("/")) navigate(key);
  };

  const { modal } = App.useApp();

  const handleLogout = () => {
    modal.confirm({
      title: "确认退出",
      content: "确定要退出登录吗？",
      onOk: async () => {
        await logout();
        navigate("/login");
      },
    });
  };

  const dropdownItems = {
    items: [
      { key: "profile", icon: <UserOutlined />, label: "个人信息" },
      { type: "divider" as const },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "退出登录",
        danger: true,
      },
    ],
    onClick: ({ key }: { key: string }) => {
      console.log("Dropdown menu clicked:", key);
      if (key === "logout") handleLogout();
    },
  };

  return (
    <Layout className="admin-layout">
      <Sider
        className="admin-sider"
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={220}
        collapsedWidth={64}
      >
        <div className="sider-logo">
          <div className="logo-icon">M</div>
          {!collapsed && <span className="logo-text">商城管理后台</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={openKeys}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 64 : 220,
          transition: "margin-left 0.2s",
        }}
      >
        <Header className="admin-header">
          <div className="header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleCollapsed}
            />
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <div className="header-right">
            <Dropdown menu={dropdownItems} placement="bottomRight">
              <div className="admin-name">
                <Avatar size="small" icon={<UserOutlined />} />
                <span>
                  {adminInfo?.realName || adminInfo?.username || "管理员"}
                </span>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="admin-content">
          <Outlet />
        </Content>

        <Footer className="admin-footer">
          商城分润管理系统 &copy; {new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
