import { useLoaderData } from '@remix-run/react';
import { ErrorComponent } from '@/components/building-blocks/error-component/error-component';
import OrgsDashboard, { loader as orgsDashboardLoader } from './orgs-dashboard';

export async function loader() {
  return orgsDashboardLoader();
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  if ('error' in data) {
    return <ErrorComponent errorMessage={data.error} />;
  }

  return <OrgsDashboard {...data} />;
}
