import { AccountList } from '@/components/client/account-list';
import { ProtectedRoute } from '@/components/protected-route';
import { getApi } from '@/lib/api';
import { cookies } from 'next/headers';

export default async function AccountPage() {
  const cookiesStore = await cookies();
  const token = cookiesStore.get('auth_token')?.value || undefined;
  const response = await getApi(token).fetch('/client/accounts');
  const data = await response.json();

  console.log(data);

  if (data.error) {
    throw new Error(data.error);
  }

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <AccountList accounts={data} />
    </ProtectedRoute>
  );
}
