'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { ReactNode } from 'react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  loading: boolean;
  title?: string | ReactNode;
  content?: string | ReactNode;
  buttonTextCancel?: string;
  buttonTextConfirm?: string;
  showConfirmButton?: boolean;
  width?: string; // Thêm prop width
  size?: 'sm' | 'md' | 'lg'; // Kích thước modal, có thể là 'sm', 'md', 'lg'
}
export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title = 'Are you sure?', // Giá trị mặc định
  content = 'This action cannot be undone.', // Giá trị mặc định
  buttonTextCancel = 'Cancel', // Giá trị mặc định
  buttonTextConfirm = 'Continue', // Giá trị mặc định
  showConfirmButton = true, // Giá trị mặc định: Hiển thị nút Confirm
  size = 'sm' // Kích thước modal, có thể là 'sm', 'md', 'lg'
}) => {
  const [isMounted, setIsMounted] = useState(false);

  // Kiểm tra xem component đã được mount hay chưa
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title={title} // Truyền title từ props
      description={content} // Truyền content từ props
      isOpen={isOpen}
      onClose={onClose}
      size={size} // Kích thước modal
    >
      {/* Footer chứa các nút hành động */}
      <div className='flex w-full items-center justify-end space-x-2 pt-6'>
        {/* Nút Cancel */}
        <Button disabled={loading} variant='outline' onClick={onClose}>
          {buttonTextCancel}
        </Button>

        {/* Nút Confirm - chỉ hiển thị nếu showConfirmButton === true */}
        {showConfirmButton && (
          <Button disabled={loading} variant='destructive' onClick={onConfirm}>
            {buttonTextConfirm}
          </Button>
        )}
      </div>
    </Modal>
  );
};
