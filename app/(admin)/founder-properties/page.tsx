'use client';

import { useEffect } from 'react';
import { Building2, Star, TrendingUp } from 'lucide-react';
import { useFounderPropertiesStore } from '@/stores/founder-properties-store';
import { StatCard } from '@/components/dashboard/stat-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RoleGuard } from '@/components/role-guard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function FounderPropertiesPage() {
  return (
    <RoleGuard feature="founder-properties" requiredLevel="view">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Properties Analytics</h1>
          <p className="text-muted-foreground">Property performance and occupancy metrics</p>
        </div>
        <FounderPropertiesClient />
      </div>
    </RoleGuard>
  );
}

function FounderPropertiesClient() {
  const { dashboard, isLoading, fetchDashboard, refreshDashboard } = useFounderPropertiesStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (isLoading && !dashboard) {
    return <div className="grid gap-4 md:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)}</div>;
  }

  if (!dashboard) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <StatCard
          title="Total Properties"
          value={dashboard.total.toString()}
          icon={Building2}
          iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
        />
        <StatCard
          title="New This Month"
          value={dashboard.new_this_month.toString()}
          icon={TrendingUp}
          trend="up"
          iconClassName="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Most Viewed Properties</CardTitle>
            <CardDescription>Properties with highest view counts</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshDashboard}>Refresh</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboard.most_viewed.slice(0, 10).map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">{property.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{property.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{property.location}</TableCell>
                  <TableCell className="text-right font-semibold">₦{parseFloat(property.price).toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    {property.average_rating ? (
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{parseFloat(property.average_rating).toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">({property.rating_count})</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No ratings</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Most Booked Properties</CardTitle>
          <CardDescription>Properties with highest booking counts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Bookings</TableHead>
                <TableHead className="text-center">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboard.most_booked.slice(0, 10).map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">{property.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{property.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{property.location}</TableCell>
                  <TableCell className="text-right font-semibold">₦{parseFloat(property.price).toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{property.bookings_count || 0}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {property.average_rating ? (
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{parseFloat(property.average_rating).toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">({property.rating_count})</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No ratings</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
