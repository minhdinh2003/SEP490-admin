'use client';
import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { useAuthStore } from '@/store/use-auth-store';
import TaskTemplateListingPage from '@/features/taskTemplate/components/taskTemplate-listing';
type pageProps = {
  searchParams: SearchParams;
};

export default function Page({ searchParams }: pageProps) {
  searchParamsCache.parse(searchParams);
  const { fullName } = useAuthStore.getState();
  return (
    <PageContainer>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Danh mục task'
            description=''
          />
          <Link
            href='/task-template/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className='mr-2 h-4 w-4' /> Thêm
          </Link>
        </div>
        <Separator />
        <TaskTemplateListingPage />
      </div>
    </PageContainer>
  );
}
