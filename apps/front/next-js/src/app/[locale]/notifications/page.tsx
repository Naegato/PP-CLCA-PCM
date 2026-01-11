import { NotificationList } from '@/components/client/notification-list';
import { ProtectedRoute } from '@/components/protected-route';

export default function NotificationsPage() {
  return (
    <ProtectedRoute allowedRoles={['client']}>
      <NotificationList />
    </ProtectedRoute>
  );
}
