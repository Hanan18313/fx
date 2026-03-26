export type NotificationType = 'system' | 'order' | 'profit';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  content: string;
  isRead: number;
  linkType?: string;
  linkValue?: string;
  createdAt: string;
}
