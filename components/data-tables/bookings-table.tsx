'use client';

import { useEffect, useState } from 'react';
import { useBookingsStore } from '@/stores/bookings-store';
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
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Edit, Search, DollarSign } from 'lucide-react';
import { Booking, BookingUpdate } from '@/types/api';
import { BookingEditModal } from '@/components/modals/booking-edit-modal';
import { BookingRefundModal } from '@/components/modals/booking-refund-modal';
import { toast } from 'sonner';

const statusColors = {
  pending: 'secondary',
  confirmed: 'success',
  cancelled: 'destructive',
  completed: 'default',
} as const;

export function BookingsTable() {
  const {
    bookings,
    pagination,
    isLoading,
    statusFilter,
    searchTerm,
    fetchBookings,
    updateBooking,
    processRefund,
    setStatusFilter,
    setSearchTerm,
  } = useBookingsStore();

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    status: '',
    admin_notes: '',
  });
  const [refundFormData, setRefundFormData] = useState({
    amount: '',
    reason: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        setSearchTerm(localSearchTerm);
        fetchBookings({ page: 1, search: localSearchTerm });
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [localSearchTerm, searchTerm, setSearchTerm, fetchBookings]);

  const handleEditClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditFormData({
      status: booking.status,
      admin_notes: '',
    });
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedBooking(null);
    setEditFormData({
      status: '',
      admin_notes: '',
    });
  };

  const handleRefundClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setRefundFormData({
      amount: '',
      reason: '',
    });
    setIsRefundModalOpen(true);
  };

  const handleRefundModalClose = () => {
    setIsRefundModalOpen(false);
    setSelectedBooking(null);
    setRefundFormData({
      amount: '',
      reason: '',
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    setIsSubmitting(true);
    try {
      await updateBooking(selectedBooking.id, {
        status: editFormData.status as Booking['status'],
        admin_notes: editFormData.admin_notes,
      } as BookingUpdate);
      
      toast.success('Booking updated successfully');
      handleEditModalClose();
    } catch {
      toast.error('Failed to update booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = (value: string) => {
    setEditFormData(prev => ({
      ...prev,
      status: value,
    }));
  };

  const handleNotesChange = (value: string) => {
    setEditFormData(prev => ({
      ...prev,
      admin_notes: value,
    }));
  };

  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    setIsSubmitting(true);
    try {
      const amount = parseFloat(refundFormData.amount);
      await processRefund(selectedBooking.id, amount, refundFormData.reason);
      
      toast.success('Refund processed successfully');
      handleRefundModalClose();
    } catch {
      toast.error('Failed to process refund');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefundAmountChange = (value: string) => {
    setRefundFormData(prev => ({
      ...prev,
      amount: value,
    }));
  };

  const handleRefundReasonChange = (value: string) => {
    setRefundFormData(prev => ({
      ...prev,
      reason: value,
    }));
  };

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
    fetchBookings({ page: 1, status: status !== 'all' ? status : undefined });
  };

  const handlePageChange = (page: number) => {
    fetchBookings({ page });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading && bookings.length === 0) {
    return (
      <Card>
        <CardHeader>          
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-40" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>        
        <div className="flex w-full items-center space-x-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search bookings..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {!bookings || bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 9l6-6m0 0l6 6m-6-6v6" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No bookings found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {statusFilter !== 'all' ? `No bookings with "${statusFilter}" status` : 'There are no bookings to display at the moment.'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.guestName}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.guestEmail}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(booking.checkIn)}</TableCell>
                    <TableCell>{formatDate(booking.checkOut)}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(booking.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[booking.status]}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(booking)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRefundClick(booking)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <DollarSign className="h-4 w-4" />
                        </Button>
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
                  {pagination.total} bookings
                </p>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (pagination.page > 1) {
                            handlePageChange(pagination.page - 1);
                          }
                        }}
                        className={pagination.page === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(pageNum);
                            }}
                            isActive={pagination.page === pageNum}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (pagination.page < pagination.totalPages) {
                            handlePageChange(pagination.page + 1);
                          }
                        }}
                        className={pagination.page === pagination.totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>

      <BookingEditModal
        selectedBooking={selectedBooking}
        isOpen={isEditModalOpen}
        isSubmitting={isSubmitting}
        editFormData={editFormData}
        onClose={handleEditModalClose}
        onSubmit={handleEditSubmit}
        onStatusChange={handleStatusChange}
        onNotesChange={handleNotesChange}
      />

      <BookingRefundModal
        selectedBooking={selectedBooking}
        isOpen={isRefundModalOpen}
        isSubmitting={isSubmitting}
        refundFormData={refundFormData}
        onClose={handleRefundModalClose}
        onSubmit={handleRefundSubmit}
        onAmountChange={handleRefundAmountChange}
        onReasonChange={handleRefundReasonChange}
      />
    </Card>
  );
}