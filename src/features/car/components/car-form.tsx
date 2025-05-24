import { format, parse } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
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
      .min(2, { message: 'Tên sản phẩm phải có ít nhất 2 ký tự.' }),
    description: z.string().optional(),
    price: z
      .number({ invalid_type_error: 'Giá phải là số.' })
      .positive({ message: 'Giá phải lớn hơn 0.' }),
    originPrice: z
      .number({ invalid_type_error: 'Giá nhập phải là số.' })
      .positive({ message: 'Giá nhập phải lớn hơn 0.' }),
    category: z.enum(['CAR', 'PART'], {
      message: 'Loại sản phẩm không hợp lệ.'
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
    registrationExpiry: z.date().nullable().optional(), // Thời hạn đăng kiểm
    insuranceExpiry: z.date().nullable().optional(), // Thời hạn bảo hiểm
    originalPaintPercentage: z.number().nullable().optional(), // % Sơn zin
    accidentDetails: z.string().nullable().optional(), // Mức độ đâm đụng
    floodDamageDetails: z.string().nullable().optional(), // Ngập nước
    engineCondition: z.string().nullable().optional(), // Động cơ
    transmissionCondition: z.string().nullable().optional(), // Hộp số
    ownerCount: z
      .number({ invalid_type_error: ' Phải là số.' })
      .positive({ message: 'Số chủ sở hữu phải lớn hơn 0.' }),
  }).refine(
    (data) => data.originPrice < data.price,
    {
      message: 'Giá nhập phải thấp hơn giá bán',
      path: ['originPrice'],
    }
  );

  const defaultValues = initialData
    ? {
      ...initialData,
      registrationExpiry: initialData.registrationExpiry
        ? new Date(initialData.registrationExpiry)
        : null,
      insuranceExpiry: initialData.insuranceExpiry
        ? new Date(initialData.insuranceExpiry)
        : null,
      price: parseInt(initialData.price?.toString() || '0'),
      originPrice: parseInt(initialData.originPrice?.toString() || '0'),
    }
    : {
      name: '',
      description: '',
      price: 0,
      originPrice: 0,
      category: "CAR" as "CAR" | "PART",
      model: '',
      year: null,
      status: "AVAILABLE" as "AVAILABLE" | "SOLD" | "OUT_OF_STOCK",
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
      registrationExpiry: null,
      insuranceExpiry: null,
      originalPaintPercentage: null,
      accidentDetails: '',
      floodDamageDetails: null,
      engineCondition: null,
      transmissionCondition: null,
      ownerCount: 0
    };

  // XÓA 2 DÒNG NÀY (không cần nữa):
  // defaultValues.price = parseInt(defaultValues.price.toString());
  // defaultValues.originPrice = parseInt(
  //   defaultValues.originPrice?.toString() || '0'



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
      toast.success('Cập nhật sản phẩm thành công');
      router.push('/product/car');
    } else {
      toast.error('Không tìm thấy thông tin sản phẩm');
    }
  };
  const isBrand12 = form.watch('brand') === '12';
  const insertData = async (values: any) => {
    const result = await ProductService.post<ServiceResponse>('', values);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success('Thêm sản phẩm thành công');
    router.push('/product/car');
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    values.category = ProductCategory.CAR;
    var data = JSON.parse(JSON.stringify(values));
    if (data.brand) {
      data.brandInfo = {
        connect: [{ id: parseInt(data.brand) }]
      };
      delete data.brand;
    }
    if (modeForm === ModeForm.Update) {
      if (initialData?.brand && initialData.brand != data.brand) {
        data.brandInfo['disconnect'] = [{ id: parseInt(initialData?.brand) }];
      }

      updateData(data);
    } else {
      insertData(data);
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
                    <FormLabel>Tên sản phẩm</FormLabel>
                    <FormControl>
                      <Input placeholder='Nhập tên sản phẩm' {...field} />
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
                      <Input placeholder='Nhập mô tả sản phẩm' {...field} />
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
                    <FormLabel>Giá bán</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Nhập giá sản phẩm'
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

              {/* Category */}
              <FormField
                control={form.control}
                name='brand'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hãng xe</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Chọn hãng xe' />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.map((brand) => (
                            <SelectItem
                              key={brand.id}
                              value={brand.id.toString() || ''}
                            >
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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

              {/* Model */}
              <FormField
                control={form.control}
                name='model'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mẫu xe</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập mẫu xe'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Year */}
              <FormField
                control={form.control}
                name='year'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Năm sản xuất</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Nhập năm sản xuất'
                        value={field.value || ''}
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

              {/* Style */}
              <FormField
                control={form.control}
                name='style'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kiểu dáng</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập kiểu dáng'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              {/* Engine Capacity */}
              <FormField
                control={form.control}
                name='engine_capacity'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {isBrand12 ? 'Công suất động cơ' : 'Dung tích động cơ'}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          isBrand12
                            ? 'Nhập công suất động cơ'
                            : 'Nhập dung tích động cơ'
                        }
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fuel Type */}
              <FormField
                control={form.control}
                name='fuel_type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại nhiên liệu</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập loại nhiên liệu'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Transmission */}
              <FormField
                control={form.control}
                name='transmission'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hộp số</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập hộp số'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='transmissionCondition'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hộp số</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Mô tả tình trạng hộp số'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mileage */}
              <FormField
                control={form.control}
                name='mileage'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số km đã đi</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Nhập chỉ số đồng hồ'
                        value={field.value || ''}
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

              {/* Exterior Color */}
              <FormField
                control={form.control}
                name='exterior_color'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Màu xe</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập màu xe'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Interior Color */}
              <FormField
                control={form.control}
                name='interior_color'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Màu nội thất</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập màu nội thất'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Origin */}
              <FormField
                control={form.control}
                name='origin'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xuất xứ</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập xuất xứ'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Seats */}
              <FormField
                control={form.control}
                name='seats'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số chỗ ngồi</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Nhập số chỗ ngồi'
                        value={field.value || ''}
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

              {/* Doors */}
              <FormField
                control={form.control}
                name='doors'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số cửa</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Nhập số cửa'
                        value={field.value || ''}
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
              {/* Registration Expiry */}
              <FormField
                control={form.control}
                name='registrationExpiry'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời hạn đăng kiểm</FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        {...field}
                        value={
                          field.value ? format(field.value, 'yyyy-MM-dd') : ''
                        }
                        placeholder='Chọn thời hạn đăng kiểm'
                        onChange={(e) => {
                          const dateValue = e.target.value;
                          // Chỉ nhận giá trị hợp lệ, nếu không thì reset về ''
                          if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue) && dateValue !== '') {
                            field.onChange(null);
                            return;
                          }
                          field.onChange(
                            dateValue
                              ? parse(dateValue, 'yyyy-MM-dd', new Date())
                              : null
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Insurance Expiry */}
              <FormField
                control={form.control}
                name='insuranceExpiry'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời hạn bảo hiểm</FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        {...field}
                        value={
                          field.value ? format(field.value, 'yyyy-MM-dd') : ''
                        }
                        placeholder='Chọn thời hạn bảo hiểm'
                        onChange={(e) => {
                          const dateValue = e.target.value;
                          if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue) && dateValue !== '') {
                            field.onChange(null);
                            return;
                          }
                          field.onChange(
                            dateValue
                              ? parse(dateValue, 'yyyy-MM-dd', new Date())
                              : null
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Original Paint Percentage */}
              <FormField
                control={form.control}
                name='originalPaintPercentage'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>% Sơn zin</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Nhập % sơn zin'
                        {...field}
                        value={field.value || ''}
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

              {/* Accident Details */}
              <FormField
                control={form.control}
                name='accidentDetails'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mức độ đâm đụng</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Mô tả mức độ đâm đụng'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Flood Damage Details */}
              <FormField
                control={form.control}
                name='floodDamageDetails'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngập nước</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Mô tả tình trạng ngập nước'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Engine Condition */}
              <FormField
                control={form.control}
                name='engineCondition'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Động cơ</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Mô tả tình trạng động cơ'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='ownerCount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số chủ sở hữu</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Nhập số chủ sở hữu'
                        value={field.value || ''}
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

              {/* Transmission Condition */}

              {/* <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập địa chỉ'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

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
                        {/* {field.value && typeof field.value === 'string' && (
                    <ImageCarousel
                      images={field.value.split(';').filter(Boolean)} // Đảm bảo chỉ split chuỗi
                    />
                  )} */}
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
                onClick={() => router.push('/product/car')}
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