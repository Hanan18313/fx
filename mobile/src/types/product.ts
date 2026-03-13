export interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  profit_rate: string;
  images: string[];
  description?: string;
  sales?: number;
  tags?: ProductTag[];
}

export type ProductTag = 'new' | 'hot' | 'member_exclusive' | 'promotion';

export interface ProductListParams {
  keyword?: string;
  categoryId?: number;
  page?: number;
  pageSize?: number;
  sort?: 'price_asc' | 'price_desc' | 'sales' | 'newest';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
