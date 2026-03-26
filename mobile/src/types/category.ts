export interface Category {
  id: number;
  name: string;
  icon?: string;
  iconName?: string;
  description?: string;
  parentId: number | null;
  children?: SubCategory[];
}

export interface SubCategory {
  id: number;
  name: string;
  icon?: string;
  iconName?: string;
  parentId: number;
  imageUrl?: string;
  productCount?: number;
  description?: string;
}

export interface QuickCategory {
  id: number;
  name: string;
  icon: string;
  color: string;
}
