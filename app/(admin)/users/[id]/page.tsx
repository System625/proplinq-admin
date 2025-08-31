'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUsersStore } from '@/stores/users-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Mail, Calendar, User, Shield } from 'lucide-react';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser, isLoading, fetchUser } = useUsersStore();
  const userId = params.id as string;

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId, fetchUser]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRole = (role: string) => {
    const roleMap: Record<string, string> = {
      'admin': 'Administrator',
      'agent': 'Real Estate Agent',
      'home_seeker': 'Home Seeker',
      'property_owner': 'Property Owner',
      'individual_agent': 'Individual Agent',
      'agency_agent': 'Agency Agent',
    };
    return roleMap[role] || role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getRoleVariant = (role: string): "red" | "blue" | "green" | "purple" | "indigo" | "cyan" | "gray" => {
    const variants = {
      'admin': 'red' as const,
      'agent': 'blue' as const,
      'home_seeker': 'green' as const,
      'property_owner': 'purple' as const,
      'individual_agent': 'indigo' as const,
      'agency_agent': 'cyan' as const,
    };
    return variants[role as keyof typeof variants] || 'gray';
  };

  const getStatusVariant = (verified: boolean): "green" | "orange" => {
    return verified ? 'green' : 'orange';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="p-6">
          <CardContent className="text-center">
            <p className="text-red-500 mb-4">User not found</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="h-10 w-10 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {currentUser.full_name}
          </h1>
          <p className="text-muted-foreground">User Details</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>User Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{currentUser.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div>
                <p className="text-sm font-medium">Phone Number</p>
                <p className="text-sm text-muted-foreground">{currentUser.phone_number || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{currentUser.location || 'Not provided'}</p>
              </div>
            </div>

            {currentUser.agency_name && (
              <div className="flex items-center space-x-3">
                <div>
                  <p className="text-sm font-medium">Agency Name</p>
                  <p className="text-sm text-muted-foreground">{currentUser.agency_name}</p>
                </div>
              </div>
            )}

            {currentUser.agent_type && (
              <div className="flex items-center space-x-3">
                <div>
                  <p className="text-sm font-medium">Agent Type</p>
                  <Badge variant="secondary">{formatRole(currentUser.agent_type)}</Badge>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Role</p>
                <Badge variant={getRoleVariant(currentUser.role)}>
                  {formatRole(currentUser.role)}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Email Verification</p>
              <Badge variant={getStatusVariant(!!currentUser.email_verified_at)}>
                {currentUser.email_verified_at ? 'Verified' : 'Unverified'}
              </Badge>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Phone Verification</p>
              <Badge variant={getStatusVariant(!!currentUser.phone_verified_at)}>
                {currentUser.phone_verified_at ? 'Verified' : 'Unverified'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Account Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Account Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Account Created</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(currentUser.created_at)}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium">Last Updated</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(currentUser.updated_at)}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium">User ID</p>
              <p className="text-sm text-muted-foreground font-mono">
                {currentUser.id}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Account Status</p>
              <div className="flex gap-2">
                <Badge variant={currentUser.is_suspended ? 'destructive' : 'success'}>
                  {currentUser.is_suspended ? 'Suspended' : 'Active'}
                </Badge>
                <Badge variant={getStatusVariant(currentUser.terms_accepted)}>
                  {currentUser.terms_accepted ? 'Terms Accepted' : 'Terms Pending'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button variant="outline">
              View Bookings
            </Button>
            <Button variant="outline">
              View Transactions
            </Button>
            <Button variant="outline">
              KYC Status
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}