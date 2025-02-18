import { Metadata } from 'next';
import SignInViewPage from '@/features/auth/components/sigin-view';

export const metadata: Metadata = {
  title: 'Xác thực | đăng nhập',
  description: 'Mô tả thêm.'
};

export default function Page() {
  return <SignInViewPage />;
}
