import { DollarSign, Package, Users } from 'lucide-react';
import { QuickInfoCard } from '@/components/building-blocks/quick-info-card/quick-info-card';

export const totalActiveUsersQuery = `
  SELECT COUNT(user_id) AS total_active_users FROM users WHERE is_active = TRUE;
`;

export const totalProductsQuery = `
  SELECT COUNT(product_id) AS total_products FROM products;
`;

export const totalSalesAmountQuery = `
  SELECT SUM(total_amount) AS total_sales_amount FROM sales;
`;

export type TotalActiveUsersData = {
  total_active_users: number;
};

export type TotalProductsData = {
  total_products: number;
};

export type TotalSalesAmountData = {
  total_sales_amount: string; // numeric type from postgres often comes as string
};

interface OrgKeyMetricsProps {
  totalActiveUsers: TotalActiveUsersData[];
  totalProducts: TotalProductsData[];
  totalSalesAmount: TotalSalesAmountData[];
}

export function OrgKeyMetrics({ totalActiveUsers, totalProducts, totalSalesAmount }: OrgKeyMetricsProps) {
  const activeUsers = totalActiveUsers?.[0]?.total_active_users || 0;
  const products = totalProducts?.[0]?.total_products || 0;
  const salesAmount = parseFloat(totalSalesAmount?.[0]?.total_sales_amount || '0').toFixed(2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <QuickInfoCard
        title="Total Active Users"
        description="Currently active users across all organizations"
        icon={<Users className="h-5 w-5 text-blue-500" />}
      >
        <div className="text-3xl font-bold">{activeUsers}</div>
      </QuickInfoCard>

      <QuickInfoCard
        title="Total Products"
        description="All products available across organizations"
        icon={<Package className="h-5 w-5 text-purple-500" />}
      >
        <div className="text-3xl font-bold">{products}</div>
      </QuickInfoCard>

      <QuickInfoCard
        title="Total Sales Amount"
        description="Cumulative sales revenue"
        icon={<DollarSign className="h-5 w-5 text-green-500" />}
      >
        <div className="text-3xl font-bold">${salesAmount}</div>
      </QuickInfoCard>
    </div>
  );
}
