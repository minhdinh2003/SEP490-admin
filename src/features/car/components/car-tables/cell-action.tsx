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
interface CellActionProps {
  data: Product;
  handle?: any;
}

export const CellAction: React.FC<CellActionProps> = ({ data, handle }) => {
  const [loading, setLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openInventoryModal, setOpenInventoryModal] = useState(false);
  const [inventoryQuantity, setInventoryQuantity] = useState<number | null>(
    null
  ); // Số lượng kho
  const router = useRouter();

  // Xác nhận xóa sản phẩm
  const onConfirmDelete = async () => {
    setOpenDeleteModal(false);
    setLoading(true);
    handle(ActionType.DELETE, { id: data.id });
  };

  // Lưu cập nhật số lượng kho
  const onSaveInventory = async () => {
    if (inventoryQuantity === null) {
      toast.error('Vui lòng nhập số lượng kho.');
      return;
    }

    setLoading(true);
    try {
      // Gọi API để cập nhật số lượng kho
      const response = await InventoryService.updateById<ServiceResponse>(
        data.inventory.id,
        {
          productId: data.id,
          quantity: inventoryQuantity
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
        title='Xóa sản phẩm'
        content={`Bạn có chắc muốn xóa sản phẩm ${data.name} không?`}
      />

      {/* Modal cập nhật kho */}
      <AlertModal
        isOpen={openInventoryModal}
        onClose={() => setOpenInventoryModal(false)}
        onConfirm={onSaveInventory}
        loading={loading}
        buttonTextCancel='Hủy'
        buttonTextConfirm='Lưu'
        title='Cập nhật kho'
        content={
          <div>
            <p className='mb-1 mt-2'>
              Số lượng kho hiện tại: {data.inventory?.quantity || 0}
            </p>
            {/* <p className='mb-1 mt-2'>Số lượng kho hiện tại: 1</p> */}
            <Input
              type='number'
              placeholder='Nhập số lượng kho mới'
              value={inventoryQuantity || ''}
              onChange={(e) => {
                const value = Number(e.target.value);
                setInventoryQuantity(value < 0 ? 0 : value); // Đảm bảo giá trị >= 0
              }}
              min={0} // Giới hạn giá trị tối thiểu là 0
            />
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
          {/* Cập nhật sản phẩm */}
          <DropdownMenuItem
            onClick={() => router.push(`/product/car/${data.id}`)}
          >
            <Edit className='mr-2 h-4 w-4' /> Cập nhật thông tin
          </DropdownMenuItem>

          {/* Cập nhật kho */}
          {/* <DropdownMenuItem onClick={() => setOpenInventoryModal(true)}>
            <Edit className='mr-2 h-4 w-4' /> Cập nhật kho
          </DropdownMenuItem> */}

          {/* Xóa sản phẩm */}
          <DropdownMenuItem onClick={() => setOpenDeleteModal(true)}>
            <Trash className='mr-2 h-4 w-4' /> Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
