'use client';

import { useState } from 'react';
import { Shield, CheckCircle, XCircle, CreditCard, Calendar } from 'lucide-react';
import { useFounderOverridesStore } from '@/stores/founder-overrides-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RoleGuard } from '@/components/role-guard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function FounderOverridesPage() {
  return (
    <RoleGuard feature="founder-overrides" requiredLevel="view">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">System Overrides</h1>
          <p className="text-muted-foreground">
            Manage KYC approvals, subscription overrides, and payment overrides
          </p>
        </div>
        <FounderOverridesClient />
      </div>
    </RoleGuard>
  );
}

function FounderOverridesClient() {
  return (
    <Tabs defaultValue="kyc" className="space-y-4">
      <TabsList>
        <TabsTrigger value="kyc">KYC Approvals</TabsTrigger>
        <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
      </TabsList>

      <TabsContent value="kyc" className="space-y-4">
        <KYCOverridesTab />
      </TabsContent>

      <TabsContent value="subscriptions" className="space-y-4">
        <SubscriptionOverridesTab />
      </TabsContent>

      <TabsContent value="payments" className="space-y-4">
        <PaymentOverridesTab />
      </TabsContent>
    </Tabs>
  );
}

function KYCOverridesTab() {
  const { approveKyc, declineKyc, isLoading } = useFounderOverridesStore();
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isDeclineOpen, setIsDeclineOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const handleApprove = async () => {
    if (!userId || !reason) {
      toast.error('User ID and reason are required');
      return;
    }

    try {
      await approveKyc(userId, { reason, notes });
      setIsApproveOpen(false);
      setUserId('');
      setReason('');
      setNotes('');
    } catch {
      // Error handled in store
    }
  };

  const handleDecline = async () => {
    if (!userId || !reason) {
      toast.error('User ID and reason are required');
      return;
    }

    try {
      await declineKyc(userId, { reason, notes });
      setIsDeclineOpen(false);
      setUserId('');
      setReason('');
      setNotes('');
    } catch {
      // Error handled in store
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Approve KYC
          </CardTitle>
          <CardDescription>Override and approve pending KYC verification</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
            <Button onClick={() => setIsApproveOpen(true)} className="w-full">
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve KYC
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Approve KYC Override</DialogTitle>
                <DialogDescription>
                  Manually approve a user&apos;s KYC verification
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="approve-user-id">User ID</Label>
                  <Input
                    id="approve-user-id"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter user ID"
                  />
                </div>
                <div>
                  <Label htmlFor="approve-reason">Reason</Label>
                  <Input
                    id="approve-reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason for approval"
                  />
                </div>
                <div>
                  <Label htmlFor="approve-notes">Notes (Optional)</Label>
                  <Textarea
                    id="approve-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional notes"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsApproveOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleApprove} disabled={isLoading}>
                    {isLoading ? 'Approving...' : 'Approve'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            Decline KYC
          </CardTitle>
          <CardDescription>Reject pending KYC verification</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isDeclineOpen} onOpenChange={setIsDeclineOpen}>
            <Button
              onClick={() => setIsDeclineOpen(true)}
              variant="destructive"
              className="w-full"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Decline KYC
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Decline KYC</DialogTitle>
                <DialogDescription>Reject a user&apos;s KYC verification</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="decline-user-id">User ID</Label>
                  <Input
                    id="decline-user-id"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter user ID"
                  />
                </div>
                <div>
                  <Label htmlFor="decline-reason">Reason</Label>
                  <Input
                    id="decline-reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason for declining"
                  />
                </div>
                <div>
                  <Label htmlFor="decline-notes">Notes (Optional)</Label>
                  <Textarea
                    id="decline-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional notes"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDeclineOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDecline}
                    disabled={isLoading}
                    variant="destructive"
                  >
                    {isLoading ? 'Declining...' : 'Decline'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}

function SubscriptionOverridesTab() {
  const { overrideSubscription, isLoading } = useFounderOverridesStore();
  const [isOpen, setIsOpen] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState('');
  const [plan, setPlan] = useState('');
  const [amount, setAmount] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const handleOverride = async () => {
    if (!subscriptionId || !reason) {
      toast.error('Subscription ID and reason are required');
      return;
    }

    try {
      await overrideSubscription(subscriptionId, {
        plan: plan || undefined,
        amount: amount ? parseFloat(amount) : undefined,
        end_date: endDate || undefined,
        reason,
      });
      setIsOpen(false);
      setSubscriptionId('');
      setPlan('');
      setAmount('');
      setEndDate('');
      setReason('');
    } catch {
      // Error handled in store
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Subscription Override
        </CardTitle>
        <CardDescription>
          Modify subscription plan, amount, or end date for specific users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Button onClick={() => setIsOpen(true)}>
            <Shield className="mr-2 h-4 w-4" />
            Override Subscription
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Override Subscription</DialogTitle>
              <DialogDescription>
                Modify subscription details for a specific user
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="sub-id">Subscription ID</Label>
                <Input
                  id="sub-id"
                  value={subscriptionId}
                  onChange={(e) => setSubscriptionId(e.target.value)}
                  placeholder="Enter subscription ID"
                />
              </div>
              <div>
                <Label htmlFor="plan">Plan (Optional)</Label>
                <Select value={plan} onValueChange={setPlan}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount (Optional)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Override amount"
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date (Optional)</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="sub-reason">Reason</Label>
                <Textarea
                  id="sub-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason for override"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleOverride} disabled={isLoading}>
                  {isLoading ? 'Overriding...' : 'Override'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function PaymentOverridesTab() {
  const { overridePayment, isLoading } = useFounderOverridesStore();
  const [isOpen, setIsOpen] = useState(false);
  const [paymentId, setPaymentId] = useState('');
  const [status, setStatus] = useState<'completed' | 'failed'>('completed');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const handleOverride = async () => {
    if (!paymentId || !reason) {
      toast.error('Payment ID and reason are required');
      return;
    }

    try {
      await overridePayment(paymentId, {
        status,
        reason,
        notes,
      });
      setIsOpen(false);
      setPaymentId('');
      setStatus('completed');
      setReason('');
      setNotes('');
    } catch {
      // Error handled in store
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-green-600" />
          Payment Override
        </CardTitle>
        <CardDescription>
          Manually set payment status to completed or failed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Button onClick={() => setIsOpen(true)}>
            <Shield className="mr-2 h-4 w-4" />
            Override Payment
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Override Payment Status</DialogTitle>
              <DialogDescription>
                Manually set the status of a payment transaction
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="payment-id">Payment ID</Label>
                <Input
                  id="payment-id"
                  value={paymentId}
                  onChange={(e) => setPaymentId(e.target.value)}
                  placeholder="Enter payment ID"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value: 'completed' | 'failed') => setStatus(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="payment-reason">Reason</Label>
                <Input
                  id="payment-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason for override"
                />
              </div>
              <div>
                <Label htmlFor="payment-notes">Notes (Optional)</Label>
                <Textarea
                  id="payment-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleOverride} disabled={isLoading}>
                  {isLoading ? 'Overriding...' : 'Override'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
