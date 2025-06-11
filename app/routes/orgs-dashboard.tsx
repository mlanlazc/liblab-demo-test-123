import { executeQuery, QueryData } from '@/db/execute-query';
import { LoaderError } from '@/types/loader-error';
import { WithErrorHandling } from '@/components/hoc/error-handling-wrapper/error-handling-wrapper';
import {
  SubscriptionTierChart,
  SubscriptionTierData,
  subscriptionTierQuery,
} from '@/routes/orgs-dashboard/components/SubscriptionTierChart';
import {
  TopOrganizationsByRevenueChart,
  TopOrganizationsByRevenueData,
  topOrganizationsByRevenueQuery,
} from '@/routes/orgs-dashboard/components/TopOrganizationsByRevenueChart';
import {
  AveragePlanPriceChart,
  AveragePlanPriceData,
  averagePlanPriceQuery,
} from '@/routes/orgs-dashboard/components/AveragePlanPriceChart';
import {
  OrgKeyMetrics,
  TotalActiveUsersData,
  TotalProductsData,
  TotalSalesAmountData,
  totalActiveUsersQuery,
  totalProductsQuery,
  totalSalesAmountQuery,
} from '@/routes/orgs-dashboard/components/OrgKeyMetrics';

export async function loader(): Promise<OrgsDashboardProps | LoaderError> {
  try {
    const [subscriptionTiers, topOrgsByRevenue, averagePlanPrices, totalActiveUsers, totalProducts, totalSalesAmount] = await Promise.all([
      executeQuery<SubscriptionTierData>(subscriptionTierQuery),
      executeQuery<TopOrganizationsByRevenueData>(topOrganizationsByRevenueQuery),
      executeQuery<AveragePlanPriceData>(averagePlanPriceQuery),
      executeQuery<TotalActiveUsersData>(totalActiveUsersQuery),
      executeQuery<TotalProductsData>(totalProductsQuery),
      executeQuery<TotalSalesAmountData>(totalSalesAmountQuery),
    ]);

    return {
      subscriptionTiers,
      topOrgsByRevenue,
      averagePlanPrices,
      totalActiveUsers,
      totalProducts,
      totalSalesAmount,
    };
  } catch (error) {
    console.error('Error in organizations dashboard loader:', error);
    return { error: error instanceof Error ? error.message : 'Failed to load organizations dashboard data' };
  }
}

interface OrgsDashboardProps {
  subscriptionTiers: QueryData<SubscriptionTierData[]>;
  topOrgsByRevenue: QueryData<TopOrganizationsByRevenueData[]>;
  averagePlanPrices: QueryData<AveragePlanPriceData[]>;
  totalActiveUsers: QueryData<TotalActiveUsersData[]>;
  totalProducts: QueryData<TotalProductsData[]>;
  totalSalesAmount: QueryData<TotalSalesAmountData[]>;
}

export default function OrgsDashboard({
  subscriptionTiers,
  topOrgsByRevenue,
  averagePlanPrices,
  totalActiveUsers,
  totalProducts,
  totalSalesAmount,
}: OrgsDashboardProps) {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Amazing Organizations Dashboard</h1>

      <WithErrorHandling
        queryData={totalActiveUsers}
        render={(activeUsersData) => (
          <WithErrorHandling
            queryData={totalProducts}
            render={(productsData) => (
              <WithErrorHandling
                queryData={totalSalesAmount}
                render={(salesAmountData) => (
                  <OrgKeyMetrics
                    totalActiveUsers={activeUsersData}
                    totalProducts={productsData}
                    totalSalesAmount={salesAmountData}
                  />
                )}
              />
            )}
          />
        )}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WithErrorHandling
          queryData={subscriptionTiers}
          render={(data) => <SubscriptionTierChart data={data} />}
        />
        <WithErrorHandling
          queryData={topOrgsByRevenue}
          render={(data) => <TopOrganizationsByRevenueChart data={data} />}
        />
      </div>

      <div className="grid grid-cols-1">
        <WithErrorHandling
          queryData={averagePlanPrices}
          render={(data) => <AveragePlanPriceChart data={data} />}
        />
      </div>
    </div>
  );
}
