'use client';
import { Metadata } from 'next';
import Link from 'next/link';
import UserAuthForm from './user-auth-form';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import BgLogo from './bg-logo';
export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function SignUpViewPage() {
  const router = useRouter();

  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <BgLogo />
      <div className='flex h-full items-center p-4 lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Tạo tài khoản
            </h1>
            <p className='text-sm text-muted-foreground'>
              Nhập email của bạn dưới đây để tạo tài khoản của bạn
            </p>
          </div>
          <UserAuthForm />
          <div className='cursor flex justify-between'>
            <div
              className='inline-flex items-center justify-center text-blue-500  hover:cursor-pointer hover:underline'
              onClick={() => router.push('forgot')}
            >
              Quên mật khẩu
            </div>
            <div
              className='inline-flex items-center justify-center text-blue-500  hover:cursor-pointer hover:underline'
              onClick={() => router.push('signin')}
            >
              Đăng nhập
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
