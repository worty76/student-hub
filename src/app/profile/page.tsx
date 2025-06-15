'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EditProfileForm, UserProfile } from '@/components/profile';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EditProfilePage() {
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    setShowPreview(true);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBack}
              className="flex items-center gap-2 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Chỉnh sửa hồ sơ</h1>
              <p className="text-muted-foreground">
                Cập nhật thông tin hồ sơ và thích ứng với nhu cầu của bạn
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Edit Form */}
          <div className={showPreview ? 'hidden lg:block' : ''}>
            <EditProfileForm 
              onSuccess={handleSuccess}
              onCancel={handleBack}
            />
          </div>

          <div className={!showPreview ? 'hidden lg:block' : ''}>
            <div className="space-y-4">
              <UserProfile />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 