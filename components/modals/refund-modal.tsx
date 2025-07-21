'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTransactionsStore } from '@/stores/transactions-store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { MOCK_BOOKINGS } from '@/lib/mock-data';

const refundSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  reason: z.string().min(1, 'Please provide a reason for the refund'),
});

type RefundForm = z.infer<typeof refundSchema>;

interface RefundModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: string | null;
}

export function RefundModal({ open, onOpenChange, transactionId }: RefundModalProps) {
  const { transactions, processRefund, isProcessingRefund } = useTransactionsStore();
  const [maxAmount, setMaxAmount] = useState(0);

  const form = useForm<RefundForm>({
    resolver: zodResolver(refundSchema),
    defaultValues: {
      amount: 0,
      reason: '',
    },
  });

  const transaction = transactions.find(t => t.id === transactionId);

  useEffect(() => {
    if (transaction && open) {
      setMaxAmount(transaction.amount);
      form.setValue('amount', transaction.amount);
    }
  }, [transaction, open, form]);

  async function onSubmit(values: RefundForm) {
    if (!transaction) return;

    try {
      await processRefund({
        bookingId: transaction.bookingId,
        amount: values.amount,
        reason: values.reason,
      });
      
      onOpenChange(false);
      form.reset();
    } catch {
      // Error handling is done in the store
    }
  }

  if (!transaction) return null;

  // Find the booking for this transaction
  const booking = MOCK_BOOKINGS.find(b => b.id === transaction.bookingId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Process Refund</DialogTitle>
          <DialogDescription>
            Process a refund for transaction {transaction.id}
            {booking && ` (${booking.guestName})`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <div className="text-sm">
                  <p><span className="font-medium">Original Amount:</span> ${transaction.amount}</p>
                  <p><span className="font-medium">Payment Method:</span> {transaction.paymentMethod}</p>
                  {booking && (
                    <p><span className="font-medium">Guest:</span> {booking.guestName}</p>
                  )}
                </div>
              </div>

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Refund Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max={maxAmount}
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Refund</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide a reason for this refund..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isProcessingRefund}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isProcessingRefund}>
                {isProcessingRefund ? 'Processing...' : 'Process Refund'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}