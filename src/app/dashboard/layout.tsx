import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
export const metadata: Metadata = {
  title: 'Màn hình Dashboard',
  description: 'Mô tả màn dashboard'
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  // kiểm tra trạng thái đóng mở sider bar
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';
  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          {/* page main content */}
          {children}
          {/* page main content ends */}
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
