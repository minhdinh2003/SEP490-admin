'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Cell, Label, Pie, PieChart } from 'recharts';

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

interface OrderStatusData {
  status: string; // Trạng thái đơn hàng (ví dụ: "PENDING", "SHIPPED")
  count: number; // Số lượng đơn hàng
}

const chartConfig = {
  pending: {
    label: 'Đang xử lý',
    color: 'hsl(var(--chart-1))'
  },
  processing: {
    label: 'Đang giao hàng',
    color: 'hsl(var(--chart-2))'
  },
  shipped: {
    label: 'Đã nhận đơn hàng',
    color: 'hsl(var(--chart-3))'
  },
  cancelled: {
    label: 'Đã hủy',
    color: 'hsl(var(--chart-4))'
  }
} satisfies ChartConfig;

interface PieGraphProps {
  data: OrderStatusData[]; // Dữ liệu động từ báo cáo
}

export function PieGraph({ data }: PieGraphProps) {
  // Tính tổng số đơn hàng
  const totalOrders = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.count, 0);
  }, [data]);

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Phân bổ đơn hàng</CardTitle>
        <CardDescription>Tỷ lệ đơn hàng theo trạng thái</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[360px]'
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey='count' // Trường chứa giá trị (số lượng đơn hàng)
              nameKey='status' // Trường chứa nhãn (trạng thái đơn hàng)
              innerRadius={60}
              strokeWidth={5}
            >
              {data.map((entry, index) => (
                <React.Fragment key={`cell-${index}`}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor='middle'
                            dominantBaseline='middle'
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className='fill-foreground text-3xl font-bold'
                            >
                              {totalOrders.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className='fill-muted-foreground'
                            >
                              Đơn hàng
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      chartConfig[
                        entry.status.toLowerCase() as keyof typeof chartConfig
                      ]?.color || '#8884d8'
                    }
                  />
                </React.Fragment>
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 font-medium leading-none'>
          Phân bổ <TrendingUp className='h-4 w-4' />
        </div>
      </CardFooter>
    </Card>
  );
}
