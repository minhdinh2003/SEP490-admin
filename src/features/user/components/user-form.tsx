'use client';
import { format, parse } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { User } from '@/models/base.model';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import UserService from '@/services/userService';
import { ServiceResponse } from 'types/service.response';
import { useRouter } from 'next/navigation';
import { ModeForm } from '@/enum/mode.type';
import Province from '@/components/ui/Province';
import { useEffect, useState } from 'react';
export default function UserForm({
  pageTitle,
  initialData,
  modeForm,
  id
}: {
  pageTitle: string;
  initialData: User | null;
  modeForm: ModeForm;
  id: number | null;
}) {
  const router = useRouter();
  const [province, setProvin] = useState({
    province: '',
    district: '',
    ward: ''
  });
  const formSchema = z.object({
    fullName: z
      .string()
      .min(2, { message: 'Full name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Invalid email address.' }),
    role: z.enum(['ADMIN', 'USER', 'OWNER', 'EMPLOYEE'], {
      message: 'Invalid role.'
    }),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER'], { message: 'Invalid gender.' }),
    dateOfBirth: z.date().nullable().optional(),
    phoneNumber: z.string().nullable().optional(),
    addressLine1: z.string().nullable().optional(),
    addressLine2: z.string().nullable().optional(),
    province: z.string().nullable().optional(),
    ward: z.string().nullable().optional(),
    district: z.string().nullable().optional(),
    profilePictureURL: z.any().optional()
  });
  if (initialData?.dateOfBirth) {
    initialData.dateOfBirth = new Date(initialData.dateOfBirth);
  }
  const defaultValues = initialData || {
    fullName: '',
    email: '',
    role: 'USER',
    gender: 'OTHER',
    dateOfBirth: null,
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    profilePictureURL: null
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });
  const updateData = async (values: z.infer<typeof formSchema>) => {
    if (id) {
      var result = await UserService.updateById<ServiceResponse>(id, values);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success('Cập nhật người dùng thành công');
      router.push('/user');
    } else {
      toast.success('Không tìm thấy thông tin người dùng');
    }
  };

  const insertData = async (values: z.infer<typeof formSchema>) => {
    var result = await UserService.post<ServiceResponse>('', values);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success('Thêm người dùng thành công');
    router.push('/user');
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    values.province = province.province;
    values.district = province.district;
    values.ward = province.district;
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
              name='profilePictureURL'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
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
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {/* Full Name */}
              <FormField
                control={form.control}
                name='fullName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder='Nhập họ và tên' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder='Nhập email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role */}
              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select role' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='ADMIN'>Admin</SelectItem>
                        <SelectItem value='USER'>User</SelectItem>
                        <SelectItem value='EMPLOYEE'>EMPLOYEE</SelectItem>
                        <SelectItem value='OWNER'>OWNER</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender */}
              <FormField
                control={form.control}
                name='gender'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select gender' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='MALE'>Male</SelectItem>
                        <SelectItem value='FEMALE'>Female</SelectItem>
                        <SelectItem value='OTHER'>Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date of Birth */}
              <FormField
                control={form.control}
                name='dateOfBirth'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        {...field}
                        value={
                          field.value ? format(field.value, 'yyyy-MM-dd') : ''
                        }
                        onChange={(e) => {
                          const dateValue = e.target.value;
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

              {/* Phone Number */}
              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập phone number'
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address Line 1 */}
              <FormField
                control={form.control}
                name='addressLine1'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập address line 1'
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address Line 2 */}
              <FormField
                control={form.control}
                name='addressLine2'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập address line 2'
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Province
              state={province}
              setStateData={setProvin}
              className='space-y-4' // Áp dụng cùng một hệ thống CSS với form
            />
            <div className='flex justify-end'>
              <Button type='submit'>
                {modeForm == ModeForm.Update ? 'Cập nhập' : 'Thêm'}
              </Button>
              <Button
                className='border-1 ml-2 border-primary'
                type='button'
                variant='outline'
                onClick={() => router.push('/user')}
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
