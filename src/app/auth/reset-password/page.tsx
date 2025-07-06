'use client';

import { Suspense } from 'react';
import { ResetPasswordPageContent } from '@/components/auth/ResetPasswordPageContent';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordPageLoading />}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}

function ResetPasswordPageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-700 font-medium">Đang tải...</p>
      </div>
    </div>
  );
} 