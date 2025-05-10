'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useEffect, useState } from 'react';

interface State {
  province: string;
  district: string;
  ward: string;
}

interface ProvinceProps {
  state: State;
  setStateData: (data: State) => void;
  width?: number;
  bold?: boolean;
  className?: string;
  errors?: {
    province?: string;
    district?: string;
    ward?: string;
  };
}

interface ProvinceData {
  name: string;
  huyen?: DistrictData[];
}

interface DistrictData {
  name: string;
  xa?: WardData[];
}

interface WardData {
  name: string;
}

const Province: React.FC<ProvinceProps> = ({
  state = { province: '', district: '', ward: '' },
  setStateData = (data: State) => {},
  width = '100%',
  bold = false,
  className,
  errors = {}
}) => {
  const [listProvince, setListProvince] = useState<ProvinceData[]>([]);
  const [listDistrict, setListDistrict] = useState<DistrictData[]>([]);
  const [listWard, setListWard] = useState<WardData[]>([]);

  // Fetch danh sách tỉnh/thành phố
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/phuockaito/KaitoShop.cf/master/src/data.json'
        );
        const data = await response.json();
        setListProvince(data);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };

    fetchProvinces();
  }, []);

  // Cập nhật danh sách quận/huyện khi chọn tỉnh/thành phố
  useEffect(() => {
    if (state.province && listProvince.length > 0) {
      const districts =
        listProvince.find((province) => province.name === state.province)
          ?.huyen || [];
      setListDistrict(districts);
      setStateData({ ...state, district: '', ward: '' });
    }
  }, [state.province, listProvince]);

  // Cập nhật danh sách phường/xã khi chọn quận/huyện
  useEffect(() => {
    if (state.district && listDistrict.length > 0) {
      const wards =
        listDistrict.find((district) => district.name === state.district)?.xa ||
        [];
      setListWard(wards);
      setStateData({ ...state, ward: '' });
    }
  }, [state.district, listDistrict]);

  return (
    <div>
      <div className='flex gap-4'>
        {/* Tỉnh/Thành phố */}
        <div className='flex-1'>
          <span className='block text-sm font-medium text-gray-700'>
            Tỉnh/Thành phố
          </span>
          <Select
            value={state.province}
            onValueChange={(value) =>
              setStateData({
                ...state,
                province: value,
                district: '',
                ward: ''
              })
            }
          >
            <SelectTrigger className='mt-2 w-full'>
              <SelectValue placeholder='Chọn tỉnh/thành phố' />
            </SelectTrigger>
            <SelectContent>
              {listProvince.map((province, index) => (
                <SelectItem key={index} value={province.name}>
                  {province.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quận/Huyện */}
        <div className='flex-1'>
          <span className='block text-sm font-medium text-gray-700'>
            Quận/Huyện
          </span>
          <Select
            value={state.district}
            onValueChange={(value) =>
              setStateData({ ...state, district: value, ward: '' })
            }
            disabled={!state.province}
          >
            <SelectTrigger className='mt-2 w-full'>
              <SelectValue placeholder='Chọn quận/huyện' />
            </SelectTrigger>
            <SelectContent>
              {listDistrict.map((district, index) => (
                <SelectItem key={index} value={district.name}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className='mt-2 flex gap-4'>
        <div className='flex-1'>
          <span className='block text-sm font-medium text-gray-700'>
            Phường/Xã
          </span>
          <Select
            value={state.ward}
            onValueChange={(value) => setStateData({ ...state, ward: value })}
            disabled={!state.district}
          >
            <SelectTrigger className='mt-2  w-full'>
              <SelectValue placeholder='Chọn phường/xã' />
            </SelectTrigger>
            <SelectContent>
              {listWard.map((ward, index) => (
                <SelectItem key={index} value={ward.name}>
                  {ward.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex-1'></div>
      </div>
      {/* Phường/Xã */}
    </div>
  );
};

export default Province;
