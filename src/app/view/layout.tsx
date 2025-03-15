import KBar from '@/components/kbar';
import HeaderView from '@/components/layout/header-view';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Màn hình View',
  description: 'Mô tả màn View'
};

export default function ViewLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';
  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <SidebarInset>
          <HeaderView />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
