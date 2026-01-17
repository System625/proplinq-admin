'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import type { Lead } from '@/types/api';

interface LeadsTabProps {
  leads: { data: Lead[] } | null;
  isLoading: boolean;
  localSearch: string;
  setLocalSearch: (value: string) => void;
  leadStatusFilter: string | null;
  setLeadStatusFilter: (value: string) => void;
  leadSourceFilter: string | null;
  setLeadSourceFilter: (value: string) => void;
  onAddLead: () => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (leadId: number) => void;
  leadsPage: number;
  setLeadsPage: (page: number) => void;
  itemsPerPage: number;
}

export function LeadsTab({
  leads,
  isLoading,
  localSearch,
  setLocalSearch,
  leadStatusFilter,
  setLeadStatusFilter,
  leadSourceFilter,
  setLeadSourceFilter,
  onAddLead,
  onEditLead,
  onDeleteLead,
  leadsPage,
  setLeadsPage,
  itemsPerPage,
}: LeadsTabProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'new':
        return 'secondary';
      case 'contacted':
      case 'qualified':
        return 'default';
      case 'proposal':
      case 'negotiation':
        return 'outline';
      case 'closed_won':
        return 'default';
      case 'closed_lost':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

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
        <h3 className="text-lg font-semibold">Leads</h3>
        <Button size="sm" onClick={onAddLead}>
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </div>
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={leadStatusFilter || undefined} onValueChange={setLeadStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="proposal">Proposal</SelectItem>
            <SelectItem value="negotiation">Negotiation</SelectItem>
            <SelectItem value="closed_won">Closed Won</SelectItem>
            <SelectItem value="closed_lost">Closed Lost</SelectItem>
          </SelectContent>
        </Select>
        <Select value={leadSourceFilter || undefined} onValueChange={setLeadSourceFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="website">Website</SelectItem>
            <SelectItem value="referral">Referral</SelectItem>
            <SelectItem value="social_media">Social Media</SelectItem>
            <SelectItem value="email_campaign">Email Campaign</SelectItem>
            <SelectItem value="cold_call">Cold Call</SelectItem>
            <SelectItem value="event">Event</SelectItem>
            <SelectItem value="partner">Partner</SelectItem>
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
      ) : leads && leads.data.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getPaginatedData(leads.data, leadsPage).map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">
                    {lead.first_name} {lead.last_name}
                  </TableCell>
                  <TableCell>{lead.company_name || '-'}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(lead.status)}>
                      {lead.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{lead.source.replace('_', ' ')}</TableCell>
                  <TableCell>
                    {lead.estimated_value ? formatCurrency(lead.estimated_value) : '-'}
                  </TableCell>
                  <TableCell>{formatDate(lead.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEditLead(lead)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDeleteLead(lead.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {renderPagination(leadsPage, leads.data.length, setLeadsPage)}
        </>
      ) : (
        <div className="flex h-32 items-center justify-center text-muted-foreground">
          No leads found
        </div>
      )}
    </div>
  );
}
