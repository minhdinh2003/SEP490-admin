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
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ActionType } from '@/enum/action-type';
import { Input } from '@/components/ui/input';
import InventoryService from '@/services/inventoryService';
import { ServiceResponse } from 'types/service.response';
import { toast } from 'sonner';
import productService from '@/services/productService';
interface CellActionProps {
  data: Product;
  handle?: any;
}

export const CellAction: React.FC<CellActionProps> = ({ data, handle }) => {
  const [loading, setLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openInventoryModal, setOpenInventoryModal] = useState(false);
  const router = useRouter();

  // Xác nhận xóa phụ tùng
  const onConfirmDelete = async () => {
    setOpenDeleteModal(false);
    setLoading(true);
    handle(ActionType.DELETE, { id: data.id });
  };

  // Lưu cập nhật số lượng kho
  const onSaveInventory = async () => {
    if (additionalQuantity === null) {
      toast.error('Vui lòng nhập số lượng kho.');
      return;
    }

    setLoading(true);
    try {
      // Gọi API để cập nhật số lượng kho
      const response = await productService.post<ServiceResponse>(
        '/addStock',
        {
          productId: Number(data.id),
          quantity: Number(additionalQuantity),
          price: Number(purchasePrice)
        }
      );

      if (!response.success) {
        throw new Error('Không thể cập nhật số lượng kho.');
      }

      toast.success('Cập nhật số lượng kho thành công!');
      setOpenInventoryModal(false); // Đóng modal sau khi lưu
      handle(ActionType.UPDATE, {});
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi cập nhật số lượng kho.');
    } finally {
      setLoading(false);
    }
  };
  const [additionalQuantity, setAdditionalQuantity] = useState<number | null>(
    null
  ); // Số lượng thêm
  const [purchasePrice, setPurchasePrice] = useState<number | null>(null); // Giá nhập
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
            {/* Hiển thị số lượng kho hiện tại */}
            <p>
              Số lượng kho hiện tại:{' '}
              <strong>{data.inventory?.quantity || 0}</strong>
            </p>

            {/* Nhập số lượng thêm */}
            <div className='flex items-center space-x-2'>
              <label
                htmlFor='additionalQuantity'
                className='text-sm font-medium'
              >
                Số lượng thêm:
              </label>
              <div className='flex items-center overflow-hidden rounded-md border'>
                {/* Nút giảm số lượng */}
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

                {/* Input số lượng thêm */}
                <Input
                  id='additionalQuantity'
                  type='number'
                  className='w-20 border-none text-center focus:ring-0'
                  placeholder='Nhập số lượng'
                  value={additionalQuantity || ''}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setAdditionalQuantity(value < 0 ? 0 : value); // Đảm bảo giá trị >= 0
                  }}
                  min={0} // Giới hạn giá trị tối thiểu là 0
                />

                {/* Nút tăng số lượng */}
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

            {/* Nhập giá nhập */}
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
                  setPurchasePrice(value < 0 ? 0 : value); // Đảm bảo giá trị >= 0
                }}
                min={0} // Giới hạn giá trị tối thiểu là 0
              />
              <span className='text-sm text-gray-500'>VNĐ</span>
            </div>

            {/* Thông báo lỗi nếu thiếu thông tin */}
            {(!additionalQuantity || !purchasePrice) && (
              <p className='text-sm text-red-500'>
                Vui lòng nhập đầy đủ số lượng và giá nhập.
              </p>
            )}
          </div>
        }
      />

      {/* Dropdown menu */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Mở</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          {/* Cập nhật phụ tùng */}
          <DropdownMenuItem
            onClick={() => router.push(`/product/part/${data.id}`)}
          >
            <Edit className='mr-2 h-4 w-4' /> Cập nhật thông tin
          </DropdownMenuItem>

          {/* Cập nhật kho */}
          <DropdownMenuItem onClick={() => setOpenInventoryModal(true)}>
            <Edit className='mr-2 h-4 w-4' /> Cập nhật kho
          </DropdownMenuItem>

          {/* Xóa phụ tùng */}
          <DropdownMenuItem onClick={() => setOpenDeleteModal(true)}>
            <Trash className='mr-2 h-4 w-4' /> Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
