import { AccountDetail } from '@/components/client/account-detail';
import { ProtectedRoute } from '@/components/protected-route';
import { getApi } from '@/lib/api';
import { cookies } from 'next/headers';

interface AccountDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AccountDetailPage({ params }: AccountDetailPageProps) {
  const { id } = await params;

  const cookiesStore = await cookies();
  const token = cookiesStore.get('auth_token')?.value || undefined;

  const response = await getApi(token).fetch(`/client/accounts/${id}`);
  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <AccountDetail account={data} />
    </ProtectedRoute>
  );
}
