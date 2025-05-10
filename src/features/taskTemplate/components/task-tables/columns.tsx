'use client';
import { TaskTemplate } from '@/models/base.model';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const createColumns = (
  handleAction: (type: string, data: any) => Promise<any>
): ColumnDef<TaskTemplate>[] => [
  {
    accessorKey: 'id',
    header: () => <div style={{ fontWeight: 'bold' }}>ID</div>
  },
  {
    accessorKey: 'title',
    header: () => <div style={{ fontWeight: 'bold' }}>Tên</div>
  },
  {
    accessorKey: 'priority',
    header: () => <div style={{ fontWeight: 'bold' }}>Thứ tự ưu tiên</div>
  },
  {
    id: 'actions',
    header: () => <div style={{ fontWeight: 'bold' }}>Thao tác</div>,
    cell: ({ row }) => <CellAction data={row.original} handle={handleAction} />
  }
];
