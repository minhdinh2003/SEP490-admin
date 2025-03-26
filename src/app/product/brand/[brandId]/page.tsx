import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import BrandViewPage from '@/features/brand/components/brand-view-page';

export const metadata = {
  title: 'Dashboard : Người dùng'
};

type PageProps = { params: { brandId: string } };

export default function Page({ params }: PageProps) {
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <BrandViewPage brandId={params.brandId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
