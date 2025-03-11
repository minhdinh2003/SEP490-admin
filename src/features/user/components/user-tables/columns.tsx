'use client';
import { User } from '@/models/base.model';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const createColumns = (
  handleAction: (type: string, data: any) => Promise<any>
): ColumnDef<User>[] => [
  {
    accessorKey: 'fullName',
    header: () => <div style={{ fontWeight: 'bold' }}>Họ và tên</div>
  },
  {
    accessorKey: 'email',
    header: () => <div style={{ fontWeight: 'bold' }}>Email</div>
  },
  {
    accessorKey: 'role',
    header: () => <div style={{ fontWeight: 'bold' }}>Vai trò</div>,
    cell: ({ row }) => {
      const role = row.getValue('role') as string;
      return <span>{role.toUpperCase()}</span>;
    }
  },
  {
    accessorKey: 'gender',
    header: () => <div style={{ fontWeight: 'bold' }}>Giới tính</div>,
    cell: ({ row }) => {
      const gender = row.getValue('gender') as string;
      return (
        <span>
          {gender === 'MALE' ? 'Nam' : gender === 'FEMALE' ? 'Nữ' : 'Khác'}
        </span>
      );
    }
  },
  {
    accessorKey: 'dateOfBirth',
    header: () => <div style={{ fontWeight: 'bold' }}>Ngày sinh</div>,
    cell: ({ row }) => {
      const dateOfBirth = row.getValue('dateOfBirth') as Date | null;
      return dateOfBirth
        ? new Date(dateOfBirth).toLocaleDateString()
        : 'Chưa cập nhật';
    }
  },
  {
    accessorKey: 'phoneNumber',
    header: () => <div style={{ fontWeight: 'bold' }}>Số điện thoại</div>,
    cell: ({ row }) => {
      const phoneNumber = row.getValue('phoneNumber') as string | null;
      return phoneNumber || 'Chưa cập nhật';
    }
  },
  {
    accessorKey: 'addressLine1',
    header: () => <div style={{ fontWeight: 'bold' }}>Địa chỉ</div>,
    cell: ({ row }) => {
      const addressLine1 = row.getValue('addressLine1') as string | null;
      const city = row.getValue('city') as string | null;
      const country = row.getValue('country') as string | null;

      return (
        <div>
          {addressLine1 && <p>{addressLine1}</p>}
          {city && <p>{city}</p>}
          {country && <p>{country}</p>}
        </div>
      );
    }
  },
  {
    id: 'actions',
    header: () => <div style={{ fontWeight: 'bold' }}>Thao tác</div>,
    cell: ({ row }) => <CellAction data={row.original} handle={handleAction} />
  }
];
