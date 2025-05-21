'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { ReactNode } from 'react';

interface ModalProps {
  title?: string | ReactNode; // Tiêu đề (hỗ trợ cả string và JSX)
  description?: string | ReactNode; // Mô tả (hỗ trợ cả string và JSX)
  isOpen: boolean; // Trạng thái hiển thị modal
  onClose: () => void; // Hàm đóng modal
  children?: React.ReactNode; // Nội dung chính của modal
  size?: 'sm' | 'md' | 'lg'; // Kích thước modal
}

export const Modal: React.FC<ModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  children,
  size = 'md' // Giá trị mặc định là 'md'
}) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  // Ánh xạ kích thước modal
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className={`${sizeClasses[size]} w-full`}>
        {/* Header */}
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}

        {/* Nội dung chính */}
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};
