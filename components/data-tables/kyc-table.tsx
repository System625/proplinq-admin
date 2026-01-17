'use client';

import { useEffect, useState } from 'react';
import { useKycStore } from '@/stores/kyc-store';
import { KycVerification } from '@/types/api';
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
import { ChevronLeft, ChevronRight, Eye, FileText, User, Building, CreditCard, Check, X } from 'lucide-react';
import { DocumentButtons } from './document-buttons';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { KycReviewModal } from '@/components/modals/kyc-review-modal';

const statusColors = {
  pending: 'secondary',
  approved: 'success',
  rejected: 'destructive',
} as const;

export function KycTable() {
  const [selectedVerification, setSelectedVerification] = useState<KycVerification | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState({
    action: '' as 'approve' | 'reject' | '',
    reason: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    verifications,
    pagination,
    isLoading,
    statusFilter,
    statusCounts,
    fetchVerifications,
    fetchStatusCounts,
    reviewVerification,
    setStatusFilter,
  } = useKycStore();

  useEffect(() => {
    fetchVerifications();
    fetchStatusCounts();
  }, [fetchVerifications, fetchStatusCounts]);

  const handleTabChange = (status: string) => {
    setStatusFilter(status);
    fetchVerifications({ page: 1, status });
    // Optionally refresh counts when switching tabs
    fetchStatusCounts();
  };

  const handlePageChange = (page: number) => {
    fetchVerifications({ page });
  };

  const handleViewDetails = (verification: KycVerification) => {
    setSelectedVerification(verification);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedVerification(null);
  };

  const handleReviewClick = (verification: KycVerification, action?: 'approve' | 'reject') => {
    setSelectedVerification(verification);
    setReviewData({
      action: action || '',
      reason: '',
    });
    setIsReviewModalOpen(true);
  };

  const handleReviewModalClose = () => {
    setIsReviewModalOpen(false);
    setSelectedVerification(null);
    setReviewData({
      action: '',
      reason: '',
    });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVerification || !reviewData.action) return;

    setIsSubmitting(true);
    try {
      await reviewVerification(selectedVerification.id.toString(), {
        id: selectedVerification.id.toString(),
        action: reviewData.action,
        reason: reviewData.reason || undefined,
      });

      handleReviewModalClose();
    } catch {
      // Error toast is already shown by the store
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActionChange = (action: 'approve' | 'reject') => {
    setReviewData(prev => ({
      ...prev,
      action,
      reason: action === 'approve' ? '' : prev.reason, // Clear reason for approval
    }));
  };

  const handleReasonChange = (reason: string) => {
    setReviewData(prev => ({
      ...prev,
      reason,
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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

  // Use status counts from the store (fetched from backend)
  const { all: totalCount, pending: pendingCount, approved: approvedCount, rejected: rejectedCount } = statusCounts;

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>KYC Verifications</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={statusFilter} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({totalCount})</TabsTrigger>
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
            {!verifications || verifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No KYC verifications found</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {statusFilter !== 'all' ? `No ${statusFilter} KYC verifications` : 'There are no KYC verifications to display at the moment.'}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Documents</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {verifications &&
                      verifications.map((verification) => (
                        <TableRow key={verification.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {verification.user.full_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {verification.user.email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={statusColors[verification.status]}
                            >
                              {verification.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatDate(verification.created_at)}
                          </TableCell>
                          <TableCell>
                            <DocumentButtons verification={verification} />
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(verification)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              {verification.status === 'pending' && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleReviewClick(verification, 'approve')}
                                    className="text-green-600 hover:text-green-700 border-green-300 hover:border-green-400"
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleReviewClick(verification, 'reject')}
                                    className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
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

    {/* KYC Details Modal */}
    <Dialog open={isDetailModalOpen} onOpenChange={handleCloseDetailModal}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>KYC Verification Details</DialogTitle>
        </DialogHeader>
        
        {selectedVerification ? (
          <div className="space-y-6">
            {/* User Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-sm font-semibold">{selectedVerification.user.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{selectedVerification.user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                  <p className="text-sm">{selectedVerification.user.phone_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <p className="text-sm">{selectedVerification.user.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Agent Type</label>
                  <p className="text-sm capitalize">{selectedVerification.user.agent_type?.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Agency Name</label>
                  <p className="text-sm">{selectedVerification.user.agency_name}</p>
                </div>
              </CardContent>
            </Card>

            {/* KYC Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  KYC Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">BVN</label>
                  <p className="text-sm font-mono">{selectedVerification.bvn}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">NIN</label>
                  <p className="text-sm font-mono">{selectedVerification.nin}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge variant={statusColors[selectedVerification.status]} className="w-fit">
                    {selectedVerification.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Submitted</label>
                  <p className="text-sm">{formatDate(selectedVerification.created_at)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Employment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Employment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Employment Status</label>
                  <p className="text-sm capitalize">{selectedVerification.employment_status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                  <p className="text-sm">{selectedVerification.occupation}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Company Name</label>
                  <p className="text-sm">{selectedVerification.company_name}</p>
                </div>
                {selectedVerification.business_name && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Business Name</label>
                    <p className="text-sm">{selectedVerification.business_name}</p>
                  </div>
                )}
                {selectedVerification.tin && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">TIN</label>
                    <p className="text-sm font-mono">{selectedVerification.tin}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentButtons verification={selectedVerification!} />
              </CardContent>
            </Card>

            {/* Review Information */}
            {(selectedVerification?.reviewed_by || selectedVerification?.rejection_reason) && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedVerification?.reviewed_by && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Reviewed By</label>
                      <p className="text-sm">{selectedVerification.reviewed_by}</p>
                    </div>
                  )}
                  {selectedVerification?.reviewed_at && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Reviewed At</label>
                      <p className="text-sm">{formatDate(selectedVerification.reviewed_at)}</p>
                    </div>
                  )}
                  {selectedVerification?.rejection_reason && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Rejection Reason</label>
                      <p className="text-sm text-red-600">{selectedVerification.rejection_reason}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">No verification selected</p>
          </div>
        )}
      </DialogContent>
    </Dialog>

    {/* KYC Review Modal */}
    <KycReviewModal
      selectedVerification={selectedVerification}
      isOpen={isReviewModalOpen}
      isSubmitting={isSubmitting}
      reviewData={reviewData}
      onClose={handleReviewModalClose}
      onSubmit={handleReviewSubmit}
      onActionChange={handleActionChange}
      onReasonChange={handleReasonChange}
    />
    </>
  );
}