'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EditProfileForm, UserProfile } from '@/components/profile';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Edit3 } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-12">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            className="text-white/90 hover:text-white hover:bg-white/10 mb-6 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Hồ sơ cá nhân</h1>
                <p className="text-blue-100 text-lg">
                  Cập nhật thông tin và tùy chỉnh hồ sơ của bạn
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Edit Form Section */}
          <div className={`transition-all duration-500 ${showPreview ? 'lg:block hidden' : 'block'}`}>
            <div className="sticky top-8">
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
                <div className="bg-gradient-to-l from-violet-500 to-purple-500 p-6 text-white">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Edit3 className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Chỉnh sửa hồ sơ</h2>
                      <p className="text-emerald-100 text-sm">Cập nhật thông tin cá nhân</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <EditProfileForm 
                    onSuccess={handleSuccess}
                    onCancel={handleBack}
                    className="border-0 shadow-none bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className={`transition-all duration-500 ${!showPreview ? 'lg:block hidden' : 'block'}`}>
            <div className="sticky top-8">
              <div className="space-y-6">
                {/* Preview Card */}
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
                  <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-6 text-white">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">Xem trước hồ sơ</h2>
                        <p className="text-violet-100 text-sm">Hồ sơ như người khác nhìn thấy</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <UserProfile className="border-0 shadow-none bg-transparent" />
                  </div>
                </div>

                {/* Mobile Toggle Button */}
                <div className="lg:hidden">
                  <Button
                    onClick={() => setShowPreview(!showPreview)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
                    size="lg"
                  >
                    {showPreview ? 'Chỉnh sửa hồ sơ' : 'Xem trước hồ sơ'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 