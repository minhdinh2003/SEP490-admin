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

import { TaskTemplate, User } from '@/models/base.model';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ServiceResponse } from 'types/service.response';
import { useRouter } from 'next/navigation';
import { ModeForm } from '@/enum/mode.type';
import taskTemplateService from '@/services/taskTemplateService';
export default function TaskTemplateForm({
  pageTitle,
  initialData,
  modeForm,
  id
}: {
  pageTitle: string;
  initialData: TaskTemplate | null;
  modeForm: ModeForm;
  id: number | null;
}) {
  const router = useRouter();

  const formSchema = z.object({
    title: z
      .string()
      .min(1, { message: 'Name must be at least 1 characters.' }),
    priority: z.number()
  });

  const defaultValues = initialData || {
    title: '',
    priority: 10
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });
  const updateData = async (values: z.infer<typeof formSchema>) => {
    if (id) {
      var result = await taskTemplateService.updateById<ServiceResponse>(
        id,
        values
      );
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success('Cập nhật danh mục task thành công');
      router.push('/task-template');
    } else {
      toast.success('Không tìm thấy thông tin danh mục task');
    }
  };

  const insertData = async (values: z.infer<typeof formSchema>) => {
    var result = await taskTemplateService.post<ServiceResponse>('', values);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success('Thêm danh mục task thành công');
    router.push('/task-template');
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
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {/* Full Name */}
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
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {/* Full Name */}
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

            <div className='flex justify-end'>
              <Button type='submit'>
                {modeForm == ModeForm.Update ? 'Cập nhập' : 'Thêm'}
              </Button>
              <Button
                className='border-1 ml-2 border-primary'
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
