'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Clock, User, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupportDashboardStore } from '@/stores/support-dashboard-store';
import { format } from 'date-fns';

interface TicketDetailModalProps {
  ticketId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TicketDetailModal({ ticketId, isOpen, onClose }: TicketDetailModalProps) {
  const {
    selectedTicket,
    isTicketDetailLoading,
    fetchTicketDetails,
    respondToTicket,
    updateTicketStatus,
    closeTicket,
    clearSelectedTicket,
  } = useSupportDashboardStore();

  const [responseMessage, setResponseMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionType, setActionType] = useState<'respond' | 'assign' | 'status' | 'close' | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [resolutionNote, setResolutionNote] = useState('');

  useEffect(() => {
    if (isOpen && ticketId) {
      fetchTicketDetails(ticketId);
    }
    return () => {
      if (!isOpen) {
        clearSelectedTicket();
        setResponseMessage('');
        setActionType(null);
      }
    };
  }, [isOpen, ticketId, fetchTicketDetails, clearSelectedTicket]);

  if (!isOpen) return null;

  const handleClose = () => {
    clearSelectedTicket();
    setResponseMessage('');
    setActionType(null);
    onClose();
  };

  const handleRespond = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !responseMessage.trim()) return;

    setIsSubmitting(true);
    try {
      await respondToTicket(selectedTicket.id, responseMessage.trim());
      setResponseMessage('');
      setActionType(null);
    } catch {
      // Error handled in store
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedTicket || !selectedStatus) return;

    setIsSubmitting(true);
    try {
      await updateTicketStatus(selectedTicket.id, selectedStatus, selectedPriority || undefined);
      setSelectedStatus('');
      setSelectedPriority('');
      setActionType(null);
    } catch {
      // Error handled in store
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!selectedTicket) return;

    setIsSubmitting(true);
    try {
      await closeTicket(selectedTicket.id, resolutionNote.trim() || undefined);
      setResolutionNote('');
      setActionType(null);
      handleClose();
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
    open: 'secondary',
    in_progress: 'default',
    resolved: 'success',
    closed: 'outline',
  } as const;

  const priorityColors: Record<string, 'secondary' | 'default' | 'destructive'> = {
    low: 'secondary',
    medium: 'default',
    high: 'destructive',
    urgent: 'destructive',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {selectedTicket ? `Ticket #${selectedTicket.id}` : 'Loading...'}
            </h3>
            {selectedTicket && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {selectedTicket.title}
              </p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(90vh-180px)]">
            {isTicketDetailLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
              </div>
            ) : selectedTicket ? (
              <div className="p-6 space-y-6">
                {/* Ticket Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <Badge variant={statusColors[selectedTicket.status]} className="mt-1">
                      {selectedTicket.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Priority</p>
                    <Badge variant={priorityColors[selectedTicket.priority]} className="mt-1">
                      {selectedTicket.priority}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      {selectedTicket.category || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      {formatDate(selectedTicket.created_at)}
                    </p>
                  </div>
                </div>

                {/* User Info */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedTicket.user.full_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedTicket.user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Assigned Agent */}
                {selectedTicket.assigned_agent && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      Assigned Agent
                    </h4>
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedTicket.assigned_agent.full_name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedTicket.assigned_agent.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Description
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedTicket.description}
                  </p>
                </div>

                {/* Responses */}
                {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      Responses ({selectedTicket.responses.length})
                    </h4>
                    <div className="space-y-4">
                      {selectedTicket.responses.map((response) => (
                        <div
                          key={response.id}
                          className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {response.agent?.full_name || 'System'}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(response.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {response.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* History */}
                {selectedTicket.history && selectedTicket.history.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      Activity History
                    </h4>
                    <div className="space-y-2">
                      {selectedTicket.history.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-start gap-3 text-sm"
                        >
                          <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-gray-700 dark:text-gray-300">{entry.description}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {formatDate(entry.created_at)}
                              {entry.changed_by && ` by ${entry.changed_by.full_name}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Forms */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  {actionType === 'respond' && (
                    <form onSubmit={handleRespond} className="space-y-3">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        Add Response
                      </h4>
                      <Textarea
                        value={responseMessage}
                        onChange={(e) => setResponseMessage(e.target.value)}
                        placeholder="Type your response..."
                        className="min-h-[100px]"
                        disabled={isSubmitting}
                      />
                      <div className="flex gap-2">
                        <Button type="submit" disabled={isSubmitting || !responseMessage.trim()}>
                          <Send className="w-4 h-4 mr-2" />
                          {isSubmitting ? 'Sending...' : 'Send Response'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setActionType(null);
                            setResponseMessage('');
                          }}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}

                  {actionType === 'status' && (
                    <div className="space-y-3">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        Update Status
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Status
                          </label>
                          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">Open</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Priority
                          </label>
                          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleUpdateStatus} disabled={isSubmitting || !selectedStatus}>
                          {isSubmitting ? 'Updating...' : 'Update Status'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setActionType(null);
                            setSelectedStatus('');
                            setSelectedPriority('');
                          }}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {actionType === 'close' && (
                    <div className="space-y-3">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        Close Ticket
                      </h4>
                      <Textarea
                        value={resolutionNote}
                        onChange={(e) => setResolutionNote(e.target.value)}
                        placeholder="Resolution note (optional)"
                        className="min-h-[80px]"
                        disabled={isSubmitting}
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleCloseTicket} disabled={isSubmitting} variant="destructive">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          {isSubmitting ? 'Closing...' : 'Close Ticket'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setActionType(null);
                            setResolutionNote('');
                          }}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {!actionType && (selectedTicket.status === 'open' || selectedTicket.status === 'in_progress' || selectedTicket.status === 'resolved') && (
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => setActionType('respond')}>
                        <Send className="w-4 h-4 mr-2" />
                        Add Response
                      </Button>
                      <Button variant="outline" onClick={() => setActionType('status')}>
                        Update Status
                      </Button>
                      <Button variant="outline" onClick={() => setActionType('close')}>
                        Close Ticket
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <AlertCircle className="w-12 h-12 mb-4" />
                <p>Failed to load ticket details</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </motion.div>
    </div>
  );
}
