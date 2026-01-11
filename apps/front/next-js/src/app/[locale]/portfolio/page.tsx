import { PortfolioView } from '@/components/client/portfolio-view';
import { ProtectedRoute } from '@/components/protected-route';

export default function PortfolioPage() {
  return (
    <ProtectedRoute allowedRoles={['client']}>
      <PortfolioView />
    </ProtectedRoute>
  );
}
