import { AdvisorMessageList } from '@/components/advisor/advisor-message-list';
import { ProtectedRoute } from '@/components/protected-route';

export default function AdvisorMessagesPage() {
  return (
    <ProtectedRoute allowedRoles={['advisor']}>
      <AdvisorMessageList />
    </ProtectedRoute>
  );
}
