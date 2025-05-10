import { TaskTemplate } from '@/models/base.model';
import { DataTable as TaskTemplateTable } from '@/components/ui/table/data-table';
import { createColumns } from './task-tables/columns';
import { IPagingParam } from '@/constants/paging';
import { ServiceResponse } from 'types/service.response';
import { ActionType } from '@/enum/action-type';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import TaskTemplateService from '@/services/taskTemplateService';
import TaskTemplateTableAction from './task-tables/template-table-action';
type ListingPage = {};

export default function TaskTemplateListingPage({}: ListingPage) {
  const [isLoading, setLoading] = useState(true);
  const [dataPaging, setDataPaging] = useState<TaskTemplate[]>([]);
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
      searchFields: ['title']
    };
    return param;
  };

  const getDataPaging = async () => {
    setLoading(true);
    const data = await TaskTemplateService.getPaging<ServiceResponse>(getParamPaging());
    setLoading(false);
    const users: TaskTemplate[] = data.data.data;
    setDataPaging(users);
    setTotalPaging(data.data.totalCount);
  };

  useEffect(() => {
    getDataPaging();
  }, []);

  const handleDeleteRow = async (data: any) => {
    const { id } = data;
    var result = await TaskTemplateService.deleteById<ServiceResponse>(id);
    var { data, success, message } = result;
    if (!success) {
      toast.error('Xóa danh mục task thất bại');
      return;
    }
    toast.success('Xóa danh mục task thành công');
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
        <TaskTemplateTableAction
          searchKey='tên danh mục task'
          search={search}
          setSearch={handleSetSearch}
        />
      </div>
      {isLoading && <DataTableSkeleton columnCount={5} rowCount={10} />}
      <div
        className='space-y-4'
        style={{ display: isLoading ? 'none' : 'block' }}
      >
        <TaskTemplateTable
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
