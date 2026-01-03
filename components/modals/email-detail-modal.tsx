'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Send, User, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSupportDashboardStore } from '@/stores/support-dashboard-store';
import { format } from 'date-fns';

interface EmailDetailModalProps {
  emailId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EmailDetailModal({ emailId, isOpen, onClose }: EmailDetailModalProps) {
  const {
    selectedEmail,
    isEmailDetailLoading,
    fetchEmailDetails,
    replyToEmail,
    clearSelectedEmail,
  } = useSupportDashboardStore();

  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replySubject, setReplySubject] = useState('');
  const [replyBody, setReplyBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && emailId) {
      fetchEmailDetails(emailId);
    }
    return () => {
      if (!isOpen) {
        clearSelectedEmail();
        setShowReplyForm(false);
        setReplySubject('');
        setReplyBody('');
      }
    };
  }, [isOpen, emailId, fetchEmailDetails, clearSelectedEmail]);

  // Auto-populate reply subject when showing reply form
  useEffect(() => {
    if (showReplyForm && selectedEmail && !replySubject) {
      const subject = selectedEmail.subject.startsWith('Re: ')
        ? selectedEmail.subject
        : `Re: ${selectedEmail.subject}`;
      setReplySubject(subject);
    }
  }, [showReplyForm, selectedEmail, replySubject]);

  if (!isOpen) return null;

  const handleClose = () => {
    clearSelectedEmail();
    setShowReplyForm(false);
    setReplySubject('');
    setReplyBody('');
    onClose();
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmail || !replySubject.trim() || !replyBody.trim()) return;

    setIsSubmitting(true);
    try {
      await replyToEmail(selectedEmail.id, {
        subject: replySubject.trim(),
        body: replyBody.trim(),
      });
      setShowReplyForm(false);
      setReplySubject('');
      setReplyBody('');
    } catch {
      // Error handled in store
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy hh:mm a');
    } catch {
      return dateString;
    }
  };

  const statusColors = {
    unread: 'destructive',
    read: 'secondary',
    replied: 'success',
  } as const;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedEmail ? `Email #${selectedEmail.id}` : 'Loading...'}
              </h3>
              {selectedEmail && (
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={statusColors[selectedEmail.status]}>
                    {selectedEmail.status}
                  </Badge>
                </div>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(90vh-180px)]">
            {isEmailDetailLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
              </div>
            ) : selectedEmail ? (
              <div className="p-6 space-y-6">
                {/* Email Metadata */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">From</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedEmail.from}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">To</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedEmail.to}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(selectedEmail.created_at)}</span>
                    </div>
                  </div>
                  {selectedEmail.replied_at && (
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Replied on {formatDate(selectedEmail.replied_at)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Email Subject */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Subject
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedEmail.subject}
                  </p>
                </div>

                {/* Email Body */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Message
                  </h4>
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {selectedEmail.body}
                    </p>
                  </div>
                </div>

                {/* Reply Form */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  {showReplyForm ? (
                    <form onSubmit={handleReply} className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        Reply to Email
                      </h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Subject
                        </label>
                        <Input
                          type="text"
                          value={replySubject}
                          onChange={(e) => setReplySubject(e.target.value)}
                          placeholder="Email subject"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Message
                        </label>
                        <Textarea
                          value={replyBody}
                          onChange={(e) => setReplyBody(e.target.value)}
                          placeholder="Type your reply..."
                          className="min-h-[200px]"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          disabled={isSubmitting || !replySubject.trim() || !replyBody.trim()}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          {isSubmitting ? 'Sending...' : 'Send Reply'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowReplyForm(false);
                            setReplySubject('');
                            setReplyBody('');
                          }}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      {selectedEmail.status !== 'replied' && (
                        <Button onClick={() => setShowReplyForm(true)}>
                          <Send className="w-4 h-4 mr-2" />
                          Reply to Email
                        </Button>
                      )}
                      {selectedEmail.status === 'replied' && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Mail className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span>This email has been replied to</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <AlertCircle className="w-12 h-12 mb-4" />
                <p>Failed to load email details</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </motion.div>
    </div>
  );
}
