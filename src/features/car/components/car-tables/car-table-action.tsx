'use client';

import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useEffect, useState } from 'react';
import BrandService from '@/services/branchService';
import { ServiceResponse } from 'types/service.response';
import { MultiSelect } from 'react-multi-select-component';

type TableAction = {
  setSearch?: any;
  search: string;
  searchKey: string;
  handleFilterOption?: any;
};

export default function UserTableAction({
  setSearch,
  search,
  searchKey,
  handleFilterOption
}: TableAction) {
  const [filters, setFilters] = useState<any>([]);
  const [allOptions, setAllOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await BrandService.getAll<ServiceResponse>();
        const data = response.data;
        const options = [
          ...data.map((item: { id: string; name: string }) => ({
            value: item.id,
            label: item.name
          }))
        ];
        setAllOptions(options);
        setFilters(options);
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };

    fetchOptions();
  }, []);

  const handleFilterChange = (selectedValues: any[]) => {
    handleFilterOption(selectedValues);
    setFilters(selectedValues);
  };

  return (
    <div className='flex flex-wrap items-center gap-4'>
      <div className='flex flex-1'>
        <div className='flex-1'>
          <DataTableSearch searchKey={searchKey} setSearchQuery={setSearch} />
        </div>

        <div className='ml-2 flex-1'>
          <MultiSelect
            options={allOptions}
            value={filters}
            onChange={handleFilterChange}
            labelledBy='Chọn hãng xe'
            overrideStrings={{
              allItemsAreSelected: 'Chọn tất cả',
              selectAll: 'Tất cả',
              search: 'Tìm kiếm',
              selectSomeItems: 'Chọn hãng xe'
            }}
            className='custom-mul-select'
          />
        </div>
        <div className='ml-2'></div>
      </div>
      <div className='flex flex-1'></div>
    </div>
  );
}
