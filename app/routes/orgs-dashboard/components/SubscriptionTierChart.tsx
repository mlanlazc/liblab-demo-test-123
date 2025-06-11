import { ChartConfig } from '@/components/ui/chart';
import { ChartSharePercentage } from '@/components/building-blocks/chart-share-percentage/chart-share-percentage';

export const subscriptionTierQuery = `
  SELECT subscription_tier, COUNT(organization_id) AS total_organizations
  FROM organizations
  GROUP BY subscription_tier
  ORDER BY total_organizations DESC
  LIMIT 10;
`;

export type SubscriptionTierData = {
  subscription_tier: string;
  total_organizations: number;
};

interface SubscriptionTierChartProps {
  data: SubscriptionTierData[];
}

export function SubscriptionTierChart({ data }: SubscriptionTierChartProps) {
  const chartConfig = data.reduce((acc, item, index) => {
    const sanitizedTier = item.subscription_tier.replace(/\s+/g, '');
    acc[sanitizedTier] = {
      label: item.subscription_tier,
      color: `var(--chart-${(index % 10) + 1})`,
    };
    return acc;
  }, {} as ChartConfig);

  const totalOrganizations = data.reduce((sum, item) => sum + item.total_organizations, 0);

  return (
    <ChartSharePercentage
      title="Organizations by Subscription Tier"
      description="Distribution of organizations across different subscription tiers."
      data={data}
      dataKey="total_organizations"
      nameKey="subscription_tier"
      chartConfig={chartConfig}
      centerValueRenderer={() => ({
        title: totalOrganizations.toLocaleString(),
        subtitle: 'Organizations',
      })}
      valueFormatter={(value) => `${((value / totalOrganizations) * 100).toFixed(0)}%`}
    />
  );
}
