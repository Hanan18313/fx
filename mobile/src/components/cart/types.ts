import type { CartItem } from '../../types/cart';

export interface CartItemCardProps {
  item: CartItem;
  onToggleSelect: () => void;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export interface CartBottomBarProps {
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
  totalPrice: number;
  selectedCount: number;
  editing: boolean;
  onSettle: () => void;
  onDeleteSelected: () => void;
}
