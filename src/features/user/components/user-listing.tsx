import { User } from '@/models/base.model';
import { DataTable as UserTable } from '@/components/ui/table/data-table';
import { createColumns } from './user-tables/columns';
import UserService from '@/services/userService';
import { IPagingParam } from '@/constants/paging';
import { ServiceResponse } from 'types/service.response';
import { ActionType } from '@/enum/action-type';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import UserTableAction from '@/features/user/components/user-tables/user-table-action';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
type ListingPage = {};

export default function UserListingPage({}: ListingPage) {
  const [isLoading, setLoading] = useState(true);
  const [dataPaging, setDataPaging] = useState<User[]>([]);
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
      searchFields: ['fullName', 'email']
    };
    return param;
  };

  const getDataPaging = async () => {
    setLoading(true);
    const data = await UserService.getPaging<ServiceResponse>(getParamPaging());
    setLoading(false);
    const users: User[] = data.data.data;
    setDataPaging(users);
    setTotalPaging(data.data.totalCount);
  };

  useEffect(() => {
    getDataPaging();
  }, []);

  const handleDeleteRow = async (data: any) => {
    const { id } = data;
    var result = await UserService.deleteById<ServiceResponse>(id);
    var { data, success, message } = result;
    if (!success) {
      toast.error('Xóa tài khoản user thất bại');
      return;
    }
    toast.success('Xóa tài khoản user thành công');
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
        <UserTableAction
          searchKey='họ và tên, email'
          search={search}
          setSearch={handleSetSearch}
        />
      </div>
      {isLoading && <DataTableSkeleton columnCount={5} rowCount={10} />}
      <div
        className='space-y-4'
        style={{ display: isLoading ? 'none' : 'block' }}
      >
        <UserTable
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
