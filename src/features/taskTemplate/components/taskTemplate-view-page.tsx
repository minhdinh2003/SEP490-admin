'use client';
import { useEffect, useState } from 'react';
import { TaskTemplate } from '@/models/base.model';
import { ServiceResponse } from 'types/service.response';
import { notFound } from 'next/navigation';
import { ModeForm } from '@/enum/mode.type';
import taskTemplateService from '@/services/taskTemplateService';
import TaskTemplateForm from './taskTemplate-form';

type TTaskTemplateViewPageProps = {
  id: string;
};

export default function TaskTemplateViewPage({ id }: TTaskTemplateViewPageProps) {
  const [taskTemplate, setTaskTemplate] = useState<TaskTemplate | null>(null);
  const [pageTitle, setPageTitle] = useState<string>('Thêm danh mục task');
  const [loading, setLoading] = useState<boolean>(true);
  const [modeForm, setModeForm] = useState<ModeForm>(ModeForm.Add);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (id !== 'new') {
          const result = await taskTemplateService.getById<ServiceResponse>(
            Number(id)
          );
          if (!result || !result.data) {
            notFound();
          }
          setTaskTemplate(result.data as TaskTemplate);
          
          setPageTitle('Cập nhật danh mục task');
          setModeForm(ModeForm.Update);
        }
      } catch (error) {
        console.error('Error fetching task data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <TaskTemplateForm
      id={Number(id || -1)}
      modeForm={modeForm}
      initialData={taskTemplate}
      pageTitle={pageTitle}
    />
  );
}
