'use client';

import { useEffect, useState } from 'react';
import {
  Headphones,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
} from 'lucide-react';
import { useSupportDashboardStore } from '@/stores/support-dashboard-store';
import { StatCard } from '@/components/dashboard/stat-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RoleGuard } from '@/components/role-guard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { DashboardSearch } from '@/components/shared/dashboard-search';
import { TicketDetailModal } from '@/components/modals/ticket-detail-modal';
import { ChatDetailModal } from '@/components/modals/chat-detail-modal';
import { CallDetailModal } from '@/components/modals/call-detail-modal';
import { EmailDetailModal } from '@/components/modals/email-detail-modal';

export default function SupportDashboardPage() {
  return (
    <RoleGuard feature="support-dashboard" requiredLevel="view">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Customer Support Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage tickets, live chats, and customer inquiries
          </p>
        </div>

        <SupportDashboardClient />
      </div>
    </RoleGuard>
  );
}

function SupportDashboardClient() {
  const {
    dashboard,
    tickets,
    chats,
    calls,
    emails,
    isLoading,
    isCallLoading,
    isEmailLoading,
    fetchDashboardData,
    fetchCalls,
    fetchEmails,
    searchQuery,
    categoryFilter,
    statusFilter,
    priorityFilter,
    callStatusFilter,
    emailStatusFilter,
    setSearchQuery,
    setCategoryFilter,
    setStatusFilter,
    setPriorityFilter,
    setCallStatusFilter,
    setEmailStatusFilter,
  } = useSupportDashboardStore();

  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [selectedCallId, setSelectedCallId] = useState<number | null>(null);
  const [selectedEmailId, setSelectedEmailId] = useState<number | null>(null);

  // Pagination states for each tab
  const [ticketsPage, setTicketsPage] = useState(1);
  const [chatsPage, setChatsPage] = useState(1);
  const [callsPage, setCallsPage] = useState(1);
  const [emailsPage, setEmailsPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchDashboardData();
    fetchCalls({ per_page: 10 });
    fetchEmails({ status: 'unread', per_page: 10 });
  }, [fetchDashboardData, fetchCalls, fetchEmails]);

  if (isLoading && !dashboard) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <p>Failed to load dashboard data. Please refresh the page.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const ticketsList = tickets?.data || [];
  const chatsList = chats?.data || [];
  const callsList = calls?.data || [];
  const emailsList = emails?.data || [];

  const renderPagination = (currentPage: number, totalItems: number, onPageChange: (page: number) => void) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalItems === 0) return null;

    return (
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  const getPaginatedData = <T,>(data: T[], page: number): T[] => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Open Tickets"
          value={(dashboard.tickets?.open ?? 0).toString()}
          icon={Headphones}
          description="Active support tickets"
        />
        <StatCard
          title="In Progress"
          value={(dashboard.tickets?.in_progress ?? 0).toString()}
          icon={AlertCircle}
          description="Being worked on"
          trend="neutral"
        />
        <StatCard
          title="Resolved Tickets"
          value={(dashboard.tickets?.resolved ?? 0).toString()}
          icon={CheckCircle}
          description="Completed tickets"
          trend="up"
        />
        <StatCard
          title="Active Chats"
          value={(dashboard.chats?.active ?? 0).toString()}
          icon={MessageSquare}
          description="Ongoing conversations"
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboard.metrics?.response_time ?? 0} min</div>
            <p className="text-xs text-muted-foreground mt-1">
              Average first response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Resolution Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboard.metrics?.resolution_time ?? 0} min</div>
            <p className="text-xs text-muted-foreground mt-1">
              Average resolution time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dashboard.metrics?.satisfaction_rating !== null ? `${dashboard.metrics?.satisfaction_rating ?? 0}%` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Overall satisfaction rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboard.tickets?.total ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All tickets
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Support Management Tabs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Support Management</CardTitle>
            <CardDescription>Manage tickets, chats, calls, and emails</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchDashboardData}>
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tickets" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="tickets">
                <Headphones className="h-4 w-4 mr-2" />
                Tickets
              </TabsTrigger>
              <TabsTrigger value="chats">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chats
              </TabsTrigger>
              <TabsTrigger value="calls">
                <Phone className="h-4 w-4 mr-2" />
                Calls
              </TabsTrigger>
              <TabsTrigger value="emails">
                <Mail className="h-4 w-4 mr-2" />
                Emails
              </TabsTrigger>
            </TabsList>

            {/* Tickets Tab */}
            <TabsContent value="tickets" className="mt-4">
              <div className="mb-2">
                <p className="text-sm text-muted-foreground mb-4">Latest customer support tickets</p>
              </div>

              {/* Search and Filters */}
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
                <DashboardSearch
                  placeholder="Search by ticket ID, username, or title..."
                  onSearch={setSearchQuery}
                  defaultValue={searchQuery}
                />
                <div className="flex gap-2">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="booking">Booking</SelectItem>
                      <SelectItem value="search">Search</SelectItem>
                      <SelectItem value="kyc">KYC</SelectItem>
                      <SelectItem value="payment">Payment</SelectItem>
                      <SelectItem value="profile">Profile</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getPaginatedData(ticketsList, ticketsPage).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        No tickets found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    getPaginatedData(ticketsList, ticketsPage).map((ticket) => (
                      <TableRow
                        key={ticket.id}
                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                        onClick={() => setSelectedTicketId(ticket.id)}
                      >
                        <TableCell className="font-mono text-sm">#{ticket.id}</TableCell>
                        <TableCell className="max-w-xs truncate">{ticket.title}</TableCell>
                        <TableCell>{ticket.user.full_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {ticket.category || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              ticket.priority === 'urgent' || ticket.priority === 'high'
                                ? 'destructive'
                                : 'secondary'
                            }
                            className="capitalize"
                          >
                            {ticket.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              ticket.status === 'open'
                                ? 'secondary'
                                : ticket.status === 'in_progress'
                                ? 'default'
                                : ticket.status === 'resolved'
                                ? 'success'
                                : 'outline'
                            }
                            className="capitalize"
                          >
                            {ticket.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(ticket.created_at), 'MMM d, HH:mm')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTicketId(ticket.id);
                            }}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {renderPagination(ticketsPage, ticketsList.length, setTicketsPage)}
            </TabsContent>

            {/* Chats Tab */}
            <TabsContent value="chats" className="mt-4">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Currently ongoing conversations</p>
              </div>
              <div className="space-y-4">
                {getPaginatedData(chatsList, chatsPage).length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No active chats at the moment
                  </div>
                ) : (
                  getPaginatedData(chatsList, chatsPage).map((chat) => (
                    <div
                      key={chat.id}
                      className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                      onClick={() => setSelectedChatId(chat.id)}
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{chat.user.full_name}</p>
                          <Badge
                            variant={
                              chat.status === 'active'
                                ? 'success'
                                : chat.status === 'pending'
                                ? 'secondary'
                                : 'outline'
                            }
                            className="capitalize"
                          >
                            {chat.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {chat.user.email}
                        </p>
                        {chat.assigned_agent && (
                          <p className="text-xs text-muted-foreground">
                            Agent: {chat.assigned_agent.full_name}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Started {format(new Date(chat.created_at), 'MMM d, HH:mm')}
                        </p>
                      </div>
                      <Button size="sm" onClick={(e) => {
                        e.stopPropagation();
                        setSelectedChatId(chat.id);
                      }}>
                        Open Chat
                      </Button>
                    </div>
                  ))
                )}
              </div>
              {renderPagination(chatsPage, chatsList.length, setChatsPage)}
            </TabsContent>

            {/* Calls Tab */}
            <TabsContent value="calls" className="mt-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
                <p className="text-sm text-muted-foreground">Recent call records</p>
                <Select value={callStatusFilter} onValueChange={setCallStatusFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="missed">Missed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {isCallLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                </div>
              ) : getPaginatedData(callsList, callsPage).length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No calls found
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Scheduled</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getPaginatedData(callsList, callsPage).map((call) => (
                        <TableRow
                          key={call.id}
                          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                          onClick={() => setSelectedCallId(call.id)}
                        >
                          <TableCell className="font-mono text-sm">#{call.id}</TableCell>
                          <TableCell>{call.user.full_name}</TableCell>
                          <TableCell className="font-mono text-sm">{call.phone_number}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                call.status === 'scheduled'
                                  ? 'secondary'
                                  : call.status === 'in_progress'
                                  ? 'default'
                                  : call.status === 'completed'
                                  ? 'success'
                                  : 'destructive'
                              }
                              className="capitalize"
                            >
                              {call.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {call.duration ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s` : 'N/A'}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {call.scheduled_at ? format(new Date(call.scheduled_at), 'MMM d, HH:mm') : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCallId(call.id);
                              }}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {renderPagination(callsPage, callsList.length, setCallsPage)}
                </>
              )}
            </TabsContent>

            {/* Emails Tab */}
            <TabsContent value="emails" className="mt-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
                <p className="text-sm text-muted-foreground">Recent email inquiries</p>
                <Select value={emailStatusFilter} onValueChange={setEmailStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {isEmailLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                </div>
              ) : getPaginatedData(emailsList, emailsPage).length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No emails found
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getPaginatedData(emailsList, emailsPage).map((email) => (
                        <TableRow
                          key={email.id}
                          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                          onClick={() => setSelectedEmailId(email.id)}
                        >
                          <TableCell className="font-mono text-sm">#{email.id}</TableCell>
                          <TableCell className="max-w-xs truncate">{email.from}</TableCell>
                          <TableCell className="max-w-sm truncate">{email.subject}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                email.status === 'unread'
                                  ? 'destructive'
                                  : email.status === 'read'
                                  ? 'secondary'
                                  : 'success'
                              }
                              className="capitalize"
                            >
                              {email.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(email.created_at), 'MMM d, HH:mm')}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEmailId(email.id);
                              }}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {renderPagination(emailsPage, emailsList.length, setEmailsPage)}
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modals */}
      <TicketDetailModal
        ticketId={selectedTicketId}
        isOpen={selectedTicketId !== null}
        onClose={() => setSelectedTicketId(null)}
      />

      <ChatDetailModal
        chatId={selectedChatId}
        isOpen={selectedChatId !== null}
        onClose={() => setSelectedChatId(null)}
      />

      <CallDetailModal
        callId={selectedCallId}
        isOpen={selectedCallId !== null}
        onClose={() => setSelectedCallId(null)}
      />

      <EmailDetailModal
        emailId={selectedEmailId}
        isOpen={selectedEmailId !== null}
        onClose={() => setSelectedEmailId(null)}
      />
    </div>
  );
}
