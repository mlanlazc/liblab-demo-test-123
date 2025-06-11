import { useFetcher } from '@remix-run/react';
import { executeQuery, QueryData } from '@/db/execute-query';
import { LoaderError } from '@/types/loader-error';
import { WithErrorHandling } from '@/components/hoc/error-handling-wrapper/error-handling-wrapper';
import { useEffect } from 'react';
import { UserKeyMetrics, UserKeyMetricsData, userKeyMetricsQuery } from '@/routes/users/components/UserKeyMetrics';
import {
  UserRegistrationTrendChart,
  UserRegistrationTrendData,
  userRegistrationTrendQuery,
} from '@/routes/users/components/UserRegistrationTrendChart';
import { UserData, UsersTable } from '@/routes/users/components/UsersTable';

export async function loader(): Promise<UsersDashboardProps | LoaderError> {
  try {
    const [userKeyMetrics, userRegistrationTrend] = await Promise.all([
      executeQuery<UserKeyMetricsData>(userKeyMetricsQuery),
      executeQuery<UserRegistrationTrendData>(userRegistrationTrendQuery),
    ]);

    return {
      userKeyMetrics,
      userRegistrationTrend,
    };
  } catch (error) {
    console.error('Error in users dashboard loader:', error);
    return { error: error instanceof Error ? error.message : 'Failed to load users dashboard data' };
  }
}

interface UsersDashboardProps {
  userKeyMetrics: QueryData<UserKeyMetricsData[]>;
  userRegistrationTrend: QueryData<UserRegistrationTrendData[]>;
}

export default function UsersDashboard({ userKeyMetrics, userRegistrationTrend }: UsersDashboardProps) {
  const usersFetcher = useFetcher<QueryData<{ users: UserData[]; usersCount: number }>>();

  useEffect(() => {
    usersFetcher.submit({ page: 1, limit: 10 }, { method: 'post', action: '/resources/users' });
  }, []);

  const handleUsersTableFiltersChange = (filters: { page: number }): void => {
    usersFetcher.submit(
      {
        page: filters.page,
        limit: 10,
      },
      { method: 'post', action: '/resources/users' },
    );
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Users Dashboard</h1>

      <WithErrorHandling
        queryData={userKeyMetrics}
        render={(data) => <UserKeyMetrics data={data} />}
      />

      <div className="grid grid-cols-1">
        <WithErrorHandling
          queryData={userRegistrationTrend}
          render={(data) => <UserRegistrationTrendChart data={data} />}
        />
      </div>

      <WithErrorHandling
        queryData={usersFetcher.data}
        render={(usersData) => (
          <UsersTable
            users={usersData.users}
            usersCount={usersData.usersCount}
            isLoading={usersFetcher.state === 'submitting'}
            onFiltersChange={handleUsersTableFiltersChange}
          />
        )}
      />
    </div>
  );
}
