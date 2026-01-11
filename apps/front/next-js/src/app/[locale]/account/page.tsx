import { AccountList } from '@/components/client/account-list';
import { ProtectedRoute } from '@/components/protected-route';

export default function AccountPage() {
  return (
    <ProtectedRoute allowedRoles={['client']}>
      <AccountList />
    </ProtectedRoute>
  );
}
