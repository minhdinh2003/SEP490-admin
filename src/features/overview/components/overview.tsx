import { AreaGraph } from './area-graph';
import { PieGraph } from './pie-graph';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateRange } from 'react-day-picker';
import React, { useState } from 'react';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { addDays, format } from 'date-fns';
import { RevenueBarChart } from './revenueByMonth';
export default function OverViewPage() {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  var http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const fetchReport = async (dateRange: DateRange | undefined) => {
    try {
      setLoading(true);
      const fromDate = dateRange?.from || new Date();
      const toDate = dateRange?.to || addDays(new Date(), 30);

      const response = await http.post('/user/report', {
        fromDate: format(fromDate, 'yyyy-MM-dd'),
        toDate: format(toDate, 'yyyy-MM-dd')
      });
      setReportData(response.data.data);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu báo cáo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (dateRange: DateRange | undefined) => {
    fetchReport(dateRange);
  };
  const formatCurrency = (amount: number | undefined): string => {
    if (!amount) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };
  return (
    <PageContainer scrollable>
      <div className='space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Xin chào, chào mừng trở lại 👋
          </h2>
          <div className='hidden items-center space-x-2 md:flex'>
            <CalendarDateRangePicker onDateChange={handleDateChange} />
          </div>
        </div>
        <Tabs defaultValue='overview' className='space-y-4'>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-2'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Tổng doanh thu
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {loading
                      ? 'Đang tải...'
                      : `${formatCurrency(reportData?.totalRevenue || 0)} VNĐ`}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Người dùng
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                    <circle cx='9' cy='7' r='4' />
                    <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {loading
                      ? 'Đang tải...'
                      : `+${reportData?.totalRegistrations || 0}`}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-8'>
              <div className='col-span-4'>
                <RevenueBarChart data={reportData?.revenueByMonth || []} />
              </div>
              <div className='col-span-4'>
                <PieGraph data={reportData?.orderStatusCounts || []} />
                {/* <PieGraph data={reportData?.revenueByPaymentMethod || []} /> */}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
