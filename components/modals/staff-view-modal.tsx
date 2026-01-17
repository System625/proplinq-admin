'use client';

import { Staff } from '@/types/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Globe,
} from 'lucide-react';

interface StaffViewModalProps {
  staff: Staff | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StaffViewModal({
  staff,
  isOpen,
  onClose,
}: StaffViewModalProps) {
  if (!staff) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'support':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'operations':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'sales':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'marketing':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-start gap-2">
            <User className="h-6 w-6 mt-1 text-primary" />
            <span className="flex-1">{staff.full_name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Role Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge className={getRoleColor(staff.role)}>
              {staff.role.toUpperCase()}
            </Badge>
            <Badge
              variant={staff.is_suspended ? 'destructive' : 'default'}
            >
              {staff.is_suspended ? 'Suspended' : 'Active'}
            </Badge>
            {staff.email_verified_at && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Email Verified
              </Badge>
            )}
            {staff.phone_verified_at && (
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                Phone Verified
              </Badge>
            )}
            {staff.is_online && (
              <Badge className="bg-green-500 text-white">
                Online
              </Badge>
            )}
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
              <Mail className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium break-all">{staff.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
              <Phone className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium">{staff.phone_number || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Additional Contact Info */}
          {staff.whatsapp_number && (
            <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
              <Phone className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">WhatsApp Number</p>
                <p className="font-medium">{staff.whatsapp_number}</p>
              </div>
            </div>
          )}

          {/* Location and Agency Info */}
          {(staff.location || staff.agency_name) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {staff.location && (
                <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
                  <MapPin className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{staff.location}</p>
                  </div>
                </div>
              )}
              {staff.agency_name && (
                <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
                  <Building2 className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Agency Name</p>
                    <p className="font-medium">{staff.agency_name}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Agent Type */}
          {staff.agent_type && (
            <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
              <Shield className="h-8 w-8 text-indigo-600" />
              <div>
                <p className="text-sm text-muted-foreground">Agent Type</p>
                <p className="font-medium capitalize">{staff.agent_type}</p>
              </div>
            </div>
          )}

          <Separator />

          {/* Permissions */}
          <div>
            <h3 className="font-semibold mb-3 text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Permissions
            </h3>
            {staff.staff_permissions && staff.staff_permissions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {staff.staff_permissions.map((perm) => (
                  <div
                    key={perm.id}
                    className={`flex items-center gap-2 p-3 border rounded-md ${
                      perm.granted
                        ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
                    }`}
                  >
                    {perm.granted ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm font-medium capitalize">
                      {perm.permission.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No permissions assigned</p>
            )}
          </div>

          <Separator />

          {/* Activity Information */}
          <div>
            <h3 className="font-semibold mb-3 text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Activity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Last Seen</p>
                  <p className="font-medium">{formatDate(staff.last_seen_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Created At</p>
                  <p className="font-medium">{formatDate(staff.created_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div>
            <h3 className="font-semibold mb-3 text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Status
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                {staff.terms_accepted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="text-sm font-medium">Terms Accepted</span>
              </div>
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                {staff.free_listing_active ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="text-sm font-medium">Free Listing Active</span>
              </div>
              {staff.google_id && (
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">Google Linked</span>
                </div>
              )}
              {staff.apple_id && (
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <Globe className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium">Apple Linked</span>
                </div>
              )}
            </div>
          </div>

          {staff.free_listing_expires_at && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <span className="text-sm font-medium text-yellow-900 dark:text-yellow-300">
                Free Listing Expires:
              </span>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                {formatDate(staff.free_listing_expires_at)}
              </p>
            </div>
          )}

          <Separator />

          {/* Administrative Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Administrative Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Staff ID:</span>
                <span className="ml-2 font-medium">#{staff.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Updated At:</span>
                <span className="ml-2 font-medium">{formatDate(staff.updated_at)}</span>
              </div>
              {staff.email_verified_at && (
                <div>
                  <span className="text-muted-foreground">Email Verified:</span>
                  <span className="ml-2 font-medium">{formatDate(staff.email_verified_at)}</span>
                </div>
              )}
              {staff.phone_verified_at && (
                <div>
                  <span className="text-muted-foreground">Phone Verified:</span>
                  <span className="ml-2 font-medium">{formatDate(staff.phone_verified_at)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Profile Image */}
          {staff.profile_image_full_url && (
            <div>
              <h3 className="font-semibold mb-3 text-lg">Profile Image</h3>
              <img
                src={staff.profile_image_full_url}
                alt={staff.full_name}
                className="w-32 h-32 rounded-lg object-cover border"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
