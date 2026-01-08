import { DirectorStockList } from '@/components/director/stock-list';
import { ProtectedRoute } from '@/components/protected-route';

export default function AdminStocksPage() {
  return (
    <ProtectedRoute allowedRoles={['director']}>
      <DirectorStockList />
    </ProtectedRoute>
  );
}
