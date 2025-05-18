import React, { useEffect } from 'react';
import { Separator } from '../ui/separator';
import { UserNav } from './user-nav';
import ThemeToggle from './ThemeToggle/theme-toggle';
import { useAuthStore } from '@/store/use-auth-store';
import Image from 'next/image';

export default async function HeaderView() {
  const { userId } = useAuthStore.getState();
    useEffect(() => {
    
    if (process.env.NODE_ENV !== 'development') return;

    const interval = setInterval(() => {
      document.querySelector('body > nextjs-portal')?.remove();
    }, 10);

    return () => clearInterval(interval); // Cleanup
  }, []);
  return (
    <header className='sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-2 bg-white transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
      <div className='flex items-center gap-2 px-4'>
        <Image
          src='/anycar.png'
          alt='Logo'
          width={100}
          height={30}
          className='mr-4'
        />
        {/* <SidebarTrigger className='-ml-1' /> */}
        <Separator orientation='vertical' className='mr-2 h-4' />
        {/* <Breadcrumbs /> */}
      </div>
      <div className='flex items-center gap-2 px-4'>
        {userId ? <UserNav /> : null}

        <ThemeToggle />
      </div>
    </header>
  );
}
