export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'done' | 'cancelled';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  price: string;
  quantity: number;
  subtotal: string;
}

export interface Order {
  id: number;
  orderNo?: string;
  status: OrderStatus;
  totalAmount: string;
  freightAmount?: string;
  discountAmount?: string;
  payAmount?: string;
  profitPool?: string;
  addressSnapshot?: Address;
  remark?: string;
  payType?: string;
  paidAt?: string;
  shippedAt?: string;
  completedAt?: string;
  createdAt: string;
  items?: OrderItem[];
}

export interface Address {
  id: number;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: number;
}

export const ORDER_STATUS_MAP: Record<OrderStatus, string> = {
  pending: '待付款',
  paid: '待发货',
  shipped: '待收货',
  done: '已完成',
  cancelled: '已取消',
};

export const ORDER_STATUS_TABS = [
  { key: '', label: '全部' },
  { key: 'pending', label: '待付款' },
  { key: 'paid', label: '待发货' },
  { key: 'shipped', label: '待收货' },
  { key: 'done', label: '已完成' },
] as const;
