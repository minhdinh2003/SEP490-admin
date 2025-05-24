import { ColumnDef } from '@tanstack/react-table';
import { TaskTemplate } from '@/models/base.model';
import { CellAction } from './cell-action';

type CellActionProps = {
  data: TaskTemplate;
  handle: (type: string, data: any) => Promise<any>;
};

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
    accessorKey: 'price',
    header: () => <div style={{ fontWeight: 'bold' }}>Chi phí</div>,
    cell: ({ row }) => {
      const price = row.original.price || 0; // Giá trị mặc định nếu không có chi phí
      return (
        <div>
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(price)}
        </div>
      );
    }
  },
  {
    accessorKey: 'priority',
    header: () => <div style={{ fontWeight: 'bold' }}>Thứ tự ưu tiên</div>
  },
  {
    accessorKey: 'items',
    header: () => <div style={{ fontWeight: 'bold' }}>Danh sách đầu việc</div>,
    cell: ({ row }) => {
      const items =
        (row.original.items as Array<{ title: string; isDone: boolean }>) || [];
      return (
        <div>
          {items && items.length > 0 ? (
            <ol>
              {items.map(
                (item: { title: string; isDone: boolean }, index: number) => (
                  <li key={index}>
                    <span>
                      {index + 1}. <b>{item.title}</b>
                    </span>
                    {item.isDone && (
                      <span style={{ color: 'green', marginLeft: '5px' }}>
                        ✓
                      </span>
                    )}
                  </li>
                )
              )}
            </ol>
          ) : (
            <span>Không có đầu việc</span>
          )}
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
