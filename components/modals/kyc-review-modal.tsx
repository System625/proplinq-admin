'use client';

import { motion } from 'framer-motion';
import { Check, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { KycVerification } from '@/types/api';

interface KycReviewModalProps {
  selectedVerification: KycVerification | null;
  isOpen: boolean;
  isSubmitting: boolean;
  reviewData: {
    action: 'approve' | 'reject' | '';
    reason: string;
  };
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onActionChange: (action: 'approve' | 'reject') => void;
  onReasonChange: (reason: string) => void;
}

export function KycReviewModal({
  selectedVerification,
  isOpen,
  isSubmitting,
  reviewData,
  onClose,
  onSubmit,  
  onReasonChange,
}: KycReviewModalProps) {
  if (!isOpen || !selectedVerification) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const statusColors = {
    pending: 'secondary',
    approved: 'success',
    rejected: 'destructive',
  } as const;

  const isApproval = reviewData.action === 'approve';
  const isRejection = reviewData.action === 'reject';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            {isApproval && <Check className="w-5 h-5 mr-2 text-green-600" />}
            {isRejection && <X className="w-5 h-5 mr-2 text-red-600" />}
            {!reviewData.action && <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />}
            Review KYC Verification
          </h3>
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[400px]">
            {/* User Details Section */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                User Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedVerification.user?.full_name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedVerification.user?.email || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Status</p>
                  <Badge variant={statusColors[selectedVerification.status]} className="mt-1">
                    {selectedVerification.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Submitted Date</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {formatDate(selectedVerification.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* KYC Details Section */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                KYC Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">BVN</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedVerification.bvn || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">NIN</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedVerification.nin || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Employment Status</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedVerification.employment_status || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Occupation</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedVerification.occupation || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Company Name</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedVerification.company_name || 'N/A'}
                  </p>
                </div>
                {selectedVerification.business_name && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Business Name</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {selectedVerification.business_name}
                    </p>
                  </div>
                )}
                {selectedVerification.tin && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">TIN</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {selectedVerification.tin}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Review Section */}
            <div className="p-6 space-y-6">              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isRejection ? 'Rejection Reason' : 'Review Notes'} {isRejection && <span className="text-red-500">*</span>}
                </label>
                <Textarea
                  value={reviewData.reason}
                  onChange={(e) => onReasonChange(e.target.value)}
                  placeholder={
                    isRejection 
                      ? "Please provide a reason for rejection..."
                      : "Add any additional notes about this review (optional)..."
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {isRejection 
                    ? "This reason will be shared with the user"
                    : "These notes are for internal record-keeping"
                  }
                </p>
              </div>

              {/* Review Summary */}
              {reviewData.action && (
                <div className={`rounded-lg p-4 ${
                  isApproval ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
                }`}>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Review Summary</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Action:</span>
                      <span className={`font-medium ${
                        isApproval ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {isApproval ? 'Approve Verification' : 'Reject Verification'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">User:</span>
                      <span className="font-medium">{selectedVerification.user?.full_name}</span>
                    </div>
                    {reviewData.reason && (
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                        <span className="text-gray-600 dark:text-gray-300 block mb-1">
                          {isRejection ? 'Rejection Reason:' : 'Notes:'}
                        </span>
                        <span className="text-sm italic">{reviewData.reason}</span>
                      </div>
                    )}
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
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !reviewData.action || (isRejection && !reviewData.reason.trim())}
              className={isApproval ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Processing...
                </>
              ) : (
                <>
                  {isApproval && <Check className="w-4 h-4 mr-2" />}
                  {isRejection && <X className="w-4 h-4 mr-2" />}
                  {isApproval ? 'Approve Verification' : 'Reject Verification'}
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}