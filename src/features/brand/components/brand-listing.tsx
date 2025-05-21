import { Brand } from '@/models/base.model';
import { DataTable as BrandTable } from '@/components/ui/table/data-table';
import { createColumns } from './brand-tables/columns';
import BrandService from '@/services/branchService';
import { IPagingParam } from '@/constants/paging';
import { ServiceResponse } from 'types/service.response';
import { ActionType } from '@/enum/action-type';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import BrandTableAction from '@/features/brand/components/brand-tables/brand-table-action';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
type ListingPage = {};

export default function BranchListingPage({}: ListingPage) {
  const [isLoading, setLoading] = useState(true);
  const [dataPaging, setDataPaging] = useState<Brand[]>([]);
  const [totalPaging, setTotalPaging] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState('');
  let textSearch = '';
  const getParamPaging = (): IPagingParam => {
    const param: IPagingParam = {
      pageSize: pageSize,
      pageNumber: pageNumber,
      conditions: [],
      searchKey: textSearch,
      searchFields: ['name']
    };
    return param;
  };

  const getDataPaging = async () => {
    setLoading(true);
    const data = await BrandService.getPaging<ServiceResponse>(
      getParamPaging()
    );
    setLoading(false);
    const Brands: Brand[] = data.data.data;
    setDataPaging(Brands);
    setTotalPaging(data.data.totalCount);
  };

  useEffect(() => {
    getDataPaging();
  }, []);

  const handleDeleteRow = async (data: any) => {
    const { id } = data;
    var result = await BrandService.deleteById<ServiceResponse>(id);
    var { data, success, message } = result;
    if (!success) {
      toast.error('Xóa hãng xe thất bại');
      return;
    }
    toast.success('Xóa hãng xe thành công');
    getDataPaging();
    return true;
  };
  const handleAction = async (type: string, data: any) => {
    switch (type) {
      case ActionType.DELETE:
        return await handleDeleteRow(data);
    }
    return;
  };
  const columns = createColumns(handleAction);
  const handleOnPageChange = (pageNumber: number, pageSize: number) => {
    setPageNumber(pageNumber);
    setPageSize(pageSize);
    getDataPaging();
  };
  const handleSetSearch = (text: string) => {
    setPageNumber(1);
    setSearch(text);
    textSearch = text;
    getDataPaging();
  };
  return (
    <div>
      <div className='mb-4'>
        <BrandTableAction
          searchKey='tên thương hiệu'
          search={search}
          setSearch={handleSetSearch}
        />
      </div>
      {isLoading && <DataTableSkeleton columnCount={5} rowCount={10} />}
      <div
        className='space-y-4'
        style={{ display: isLoading ? 'none' : 'block' }}
      >
        <BrandTable
          columns={columns}
          data={dataPaging}
          totalItems={totalPaging}
          onPageChange={handleOnPageChange}
          pageSizeInit={50}
        />
      </div>
    </div>
  );
}
