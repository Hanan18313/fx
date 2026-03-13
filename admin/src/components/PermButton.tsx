import React from 'react';
import { Button, ButtonProps } from 'antd';
import { useAuthStore } from '../stores/useAuthStore';

interface PermButtonProps extends ButtonProps {
  permission: string;
}

const PermButton: React.FC<PermButtonProps> = ({ permission, children, ...rest }) => {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  if (!hasPermission(permission)) return null;
  return <Button {...rest}>{children}</Button>;
};

export default PermButton;
