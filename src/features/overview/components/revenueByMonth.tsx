'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

const chartConfig = {
  revenue: {
    label: 'Doanh thu',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig;

interface RevenueBarChartProps {
  data: any[]; // Dữ liệu động từ báo cáo
}

export function RevenueBarChart({ data }: RevenueBarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Biểu đồ doanh thu</CardTitle>
        <CardDescription>Hiển thị doanh thu theo tháng</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[310px] w-full'
        >
          <BarChart
            accessibilityLayer
            data={data} // Sử dụng dữ liệu động
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid strokeDasharray='3 3' vertical={false} />
            <XAxis
              dataKey='month' // Trường 'month' trong dữ liệu
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)} // Hiển thị 3 ký tự đầu tiên của tháng
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dot' />}
            />
            <Bar
              dataKey='revenue' // Trường 'revenue' trong dữ liệu
              fill='var(--color-revenue)' // Sử dụng màu từ chartConfig
              fillOpacity={0.6}
              stroke='var(--color-revenue)'
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 font-medium leading-none'>
              Doanh thu <TrendingUp className='h-4 w-4' />
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
