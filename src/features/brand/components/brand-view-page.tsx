'use client';
import { useEffect, useState } from 'react';
import { Brand } from '@/models/base.model';
import BrandForm from './brand-form';
import BrandService from '@/services/branchService';
import { ServiceResponse } from 'types/service.response';
import { notFound } from 'next/navigation';
import { ModeForm } from '@/enum/mode.type';

type TBrandViewPageProps = {
  brandId: string;
};

export default function BrandViewPage({ brandId }: TBrandViewPageProps) {
  const [Brand, setBrand] = useState<Brand | null>(null);
  const [pageTitle, setPageTitle] = useState<string>('Thêm thương hiệu');
  const [loading, setLoading] = useState<boolean>(true);
  const [modeForm, setModeForm] = useState<ModeForm>(ModeForm.Add);
  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        if (brandId !== 'new') {
          const result = await BrandService.getById<ServiceResponse>(
            Number(brandId)
          );
          if (!result || !result.data) {
            notFound();
          }
          setBrand(result.data as Brand);
          setPageTitle('Cập nhật thương hiệu');
          setModeForm(ModeForm.Update);
        }
      } catch (error) {
        console.error('Error fetching Brand data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandData();
  }, [brandId]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <BrandForm
      id={Number(brandId || -1)}
      modeForm={modeForm}
      initialData={Brand}
      pageTitle={pageTitle}
    />
  );
}
