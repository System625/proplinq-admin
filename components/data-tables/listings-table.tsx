'use client';

import { useEffect, useState } from 'react';
import { useListingsStore } from '@/stores/listings-store';
import { Listing } from '@/types/api';
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
import { ChevronLeft, ChevronRight, Eye, MapPin, Home, Check, X, ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ListingReviewModal } from '@/components/modals/listing-review-modal';
import { toast } from 'sonner';

const statusColors = {
  pending: 'secondary',
  approved: 'success',
  rejected: 'destructive',
} as const;

const typeColors = {
  rent: 'default',
  shortlet: 'outline',
  hotel: 'secondary',
} as const;

export function ListingsTable() {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState({
    action: '' as 'approve' | 'reject' | '',
    reason: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    listings,
    pagination,
    isLoading,
    statusFilter,
    statusCounts,
    fetchListings,
    fetchStatusCounts,
    reviewListing,
    setStatusFilter,
  } = useListingsStore();

  useEffect(() => {
    fetchListings();
    fetchStatusCounts();
  }, [fetchListings, fetchStatusCounts]);

  const handleTabChange = (status: string) => {
    setStatusFilter(status);
    fetchListings({ page: 1, status });
    fetchStatusCounts();
  };

  const handlePageChange = (page: number) => {
    fetchListings({ page });
  };

  const handleViewDetails = (listing: Listing) => {
    setSelectedListing(listing);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedListing(null);
  };

  const handleReviewClick = (listing: Listing, action?: 'approve' | 'reject') => {
    setSelectedListing(listing);
    setReviewData({
      action: action || '',
      reason: '',
    });
    setIsReviewModalOpen(true);
  };

  const handleReviewModalClose = () => {
    setIsReviewModalOpen(false);
    setSelectedListing(null);
    setReviewData({
      action: '',
      reason: '',
    });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing || !reviewData.action) return;

    setIsSubmitting(true);
    try {
      await reviewListing(selectedListing.id.toString(), {
        id: selectedListing.id.toString(),
        action: reviewData.action,
        reason: reviewData.reason || undefined,
      });

      toast.success(`Listing ${reviewData.action === 'approve' ? 'approved' : 'rejected'} successfully`);
      handleReviewModalClose();
      // Refresh data
      fetchListings();
      fetchStatusCounts();
    } catch {
      toast.error(`Failed to ${reviewData.action} listing`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActionChange = (action: 'approve' | 'reject') => {
    setReviewData(prev => ({
      ...prev,
      action,
      reason: action === 'approve' ? '' : prev.reason,
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

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  if (isLoading && listings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Listings</CardTitle>
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

  const { all: totalCount, pending: pendingCount, approved: approvedCount, rejected: rejectedCount } = statusCounts;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Property Listings</CardTitle>
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
              {!listings || listings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <Home className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No listings found</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {statusFilter !== 'all' ? `No ${statusFilter} listings` : 'There are no listings to display at the moment.'}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Owner/Agent</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listings &&
                        listings.map((listing) => (
                          <TableRow key={listing.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                                  {listing.images && listing.images.length > 0 ? (
                                    <ImageIcon className="h-5 w-5 text-gray-500" />
                                  ) : (
                                    <Home className="h-5 w-5 text-gray-500" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium line-clamp-1">
                                    {listing.title}
                                  </p>
                                  {listing.bedrooms && (
                                    <p className="text-sm text-muted-foreground">
                                      {listing.bedrooms} bed • {listing.bathrooms} bath
                                    </p>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={typeColors[listing.type]}>
                                {listing.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm">
                                  {listing.user.full_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {listing.user.agent_type?.replace('_', ' ')}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{listing.location}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">{formatPrice(listing.price)}</span>
                            </TableCell>
                            <TableCell>
                              <Badge variant={statusColors[listing.status]}>
                                {listing.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {formatDate(listing.created_at)}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewDetails(listing)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                {listing.status === 'pending' && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleReviewClick(listing, 'approve')}
                                      className="text-green-600 hover:text-green-700 border-green-300 hover:border-green-400"
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleReviewClick(listing, 'reject')}
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
                        {pagination.total} listings
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

      {/* Listing Details Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={handleCloseDetailModal}>
        <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Listing Details</DialogTitle>
          </DialogHeader>

          {selectedListing ? (
            <div className="space-y-6">
              {/* Property Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Property Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Title</label>
                    <p className="text-base font-semibold">{selectedListing.title}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <p className="text-sm">{selectedListing.description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Type</label>
                    <Badge variant={typeColors[selectedListing.type]} className="w-fit">
                      {selectedListing.type}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Price</label>
                    <p className="text-sm font-semibold">{formatPrice(selectedListing.price)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Bedrooms</label>
                    <p className="text-sm">{selectedListing.bedrooms || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Bathrooms</label>
                    <p className="text-sm">{selectedListing.bathrooms || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <Badge variant={statusColors[selectedListing.status]} className="w-fit">
                      {selectedListing.status}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Submitted</label>
                    <p className="text-sm">{formatDate(selectedListing.created_at)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Location Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Location</label>
                    <p className="text-sm">{selectedListing.location}</p>
                  </div>
                  {selectedListing.address && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Address</label>
                      <p className="text-sm">{selectedListing.address}</p>
                    </div>
                  )}
                  {selectedListing.city && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">City</label>
                      <p className="text-sm">{selectedListing.city}</p>
                    </div>
                  )}
                  {selectedListing.state && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">State</label>
                      <p className="text-sm">{selectedListing.state}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Owner Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Owner/Agent Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-sm font-semibold">{selectedListing.user.full_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-sm">{selectedListing.user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                    <p className="text-sm">{selectedListing.user.phone_number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Agent Type</label>
                    <p className="text-sm capitalize">{selectedListing.user.agent_type?.replace('_', ' ')}</p>
                  </div>
                  {selectedListing.user.agency_name && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Agency Name</label>
                      <p className="text-sm">{selectedListing.user.agency_name}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Amenities */}
              {selectedListing.amenities && selectedListing.amenities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Amenities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedListing.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Review Information */}
              {(selectedListing?.reviewed_by || selectedListing?.rejection_reason) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedListing?.reviewed_by && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Reviewed By</label>
                        <p className="text-sm">{selectedListing.reviewed_by}</p>
                      </div>
                    )}
                    {selectedListing?.reviewed_at && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Reviewed At</label>
                        <p className="text-sm">{formatDate(selectedListing.reviewed_at)}</p>
                      </div>
                    )}
                    {selectedListing?.rejection_reason && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Rejection Reason</label>
                        <p className="text-sm text-red-600">{selectedListing.rejection_reason}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">No listing selected</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Listing Review Modal */}
      <ListingReviewModal
        selectedListing={selectedListing}
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
