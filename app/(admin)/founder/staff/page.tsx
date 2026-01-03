'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useFounderStaffStore } from '@/stores/founder-staff-store';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RoleGuard } from '@/components/role-guard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Staff, CreateStaffRequest, UpdateStaffRequest } from '@/types/api';

export default function FounderStaffPage() {
  return (
    <RoleGuard feature="founder-staff" requiredLevel="view">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Staff Management</h1>
            <p className="text-muted-foreground">Manage staff members and permissions</p>
          </div>
        </div>
        <FounderStaffClient />
      </div>
    </RoleGuard>
  );
}

function FounderStaffClient() {
  const { staff, isLoading, fetchStaff, deleteStaff } = useFounderStaffStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  if (isLoading && !staff) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!staff) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Staff Members</CardTitle>
            <CardDescription>Total: {staff.total} staff members</CardDescription>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Create Staff Member</DialogTitle>
                <DialogDescription>Add a new staff member to the system</DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
                <CreateStaffForm
                  onSuccess={() => {
                    setIsCreateOpen(false);
                    fetchStaff();
                  }}
                  onCancel={() => setIsCreateOpen(false)}
                />
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.data.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={member.is_suspended ? 'destructive' : 'default'}
                    >
                      {member.is_suspended ? 'Suspended' : 'Active'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {member.last_login_at
                      ? new Date(member.last_login_at).toLocaleDateString()
                      : 'Never'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedStaff(member);
                          setIsEditOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedStaff(member);
                          setIsDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>Update staff member details</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
            {selectedStaff && (
              <EditStaffForm
                staff={selectedStaff}
                onSuccess={() => {
                  setIsEditOpen(false);
                  setSelectedStaff(null);
                  fetchStaff();
                }}
                onCancel={() => {
                  setIsEditOpen(false);
                  setSelectedStaff(null);
                }}
              />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Staff Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedStaff?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteOpen(false);
                setSelectedStaff(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (selectedStaff) {
                  try {
                    await deleteStaff(selectedStaff.id.toString());
                    setIsDeleteOpen(false);
                    setSelectedStaff(null);
                  } catch {
                    // Error already handled in store
                  }
                }
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreateStaffForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const { createStaff, isLoading } = useFounderStaffStore();
  const [formData, setFormData] = useState<CreateStaffRequest>({
    name: '',
    email: '',
    password: '',
    role: 'support',
    phone_number: '',
    permissions: [],
  });

  const availablePermissions = [
    'view_tickets',
    'respond_tickets',
    'close_tickets',
    'view_users',
    'manage_users',
    'view_reports',
    'manage_reports',
  ];

  const togglePermission = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createStaff(formData);
      onSuccess();
    } catch {
      // Error already handled in store
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone_number">Phone Number</Label>
        <Input
          id="phone_number"
          type="tel"
          value={formData.phone_number}
          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
          placeholder="+2348012345678"
          required
        />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Select
          value={formData.role}
          onValueChange={(value: 'admin' | 'support' | 'operations' | 'sales' | 'marketing') => setFormData({ ...formData, role: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="support">Support</SelectItem>
            <SelectItem value="operations">Operations</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Permissions</Label>
        <div className="mt-2 space-y-2">
          {availablePermissions.map((permission) => (
            <div key={permission} className="flex items-center space-x-2">
              <Checkbox
                id={permission}
                checked={formData.permissions.includes(permission)}
                onCheckedChange={() => togglePermission(permission)}
              />
              <Label
                htmlFor={permission}
                className="text-sm font-normal cursor-pointer"
              >
                {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create'}
        </Button>
      </div>
    </form>
  );
}

function EditStaffForm({
  staff,
  onSuccess,
  onCancel,
}: {
  staff: Staff;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { updateStaff, isLoading } = useFounderStaffStore();
  const [formData, setFormData] = useState<UpdateStaffRequest>({
    name: staff.name,
    email: staff.email,
    role: staff.role,
    is_suspended: staff.is_suspended,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateStaff(staff.id.toString(), formData);
      onSuccess();
    } catch {
      // Error already handled in store
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="edit-name">Name</Label>
        <Input
          id="edit-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="edit-email">Email</Label>
        <Input
          id="edit-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="edit-role">Role</Label>
        <Select
          value={formData.role}
          onValueChange={(value: 'admin' | 'support' | 'operations' | 'sales' | 'marketing') => setFormData({ ...formData, role: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="support">Support</SelectItem>
            <SelectItem value="operations">Operations</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="edit-is-suspended"
          checked={formData.is_suspended}
          onCheckedChange={(checked) => setFormData({ ...formData, is_suspended: checked === true })}
        />
        <Label
          htmlFor="edit-is-suspended"
          className="text-sm font-normal cursor-pointer"
        >
          Suspend this staff member
        </Label>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update'}
        </Button>
      </div>
    </form>
  );
}
