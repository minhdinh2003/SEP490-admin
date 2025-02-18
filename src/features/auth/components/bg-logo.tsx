import Image from 'next/image';

export default function BgLogo() {
  return (
    <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
      <div className='absolute inset-0 bg-zinc-900' />
      <div className='relative z-20 flex h-[calc(100%-30px)] items-center text-lg font-medium'>
        <Image
          src='/bgLogo.png'
          alt='ShopCar'
          fill
          className='rounded-lg object-cover'
        />
      </div>

      <div className='relative z-20 mt-auto'>
        <blockquote className='space-y-2'>
          <p className='text-lg'>
            &ldquo;ShopCar tự hào là một trong những công ty hàng đầu trong việc
            trao đổi và mua bán xe ô tô cũ, xe ô tô đã qua sử dụng.&rdquo;
          </p>
          <footer className='text-sm'>Team dev</footer>
        </blockquote>
      </div>
    </div>
  );
}
