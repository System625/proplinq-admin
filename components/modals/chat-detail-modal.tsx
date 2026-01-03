'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Send, User, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSupportDashboardStore } from '@/stores/support-dashboard-store';
import { format } from 'date-fns';

interface ChatDetailModalProps {
  chatId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ChatDetailModal({ chatId, isOpen, onClose }: ChatDetailModalProps) {
  const {
    selectedChat,
    isChatDetailLoading,
    fetchChatDetails,
    respondToChat,
    closeChat,
    clearSelectedChat,
  } = useSupportDashboardStore();

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [closeSummary, setCloseSummary] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && chatId) {
      fetchChatDetails(chatId);
    }
    return () => {
      if (!isOpen) {
        clearSelectedChat();
        setMessage('');
        setShowCloseConfirm(false);
      }
    };
  }, [isOpen, chatId, fetchChatDetails, clearSelectedChat]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (selectedChat && scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [selectedChat]);

  if (!isOpen) return null;

  const handleClose = () => {
    clearSelectedChat();
    setMessage('');
    setShowCloseConfirm(false);
    onClose();
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChat || !message.trim()) return;

    setIsSubmitting(true);
    try {
      await respondToChat(selectedChat.id, message.trim());
      setMessage('');
    } catch {
      // Error handled in store
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = async () => {
    if (!selectedChat) return;

    setIsRefreshing(true);
    try {
      await fetchChatDetails(selectedChat.id);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCloseChat = async () => {
    if (!selectedChat) return;

    setIsSubmitting(true);
    try {
      await closeChat(selectedChat.id, closeSummary.trim() || undefined);
      setCloseSummary('');
      setShowCloseConfirm(false);
      handleClose();
    } catch {
      // Error handled in store
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'hh:mm a');
    } catch {
      return dateString;
    }
  };

  const formatFullDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy hh:mm a');
    } catch {
      return dateString;
    }
  };

  const statusColors: Record<'active' | 'pending' | 'closed', 'success' | 'secondary' | 'outline'> = {
    active: 'success',
    pending: 'secondary',
    closed: 'outline',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedChat ? `Chat #${selectedChat.id}` : 'Loading...'}
              </h3>
              {selectedChat && (
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant={statusColors[selectedChat.status]}>
                    {selectedChat.status}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <User className="w-4 h-4" />
                    <span>{selectedChat.user.full_name}</span>
                  </div>
                  {selectedChat.assigned_agent && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Agent: {selectedChat.assigned_agent.full_name}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          {isChatDetailLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          ) : selectedChat ? (
            <>
              <ScrollArea ref={scrollAreaRef} className="h-full">
                <div className="p-6 space-y-4">
                  {/* Chat Info */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-sm">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Started</p>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {formatFullDate(selectedChat.created_at)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Customer</p>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {selectedChat.user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="space-y-3">
                    {selectedChat.messages && selectedChat.messages.length > 0 ? (
                      selectedChat.messages.map((msg) => {
                        const isAgent = msg.sender_type === 'agent';
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                isAgent
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <User className="w-3 h-3" />
                                <span className="text-xs font-medium">
                                  {msg.sender?.full_name || (isAgent ? 'Agent' : 'Customer')}
                                </span>
                                <span className="text-xs opacity-70">
                                  {formatDate(msg.created_at)}
                                </span>
                              </div>
                              <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                        No messages yet
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>

              {/* Input Area */}
              {selectedChat.status === 'active' && !showCloseConfirm && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  <form onSubmit={handleSendMessage} className="flex gap-3">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="min-h-[60px] resize-none"
                      disabled={isSubmitting}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                    />
                    <div className="flex flex-col gap-2">
                      <Button
                        type="submit"
                        disabled={isSubmitting || !message.trim()}
                        size="sm"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {isSubmitting ? 'Sending...' : 'Send'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCloseConfirm(true)}
                      >
                        Close Chat
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Close Confirmation */}
              {showCloseConfirm && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700/50">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Close Chat
                  </h4>
                  <Textarea
                    value={closeSummary}
                    onChange={(e) => setCloseSummary(e.target.value)}
                    placeholder="Add a summary (optional)"
                    className="min-h-[60px] mb-3"
                    disabled={isSubmitting}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCloseChat}
                      disabled={isSubmitting}
                      variant="destructive"
                      size="sm"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      {isSubmitting ? 'Closing...' : 'Confirm Close'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowCloseConfirm(false);
                        setCloseSummary('');
                      }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Closed Status */}
              {selectedChat.status === 'closed' && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700/50 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This chat has been closed
                    {selectedChat.closed_at && ` on ${formatFullDate(selectedChat.closed_at)}`}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p>Failed to load chat details</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
