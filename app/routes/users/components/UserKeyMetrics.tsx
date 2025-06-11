import { UserCheck, UserPlus, Users, UserX } from 'lucide-react';
import { QuickInfoCard } from '@/components/building-blocks/quick-info-card/quick-info-card';

export const userKeyMetricsQuery = `
  SELECT
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE is_email_verified = true) as verified_users,
    COUNT(*) FILTER (WHERE is_email_verified = false) as unverified_users,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as new_users_last_30_days
  FROM users
`;

export type UserKeyMetricsData = {
  total_users: number;
  verified_users: number;
  unverified_users: number;
  new_users_last_30_days: number;
};

interface UserKeyMetricsProps {
  data: UserKeyMetricsData[];
}

export function UserKeyMetrics({ data }: UserKeyMetricsProps) {
  const metrics = data?.[0];
  if (!metrics) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <QuickInfoCard
        title="Total Users"
        description="All registered users"
        icon={<Users className="h-5 w-5 text-blue-500" />}
      >
        <div className="text-3xl font-bold">{metrics.total_users}</div>
      </QuickInfoCard>

      <QuickInfoCard
        title="New Users (Last 30 Days)"
        description="Users who joined recently"
        icon={<UserPlus className="h-5 w-5 text-green-500" />}
      >
        <div className="text-3xl font-bold">{metrics.new_users_last_30_days}</div>
      </QuickInfoCard>

      <QuickInfoCard
        title="Verified Users"
        description="Users with verified email"
        icon={<UserCheck className="h-5 w-5 text-emerald-500" />}
      >
        <div className="text-3xl font-bold">{metrics.verified_users}</div>
      </QuickInfoCard>

      <QuickInfoCard
        title="Unverified Users"
        description="Users with unverified email"
        icon={<UserX className="h-5 w-5 text-amber-500" />}
      >
        <div className="text-3xl font-bold">{metrics.unverified_users}</div>
      </QuickInfoCard>
    </div>
  );
}
