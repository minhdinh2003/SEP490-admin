'use client';
import { useEffect, useState } from 'react';
import { Product } from '@/models/base.model';
import CarForm from './car-form';
import ProductService from '@/services/productService';
import { ServiceResponse } from 'types/service.response';
import { notFound } from 'next/navigation';
import { ModeForm } from '@/enum/mode.type';

type TProductViewPageProps = {
  productId: string;
};

export default function ProductViewPage({ productId }: TProductViewPageProps) {
  const [Product, setProduct] = useState<Product | null>(null);
  const [pageTitle, setPageTitle] = useState<string>('Thêm phụ tùng');
  const [loading, setLoading] = useState<boolean>(true);
  const [modeForm, setModeForm] = useState<ModeForm>(ModeForm.Add);
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        if (productId !== 'new') {
          const result = await ProductService.getByIdReference<ServiceResponse>(
            Number(productId),
            {
              brands: true
            }
          );
          if (!result || !result.data) {
            notFound();
          }
          var product = result.data as Product;
          if (product.brands && product.brands.length > 0) {
            product.brand = product.brands.map((x) => x.id).join(';');
          }

          setProduct(product);
          setPageTitle('Cập nhật sản phẩm');
          setModeForm(ModeForm.Update);
        }
      } catch (error) {
        console.error('Error fetching Product data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <CarForm
      id={Number(productId || -1)}
      modeForm={modeForm}
      initialData={Product}
      pageTitle={pageTitle}
    />
  );
}
