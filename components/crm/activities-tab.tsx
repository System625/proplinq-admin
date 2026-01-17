'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Edit, Trash2, Phone, Mail, Calendar, MessageSquare, CheckCircle } from 'lucide-react';
import type { Activity } from '@/types/api';

interface ActivitiesTabProps {
  activities: { data: Activity[] } | null;
  isLoading: boolean;
  activityTypeFilter: string | null;
  setActivityTypeFilter: (value: string) => void;
  onAddActivity: () => void;
  onEditActivity: (activity: Activity) => void;
  onDeleteActivity: (activityId: number) => void;
  activitiesPage: number;
  setActivitiesPage: (page: number) => void;
  itemsPerPage: number;
}

export function ActivitiesTab({
  activities,
  isLoading,
  activityTypeFilter,
  setActivityTypeFilter,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
  activitiesPage,
  setActivitiesPage,
  itemsPerPage,
}: ActivitiesTabProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPaginatedData = <T,>(data: T[], page: number): T[] => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

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

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Activities</h3>
        <Button size="sm" onClick={onAddActivity}>
          <Plus className="mr-2 h-4 w-4" />
          Add Activity
        </Button>
      </div>
      <div className="mb-4">
        <Select value={activityTypeFilter || undefined} onValueChange={setActivityTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="note">Note</SelectItem>
            <SelectItem value="call">Call</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="meeting">Meeting</SelectItem>
            <SelectItem value="task">Task</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : activities && activities.data.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Related To</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getPaginatedData(activities.data, activitiesPage).map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {activity.type === 'call' && <Phone className="h-4 w-4" />}
                      {activity.type === 'email' && <Mail className="h-4 w-4" />}
                      {activity.type === 'meeting' && <Calendar className="h-4 w-4" />}
                      {activity.type === 'note' && <MessageSquare className="h-4 w-4" />}
                      {activity.type === 'task' && <CheckCircle className="h-4 w-4" />}
                      <span className="capitalize">{activity.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{activity.subject}</TableCell>
                  <TableCell>
                    {activity.lead ? `Lead: ${activity.lead.first_name} ${activity.lead.last_name}` :
                     activity.contact ? `Contact: ${activity.contact.first_name} ${activity.contact.last_name}` :
                     '-'}
                  </TableCell>
                  <TableCell>{formatDate(activity.activity_date)}</TableCell>
                  <TableCell>
                    {activity.created_by_user?.full_name || 'Unknown'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEditActivity(activity)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDeleteActivity(activity.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {renderPagination(activitiesPage, activities.data.length, setActivitiesPage)}
        </>
      ) : (
        <div className="flex h-32 items-center justify-center text-muted-foreground">
          No activities found
        </div>
      )}
    </div>
  );
}
