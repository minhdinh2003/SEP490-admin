import { useAuthStore } from '@/store/use-auth-store';
import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Lato } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';

//to-do: thông tin ứng dụng
export const metadata: Metadata = {
  title: 'Tên ứng dụng',
  description: 'Mô tả ứng dụng'
};

// font-google
const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap'
});

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={`${lato.className}`}>
      <body className={'overflow-hidden'}>
        {/* show loading */}
        <NextTopLoader showSpinner={false} />
        <NuqsAdapter>
          <Providers session={null}>
            <Toaster richColors />
            {children}
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
