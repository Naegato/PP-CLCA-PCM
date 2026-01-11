import { LoanList } from '@/components/client/loan-list';
import { ProtectedRoute } from '@/components/protected-route';

export default function LoansPage() {
  return (
    <ProtectedRoute allowedRoles={['client']}>
      <LoanList />
    </ProtectedRoute>
  );
}
