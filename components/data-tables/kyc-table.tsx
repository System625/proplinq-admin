'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useKycStore } from '@/stores/kyc-store';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight, Eye, FileText } from 'lucide-react';
import { MOCK_USERS } from '@/lib/mock-data';

const statusColors = {
  pending: 'secondary',
  approved: 'success',
  rejected: 'destructive',
} as const;

const documentTypeLabels = {
  passport: 'Passport',
  driver_license: 'Driver License',
  national_id: 'National ID',
} as const;

export function KycTable() {
  const router = useRouter();
  const {
    verifications,
    pagination,
    isLoading,
    statusFilter,
    fetchVerifications,
    setStatusFilter,
  } = useKycStore();

  useEffect(() => {
    fetchVerifications();
  }, [fetchVerifications]);

  const handleTabChange = (status: string) => {
    setStatusFilter(status);
    fetchVerifications({ page: 1, status });
  };

  const handlePageChange = (page: number) => {
    fetchVerifications({ page });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getUserName = (userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  };

  const getUserEmail = (userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId);
    return user?.email || 'Unknown Email';
  };

  if (isLoading && verifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>KYC Verifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const pendingCount = verifications.filter(v => v.status === 'pending').length;
  const approvedCount = verifications.filter(v => v.status === 'approved').length;
  const rejectedCount = verifications.filter(v => v.status === 'rejected').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>KYC Verifications</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={statusFilter} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({verifications.length})</TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingCount})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedCount})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({rejectedCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={statusFilter} className="mt-6">
            {verifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No KYC verifications found
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Document Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Reviewed</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {verifications.map((verification) => (
                      <TableRow key={verification.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {getUserName(verification.userId)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {getUserEmail(verification.userId)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {documentTypeLabels[verification.documentType]}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusColors[verification.status]}>
                            {verification.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDate(verification.submittedAt)}
                        </TableCell>
                        <TableCell>
                          {verification.reviewedAt ? (
                            formatDate(verification.reviewedAt)
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(`/kyc/${verification.id}`)
                            }
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                      {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                      {pagination.total} verifications
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium">
                        Page {pagination.page} of {pagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}