'use client';

import { useEffect } from 'react';
import {
  Headphones,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Search,
  CreditCard,
  UserCircle,
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { DashboardSearch } from '@/components/shared/dashboard-search';
import { EscalateIssueDialog } from '@/components/shared/escalate-issue-dialog';

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
    stats,
    chats,
    chartData,
    isLoading,
    fetchDashboardData,
    refreshTickets,
    searchQuery,
    categoryFilter,
    statusFilter,
    priorityFilter,
    setSearchQuery,
    setCategoryFilter,
    setStatusFilter,
    setPriorityFilter,
    getFilteredTickets,
  } = useSupportDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const filteredTickets = getFilteredTickets();

  if (isLoading && !stats) {
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

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tickets"
          value={stats.totalTickets.toString()}
          icon={Headphones}
          description="All time tickets"
        />
        <StatCard
          title="Pending Tickets"
          value={stats.pendingTickets.toString()}
          icon={AlertCircle}
          description="Awaiting response"
          trend="neutral"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgressTickets.toString()}
          icon={Clock}
          description="Being handled"
        />
        <StatCard
          title="Resolved Today"
          value={stats.resolvedToday.toString()}
          icon={CheckCircle}
          description="Closed tickets"
          trend="up"
        />
      </div>

      {/* Category Breakdown */}
      {stats.categoryBreakdown && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Category Breakdown</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <StatCard
              title="Booking Issues"
              value={stats.categoryBreakdown.bookingIssues.toString()}
              icon={Calendar}
              description="Booking-related tickets"
              iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
            />
            <StatCard
              title="Search Issues"
              value={stats.categoryBreakdown.searchIssues.toString()}
              icon={Search}
              description="Search-related tickets"
              iconClassName="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
            />
            <StatCard
              title="KYC Issues"
              value={stats.categoryBreakdown.kycIssues.toString()}
              icon={AlertCircle}
              description="KYC-related tickets"
              iconClassName="bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
            />
            <StatCard
              title="Payment Issues"
              value={stats.categoryBreakdown.paymentIssues.toString()}
              icon={CreditCard}
              description="Payment-related tickets"
              iconClassName="bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
            />
            <StatCard
              title="Profile Issues"
              value={stats.categoryBreakdown.profileIssues.toString()}
              icon={UserCircle}
              description="Profile-related tickets"
              iconClassName="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
            />
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeChats}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Live conversations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Average first response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Satisfaction Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.satisfactionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Customer satisfaction
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ticket Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Ticket Trends</CardTitle>
          <CardDescription>Weekly ticket status overview</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pending" stroke="#f59e0b" name="Pending" />
              <Line type="monotone" dataKey="resolved" stroke="#10b981" name="Resolved" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Tickets Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Recent Tickets</CardTitle>
              <CardDescription>
                Latest customer support tickets ({filteredTickets.length} results)
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={refreshTickets}>
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
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
              {filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No tickets found matching your filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets.slice(0, 10).map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-mono text-sm">{ticket.id}</TableCell>
                    <TableCell className="max-w-xs truncate">{ticket.title}</TableCell>
                    <TableCell>{ticket.user}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {ticket.category}
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
                          ticket.status === 'pending'
                            ? 'secondary'
                            : ticket.status === 'in-progress'
                            ? 'default'
                            : 'outline'
                        }
                        className="capitalize"
                      >
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(ticket.created_at), 'MMM d, HH:mm')}
                    </TableCell>
                    <TableCell className="text-right">
                      <EscalateIssueDialog
                        issueId={ticket.id}
                        issueType="ticket"
                        fromDepartment="support"
                      />
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
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{chat.user}</p>
                    <Badge
                      variant={
                        chat.status === 'active'
                          ? 'default'
                          : chat.status === 'waiting'
                          ? 'secondary'
                          : 'outline'
                      }
                      className="capitalize"
                    >
                      {chat.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{chat.message}</p>
                  <p className="text-xs text-muted-foreground">
                    Started {format(new Date(chat.started_at), 'MMM d, HH:mm')}
                  </p>
                </div>
                <Button size="sm">Respond</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
