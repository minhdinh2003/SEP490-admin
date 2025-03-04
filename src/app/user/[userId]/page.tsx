import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import UserViewPage from '@/features/user/components/user-view-page';

export const metadata = {
  title: 'Dashboard : Người dùng'
};

type PageProps = { params: { userId: string } };

export default function Page({ params }: PageProps) {
  console.log(params.userId);
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <UserViewPage userId={params.userId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
