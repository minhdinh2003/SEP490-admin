import React from 'react';
import UploadService from '@/services/upload.service';
import { toast } from 'sonner';
interface AvatarUploaderProps {
  value?: string | null; // Giá trị hiện tại (file đã chọn)
  onValueChange: (url: string | null) => void; // Hàm xử lý khi chọn file
  maxSize?: number; // Kích thước tối đa (byte)
}

function AvatarUploader({
  value,
  onValueChange,
  maxSize = 5 * 1024 * 1024 // Default: 5MB
}: AvatarUploaderProps) {
  const uploadFile = async (file: File) => {
    try {
      const response = await UploadService.upload(file);
      // console.log(response);
      if (response.data.fileUrl) {
        toast.success('File được tải lên thành công');
        return response.data.fileUrl;
      }
    } catch (error: any) {
      toast.error(error?.message);
      return '';
    }
  };
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && file.size > maxSize) {
      alert(
        `File size exceeds the maximum limit of ${maxSize / (1024 * 1024)}MB`
      );
      return;
    }
    if (file) {
      var url = await uploadFile(file);
      onValueChange(url);
    }
  };

  return (
    <div className='flex items-center justify-center'>
      <label
        htmlFor='avatar-upload'
        className='relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-200'
      >
        {value ? (
          <img
            src={value}
            alt='Avatar Preview'
            className='h-full w-full object-cover'
          />
        ) : (
          <span className='text-gray-500'>Upload</span>
        )}
        <input
          id='avatar-upload'
          type='file'
          accept='image/*'
          className='hidden'
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}

export { AvatarUploader };
