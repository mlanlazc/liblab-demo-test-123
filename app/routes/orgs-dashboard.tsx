import { useFetcher } from '@remix-run/react';
import { executeQuery, QueryData } from '@/db/execute-query';
import { LoaderError } from '@/types/loader-error';
import { WithErrorHandling } from '@/components/hoc/error-handling-wrapper/error-handling-wrapper';
import { useEffect } from 'react';
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
import { OrganizationData, OrganizationsTable } from '@/routes/orgs-dashboard/components/OrganizationsTable';

export async function loader(): Promise<OrgsDashboardProps | LoaderError> {
  try {
    const [subscriptionTiers, topOrgsByRevenue, averagePlanPrices] = await Promise.all([
      executeQuery<SubscriptionTierData>(subscriptionTierQuery),
      executeQuery<TopOrganizationsByRevenueData>(topOrganizationsByRevenueQuery),
      executeQuery<AveragePlanPriceData>(averagePlanPriceQuery),
    ]);

    return {
      subscriptionTiers,
      topOrgsByRevenue,
      averagePlanPrices,
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
}

export default function OrgsDashboard({ subscriptionTiers, topOrgsByRevenue, averagePlanPrices }: OrgsDashboardProps) {
  const orgsFetcher = useFetcher<QueryData<{ organizations: OrganizationData[]; organizationsCount: number }>>();

  useEffect(() => {
    orgsFetcher.submit({ page: 1, limit: 10 }, { method: 'post', action: '/resources/orgs' });
  }, []);

  const handleOrgsTableFiltersChange = (filters: { page: number }): void => {
    orgsFetcher.submit(
      {
        page: filters.page,
        limit: 10,
      },
      { method: 'post', action: '/resources/orgs' },
    );
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Amazing Organizations Dashboard</h1>

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

      <WithErrorHandling
        queryData={orgsFetcher.data}
        render={(orgsData) => (
          <OrganizationsTable
            organizations={orgsData.organizations}
            organizationsCount={orgsData.organizationsCount}
            isLoading={orgsFetcher.state === 'submitting'}
            onFiltersChange={handleOrgsTableFiltersChange}
          />
        )}
      />
    </div>
  );
}
