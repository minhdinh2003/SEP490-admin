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
import { Product } from '@/models/base.model';
import { Edit, MoreHorizontal, Plus, Trash, View } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ActionType } from '@/enum/action-type';
import { Input } from '@/components/ui/input';
import { ServiceResponse } from 'types/service.response';
import { toast } from 'sonner';
import productService from '@/services/productService';
import { IPagingParam } from '@/constants/paging';
import inventoryHistoryService from '@/services/inventoryHistoryService';
import { ModalV2 } from '@/components/ui/modalV2';

interface CellActionProps {
  data: Product;
  handle?: any;
}

export const CellAction: React.FC<CellActionProps> = ({ data, handle }) => {
  const [loading, setLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openInventoryModal, setOpenInventoryModal] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false); // Modal lịch sử nhập kho
  const [inventoryHistory, setInventoryHistory] = useState<any[]>([]); // Dữ liệu lịch sử nhập kho

  const router = useRouter();

  // Xác nhận xóa phụ tùng
  const onConfirmDelete = async () => {
    setOpenDeleteModal(false);
    setLoading(true);
    handle(ActionType.DELETE, { id: data.id });
  };

  // Lưu cập nhật số lượng kho
  const onSaveInventory = async () => {
    if (additionalQuantity === null || purchasePrice === null) {
      toast.error('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    setLoading(true);
    try {
      const response = await productService.post<ServiceResponse>('/addStock', {
        productId: Number(data.id),
        quantity: Number(additionalQuantity),
        price: Number(purchasePrice)
      });
      if (!response.success) {
        throw new Error('Không thể cập nhật số lượng kho.');
      }
      toast.success('Cập nhật số lượng kho thành công!');
      setOpenInventoryModal(false);
      handle(ActionType.UPDATE, {});
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi cập nhật số lượng kho.');
    } finally {
      setLoading(false);
    }
  };

  const getParamPaging = (): IPagingParam => {
    const param: IPagingParam = {
      pageSize: 1000,
      pageNumber: 1,
      conditions: [
        {
          key: 'productId',
          condition: 'equal',
          value: data.id
        }
      ],
      searchKey: '',
      searchFields: []
    };
    return param;
  };

  // Fetch lịch sử nhập kho
  const fetchInventoryHistory = async () => {
    setLoading(true);
    try {
      const response = await inventoryHistoryService.getPaging<ServiceResponse>(
        getParamPaging()
      );
      setInventoryHistory(response?.data?.data || []);
    } catch (error) {
      console.error('Error fetching inventory history:', error);
      toast.error('Có lỗi xảy ra khi tải lịch sử nhập kho.');
    } finally {
      setLoading(false);
    }
  };

  const [additionalQuantity, setAdditionalQuantity] = useState<number | null>(
    null
  );
  const [purchasePrice, setPurchasePrice] = useState<number | null>(null);

  return (
    <>
      {/* Modal xác nhận xóa */}
      <AlertModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={onConfirmDelete}
        loading={loading}
        buttonTextCancel='Hủy'
        buttonTextConfirm='Tiếp tục'
        title='Xóa phụ tùng'
        content={`Bạn có chắc muốn xóa phụ tùng ${data.name} không?`}
      />

      {/* Modal cập nhật kho */}
      <AlertModal
        isOpen={openInventoryModal}
        onClose={() => setOpenInventoryModal(false)}
        onConfirm={onSaveInventory}
        loading={loading}
        buttonTextCancel='Hủy'
        buttonTextConfirm='Lưu'
        title='Nhập kho'
        content={
          <div className='space-y-4'>
            <p>
              Số lượng kho hiện tại:{' '}
              <strong>{data.inventory?.quantity || 0}</strong>
            </p>

            <div className='flex items-center space-x-2'>
              <label
                htmlFor='additionalQuantity'
                className='text-sm font-medium'
              >
                Số lượng thêm:
              </label>
              <div className='flex items-center overflow-hidden rounded-md border'>
                <button
                  type='button'
                  className='bg-gray-100 px-2 py-1 transition-colors hover:bg-gray-200'
                  onClick={() =>
                    setAdditionalQuantity((prev) =>
                      prev ? Math.max(prev - 1, 0) : 0
                    )
                  }
                  disabled={loading}
                >
                  -
                </button>
                <Input
                  id='additionalQuantity'
                  type='number'
                  className='w-20 border-none text-center focus:ring-0'
                  placeholder='Nhập số lượng'
                  value={additionalQuantity || ''}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setAdditionalQuantity(value < 0 ? 0 : value);
                  }}
                  min={0}
                />
                <button
                  type='button'
                  className='bg-gray-100 px-2 py-1 transition-colors hover:bg-gray-200'
                  onClick={() =>
                    setAdditionalQuantity((prev) => (prev || 0) + 1)
                  }
                  disabled={loading}
                >
                  +
                </button>
              </div>
            </div>

            <div className='flex items-center space-x-2'>
              <label htmlFor='purchasePrice' className='text-sm font-medium'>
                Giá nhập:
              </label>
              <Input
                id='purchasePrice'
                type='number'
                className='w-32 rounded-md border px-2 py-1'
                placeholder='Nhập giá nhập'
                value={purchasePrice || ''}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setPurchasePrice(value < 0 ? 0 : value);
                }}
                min={0}
              />
              <span className='text-sm text-gray-500'>VNĐ</span>
            </div>

            {(!additionalQuantity || !purchasePrice) && (
              <p className='text-sm text-red-500'>
                Vui lòng nhập đầy đủ số lượng và giá nhập.
              </p>
            )}
          </div>
        }
      />

      {/* Modal lịch sử nhập kho - chỉ hiển thị nút ĐÓNG */}
      <ModalV2
        size='lg'
        isOpen={openHistoryModal}
        onClose={() => setOpenHistoryModal(false)}
        title='Lịch sử nhập kho'
      >
        {' '}
        <div className='max-h-[400px] overflow-y-auto'>
          {inventoryHistory.length > 0 ? (
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                    Thời gian
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                    Số lượng thay đổi
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                    Mô tả
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 bg-white'>
                {inventoryHistory.map((item, index) => (
                  <tr key={index}>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
                      {new Date(item.updatedAt).toLocaleString()}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
                      {item.quantityChange}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
                      {item.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className='text-sm text-gray-500'>Không có dữ liệu lịch sử.</p>
          )}
        </div>
      </ModalV2>

      {/* Dropdown menu */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Mở</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem
            onClick={() => router.push(`/product/part/${data.id}`)}
          >
            <Edit className='mr-2 h-4 w-4' /> Cập nhật thông tin
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenInventoryModal(true)}>
            <Plus className='mr-2 h-4 w-4' /> Cập nhật kho
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              await fetchInventoryHistory();
              setOpenHistoryModal(true);
            }}
          >
            <View className='mr-2 h-4 w-4' /> Lịch sử nhập kho
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDeleteModal(true)}>
            <Trash className='mr-2 h-4 w-4' /> Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
