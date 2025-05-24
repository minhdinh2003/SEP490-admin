'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { ReactNode } from 'react';

interface AlertModalProps {
<<<<<<< HEAD
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
=======
  isOpen: boolean; // Trạng thái hiển thị modal
  onClose: () => void; // Hàm đóng modal
  onConfirm: () => void; // Hàm xác nhận hành động
  loading: boolean; // Trạng thái loading
  title?: string | ReactNode; // Tiêu đề của modal (hỗ trợ cả string và JSX)
  content?: string | ReactNode; // Nội dung của modal (hỗ trợ cả string và JSX)
  buttonTextCancel?: string; // Văn bản cho nút Cancel
  buttonTextConfirm?: string; // Văn bản cho nút Confirm
>>>>>>> b695a40 (Refactor and clean up code across multiple files)
}
export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title = 'Are you sure?', // Giá trị mặc định
  content = 'This action cannot be undone.', // Giá trị mặc định
  buttonTextCancel = 'Cancel', // Giá trị mặc định
<<<<<<< HEAD
  buttonTextConfirm = 'Continue', // Giá trị mặc định
  showConfirmButton = true, // Giá trị mặc định: Hiển thị nút Confirm
  size = 'sm' // Kích thước modal, có thể là 'sm', 'md', 'lg'
=======
  buttonTextConfirm = 'Continue' // Giá trị mặc định
>>>>>>> b695a40 (Refactor and clean up code across multiple files)
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
<<<<<<< HEAD
=======
        </Button>
        {/* Nút Confirm */}
        <Button disabled={loading} variant='destructive' onClick={onConfirm}>
          {buttonTextConfirm}
>>>>>>> b695a40 (Refactor and clean up code across multiple files)
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
