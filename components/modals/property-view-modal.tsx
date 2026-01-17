'use client';

import { PropertyItem } from '@/types/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Building2,
  MapPin,
  BedDouble,
  Bath,
  DollarSign,
  Calendar,
  Eye,
  Star,
  CheckCircle2,
  XCircle,
  Tag,
  ShieldCheck,
  Video,
  TrendingUp,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface PropertyViewModalProps {
  property: PropertyItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PropertyViewModal({
  property,
  isOpen,
  onClose,
}: PropertyViewModalProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Reset lightbox state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsLightboxOpen(false);
      setLightboxIndex(0);
    }
  }, [isOpen]);

  if (!property) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price: string) => {
    return `₦${parseFloat(price).toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'sold':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'for_sale':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'for_rent':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'hotel':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <>
      <Dialog open={isOpen && !isLightboxOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-start gap-2">
              <Building2 className="h-6 w-6 mt-1 text-primary" />
              <span className="flex-1">{property.title}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Property Images */}
            {property.images_full_urls && property.images_full_urls.length > 0 && (
              <div className="space-y-3">
                <div
                  className="relative w-full h-64 rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => {
                    setLightboxIndex(0);
                    setIsLightboxOpen(true);
                  }}
                >
                  <img
                    src={property.images_full_urls[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {property.images_full_urls.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {property.images_full_urls.slice(1, 5).map((url, index) => (
                      <div
                        key={index}
                        className="relative w-full h-20 rounded-md overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => {
                          setLightboxIndex(index + 1);
                          setIsLightboxOpen(true);
                        }}
                      >
                        <img
                          src={url}
                          alt={`${property.title} - ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {property.images_full_urls.length > 5 && (
                      <div
                        className="relative w-full h-20 rounded-md overflow-hidden bg-muted flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => {
                          setLightboxIndex(5);
                          setIsLightboxOpen(true);
                        }}
                      >
                        <span className="text-sm font-medium">
                          +{property.images_full_urls.length - 5} more
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          {/* Status and Category Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge className={getStatusColor(property.status)}>
              {property.status}
            </Badge>
            <Badge className={getCategoryColor(property.category)}>
              {property.category.replace('_', ' ')}
            </Badge>
            <Badge variant="outline">
              <Tag className="h-3 w-3 mr-1" />
              {property.type}
            </Badge>
            {property.is_promoted && (
              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                <TrendingUp className="h-3 w-3 mr-1" />
                Promoted
              </Badge>
            )}
          </div>

          {/* Price and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="text-xl font-bold">{formatPrice(property.price)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
              <MapPin className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{property.location}</p>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {property.bedrooms !== null && (
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <BedDouble className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Bedrooms</p>
                  <p className="font-semibold">{property.bedrooms}</p>
                </div>
              </div>
            )}
            {property.bathrooms !== null && (
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <Bath className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Bathrooms</p>
                  <p className="font-semibold">{property.bathrooms}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Eye className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Views</p>
                <p className="font-semibold">{property.views_count}</p>
              </div>
            </div>
            {property.bookings_count !== undefined && (
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Bookings</p>
                  <p className="font-semibold">{property.bookings_count}</p>
                </div>
              </div>
            )}
          </div>

          {/* Rating */}
          {property.average_rating && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-semibold">
                  {parseFloat(property.average_rating).toFixed(1)}
                </span>
                <span className="text-muted-foreground">
                  ({property.rating_count} {property.rating_count === 1 ? 'rating' : 'ratings'})
                </span>
              </div>
            </div>
          )}

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2 text-lg">Description</h3>
            <p className="text-muted-foreground whitespace-pre-line">{property.description}</p>
          </div>

          {/* Features */}
          {property.features && property.features.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 text-lg">Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Property Amenities */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              {property.gated ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="text-sm font-medium">Gated Community</span>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              {property.parking ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="text-sm font-medium">Parking Available</span>
            </div>
          </div>

          {/* Video URL */}
          {property.video_url && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                <a
                  href={property.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View Property Video
                </a>
              </div>
            </div>
          )}

          <Separator />

          {/* Admin Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Administrative Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Property ID:</span>
                <span className="ml-2 font-medium">#{property.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Owner ID:</span>
                <span className="ml-2 font-medium">#{property.user_id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Created:</span>
                <span className="ml-2 font-medium">{formatDate(property.created_at)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Updated:</span>
                <span className="ml-2 font-medium">{formatDate(property.updated_at)}</span>
              </div>
              {property.approved_at && (
                <div>
                  <span className="text-muted-foreground">Approved:</span>
                  <span className="ml-2 font-medium">{formatDate(property.approved_at)}</span>
                </div>
              )}
              {property.rejected_at && (
                <div>
                  <span className="text-muted-foreground">Rejected:</span>
                  <span className="ml-2 font-medium">{formatDate(property.rejected_at)}</span>
                </div>
              )}
              {property.promoted_at && (
                <div>
                  <span className="text-muted-foreground">Promoted:</span>
                  <span className="ml-2 font-medium">{formatDate(property.promoted_at)}</span>
                </div>
              )}
            </div>
            {property.rejection_reason && (
              <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                <span className="text-sm font-medium text-red-900 dark:text-red-300">
                  Rejection Reason:
                </span>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                  {property.rejection_reason}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>

      {/* Lightbox for full-screen image viewing - rendered outside Dialog */}
      {property.images_full_urls && property.images_full_urls.length > 0 && (
        <Lightbox
          open={isLightboxOpen}
          close={() => setIsLightboxOpen(false)}
          index={lightboxIndex}
          slides={property.images_full_urls.map((url) => ({ src: url }))}
        />
      )}
    </>
  );
}
