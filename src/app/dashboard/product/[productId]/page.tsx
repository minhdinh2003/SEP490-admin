<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> ae46164c3f9f5f35ecd5890e6fff3e5483bb0a6b
import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductViewPage from '@/features/products/components/product-view-page';

export const metadata = {
  title: 'Dashboard : Product View'
};
<<<<<<< HEAD

=======
>>>>>>> ae46164c3f9f5f35ecd5890e6fff3e5483bb0a6b
type PageProps = { params: { productId: string } };

export default function Page({ params }: PageProps) {
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <ProductViewPage productId={params.productId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
<<<<<<< HEAD
=======

>>>>>>> ae46164c3f9f5f35ecd5890e6fff3e5483bb0a6b
