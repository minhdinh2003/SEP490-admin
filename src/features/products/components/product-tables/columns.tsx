'use client';
import { Product } from '@/models/base.model';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'ImageURL',
    header: 'Logo',
    cell: ({ row }) => {
      return (
        <div className='relative aspect-square'>
          <Image
            src={row.getValue('photo_url')}
            alt={row.getValue('name')}
            fill
            className='rounded-lg'
          />
        </div>
      );
    }
  },
  {
    accessorKey: 'CategoryName',
    header: 'Hãng xe'
  },
  {
    accessorKey: 'Description',
    header: 'Mô tả'
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
