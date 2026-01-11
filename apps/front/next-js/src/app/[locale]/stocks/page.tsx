import { StockList } from '@/components/client/stock-list';
import { ProtectedRoute } from '@/components/protected-route';

export default function StocksPage() {
  return (
    <ProtectedRoute allowedRoles={['client']}>
      <StockList />
    </ProtectedRoute>
  );
}
