import { UniversalTableCard } from '@/components/building-blocks/universal-table-card/universal-table-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

export const usersQuery = `
  SELECT
    id,
    email,
    created_at,
    last_login_at,
    is_email_verified,
    signup_method
  FROM users
  ORDER BY created_at DESC
  LIMIT $1 OFFSET $2
`;

export const usersCountQuery = `
  SELECT COUNT(*) as total FROM users
`;

export interface UserData {
  id: string;
  email: string;
  created_at: string;
  last_login_at: string | null;
  is_email_verified: boolean;
  signup_method: string;
}

export interface UserCountData {
  total: number;
}

const ITEMS_PER_PAGE = 10;

interface UsersTableProps {
  users: UserData[];
  usersCount: number;
  isLoading: boolean;
  onFiltersChange?: (filters: { page: number }) => void;
}

export function UsersTable({ users, usersCount, isLoading, onFiltersChange }: UsersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onFiltersChange?.({ page });
  };

  const totalPages = usersCount > 0 ? Math.ceil(usersCount / ITEMS_PER_PAGE) : 0;

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
      title="All Users"
      description="List of all registered users"
      CardFooterComponent={PaginationControls}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Signup Method</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Last Login</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user: UserData) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.signup_method}</TableCell>
                <TableCell>
                  <Badge variant={user.is_email_verified ? 'default' : 'destructive'}>
                    {user.is_email_verified ? 'Yes' : 'No'}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
                <TableCell>{user.last_login_at ? new Date(user.last_login_at).toLocaleString() : '-'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </UniversalTableCard>
  );
}
