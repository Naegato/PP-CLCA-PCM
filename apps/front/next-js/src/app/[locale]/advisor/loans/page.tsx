import { PendingLoanList } from '@/components/advisor/pending-loan-list';
import { ProtectedRoute } from '@/components/protected-route';

export default function AdvisorLoansPage() {
  return (
    <ProtectedRoute allowedRoles={['advisor']}>
      <PendingLoanList />
    </ProtectedRoute>
  );
}
