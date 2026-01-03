'use client';

import { useEffect, useState } from 'react';
import { Percent, Plus, Edit, Trash2, Calendar, TrendingUp } from 'lucide-react';
import { useFounderDiscountsStore } from '@/stores/founder-discounts-store';
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
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Discount, CreateDiscountRequest, UpdateDiscountRequest } from '@/types/api';

export default function FounderDiscountsPage() {
  return (
    <RoleGuard feature="founder-discounts" requiredLevel="view">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Discounts Management</h1>
            <p className="text-muted-foreground">Create and manage discount codes</p>
          </div>
        </div>
        <FounderDiscountsClient />
      </div>
    </RoleGuard>
  );
}

function FounderDiscountsClient() {
  const { discounts, isLoading, fetchDiscounts, deleteDiscount } =
    useFounderDiscountsStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  if (isLoading && !discounts) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!discounts) return null;

  const activeDiscounts = discounts.data.filter((d) => d.status === 'active').length;
  const totalUsage = discounts.data.reduce((sum, d) => sum + d.usage_count, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Percent className="h-4 w-4 text-blue-600" />
              Total Discounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{discounts.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Active Discounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDiscounts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              Total Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Discount Codes</CardTitle>
            <CardDescription>Manage promotional discount codes</CardDescription>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Discount
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Create Discount Code</DialogTitle>
                <DialogDescription>Create a new promotional discount</DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
                <CreateDiscountForm
                  onSuccess={() => {
                    setIsCreateOpen(false);
                    fetchDiscounts();
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
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Valid Period</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.data.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell className="font-mono font-semibold">{discount.code}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {discount.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {discount.type === 'percentage'
                      ? `${discount.value}%`
                      : `₦${discount.value.toLocaleString()}`}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        discount.status === 'active'
                          ? 'default'
                          : discount.status === 'inactive'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {discount.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {discount.usage_count} / {discount.max_uses}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(discount.valid_from).toLocaleDateString()} - {new Date(discount.valid_until).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedDiscount(discount);
                          setIsEditOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedDiscount(discount);
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
            <DialogTitle>Edit Discount</DialogTitle>
            <DialogDescription>Update discount details</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
            {selectedDiscount && (
              <EditDiscountForm
                discount={selectedDiscount}
                onSuccess={() => {
                  setIsEditOpen(false);
                  setSelectedDiscount(null);
                  fetchDiscounts();
                }}
                onCancel={() => {
                  setIsEditOpen(false);
                  setSelectedDiscount(null);
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
            <DialogTitle>Delete Discount</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the discount code &quot;{selectedDiscount?.code}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteOpen(false);
                setSelectedDiscount(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (selectedDiscount) {
                  try {
                    await deleteDiscount(selectedDiscount.id.toString());
                    setIsDeleteOpen(false);
                    setSelectedDiscount(null);
                  } catch {
                    // Error handled in store
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

function CreateDiscountForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const { createDiscount, isLoading } = useFounderDiscountsStore();
  const [formData, setFormData] = useState<CreateDiscountRequest>({
    code: '',
    type: 'percentage',
    value: 0,
    max_uses: 0,
    valid_from: '',
    valid_until: '',
    applicable_to: '',
    min_amount: 0,
    max_discount: 0,
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDiscount(formData);
      onSuccess();
    } catch {
      // Error handled in store
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="code">Discount Code</Label>
        <Input
          id="code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
          placeholder="SUMMER2024"
          required
        />
      </div>
      <div>
        <Label htmlFor="type">Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value: 'percentage' | 'fixed') => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">Percentage</SelectItem>
            <SelectItem value="fixed">Fixed Amount</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="value">Value</Label>
        <Input
          id="value"
          type="number"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
          placeholder={formData.type === 'percentage' ? '10' : '1000'}
          required
        />
      </div>
      <div>
        <Label htmlFor="max_uses">Max Uses</Label>
        <Input
          id="max_uses"
          type="number"
          value={formData.max_uses}
          onChange={(e) => setFormData({ ...formData, max_uses: parseInt(e.target.value) })}
          placeholder="100"
          required
        />
      </div>
      <div>
        <Label htmlFor="valid_from">Valid From</Label>
        <Input
          id="valid_from"
          type="date"
          value={formData.valid_from}
          onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="valid_until">Valid Until</Label>
        <Input
          id="valid_until"
          type="date"
          value={formData.valid_until}
          onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="applicable_to">Applicable To</Label>
        <Input
          id="applicable_to"
          value={formData.applicable_to}
          onChange={(e) => setFormData({ ...formData, applicable_to: e.target.value })}
          placeholder="all"
          required
        />
      </div>
      <div>
        <Label htmlFor="min_amount">Minimum Amount</Label>
        <Input
          id="min_amount"
          type="number"
          step="0.01"
          value={formData.min_amount}
          onChange={(e) => setFormData({ ...formData, min_amount: parseFloat(e.target.value) })}
          placeholder="1000.00"
          required
        />
      </div>
      <div>
        <Label htmlFor="max_discount">Max Discount</Label>
        <Input
          id="max_discount"
          type="number"
          step="0.01"
          value={formData.max_discount}
          onChange={(e) => setFormData({ ...formData, max_discount: parseFloat(e.target.value) })}
          placeholder="5000.00"
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description of the discount"
          required
        />
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

function EditDiscountForm({
  discount,
  onSuccess,
  onCancel,
}: {
  discount: Discount;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { updateDiscount, isLoading } = useFounderDiscountsStore();
  const [formData, setFormData] = useState<UpdateDiscountRequest>({
    value: discount.value,
    max_uses: discount.max_uses,
    is_active: discount.status === 'active',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDiscount(discount.id.toString(), formData);
      onSuccess();
    } catch {
      // Error handled in store
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="edit-value">Value</Label>
        <Input
          id="edit-value"
          type="number"
          value={formData.value || ''}
          onChange={(e) => setFormData({ ...formData, value: e.target.value ? parseFloat(e.target.value) : undefined })}
        />
      </div>
      <div>
        <Label htmlFor="edit-max_uses">Max Uses</Label>
        <Input
          id="edit-max_uses"
          type="number"
          value={formData.max_uses || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              max_uses: e.target.value ? parseInt(e.target.value) : undefined,
            })
          }
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="edit-is-active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked === true })}
        />
        <Label htmlFor="edit-is-active" className="text-sm font-normal cursor-pointer">
          Discount is active
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
