'use client';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import BgLogo from './bg-logo';
import { useRouter } from 'next/navigation';
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
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email({ message: 'Nhập địa chỉ email' })
});

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};
type UserFormValue = z.infer<typeof formSchema>;

export default function ForgotPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [loading, startTransition] = useTransition();
  const defaultValues = {
    email: 'nguyenvana@gmail.com'
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    startTransition(() => {
      signIn('credentials', {
        email: data.email,
        callbackUrl: callbackUrl ?? '/dashboard'
      });
      toast.success('Signed In Successfully!');
    });
  };
  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <BgLogo />
      <div className='flex h-full items-center p-4 lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Quên mật khẩu
            </h1>
            <p className='text-sm text-muted-foreground'>
              Nhập email của bạn dưới đây để lấy lại mật khẩu
            </p>
          </div>
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
              <Button
                disabled={loading}
                className='ml-auto w-full'
                type='submit'
              >
                Lấy mã OTP
              </Button>
            </form>
          </Form>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'></div>
          </div>
          <div className='cursor flex justify-between'>
            <div
              className='inline-flex items-center justify-center text-blue-500  hover:cursor-pointer hover:underline'
              onClick={() => router.push('signin')}
            >
              Quay lại đăng nhập
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
