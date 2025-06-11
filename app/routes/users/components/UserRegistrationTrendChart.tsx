import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { UniversalChartCard } from '@/components/building-blocks/universal-chart-card/universal-chart-card';

export const userRegistrationTrendQuery = `
  SELECT
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as registered_users
  FROM users
  WHERE created_at >= NOW() - INTERVAL '12 months'
  GROUP BY DATE_TRUNC('month', created_at)
  ORDER BY month ASC
`;

export type UserRegistrationTrendData = {
  month: string;
  registered_users: number;
};

interface UserRegistrationTrendChartProps {
  data: UserRegistrationTrendData[];
}

export function UserRegistrationTrendChart({ data }: UserRegistrationTrendChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    month: new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  }));

  const chartConfig = {
    registered_users: {
      label: 'Registered Users',
      color: 'var(--chart-2)',
    },
  };

  return (
    <UniversalChartCard
      title="User Registration Trend"
      description="New user registrations by month over the last 12 months"
      chartConfig={chartConfig}
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="registered_users"
            stroke="var(--chart-2-stroke)"
            fill="var(--chart-2)"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </UniversalChartCard>
  );
}
