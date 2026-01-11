import { AccountCreateForm } from '@/components/client/account-create-form';
import { ProtectedRoute } from '@/components/protected-route';

export default function AccountCreatePage() {
  return (
    <ProtectedRoute allowedRoles={['client']}>
      <div className="max-w-md mx-auto">
        <AccountCreateForm />
      </div>
    </ProtectedRoute>
  );
}
