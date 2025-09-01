'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Booking } from '@/types/api';

interface BookingEditModalProps {
  selectedBooking: Booking | null;
  isOpen: boolean;
  isSubmitting: boolean;
  editFormData: {
    status: string;
    admin_notes: string;
  };
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onStatusChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}

const statusOptions = [
  { value: 'pending', label: 'Pending', variant: 'secondary' as const },
  { value: 'confirmed', label: 'Confirmed', variant: 'success' as const },
  { value: 'completed', label: 'Completed', variant: 'default' as const },
  { value: 'cancelled', label: 'Cancelled', variant: 'destructive' as const },
];

export function BookingEditModal({
  selectedBooking,
  isOpen,
  isSubmitting,
  editFormData,
  onClose,
  onSubmit,
  onStatusChange,
  onNotesChange,
}: BookingEditModalProps) {
  if (!isOpen || !selectedBooking) return null;

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

  const currentStatus = statusOptions.find(option => option.value === selectedBooking.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Manage Booking #{selectedBooking.id}
          </h3>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
          {/* Booking Details Section */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Booking Details
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Guest</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedBooking.guestName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedBooking.guestEmail}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current Status</p>
                <Badge variant={currentStatus?.variant} className="mt-1">
                  {currentStatus?.label}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Check-in</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {formatDate(selectedBooking.checkIn)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Check-out</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {formatDate(selectedBooking.checkOut)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {formatCurrency(selectedBooking.totalAmount)}
                </p>
              </div>
              {selectedBooking.property && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Property</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedBooking.property.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedBooking.property.location}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Edit Form */}
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Update Status
              </label>
              <Select
                value={editFormData.status}
                onValueChange={onStatusChange}
              >
                <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          option.variant === 'secondary' ? 'bg-gray-500' :
                          option.variant === 'success' ? 'bg-green-500' :
                          option.variant === 'default' ? 'bg-blue-500' :
                          'bg-red-500'
                        }`}></div>
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Admin Notes
              </label>
              <Textarea
                value={editFormData.admin_notes}
                onChange={(e) => onNotesChange(e.target.value)}
                placeholder="Add notes about this booking management action..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                These notes will be stored for audit purposes
              </p>
            </div>
          </div>
        </ScrollArea>

        {/* Fixed Footer */}
        <form onSubmit={onSubmit} className="border-t border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 flex justify-end space-x-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Update Booking
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}