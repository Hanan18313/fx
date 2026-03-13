import React from 'react';
import { App as AntdApp } from 'antd';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthRoute from './components/AuthRoute';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/login/index';
import DashboardPage from './pages/dashboard/index';
import AdminListPage from './pages/system/admin/index';
import RoleListPage from './pages/system/role/index';
import MenuListPage from './pages/system/menu/index';
import DeptListPage from './pages/system/dept/index';
import LogPage from './pages/system/log/index';
import UserListPage from './pages/user/index';
import ProductListPage from './pages/product/index';
import OrderListPage from './pages/order/index';
import OrderDetailPage from './pages/order/detail';
import WithdrawalListPage from './pages/withdrawal/index';
import ProfitPage from './pages/profit/index';

const App: React.FC = () => {
  return (
    <AntdApp>
      <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <AuthRoute>
              <AdminLayout />
            </AuthRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="system/admins" element={<AdminListPage />} />
          <Route path="system/roles" element={<RoleListPage />} />
          <Route path="system/menus" element={<MenuListPage />} />
          <Route path="system/depts" element={<DeptListPage />} />
          <Route path="system/logs" element={<LogPage />} />
          <Route path="users" element={<UserListPage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="orders" element={<OrderListPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="finance/withdrawals" element={<WithdrawalListPage />} />
          <Route path="profit" element={<ProfitPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </AntdApp>
  );
};

export default App;
