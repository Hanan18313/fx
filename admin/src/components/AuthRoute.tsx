import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuthStore } from '../stores/useAuthStore';

const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useAuthStore((s) => s.token);
  const adminInfo = useAuthStore((s) => s.adminInfo);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const reset = useAuthStore((s) => s.reset);
  const [loading, setLoading] = useState(!adminInfo && !!token);

  useEffect(() => {
    if (token && !adminInfo) {
      setLoading(true);
      fetchProfile()
        .catch(() => reset())
        .finally(() => setLoading(false));
    }
  }, [token, adminInfo, fetchProfile, reset]);

  if (!token) return <Navigate to="/login" replace />;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthRoute;
