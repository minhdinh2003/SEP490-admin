'use client';
import { Brand } from '@/models/base.model';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import Image from 'next/image';
export const createColumns = (
  handleAction: (type: string, data: any) => Promise<any>
): ColumnDef<Brand>[] => [
  {
    accessorKey: 'logoURL',
    cell: ({ row }) => {
      const logoURL = row.getValue('logoURL');

      return (
        <div className='relative h-10 w-10'>
          {logoURL ? (
            <Image
              src={row.getValue('logoURL')}
              alt={row.getValue('name')}
              fill
              className='rounded-lg object-cover'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center rounded-lg bg-gray-200'>
              <span className='text-xs text-gray-500'>No Logo</span>
            </div>
          )}
        </div>
      );
    },
    header: () => <div style={{ fontWeight: 'bold' }}>Logo</div>
  },
  {
    accessorKey: 'name',
    header: () => <div style={{ fontWeight: 'bold' }}>Tên thương hiệu</div>
  },
  {
    accessorKey: 'description',
    header: () => <div style={{ fontWeight: 'bold' }}>Mô tả</div>
  },
  {
    id: 'actions',
    header: () => <div style={{ fontWeight: 'bold' }}>Thao tác</div>,
    cell: ({ row }) => <CellAction data={row.original} handle={handleAction} />
  }
];
