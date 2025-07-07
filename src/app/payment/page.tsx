'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const resultCode = searchParams.get('resultCode');
    
    if (resultCode === '0' || resultCode === '00' || resultCode === '0000') {
      const queryString = Array.from(searchParams.entries())
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
        
      router.push(`/payment/success?${queryString}`);
    } else {
      router.push('/');
    }
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
        <h2 className="text-2xl font-bold text-gray-800">Đang xử lý thanh toán...</h2>
        <p className="text-gray-500">Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
          <h2 className="text-2xl font-bold text-gray-800">Đang tải...</h2>
        </div>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
} 