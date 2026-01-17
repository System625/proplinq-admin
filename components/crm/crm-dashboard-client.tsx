'use client';

import { useEffect, useState } from 'react';
import { useCRMDashboardStore } from '@/stores/crm-dashboard-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Users, UserCheck, Activity as ActivityIcon } from 'lucide-react';
import { LeadForm } from '@/components/forms/lead-form';
import { ContactForm } from '@/components/forms/contact-form';
import { ActivityForm } from '@/components/forms/activity-form';
import { StatsCards } from '@/components/crm/stats-cards';
import { LeadsTab } from '@/components/crm/leads-tab';
import { ContactsTab } from '@/components/crm/contacts-tab';
import { ActivitiesTab } from '@/components/crm/activities-tab';
import type {
  Lead,
  Contact as ContactType,
  Activity,
  CreateLeadRequest,
  UpdateLeadRequest,
  CreateContactRequest,
  UpdateContactRequest,
  CreateActivityRequest,
  UpdateActivityRequest
} from '@/types/api';

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

  // Pagination state
  const [leadsPage, setLeadsPage] = useState(1);
  const [contactsPage, setContactsPage] = useState(1);
  const [activitiesPage, setActivitiesPage] = useState(1);
  const itemsPerPage = 10;

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

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <StatsCards dashboard={dashboard} isLoading={isLoading} />

      {/* CRM Management Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>CRM Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="leads" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="leads">
                <Users className="h-4 w-4 mr-2" />
                Leads
              </TabsTrigger>
              <TabsTrigger value="contacts">
                <UserCheck className="h-4 w-4 mr-2" />
                Contacts
              </TabsTrigger>
              <TabsTrigger value="activities">
                <ActivityIcon className="h-4 w-4 mr-2" />
                Activities
              </TabsTrigger>
            </TabsList>

            <TabsContent value="leads">
              <LeadsTab
                leads={leads}
                isLoading={isLeadLoading}
                localSearch={localSearch}
                setLocalSearch={setLocalSearch}
                leadStatusFilter={leadStatusFilter}
                setLeadStatusFilter={setLeadStatusFilter}
                leadSourceFilter={leadSourceFilter}
                setLeadSourceFilter={setLeadSourceFilter}
                onAddLead={() => setLeadDialogOpen(true)}
                onEditLead={(lead) => {
                  setEditingLead(lead);
                  setLeadDialogOpen(true);
                }}
                onDeleteLead={handleDeleteLead}
                leadsPage={leadsPage}
                setLeadsPage={setLeadsPage}
                itemsPerPage={itemsPerPage}
              />
            </TabsContent>

            <TabsContent value="contacts">
              <ContactsTab
                contacts={contacts}
                isLoading={isContactLoading}
                contactTypeFilter={contactTypeFilter}
                setContactTypeFilter={setContactTypeFilter}
                onAddContact={() => setContactDialogOpen(true)}
                onEditContact={(contact) => {
                  setEditingContact(contact);
                  setContactDialogOpen(true);
                }}
                onDeleteContact={handleDeleteContact}
                contactsPage={contactsPage}
                setContactsPage={setContactsPage}
                itemsPerPage={itemsPerPage}
              />
            </TabsContent>

            <TabsContent value="activities">
              <ActivitiesTab
                activities={activities}
                isLoading={isActivityLoading}
                activityTypeFilter={activityTypeFilter}
                setActivityTypeFilter={setActivityTypeFilter}
                onAddActivity={() => setActivityDialogOpen(true)}
                onEditActivity={(activity) => {
                  setEditingActivity(activity);
                  setActivityDialogOpen(true);
                }}
                onDeleteActivity={handleDeleteActivity}
                activitiesPage={activitiesPage}
                setActivitiesPage={setActivitiesPage}
                itemsPerPage={itemsPerPage}
              />
            </TabsContent>
          </Tabs>
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
