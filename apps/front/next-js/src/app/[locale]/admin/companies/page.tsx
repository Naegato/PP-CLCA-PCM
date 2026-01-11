import { CompanyList } from '@/components/director/company-list';
import { ProtectedRoute } from '@/components/protected-route';

export default function AdminCompaniesPage() {
  return (
    <ProtectedRoute allowedRoles={['director']}>
      <CompanyList />
    </ProtectedRoute>
  );
}
