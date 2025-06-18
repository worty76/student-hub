import { Metadata } from 'next';
import PublicUserProfile from '@/components/users/PublicUserProfile';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Hồ sơ người dùng - Student Hub`,
    description: 'Xem thông tin hồ sơ người dùng trên Student Hub',
  };
}

export default async function UserProfilePage({ params }: PageProps) {
  const { id } = await params;
  return <PublicUserProfile userId={id} />;
} 