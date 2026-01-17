'use client';

import { useEffect, useState } from 'react';
import { Building2, Star, TrendingUp, Eye } from 'lucide-react';
import { useFounderPropertiesStore } from '@/stores/founder-properties-store';
import { StatCard } from '@/components/dashboard/stat-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RoleGuard } from '@/components/role-guard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropertyViewModal } from '@/components/modals/property-view-modal';
import { PropertyItem } from '@/types/api';

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
  const [selectedProperty, setSelectedProperty] = useState<PropertyItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [mostViewedPage, setMostViewedPage] = useState(1);
  const [mostBookedPage, setMostBookedPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleViewProperty = (property: PropertyItem) => {
    setSelectedProperty(property);
    setIsViewModalOpen(true);
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

  const renderPagination = (currentPage: number, totalItems: number, onPageChange: (page: number) => void) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalItems === 0) return null;

    return (
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} properties
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  const renderPropertyTable = (properties: PropertyItem[], currentPage: number, setPage: (page: number) => void) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProperties = properties.slice(startIndex, endIndex);

    return (
      <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Rating</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProperties.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium max-w-[200px] truncate">{property.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{property.type}</Badge>
                </TableCell>
                <TableCell className="text-right font-semibold">₦{parseFloat(property.price).toLocaleString()}</TableCell>
                <TableCell className="text-center">
                  {property.average_rating ? (
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{parseFloat(property.average_rating).toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">({property.rating_count})</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">No ratings</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={getCategoryColor(property.category)}>
                    {property.category.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(property.status)}>
                    {property.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewProperty(property)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {renderPagination(currentPage, properties.length, setPage)}
      </>
    );
  };

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
            <CardTitle>Property Performance</CardTitle>
            <CardDescription>View and analyze property metrics</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshDashboard}>Refresh</Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="most-viewed" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="most-viewed">Most Viewed</TabsTrigger>
              <TabsTrigger value="most-booked">Most Booked</TabsTrigger>
            </TabsList>
            <TabsContent value="most-viewed" className="mt-4">
              <div className="mb-2">
                <p className="text-sm text-muted-foreground">Properties with highest view counts</p>
              </div>
              {renderPropertyTable(dashboard.most_viewed, mostViewedPage, setMostViewedPage)}
            </TabsContent>
            <TabsContent value="most-booked" className="mt-4">
              <div className="mb-2">
                <p className="text-sm text-muted-foreground">Properties with highest booking counts</p>
              </div>
              {renderPropertyTable(dashboard.most_booked, mostBookedPage, setMostBookedPage)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <PropertyViewModal
        property={selectedProperty}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />
    </div>
  );
}
