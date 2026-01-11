import { ClientList } from '@/components/director/client-list';
import { ProtectedRoute } from '@/components/protected-route';

export default function AdminUsersPage() {
  return (
    <ProtectedRoute allowedRoles={['director']}>
      <ClientList />
    </ProtectedRoute>
  );
}
