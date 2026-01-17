'use client';

import { Eye, Edit, Trash2, CheckCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { PropertyItem } from '@/types/api';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface PropertiesDataTableProps {
  data: PropertyItem[];
  currentPage: number;
  totalPages: number;
  isLoading?: boolean;
  onView: (item: PropertyItem) => void;
  onEdit: (item: PropertyItem) => void;
  onDelete: (item: PropertyItem) => void;
  onUpdateStatus: (item: PropertyItem) => void;
  onPageChange: (page: number) => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

export function PropertiesDataTable({
  data,
  currentPage,
  totalPages,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
  onUpdateStatus,
  onPageChange,
  searchTerm,
  onSearchTermChange,
}: PropertiesDataTableProps) {
  const getStatusVariant = (
    status: string
  ):
    | 'blue'
    | 'green'
    | 'yellow'
    | 'purple'
    | 'gray'
    | 'red'
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary' => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getCategoryVariant = (
    category: string
  ):
    | 'blue'
    | 'green'
    | 'yellow'
    | 'purple'
    | 'gray'
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary' => {
    switch (category.toLowerCase()) {
      case 'for_sale':
        return 'blue';
      case 'for_rent':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const formatPrice = (price: string) => {
    return `₦${parseFloat(price).toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search properties by title, location, or type..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                No properties found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                There are no properties to display at the moment.
              </p>
            </div>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {item.title}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      {item.location}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getCategoryVariant(item.category)}>
                        {item.category.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(item.price)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.views_count}</TableCell>
                    <TableCell>{formatDate(item.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(item)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(item)}
                          title="Edit Property"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {item.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onUpdateStatus(item)}
                            title="Update Status"
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(item)}
                          title="Delete Property"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * 15 + 1} to{' '}
                  {Math.min(currentPage * 15, data.length)} of {data.length}{' '}
                  properties
                </p>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) {
                            onPageChange(currentPage - 1);
                          }
                        }}
                        className={
                          currentPage === 1
                            ? 'pointer-events-none opacity-50'
                            : ''
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              onPageChange(pageNum);
                            }}
                            isActive={currentPage === pageNum}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) {
                            onPageChange(currentPage + 1);
                          }
                        }}
                        className={
                          currentPage === totalPages
                            ? 'pointer-events-none opacity-50'
                            : ''
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
