'use client';

import { useState, useEffect } from 'react';
import { PropertiesDataTable } from './properties-data-table';
import { PropertyViewModal } from '@/components/modals/property-view-modal';
import { PropertyEditModal } from '@/components/modals/property-edit-modal';
import { PropertyStatusModal } from '@/components/modals/property-status-modal';
import { PropertyItem, UpdatePropertyListingRequest } from '@/types/api';
import { usePropertiesStore } from '@/stores/properties-store';
import { useDebounce } from '@/hooks/use-debounce';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

function PropertiesClient() {
  const {
    properties,
    isLoading,
    fetchProperties,
    updateProperty,
    updatePropertyStatus,
    deleteProperty,
  } = usePropertiesStore();

  const [selectedProperty, setSelectedProperty] = useState<PropertyItem | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    fetchProperties({ page: currentPage });
  }, [currentPage, fetchProperties]);

  const handleViewProperty = (property: PropertyItem) => {
    setSelectedProperty(property);
    setIsViewModalOpen(true);
  };

  const handleEditProperty = (property: PropertyItem) => {
    setSelectedProperty(property);
    setIsEditModalOpen(true);
  };

  const handleDeleteProperty = (property: PropertyItem) => {
    setSelectedProperty(property);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateStatus = (property: PropertyItem) => {
    setSelectedProperty(property);
    setIsStatusModalOpen(true);
  };

  const handleEditSubmit = async (
    id: number,
    data: UpdatePropertyListingRequest
  ) => {
    setIsSubmitting(true);
    try {
      await updateProperty(id, data);
      setIsEditModalOpen(false);
      setSelectedProperty(null);
    } catch (error) {
      console.error('Error updating property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveProperty = async (id: number) => {
    setIsSubmitting(true);
    try {
      await updatePropertyStatus(id, { status: 'available' });
      setIsStatusModalOpen(false);
      setSelectedProperty(null);
    } catch (error) {
      console.error('Error approving property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectProperty = async (id: number) => {
    setIsSubmitting(true);
    try {
      await updatePropertyStatus(id, { status: 'rejected' });
      setIsStatusModalOpen(false);
      setSelectedProperty(null);
    } catch (error) {
      console.error('Error rejecting property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedProperty) return;

    setIsSubmitting(true);
    try {
      await deleteProperty(selectedProperty.id);
      setIsDeleteModalOpen(false);
      setSelectedProperty(null);
    } catch (error) {
      console.error('Error deleting property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredData =
    properties?.data?.filter(
      (item) =>
        item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        item.location
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    ) || [];

  // Client-side pagination
  const itemsPerPage = 15;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <PropertiesDataTable
        data={paginatedData}
        currentPage={currentPage}
        totalPages={totalPages}
        isLoading={isLoading}
        onView={handleViewProperty}
        onEdit={handleEditProperty}
        onDelete={handleDeleteProperty}
        onUpdateStatus={handleUpdateStatus}
        onPageChange={setCurrentPage}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
      />

      {/* View Modal */}
      <PropertyViewModal
        property={selectedProperty}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedProperty(null);
        }}
      />

      {/* Edit Modal */}
      <PropertyEditModal
        property={selectedProperty}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProperty(null);
        }}
        onSubmit={handleEditSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Status Update Modal */}
      <PropertyStatusModal
        property={selectedProperty}
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setSelectedProperty(null);
        }}
        onApprove={handleApproveProperty}
        onReject={handleRejectProperty}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteModalOpen}
        onOpenChange={(open) => {
          setIsDeleteModalOpen(open);
          if (!open) setSelectedProperty(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the property &ldquo;
              <strong>{selectedProperty?.title}</strong>&rdquo;? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { PropertiesClient };
