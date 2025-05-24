'use client';
import { Inventory, Product } from '@/models/base.model';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const createColumns = (
  handleAction: (type: string, data: any) => Promise<any>
): ColumnDef<Product>[] => [
  {
    accessorKey: 'name',
    header: () => <div style={{ fontWeight: 'bold' }}>Tên sản phẩm</div>
  },
  // {
  //   accessorKey: 'category',
  //   header: () => (
  //     <div style={{ fontWeight: 'bold' }}>
  //       Loại
  //     </div>
  //   ),
  //   cell: ({ row }) => {
  //     const category = row.getValue('category') as string;
  //     return <span>{category === 'CAR' ? 'Xe' : 'Phụ tùng'}</span>;
  //   },
  // },
  {
    accessorKey: 'price',
    header: () => <div style={{ fontWeight: 'bold' }}>Giá</div>,
    cell: ({ row }) => {
      const price = row.getValue('price') as number;
      return (
        <span>
          {price.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
          })}
        </span>
      );
    }
  },
  {
    accessorKey: 'originPrice',
    header: () => <div style={{ fontWeight: 'bold' }}>Giá nhập</div>,
    cell: ({ row }) => {
      const price = (row.getValue('originPrice') || 0) as number;
      return (
        <span>
          {price.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
          })}
        </span>
      );
    }
  },
  {
    accessorKey: 'quantity',
    header: () => <div style={{ fontWeight: 'bold' }}>Số lượng tồn kho</div>,
    cell: ({ row }) => {
      return <span>{row?.original?.inventory?.quantity || 0}</span>;
    }
  },
  // {
  //   accessorKey: 'status',
  //   header: () => <div style={{ fontWeight: 'bold' }}>Trạng thái</div>,
  //   cell: ({ row }) => {
  //     const status = row.getValue('status') as string;
  //     let statusText = '';
  //     let statusColor = '';

  //     switch (status) {
  //       case 'AVAILABLE':
  //         statusText = 'Có sẵn';
  //         statusColor = 'text-green-500';
  //         break;
  //       case 'SOLD':
  //         statusText = 'Đã bán';
  //         statusColor = 'text-red-500';
  //         break;
  //       case 'OUT_OF_STOCK':
  //         statusText = 'Hết hàng';
  //         statusColor = 'text-gray-500';
  //         break;
  //       default:
  //         statusText = 'Không xác định';
  //         statusColor = 'text-black';
  //     }

  //     return <span className={statusColor}>{statusText}</span>;
  //   }
  // },
  // {
  //   accessorKey: 'model',
  //   header: () => <div style={{ fontWeight: 'bold' }}>Mẫu xe</div>,
  //   cell: ({ row }) => {
  //     const model = row.getValue('model') as string | null;
  //     return model || 'Chưa cập nhật';
  //   }
  // },
  {
    accessorKey: 'brandName',
    header: () => <div style={{ fontWeight: 'bold' }}>Hãng xe</div>,
    cell: ({ row }) => {
      var brands = row?.original?.brands;
      if (brands && brands.length > 0) {
        return <span>{brands[0].name}</span>;
      } else {
        return <span>{''}</span>;
      }
    }
  },
  {
    accessorKey: 'year',
    header: () => <div style={{ fontWeight: 'bold' }}>Năm sản xuất</div>,
    cell: ({ row }) => {
      const year = row.getValue('year') as number | null;
      return year?.toString() || 'Chưa cập nhật';
    }
  },

  {
    id: 'actions',
    header: () => <div style={{ fontWeight: 'bold' }}>Thao tác</div>,
    cell: ({ row }) => <CellAction data={row.original} handle={handleAction} />
  }
];
