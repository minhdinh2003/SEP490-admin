'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { TaskTemplate } from '@/models/base.model';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ActionType } from '@/enum/action-type';

interface CellActionProps {
  data: TaskTemplate;
  handle?: any;
}

export const CellAction: React.FC<CellActionProps> = ({ data, handle }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    setOpen(false);
    setLoading(true);
    handle(ActionType.DELETE, { id: data.id });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        buttonTextCancel='Hủy'
        buttonTextConfirm='Tiếp tục'
        title='Xóa danh mục'
        content={`Bạn có chắc muốn xóa danh mục ${data.title} không?`}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Mở</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}

          <DropdownMenuItem onClick={() => router.push(`/task-template/${data.id}`)}>
            <Edit className='mr-2 h-4 w-4' /> Cập nhật
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className='mr-2 h-4 w-4' /> Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
