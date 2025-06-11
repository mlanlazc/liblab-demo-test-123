import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { UniversalChartCard } from '@/components/building-blocks/universal-chart-card/universal-chart-card';
import { ChartConfig } from '@/components/ui/chart';

export const topOrganizationsByRevenueQuery = `
  SELECT o.organization_name, SUM(r.total_revenue) AS total_revenue
  FROM organizations o
  JOIN revenue r ON o.organization_id = r.organization_id
  GROUP BY o.organization_name
  ORDER BY total_revenue DESC
  LIMIT 10;
`;

export type TopOrganizationsByRevenueData = {
  organization_name: string;
  total_revenue: number;
};

interface TopOrganizationsByRevenueChartProps {
  data: TopOrganizationsByRevenueData[];
}

export function TopOrganizationsByRevenueChart({ data }: TopOrganizationsByRevenueChartProps) {
  const chartConfig: ChartConfig = {
    total_revenue: {
      label: 'Total Revenue',
      color: 'var(--chart-2)',
    },
  };

  return (
    <UniversalChartCard
      title="Top 10 Organizations by Revenue"
      description="Organizations with the highest accumulated revenue."
      chartConfig={chartConfig}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="organization_name" angle={-45} textAnchor="end" height={80} />
          <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
          <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
          <Bar dataKey="total_revenue" stroke="var(--chart-2-stroke)" fill="var(--chart-2)" />
        </BarChart>
      </ResponsiveContainer>
    </UniversalChartCard>
  );
}
