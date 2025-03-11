'use client';
import { DataTableSearch } from '@/components/ui/table/data-table-search';

type TableAction = {
  setSearch?: any;
  search: string;
  searchKey: string;
};

export default function BrandTableAction({
  setSearch,
  search,
  searchKey
}: TableAction) {
  const resetFilter = () => {
    setSearch('');
  };
  const isAnyFilterActive = true;
  return (
    <div className='flex flex-wrap items-center gap-4'>
      <DataTableSearch searchKey={searchKey} setSearchQuery={setSearch} />
      {/* <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilter}
      /> */}
    </div>
  );
}
