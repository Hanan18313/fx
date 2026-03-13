export interface Category {
  id: number;
  name: string;
  icon?: string;
  parentId: number | null;
  children?: SubCategory[];
}

export interface SubCategory {
  id: number;
  name: string;
  icon?: string;
  parentId: number;
}

export interface QuickCategory {
  id: number;
  name: string;
  icon: string;
  color: string;
}
