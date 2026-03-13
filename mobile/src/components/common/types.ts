export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}

export interface EmptyStateProps {
  icon?: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}
