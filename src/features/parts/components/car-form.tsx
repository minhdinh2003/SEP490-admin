import { AvatarUploader } from '@/components/ui/avatar-upload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  MultiSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ModeForm } from '@/enum/mode.type';
import { Brand, Product } from '@/models/base.model';
import ProductService from '@/services/productService';
import { ServiceResponse } from 'types/service.response';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import MultiImageUploader from '@/components/ui/multi-image';
import { ProductCategory } from '@/enum/category-type';
import { useEffect, useState } from 'react';
import BrandService from '@/services/branchService';
export default function ProductForm({
  pageTitle,
  initialData,
  modeForm,
  id
}: {
  pageTitle: string;
  initialData: Product | null;
  modeForm: ModeForm;
  id: number | null;
}) {
  const router = useRouter();

  const formSchema = z.object({
    name: z
      .string()
      .min(2, { message: 'Tên phụ tùng phải có ít nhất 2 ký tự.' }),
    description: z.string().optional(),
    price: z
      .number({ invalid_type_error: 'Giá phải là số.' })
      .positive({ message: 'Giá phải lớn hơn 0.' }),
    originPrice: z
      .number({ invalid_type_error: 'Giá nhập phải là số.' })
      .positive({ message: 'Giá nhập phải lớn hơn 0.' }),
    category: z.enum(['CAR', 'PART'], {
      message: 'Loại phụ tùng không hợp lệ.'
    }),
    model: z.string().nullable().optional(),
    year: z.number().nullable().optional(),
    status: z.enum(['AVAILABLE', 'SOLD', 'OUT_OF_STOCK'], {
      message: 'Trạng thái không hợp lệ.'
    }),
    listImage: z.any().optional(),
    style: z.string().nullable().optional(),
    engine_capacity: z.string().nullable().optional(),
    fuel_type: z.string().nullable().optional(),
    transmission: z.string().nullable().optional(),
    mileage: z.number().nullable().optional(),
    exterior_color: z.string().nullable().optional(),
    interior_color: z.string().nullable().optional(),
    origin: z.string().nullable().optional(),
    seats: z.number().nullable().optional(),
    doors: z.number().nullable().optional(),
    brand: z.string().nonempty('Vui lòng chọn hãng xe'),
    // address: z.string().nullable().optional(),
    partType: z.enum(
      [
        'ENGINE',
        'TRANSMISSION',
        'BRAKE_SYSTEM',
        'SUSPENSION',
        'ELECTRICAL',
        'COOLING_SYSTEM',
        'FUEL_SYSTEM',
        'EXHAUST_SYSTEM',
        'BODY_PARTS',
        'INTERIOR',
        'EXTERIOR',
        'TIRES_WHEELS',
        'LIGHTING',
        'FILTERS',
        'BELTS',
        'BATTERIES',
        'STEERING',
        'AIR_CONDITIONING',
        'SAFETY',
        'OTHERS'
      ],
      { message: 'Loại phụ tùng không hợp lệ.' }
    )
  });

  const defaultValues = initialData || {
    name: '',
    description: '',
    price: 0,
    originPrice: 0,
    category: 'CAR',
    model: '',
    year: null,
    status: 'AVAILABLE',
    listImage: [],
    style: null,
    engine_capacity: null,
    fuel_type: null,
    transmission: null,
    mileage: null,
    exterior_color: null,
    interior_color: null,
    origin: null,
    seats: null,
    doors: null,
    brand: '',
    // address: '',
    partType: 'OTHERS'
  };
  defaultValues.price = parseInt(defaultValues.price.toString());
  defaultValues.originPrice = parseInt(
    defaultValues.originPrice?.toString() || '0'
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await BrandService.getAll<ServiceResponse>();
        setBrands(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchBrands();
  }, []);

  const updateData = async (values: any) => {
    if (id) {
      const result = await ProductService.updateById<ServiceResponse>(
        id,
        values
      );
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success('Cập nhật phụ tùng thành công');
      router.push('/product/part');
    } else {
      toast.error('Không tìm thấy thông tin phụ tùng');
    }
  };

  const insertData = async (values: any) => {
    const result = await ProductService.post<ServiceResponse>('', values);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success('Thêm phụ tùng thành công');
    router.push('/product/part');
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    values.category = ProductCategory.PART; // Đặt category cố định là PART
    const data = JSON.parse(JSON.stringify(values)); // Sao chép giá trị

    // Xử lý brandInfo cho nhiều brand

    if (data.brand) {
      var brandData = data.brand.split(';');
      data.brandInfo = {
        connect: brandData.map((brandId: string) => ({ id: parseInt(brandId) }))
      };
      delete data.brand;
    }

    // Nếu là chế độ Update, xử lý disconnect các brand cũ
    if (modeForm === ModeForm.Update) {
      if (initialData?.brand) {
        var oldBrands = initialData.brand.split(';');
        const initialBrandIds = oldBrands.map((brand: string) =>
          parseInt(brand)
        );
        const currentBrandIds = data.brandInfo.connect.map(
          (item: { id: number }) => item.id
        );

        const brandsToDisconnect = initialBrandIds.filter(
          (id: number) => !currentBrandIds.includes(id)
        );

        if (brandsToDisconnect.length > 0) {
          data.brandInfo.disconnect = brandsToDisconnect.map((id: number) => ({
            id
          }));
        }
      }

      updateData(data); // Gọi hàm update
    } else {
      insertData(data); // Gọi hàm insert
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {/* Name */}
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên phụ tùng</FormLabel>
                    <FormControl>
                      <Input placeholder='Nhập tên phụ tùng' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Input placeholder='Nhập mô tả phụ tùng' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Nhập giá phụ tùng'
                        value={parseInt(field.value?.toString() || '0') || 0}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? null : Number(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='originPrice'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá nhập</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Nhập giá nhập sản phẩm'
                        value={parseInt(field.value?.toString() || '0') || 0}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? null : Number(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              {/* <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Chọn trạng thái' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='AVAILABLE'>Có sẵn</SelectItem>
                        <SelectItem value='SOLD'>Đã bán</SelectItem>
                        <SelectItem value='OUT_OF_STOCK'>Hết hàng</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* Part Type */}
              <FormField
                control={form.control}
                name='partType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại phụ tùng</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Chọn loại phụ tùng' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='ENGINE'>Động cơ</SelectItem>
                        <SelectItem value='TRANSMISSION'>Hộp số</SelectItem>
                        <SelectItem value='BRAKE_SYSTEM'>
                          Hệ thống phanh
                        </SelectItem>
                        <SelectItem value='SUSPENSION'>
                          Hệ thống treo
                        </SelectItem>
                        <SelectItem value='ELECTRICAL'>
                          Hệ thống điện
                        </SelectItem>
                        <SelectItem value='COOLING_SYSTEM'>
                          Hệ thống làm mát
                        </SelectItem>
                        <SelectItem value='FUEL_SYSTEM'>
                          Hệ thống nhiên liệu
                        </SelectItem>
                        <SelectItem value='EXHAUST_SYSTEM'>
                          Hệ thống xả
                        </SelectItem>
                        <SelectItem value='BODY_PARTS'>Phần thân xe</SelectItem>
                        <SelectItem value='INTERIOR'>Nội thất</SelectItem>
                        <SelectItem value='EXTERIOR'>Ngoại thất</SelectItem>
                        <SelectItem value='TIRES_WHEELS'>
                          Lốp và bánh xe
                        </SelectItem>
                        <SelectItem value='LIGHTING'>
                          Hệ thống chiếu sáng
                        </SelectItem>
                        <SelectItem value='FILTERS'>Lọc</SelectItem>
                        <SelectItem value='BELTS'>Dây đai</SelectItem>
                        <SelectItem value='BATTERIES'>Ắc quy</SelectItem>
                        <SelectItem value='STEERING'>Hệ thống lái</SelectItem>
                        <SelectItem value='AIR_CONDITIONING'>
                          Hệ thống điều hòa
                        </SelectItem>
                        <SelectItem value='SAFETY'>An toàn</SelectItem>
                        <SelectItem value='OTHERS'>Khác</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Category */}
              <FormField
                control={form.control}
                name='brand'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hãng xe</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={brands.map((brand) => ({
                          value: brand.id.toString(),
                          label: brand.name || 'Unknown'
                        }))}
                        value={field.value ? field.value.split(';') : []} // Chuyển chuỗi thành mảng
                        onChange={(selectedValues) =>
                          field.onChange(selectedValues.join(';'))
                        }
                        placeholder='Chọn hãng xe'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Images */}
              <FormField
                control={form.control}
                name='listImage'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hình ảnh</FormLabel>
                    <FormControl>
                      <>
                        <MultiImageUploader
                          value={field.value}
                          onValueChange={(urls) => field.onChange(urls)}
                          maxSize={5 * 1024 * 1024} // 5MB
                        />
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.push('/product/part')}
              >
                Hủy
              </Button>
              <Button type='submit'>
                {modeForm === ModeForm.Update ? 'Cập nhật' : 'Thêm'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
