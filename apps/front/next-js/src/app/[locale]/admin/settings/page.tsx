import { SavingsRateForm } from '@/components/director/savings-rate-form';
import { ProtectedRoute } from '@/components/protected-route';

export default function AdminSettingsPage() {
  return (
    <ProtectedRoute allowedRoles={['director']}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <SavingsRateForm />
      </div>
    </ProtectedRoute>
  );
}
