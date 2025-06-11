import { executeQuery } from '@/db/execute-query';
import {
  OrganizationCountData,
  OrganizationData,
  organizationsCountQuery,
  organizationsQuery,
} from '@/routes/orgs-dashboard/components/OrganizationsTable';

export async function action({ request }: { request: Request }) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const formData = await request.formData();
    const page = parseInt(formData.get('page') as string) || 1;
    const limit = parseInt(formData.get('limit') as string) || 10;
    const offset = (page - 1) * limit;

    const orgsCount = await executeQuery<OrganizationCountData>(organizationsCountQuery);
    if (orgsCount.isError) {
      return Response.json(orgsCount);
    }

    const orgs = await executeQuery<OrganizationData>(organizationsQuery, [limit.toString(), offset.toString()]);
    if (orgs.isError) {
      return Response.json(orgs);
    }

    return Response.json({
      data: {
        organizations: orgs.data,
        organizationsCount: orgsCount.data[0].total,
      },
      isError: false,
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return Response.json({ error: 'Failed to fetch organizations' }, { status: 500 });
  }
}
