import React, { Suspense } from 'react';
import { AdminStudio } from '@/components/admin/AdminStudio';

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm font-semibold text-slate-500">
          Loading KinderESL Admin Studio...
        </div>
      }
    >
      <AdminStudio />
    </Suspense>
  );
}
