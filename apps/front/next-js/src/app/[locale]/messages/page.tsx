import { MessageList } from '@/components/client/message-list';
import { ProtectedRoute } from '@/components/protected-route';

export default function MessagesPage() {
  return (
    <ProtectedRoute allowedRoles={['client']}>
      <MessageList />
    </ProtectedRoute>
  );
}
