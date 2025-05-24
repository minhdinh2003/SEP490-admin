'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { ModeForm } from '@/enum/mode.type';
import taskTemplateService from '@/services/taskTemplateService';
import { ServiceResponse } from 'types/service.response';

// Định dạng tiền tệ
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
};

// Schema validation cho form
const formSchema = z.object({
  title: z.string().min(1, { message: 'Tên không được để trống.' }),
  priority: z.number(),
  price: z
    .number()
    .nonnegative({ message: 'Chi phí phải lớn hơn hoặc bằng 0.' }) // Thêm trường price
});

// Giá trị mặc định cho form
const defaultValues = {
  title: '',
  priority: 10,
  price: 0, // Thêm giá trị mặc định cho price
  taskItems: [] as { title: string; isDone: boolean }[]
};

export default function TaskTemplateForm({
  pageTitle,
  initialData,
  modeForm,
  id
}: {
  pageTitle: string;
  initialData: any | null;
  modeForm: ModeForm;
  id: number | null;
}) {
  const router = useRouter();

  // Khởi tạo form với react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || defaultValues
  });

  // State quản lý danh sách đầu việc
  const [taskItems, setTaskItems] = useState<
    { title: string; isDone: boolean }[]
  >(initialData?.items || []);

  // Thêm một đầu việc mới
  const handleAddTaskItem = () => {
    setTaskItems((prev) => [...prev, { title: '', isDone: false }]);
  };

  // Cập nhật tiêu đề của một đầu việc
  const handleUpdateTaskItem = (index: number, value: string) => {
    setTaskItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, title: value } : item))
    );
  };

  // Xóa một đầu việc
  const handleRemoveTaskItem = (index: number) => {
    setTaskItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Xử lý submit form
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const updatedValues = {
        ...values,
        items: taskItems // Bao gồm danh sách đầu việc trong payload
      };

      let result;

      if (modeForm === ModeForm.Update && id) {
        // Cập nhật task template
        result = await taskTemplateService.put<ServiceResponse>(
          `/${id}`,
          updatedValues
        );
      } else {
        // Tạo mới task template
        result = await taskTemplateService.post<ServiceResponse>(
          ``,
          updatedValues
        );
      }

      if (!result.success) {
        toast.error(result.message || 'Có lỗi xảy ra.');
        return;
      }

      toast.success(
        modeForm === ModeForm.Update
          ? 'Cập nhật danh mục task thành công'
          : 'Thêm danh mục task thành công'
      );
      router.push('/task-template');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Có lỗi xảy ra khi gửi dữ liệu.');
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
            {/* Trường Title */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên</FormLabel>
                    <FormControl>
                      <Input placeholder='Nhập tên' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Trường Priority */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='priority'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thứ tự hiển thị</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Nhập thứ tự hiển thị'
                        {...field}
                        min={0}
                        value={parseInt(field.value?.toString() || '0') || 0}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? 0 : Number(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Trường Price */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chi phí task</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='Nhập chi phí task'
                        value={
                          field.value === 0 ? '' : formatCurrency(field.value)
                        } // Format tiền tệ
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(
                            /[^0-9]/g,
                            ''
                          ); // Loại bỏ ký tự không phải số
                          const numericValue = rawValue
                            ? parseInt(rawValue, 10)
                            : 0;
                          field.onChange(numericValue); // Lưu giá trị số
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Danh sách đầu việc */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Danh sách đầu việc</h3>
              {taskItems.map((item, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <Input
                    type='text'
                    placeholder='Nhập tiêu đề đầu việc'
                    value={item.title}
                    onChange={(e) =>
                      handleUpdateTaskItem(index, e.target.value)
                    }
                    className='flex-1'
                  />
                  <button
                    type='button'
                    onClick={() => handleRemoveTaskItem(index)}
                    className='text-red-500 hover:text-red-700'
                  >
                    <TrashIcon className='h-5 w-5' />
                  </button>
                </div>
              ))}
              <Button
                type='button'
                variant='outline'
                onClick={handleAddTaskItem}
                className='w-full justify-start'
              >
                <PlusIcon className='mr-2 h-4 w-4' /> Thêm đầu việc
              </Button>
            </div>

            {/* Nút hành động */}
            <div className='flex justify-end gap-2'>
              <Button type='submit'>
                {modeForm === 'Update' ? 'Cập nhật' : 'Thêm'}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.push('/task-template')}
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
