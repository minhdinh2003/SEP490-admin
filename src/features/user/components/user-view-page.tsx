'use client';
import { useEffect, useState } from 'react';
import { User } from '@/models/base.model';
import UserForm from './user-form';
import UserService from '@/services/userService';
import { ServiceResponse } from 'types/service.response';
import { notFound } from 'next/navigation';
import { ModeForm } from '@/enum/mode.type';

type TUserViewPageProps = {
  userId: string;
};

export default function UserViewPage({ userId }: TUserViewPageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [pageTitle, setPageTitle] = useState<string>('Thêm người dùng');
  const [loading, setLoading] = useState<boolean>(true);
  const [modeForm, setModeForm] = useState<ModeForm>(ModeForm.Add);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (userId !== 'new') {
          const result = await UserService.getById<ServiceResponse>(
            Number(userId)
          );
          if (!result || !result.data) {
            notFound();
          }
          setUser(result.data as User);
          setPageTitle('Cập nhật người dùng');
          setModeForm(ModeForm.Update);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <UserForm
      id={Number(userId || -1)}
      modeForm={modeForm}
      initialData={user}
      pageTitle={pageTitle}
    />
  );
}
