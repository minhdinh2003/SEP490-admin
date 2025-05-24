'use client';
import React, { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface ModalProps {
  title?: string | ReactNode;
  description?: string | ReactNode;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  size?: string;
}

export const ModalV2: React.FC<ModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  children,
  size = 'max-w-md'
}) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className={`${size} w-full max-h-[90vh] overflow-y-auto  max-w-6xl`}>
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

        {/* Styled JSX - CSS nội bộ */}
        <style jsx>{`
          /* Ánh xạ kích thước */
          .max-w-sm {
            max-width: 24rem; /* ~384px */
          }
          .max-w-md {
            max-width: 28rem; /* ~448px */
          }
          .max-w-lg {
            max-width: 50rem; /* ~512px */
          }
          .max-w-xl {
            max-width: 36rem; /* ~576px */
          }
          .max-w-2xl {
            max-width: 42rem; /* ~672px */
          }
          .max-w-full {
            max-width: 100%; /* Full width */
          }

          /* Style cho modal */
          [data-radix-dialog-content] {
            max-height: 90vh; /* Giới hạn chiều cao tối đa */
            overflow-y: auto; /* Cho phép cuộn nếu nội dung vượt quá chiều cao */
            border-radius: 8px; /* Bo góc modal */
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Hiệu ứng bóng */
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};