'use client';

import { motion } from 'framer-motion';
import { DollarSign, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Booking } from '@/types/api';

interface BookingRefundModalProps {
  selectedBooking: Booking | null;
  isOpen: boolean;
  isSubmitting: boolean;
  refundFormData: {
    amount: string;
    reason: string;
  };
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onAmountChange: (value: string) => void;
  onReasonChange: (value: string) => void;
}

export function BookingRefundModal({
  selectedBooking,
  isOpen,
  isSubmitting,
  refundFormData,
  onClose,
  onSubmit,
  onAmountChange,
  onReasonChange,
}: BookingRefundModalProps) {
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

  const statusColors = {
    pending: 'secondary',
    confirmed: 'success',
    cancelled: 'destructive',
    completed: 'default',
  } as const;

  const maxRefundAmount = selectedBooking.totalAmount;
  const refundAmount = parseFloat(refundFormData.amount) || 0;
  const isValidAmount = refundAmount > 0 && refundAmount <= maxRefundAmount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Process Refund - Booking #{selectedBooking.id}
          </h3>
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[400px]">
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
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <Badge variant={statusColors[selectedBooking.status]} className="mt-1">
                    {selectedBooking.status}
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
                  <p className="text-sm text-gray-500 dark:text-gray-400">Original Amount</p>
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

            {/* Refund Form */}
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Refund Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="number"
                    value={refundFormData.amount}
                    onChange={(e) => onAmountChange(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    max={maxRefundAmount}
                    step="0.01"
                    className="pl-10 w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Maximum refundable: {formatCurrency(maxRefundAmount)}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onAmountChange((maxRefundAmount * 0.5).toFixed(2))}
                    >
                      50%
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onAmountChange(maxRefundAmount.toString())}
                    >
                      Full
                    </Button>
                  </div>
                </div>
                {!isValidAmount && refundFormData.amount && (
                  <p className="text-xs text-red-500 mt-1">
                    Please enter a valid amount between $0.01 and {formatCurrency(maxRefundAmount)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Refund Reason
                </label>
                <Textarea
                  value={refundFormData.reason}
                  onChange={(e) => onReasonChange(e.target.value)}
                  placeholder="Enter the reason for this refund..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                  required
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  This reason will be recorded for audit purposes and may be shared with the guest
                </p>
              </div>

              {/* Refund Summary */}
              {isValidAmount && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Refund Summary</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Original Payment:</span>
                      <span className="font-medium">{formatCurrency(selectedBooking.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Refund Amount:</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        -{formatCurrency(refundAmount)}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-2 flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Remaining Balance:</span>
                      <span className="font-medium">
                        {formatCurrency(selectedBooking.totalAmount - refundAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Fixed Footer */}
        <form onSubmit={onSubmit} className="border-t border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 flex justify-end space-x-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isValidAmount || !refundFormData.reason.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Processing...
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Process Refund
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}