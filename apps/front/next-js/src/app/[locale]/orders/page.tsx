import { OrderList } from '@/components/client/order-list';
import { ProtectedRoute } from '@/components/protected-route';

export default function OrdersPage() {
  return (
    <ProtectedRoute allowedRoles={['client']}>
      <OrderList />
    </ProtectedRoute>
  );
}
