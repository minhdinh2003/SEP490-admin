'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { useAuthStore } from '@/store/use-auth-store';
import { useRouter } from 'next/navigation';
const formSchema = z.object({
  email: z.string().email({ message: 'Nhập địa chỉ email' }),
  password: z.string().min(1, 'Mật khẩu phải có ít nhất 8 ký tự')
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl');
  const [loading, startTransition] = useTransition();
  const defaultValues = {
    email: ''
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    const { logIn, fullName, userId } = useAuthStore.getState();
    var result = await logIn({
      email: data.email,
      password: data.password
    });
    if (result.success) {
      toast.success('Đăng nhập thành công');
<<<<<<< HEAD
      router.push('/dashboard/overview');
=======
      console.log('result', result.data.role);
      if (result.data.role === 'ADMIN') {
        router.push('/user');
      } else if (result.data.role === 'OWNER') {
        router.push('/dashboard/overview');
      } else {
        router.push('/'); // fallback nếu không phải ADMIN hoặc OWNER
      }
>>>>>>> b695a40 (Refactor and clean up code across multiple files)
    } else {
      toast.error('Đăng nhập thất bại');
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full space-y-2'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='Nhập email...'
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Nhập mật khẩu'
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} className='ml-auto w-full' type='submit'>
            Đăng nhập
          </Button>
        </form>
      </Form>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'></div>
      </div>
    </>
  );
}
