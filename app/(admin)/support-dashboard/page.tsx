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

      {/* Recent Tickets Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Recent Tickets</CardTitle>
              <CardDescription>
                Latest customer support tickets ({ticketsList.length} results)
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchDashboardData}>
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
              {ticketsList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No tickets found matching your filters
                  </TableCell>
                </TableRow>
              ) : (
                ticketsList.map((ticket) => (
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
        </CardContent>
      </Card>

      {/* Active Chats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Active Live Chats
          </CardTitle>
          <CardDescription>Currently ongoing conversations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chatsList.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No active chats at the moment
              </div>
            ) : (
              chatsList.map((chat) => (
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
        </CardContent>
      </Card>

      {/* Support Calls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              <div>
                <CardTitle>Support Calls</CardTitle>
                <CardDescription>Recent call records ({callsList.length} results)</CardDescription>
              </div>
            </div>
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
        </CardHeader>
        <CardContent>
          {isCallLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          ) : callsList.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No calls found
            </div>
          ) : (
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
                {callsList.map((call) => (
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
          )}
        </CardContent>
      </Card>

      {/* Support Emails */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <div>
                <CardTitle>Support Emails</CardTitle>
                <CardDescription>Recent email inquiries ({emailsList.length} results)</CardDescription>
              </div>
            </div>
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
        </CardHeader>
        <CardContent>
          {isEmailLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          ) : emailsList.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No emails found
            </div>
          ) : (
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
                {emailsList.map((email) => (
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
          )}
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
