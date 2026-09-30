import { NotificationItem } from '../types';

export function createNotification(
  userId: string,
  title: string,
  message: string,
  type: 'INFO' | 'WARNING' | 'ALERT' | 'SUCCESS',
  applicationId?: string,
  actionUrl?: string
): NotificationItem {
  return {
    id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId,
    title,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString(),
    applicationId,
    actionUrl,
  };
}
