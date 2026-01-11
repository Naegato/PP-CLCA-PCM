'use client';

import { SavingsCreateForm } from '@/components/client/savings-create-form';
import { ProtectedRoute } from '@/components/protected-route';
import { useRouter } from '@/src/i18n/navigation';
import { useLocale } from 'next-intl';

export default function SavingsCreatePage() {
  const locale = useLocale();
  const router = useRouter()

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <div className="max-w-md mx-auto">
        <SavingsCreateForm onSuccess={() => {
          console.log('redirect to /account');
          router.push('/account');
        }}/>
      </div>
    </ProtectedRoute>
  );
}
