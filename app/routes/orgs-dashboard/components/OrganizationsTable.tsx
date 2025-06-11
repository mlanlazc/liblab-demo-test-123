import { UniversalTableCard } from '@/components/building-blocks/universal-table-card/universal-table-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const organizationsQuery = `
  SELECT o.organization_name,
         COUNT(DISTINCT u.user_id) AS total_active_users,
         COUNT(DISTINCT p.product_id) AS total_products
  FROM organizations o
  LEFT JOIN users u ON o.organization_id = u.organization_id AND u.is_active = TRUE
  LEFT JOIN products p ON o.organization_id = p.organization_id
  GROUP BY o.organization_name
  ORDER BY o.organization_name
  LIMIT $1 OFFSET $2;
`;

export const organizationsCountQuery = `
  SELECT COUNT(*) as total
  FROM organizations;
`;

export interface OrganizationData {
  organization_name: string;
  total_active_users: number;
  total_products: number;
}

export interface OrganizationCountData {
  total: number;
}

const ITEMS_PER_PAGE = 10;

interface OrganizationsTableProps {
  organizations: OrganizationData[];
  organizationsCount: number;
  isLoading: boolean;
  onFiltersChange?: (filters: { page: number }) => void;
}

export function OrganizationsTable({ organizations, organizationsCount, isLoading, onFiltersChange }: OrganizationsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onFiltersChange?.({ page });
  };

  const totalPages = organizationsCount > 0 ? Math.ceil(organizationsCount / ITEMS_PER_PAGE) : 0;

  const PaginationControls = (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  );

  return (
    <UniversalTableCard
      title="Organizations Overview"
      description="List of all organizations with active users and product counts."
      CardFooterComponent={PaginationControls}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Organization Name</TableHead>
            <TableHead>Total Active Users</TableHead>
            <TableHead>Total Products</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : organizations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No organizations found
              </TableCell>
            </TableRow>
          ) : (
            organizations.map((org: OrganizationData) => (
              <TableRow key={org.organization_name}>
                <TableCell>{org.organization_name}</TableCell>
                <TableCell>{org.total_active_users}</TableCell>
                <TableCell>{org.total_products}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </UniversalTableCard>
  );
}
