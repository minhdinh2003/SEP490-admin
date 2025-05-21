'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AvatarUploader } from '@/components/ui/avatar-upload';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Brand } from '@/models/base.model';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import BrandService from '@/services/branchService';
import { ServiceResponse } from 'types/service.response';
import { useRouter } from 'next/navigation';
import { ModeForm } from '@/enum/mode.type';
export default function BrandForm({
  pageTitle,
  initialData,
  modeForm,
  id
}: {
  pageTitle: string;
  initialData: Brand | null;
  modeForm: ModeForm;
  id: number | null;
}) {
  const router = useRouter();
  const formSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }), // Yêu cầu string
    description: z.string().optional(), // Optional (string | undefined)
    logoURL: z.any().optional() // Optional (any | undefined)
  });

  const defaultValues = initialData || {
    name: '', // Không được là null
    description: '', // Chuỗi rỗng
    logoURL: '' // Chuỗi rỗng
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });
  const updateData = async (values: z.infer<typeof formSchema>) => {
    if (id) {
      var result = await BrandService.updateById<ServiceResponse>(id, values);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success('Cập nhật người dùng thành công');
      router.push('/product/brand');
    } else {
      toast.success('Không tìm thấy thông tin người dùng');
    }
  };

  const insertData = async (values: z.infer<typeof formSchema>) => {
    var result = await BrandService.post<ServiceResponse>('', values);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success('Thêm người dùng thành công');
    router.push('/product/brand');
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (modeForm == ModeForm.Update) {
      updateData(values);
    } else {
      insertData(values);
    }
  };

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Profile Picture */}
            <FormField
              control={form.control}
              name='logoURL'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <AvatarUploader
                      value={field.value} // Giá trị hiện tại
                      onValueChange={(url: string | null) => {
                        field.onChange(url);
                      }}
                      maxSize={5 * 1024 * 1024} // 5MB
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Full Name */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên hãng</FormLabel>
                  <FormControl>
                    <Input placeholder='Nhập tên hãng' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Nhập mô tả' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end'>
              <Button type='submit'>
                {modeForm == ModeForm.Update ? 'Cập nhập' : 'Thêm'}
              </Button>
              <Button
                className='border-1 ml-2 border-primary'
                type='button'
                variant='outline'
                onClick={() => router.push('/product/brand')}
              >
                Hủy
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
