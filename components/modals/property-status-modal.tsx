'use client';

import { PropertyItem } from '@/types/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

interface PropertyStatusModalProps {
  property: PropertyItem | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: number) => Promise<void>;
  onReject: (id: number) => Promise<void>;
  isSubmitting: boolean;
}

export function PropertyStatusModal({
  property,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isSubmitting,
}: PropertyStatusModalProps) {
  if (!property) return null;

  const handleApprove = async () => {
    try {
      await onApprove(property.id);
      onClose();
    } catch (error) {
      console.error('Error approving property:', error);
    }
  };

  const handleReject = async () => {
    try {
      await onReject(property.id);
      onClose();
    } catch (error) {
      console.error('Error rejecting property:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Property Status</DialogTitle>
          <DialogDescription>
            Choose an action for this property listing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Property Info */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <h4 className="font-semibold text-lg mb-2">{property.title}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium">{property.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-medium">
                  ₦{parseFloat(property.price).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Status:</span>
                <Badge
                  variant={
                    property.status === 'available'
                      ? 'green'
                      : property.status === 'pending'
                        ? 'yellow'
                        : 'red'
                  }
                >
                  {property.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              onClick={handleApprove}
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              {isSubmitting ? 'Processing...' : 'Approve Property'}
            </Button>

            <Button
              type="button"
              onClick={handleReject}
              disabled={isSubmitting}
              variant="destructive"
              className="w-full"
              size="lg"
            >
              <XCircle className="h-5 w-5 mr-2" />
              {isSubmitting ? 'Processing...' : 'Reject Property'}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Approving will make the property visible to users. Rejecting will
            hide it from the platform.
          </p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
