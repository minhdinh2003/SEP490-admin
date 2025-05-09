import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import TaskTemplateViewPage from '@/features/taskTemplate/components/taskTemplate-view-page';

export const metadata = {
  title: 'Dashboard : Người dùng'
};

type PageProps = { params: { id: string } };

export default function Page({ params }: PageProps) {
  console.log(params.id);
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <TaskTemplateViewPage id={params.id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
