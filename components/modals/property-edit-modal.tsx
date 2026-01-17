'use client';

import { PropertyItem, UpdatePropertyListingRequest } from '@/types/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface PropertyEditModalProps {
  property: PropertyItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, data: UpdatePropertyListingRequest) => Promise<void>;
  isSubmitting: boolean;
}

export function PropertyEditModal({
  property,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: PropertyEditModalProps) {
  const [formData, setFormData] = useState<UpdatePropertyListingRequest>({});
  const [currentFeature, setCurrentFeature] = useState('');

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        description: property.description,
        price: parseFloat(property.price),
        location: property.location,
        bedrooms: property.bedrooms ?? undefined,
        bathrooms: property.bathrooms ?? undefined,
        gated: property.gated,
        parking: property.parking,
        features: property.features || [],
      });
    }
  }, [property]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    try {
      await onSubmit(property.id, formData);
      onClose();
    } catch (error) {
      console.error('Error updating property:', error);
    }
  };

  const handleAddFeature = () => {
    if (currentFeature.trim() && formData.features) {
      setFormData({
        ...formData,
        features: [...formData.features, currentFeature.trim()],
      });
      setCurrentFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    if (formData.features) {
      setFormData({
        ...formData,
        features: formData.features.filter((_, i) => i !== index),
      });
    }
  };

  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4 py-4">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Property title"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Property description"
                  rows={4}
                />
              </div>

              {/* Price */}
              <div>
                <Label htmlFor="price">Price (₦)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value),
                    })
                  }
                  placeholder="0.00"
                />
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Property location"
                />
              </div>

              {/* Bedrooms and Bathrooms */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms ?? ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bedrooms: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                    placeholder="Number of bedrooms"
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms ?? ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bathrooms: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                    placeholder="Number of bathrooms"
                  />
                </div>
              </div>

              {/* Gated and Parking */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="gated"
                    checked={formData.gated || false}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, gated: checked as boolean })
                    }
                  />
                  <Label htmlFor="gated" className="cursor-pointer">
                    Gated Community
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="parking"
                    checked={formData.parking || false}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, parking: checked as boolean })
                    }
                  />
                  <Label htmlFor="parking" className="cursor-pointer">
                    Parking Available
                  </Label>
                </div>
              </div>

              {/* Features */}
              <div>
                <Label>Features</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={currentFeature}
                    onChange={(e) => setCurrentFeature(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="Add a feature"
                  />
                  <Button
                    type="button"
                    onClick={handleAddFeature}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                {formData.features && formData.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.features.map((feature, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="pl-3 pr-1"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="ml-2 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Status (read-only display) */}
              <div>
                <Label>Current Status</Label>
                <div className="mt-2">
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
                  <p className="text-sm text-muted-foreground mt-1">
                    Use the status action button to change property status
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Property'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
