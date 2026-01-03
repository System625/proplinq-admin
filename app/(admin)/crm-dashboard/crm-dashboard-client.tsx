'use client';

import { useEffect, useState } from 'react';
import { useCRMDashboardStore } from '@/stores/crm-dashboard-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Users,
  TrendingUp,
  DollarSign,
  Contact,
  Plus,
  Search,
  Edit,
  Trash2,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  CheckCircle,
} from 'lucide-react';
import { LeadForm } from '@/components/forms/lead-form';
import { ContactForm } from '@/components/forms/contact-form';
import { ActivityForm } from '@/components/forms/activity-form';
import type { Lead, Contact as ContactType, Activity, CreateLeadRequest, UpdateLeadRequest, CreateContactRequest, UpdateContactRequest, CreateActivityRequest, UpdateActivityRequest } from '@/types/api';

export function CRMDashboardClient() {
  const {
    dashboard,
    leads,
    contacts,
    activities,
    isLoading,
    isLeadLoading,
    isContactLoading,
    isActivityLoading,
    error,
    leadStatusFilter,
    leadSourceFilter,
    contactTypeFilter,
    activityTypeFilter,
    setSearchQuery,
    setLeadStatusFilter,
    setLeadSourceFilter,
    setContactTypeFilter,
    setActivityTypeFilter,
    fetchDashboardData,
    fetchActivities,
    createLead,
    updateLead,
    deleteLead,
    createContact,
    updateContact,
    deleteContact,
    createActivity,
    updateActivity,
    deleteActivity,
  } = useCRMDashboardStore();

  const [leadDialogOpen, setLeadDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [editingContact, setEditingContact] = useState<ContactType | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    fetchDashboardData();
    fetchActivities();
  }, [fetchDashboardData, fetchActivities]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  const handleCreateLead = async (data: CreateLeadRequest) => {
    await createLead(data);
    setLeadDialogOpen(false);
  };

  const handleUpdateLead = async (data: UpdateLeadRequest) => {
    if (!editingLead) return;
    await updateLead(editingLead.id, data);
    setLeadDialogOpen(false);
    setEditingLead(null);
  };

  const handleDeleteLead = async (leadId: number) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      await deleteLead(leadId);
    }
  };

  const handleCreateContact = async (data: CreateContactRequest) => {
    await createContact(data);
    setContactDialogOpen(false);
  };

  const handleUpdateContact = async (data: UpdateContactRequest) => {
    if (!editingContact) return;
    await updateContact(editingContact.id, data);
    setContactDialogOpen(false);
    setEditingContact(null);
  };

  const handleDeleteContact = async (contactId: number) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      await deleteContact(contactId);
    }
  };

  const handleCreateActivity = async (data: CreateActivityRequest) => {
    await createActivity(data);
    setActivityDialogOpen(false);
  };

  const handleUpdateActivity = async (data: UpdateActivityRequest) => {
    if (!editingActivity) return;
    await updateActivity(editingActivity.id, data);
    setActivityDialogOpen(false);
    setEditingActivity(null);
  };

  const handleDeleteActivity = async (activityId: number) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      await deleteActivity(activityId);
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{dashboard?.total_leads || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboard?.qualified_leads || 0} qualified
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {dashboard?.conversion_rate?.toFixed(1) || 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {dashboard?.converted_leads || 0} converted
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(dashboard?.pipeline_value || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Avg: {formatCurrency(dashboard?.avg_deal_size || 0)}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Contact className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{dashboard?.total_contacts || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboard?.active_contacts || 0} active
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Leads Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Leads</CardTitle>
            <Button size="sm" onClick={() => setLeadDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Lead
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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

          {isLeadLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : leads && leads.data.length > 0 ? (
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
                {leads.data.map((lead) => (
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
                          onClick={() => {
                            setEditingLead(lead);
                            setLeadDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteLead(lead.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex h-32 items-center justify-center text-muted-foreground">
              No leads found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contacts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Contacts</CardTitle>
            <Button size="sm" onClick={() => setContactDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <Select value={contactTypeFilter || undefined} onValueChange={setContactTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="partner">Partner</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
                <SelectItem value="prospect">Prospect</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isContactLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : contacts && contacts.data.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.data.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">
                      {contact.first_name} {contact.last_name}
                    </TableCell>
                    <TableCell>{contact.company_name || '-'}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.phone || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{contact.type}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(contact.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingContact(contact);
                            setContactDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteContact(contact.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex h-32 items-center justify-center text-muted-foreground">
              No contacts found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activities Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Activities</CardTitle>
            <Button size="sm" onClick={() => setActivityDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Activity
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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

          {isActivityLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : activities && activities.data.length > 0 ? (
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
                {activities.data.map((activity) => (
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
                          onClick={() => {
                            setEditingActivity(activity);
                            setActivityDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteActivity(activity.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex h-32 items-center justify-center text-muted-foreground">
              No activities found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lead Dialog */}
      <Dialog
        open={leadDialogOpen}
        onOpenChange={(open) => {
          setLeadDialogOpen(open);
          if (!open) setEditingLead(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingLead ? 'Edit Lead' : 'Create New Lead'}</DialogTitle>
            <DialogDescription>
              {editingLead
                ? 'Update the lead information below'
                : 'Fill in the details to create a new lead'}
            </DialogDescription>
          </DialogHeader>
          <LeadForm
            lead={editingLead || undefined}
            onSubmit={async (data) => {
              if (editingLead) {
                await handleUpdateLead(data as UpdateLeadRequest);
              } else {
                await handleCreateLead(data as CreateLeadRequest);
              }
            }}
            onCancel={() => {
              setLeadDialogOpen(false);
              setEditingLead(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog
        open={contactDialogOpen}
        onOpenChange={(open) => {
          setContactDialogOpen(open);
          if (!open) setEditingContact(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingContact ? 'Edit Contact' : 'Create New Contact'}
            </DialogTitle>
            <DialogDescription>
              {editingContact
                ? 'Update the contact information below'
                : 'Fill in the details to create a new contact'}
            </DialogDescription>
          </DialogHeader>
          <ContactForm
            contact={editingContact || undefined}
            onSubmit={async (data) => {
              if (editingContact) {
                await handleUpdateContact(data as UpdateContactRequest);
              } else {
                await handleCreateContact(data as CreateContactRequest);
              }
            }}
            onCancel={() => {
              setContactDialogOpen(false);
              setEditingContact(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Activity Dialog */}
      <Dialog
        open={activityDialogOpen}
        onOpenChange={(open) => {
          setActivityDialogOpen(open);
          if (!open) setEditingActivity(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingActivity ? 'Edit Activity' : 'Create New Activity'}
            </DialogTitle>
            <DialogDescription>
              {editingActivity
                ? 'Update the activity information below'
                : 'Fill in the details to log a new activity'}
            </DialogDescription>
          </DialogHeader>
          <ActivityForm
            activity={editingActivity || undefined}
            onSubmit={async (data) => {
              if (editingActivity) {
                await handleUpdateActivity(data as UpdateActivityRequest);
              } else {
                await handleCreateActivity(data as CreateActivityRequest);
              }
            }}
            onCancel={() => {
              setActivityDialogOpen(false);
              setEditingActivity(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
