import { Product } from '@/models/base.model';
import { DataTable as ProductTable } from '@/components/ui/table/data-table';
import { createColumns } from './car-tables/columns';
import ProductService from '@/services/productService';
import { ICondition, IPagingParam } from '@/constants/paging';
import { ServiceResponse } from 'types/service.response';
import { ActionType } from '@/enum/action-type';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import ProductTableAction from '@/features/car/components/car-tables/car-table-action';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
type ListingPage = {};

export default function ProductListingPage({}: ListingPage) {
  const [isLoading, setLoading] = useState(true);
  const [dataPaging, setDataPaging] = useState<Product[]>([]);
  const [totalPaging, setTotalPaging] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState('');
  let textSearch = '';
  var selected: any = [];
  const getParamPaging = (): IPagingParam => {
    let conditions: ICondition[] = [];
    if (selected.length > 0) {
      conditions.push({
        key: 'any',
        condition: 'raw',
        value: {
          AND: [
            {
              category: 'PART'
            },
            {
              brands: {
                some: {
                  id: {
                    in: selected.map((x: any) => x.value)
                  }
                }
              }
            }
          ]
        }
      });
    } else {
      conditions.push({
        key: 'category',
        condition: 'equal',
        value: 'PART'
      });
    }

    const param: IPagingParam = {
      pageSize: pageSize,
      pageNumber: pageNumber,
      conditions: conditions,
      searchKey: textSearch,
      searchFields: ['name'],
      includeReferences: {
        inventory: true,
        brands: true
      }
    };
    return param;
  };

  const getDataPaging = async () => {
    setLoading(true);
    const data = await ProductService.getPaging<ServiceResponse>(
      getParamPaging()
    );
    setLoading(false);
    const Products: Product[] = data.data.data;
    setDataPaging(Products);
    setTotalPaging(data.data.totalCount);
  };

  useEffect(() => {
    getDataPaging();
  }, []);

  const handleDeleteRow = async (data: any) => {
    const { id } = data;
    var result = await ProductService.deleteById<ServiceResponse>(id);
    var { data, success, message } = result;
    if (!success) {
      toast.error('Không thể xóa do đã phát sinh dữ liệu');
      return;
    }
    toast.success('Xóa thành công');
    getDataPaging();
    return true;
  };
  const handleAction = async (type: string, data: any) => {
    switch (type) {
      case ActionType.DELETE:
        return await handleDeleteRow(data);
      case ActionType.UPDATE:
        return await reloadData();
    }
    return;
  };
  const reloadData = () => {
    getDataPaging();
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
  const handleFilterOption = (data: any) => {
    selected = data;
    setPageNumber(1);
    getDataPaging();
  };
  return (
    <div>
      <div className='mb-4'>
        <ProductTableAction
          searchKey='tên'
          search={search}
          setSearch={handleSetSearch}
          handleFilterOption={handleFilterOption}
        />
      </div>
      {isLoading && <DataTableSkeleton columnCount={5} rowCount={10} />}
      <div
        className='space-y-4'
        style={{ display: isLoading ? 'none' : 'block' }}
      >
        <ProductTable
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
