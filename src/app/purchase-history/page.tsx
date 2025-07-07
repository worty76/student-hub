'use client';

import { Suspense } from 'react';
import PurchaseHistory from '@/components/purchase/PurchaseHistory';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

function PurchaseHistoryPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      <Card className="mb-6 border-0 shadow-md">
        <CardContent className="pt-6">
          <Skeleton className="h-10 w-full mb-4" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function PurchaseHistoryPage() {
  return (
    <Suspense fallback={<PurchaseHistoryPageSkeleton />}>
      <PurchaseHistory />
    </Suspense>
  );
} 