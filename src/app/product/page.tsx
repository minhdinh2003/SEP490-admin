'use client';
import { useAuthStore } from '@/store/use-auth-store';
import { redirect } from 'next/navigation';

export default async function Product() {
  const { fullName, userId, authenticated } = useAuthStore.getState();

  if (!authenticated) {
    return redirect('/');
  } else {
    redirect('/dashboard/overview');
  }
}
