'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Phone, Clock, User, Calendar, PlayCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSupportDashboardStore } from '@/stores/support-dashboard-store';
import { format } from 'date-fns';

interface CallDetailModalProps {
  callId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CallDetailModal({ callId, isOpen, onClose }: CallDetailModalProps) {
  const {
    selectedCall,
    isCallDetailLoading,
    fetchCallDetails,
    scheduleCallback,
    clearSelectedCall,
  } = useSupportDashboardStore();

  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [callbackDateTime, setCallbackDateTime] = useState('');
  const [callbackNotes, setCallbackNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && callId) {
      fetchCallDetails(callId);
    }
    return () => {
      if (!isOpen) {
        clearSelectedCall();
        setShowScheduleForm(false);
        setCallbackDateTime('');
        setCallbackNotes('');
      }
    };
  }, [isOpen, callId, fetchCallDetails, clearSelectedCall]);

  if (!isOpen) return null;

  const handleClose = () => {
    clearSelectedCall();
    setShowScheduleForm(false);
    setCallbackDateTime('');
    setCallbackNotes('');
    onClose();
  };

  const handleScheduleCallback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCall || !callbackDateTime) return;

    setIsSubmitting(true);
    try {
      await scheduleCallback(selectedCall.id, {
        callback_scheduled_at: callbackDateTime,
        notes: callbackNotes.trim() || undefined,
      });
      setShowScheduleForm(false);
      setCallbackDateTime('');
      setCallbackNotes('');
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

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const statusColors = {
    scheduled: 'secondary',
    in_progress: 'default',
    completed: 'success',
    missed: 'destructive',
  } as const;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Phone className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedCall ? `Call #${selectedCall.id}` : 'Loading...'}
              </h3>
              {selectedCall && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {selectedCall.phone_number}
                </p>
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
            {isCallDetailLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
              </div>
            ) : selectedCall ? (
              <div className="p-6 space-y-6">
                {/* Call Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <Badge variant={statusColors[selectedCall.status]} className="mt-1">
                      {selectedCall.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      {formatDuration(selectedCall.duration)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      {selectedCall.phone_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      {selectedCall.user_id}
                    </p>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Call Timeline
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedCall.scheduled_at && (
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                          <Calendar className="w-4 h-4" />
                          <span>Scheduled</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(selectedCall.scheduled_at)}
                        </p>
                      </div>
                    )}
                    {selectedCall.started_at && (
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                          <Clock className="w-4 h-4" />
                          <span>Started</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(selectedCall.started_at)}
                        </p>
                      </div>
                    )}
                    {selectedCall.ended_at && (
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                          <Clock className="w-4 h-4" />
                          <span>Ended</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(selectedCall.ended_at)}
                        </p>
                      </div>
                    )}
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
                        {selectedCall.user.full_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedCall.user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Assigned Agent */}
                {selectedCall.assigned_agent && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      Assigned Agent
                    </h4>
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedCall.assigned_agent.full_name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedCall.assigned_agent.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedCall.notes && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      Call Notes
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {selectedCall.notes}
                    </p>
                  </div>
                )}

                {/* Recording */}
                {selectedCall.recording_url && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      Call Recording
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <PlayCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Recording Available
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Duration: {formatDuration(selectedCall.duration)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(selectedCall.recording_url, '_blank')}
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Play
                        </Button>
                      </div>
                      <audio
                        controls
                        className="w-full mt-4"
                        src={selectedCall.recording_url}
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </div>
                )}

                {/* Schedule Callback Form */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  {showScheduleForm ? (
                    <form onSubmit={handleScheduleCallback} className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        Schedule Callback
                      </h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Callback Date & Time
                        </label>
                        <Input
                          type="datetime-local"
                          value={callbackDateTime}
                          onChange={(e) => setCallbackDateTime(e.target.value)}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Notes (Optional)
                        </label>
                        <Textarea
                          value={callbackNotes}
                          onChange={(e) => setCallbackNotes(e.target.value)}
                          placeholder="Add notes for the callback..."
                          className="min-h-[80px]"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" disabled={isSubmitting || !callbackDateTime}>
                          <Calendar className="w-4 h-4 mr-2" />
                          {isSubmitting ? 'Scheduling...' : 'Schedule Callback'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowScheduleForm(false);
                            setCallbackDateTime('');
                            setCallbackNotes('');
                          }}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      {(selectedCall.status === 'completed' || selectedCall.status === 'missed') && (
                        <Button onClick={() => setShowScheduleForm(true)}>
                          <Calendar className="w-4 h-4 mr-2" />
                          Schedule Callback
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <AlertCircle className="w-12 h-12 mb-4" />
                <p>Failed to load call details</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </motion.div>
    </div>
  );
}
