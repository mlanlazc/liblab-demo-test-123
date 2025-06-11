import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { UniversalChartCard } from '@/components/building-blocks/universal-chart-card/universal-chart-card';
import { ChartConfig } from '@/components/ui/chart';

export const averagePlanPriceQuery = `
  SELECT plan_name, AVG(monthly_price) AS average_monthly_price
  FROM subscriptions
  GROUP BY plan_name
  ORDER BY average_monthly_price DESC
  LIMIT 10;
`;

export type AveragePlanPriceData = {
  plan_name: string;
  average_monthly_price: number;
};

interface AveragePlanPriceChartProps {
  data: AveragePlanPriceData[];
}

export function AveragePlanPriceChart({ data }: AveragePlanPriceChartProps) {
  const chartConfig: ChartConfig = {
    average_monthly_price: {
      label: 'Average Monthly Price',
      color: 'var(--chart-3)',
    },
  };

  return (
    <UniversalChartCard
      title="Average Monthly Price by Plan"
      description="Average monthly price for each subscription plan."
      chartConfig={chartConfig}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="plan_name" angle={-45} textAnchor="end" height={80} />
          <YAxis tickFormatter={(value) => `$${value.toFixed(2)}`} />
          <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
          <Bar dataKey="average_monthly_price" stroke="var(--chart-3-stroke)" fill="var(--chart-3)" />
        </BarChart>
      </ResponsiveContainer>
    </UniversalChartCard>
  );
}
