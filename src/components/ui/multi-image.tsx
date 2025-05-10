import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import UploadService from '@/services/upload.service';
import { toast } from 'sonner';

interface MultiImageUploaderProps {
  value?: any; // Danh sách URL ảnh, phân tách bởi ';'
  onValueChange: (urls: string[]) => void; // Callback khi danh sách ảnh thay đổi
  maxSize?: number; // Kích thước tối đa cho mỗi file (byte)
}

const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({
  value,
  onValueChange,
  maxSize = 5 * 1024 * 1024 // Default: 5MB
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>(
    typeof value === 'string' ? value.split(';').filter(Boolean) : value
  );
  console.log(value);

  const uploadFile = async (file: File) => {
    try {
      const response = await UploadService.upload(file);
      // console.log(response);
      if (response.data.fileUrl) {
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
    const files = event.target.files;
    if (!files) return;

    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > maxSize) {
        alert(
          `File size exceeds the maximum limit of ${maxSize / (1024 * 1024)}MB`
        );
        continue;
      }
      const url = await uploadFile(file);
      newImages.push(url);
    }

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onValueChange(updatedImages); // Lưu danh sách ảnh dưới dạng chuỗi
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onValueChange(updatedImages);
  };
  const handleButtonClick = () => {
    fileInputRef.current?.click(); // Kích hoạt input file
  };

  return (
    <div>
      {/* Nút tải lên ảnh */}
      <label htmlFor='multi-image-upload' className='cursor-pointer'>
        <Button onClick={handleButtonClick} variant='outline' type='button'>
          {' '}
          {/* Thêm type="button" */}
          Tải lên ảnh
        </Button>
      </label>

      {/* Input file ẩn */}
      <input
        id='multi-image-upload'
        ref={fileInputRef}
        type='file'
        accept='image/*'
        multiple
        className='hidden'
        onChange={handleFileChange}
      />

      {/* Hiển thị danh sách ảnh */}
      <div className='mt-4 flex flex-wrap gap-2'>
        {images.map((url, index) => (
          <div
            key={index}
            className='relative h-24 w-24 overflow-hidden rounded'
          >
            <img
              src={url}
              alt={`Preview ${index}`}
              className='h-full w-full object-cover'
            />
            <button
              onClick={() => removeImage(index)}
              className='absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white'
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiImageUploader;
