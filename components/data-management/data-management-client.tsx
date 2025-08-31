'use client';

import { useState, useEffect, useCallback } from 'react';
import { DataTable } from './data-table';
import { DataManagementModals } from '@/components/modals/data-management-modals';
import {
  CompanyData,
  CompanyDataResponse,
  CompanyDataPaginatedResponse,
} from '@/types/api';
import { getToken } from '@/lib/auth';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/use-debounce';

function DataManagementClient() {
  const [data, setData] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<CompanyData | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editFormData, setEditFormData] = useState<Partial<CompanyData>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleTokenExpiration = () => {
    toast.error('Your session has expired. Please log in again.');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const fetchData = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const token = getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/company-data?page=${page}`, {
        headers,
      });

      if (response.status === 401) {
        handleTokenExpiration();
        return;
      }

      const result: CompanyDataResponse<
        CompanyDataPaginatedResponse<CompanyData>
      > = await response.json();

      if (result.status && result.data) {
        setData(result.data.data || []);
        setTotalPages(result.data.last_page || 1);
        setCurrentPage(result.data.current_page || 1);
      }
    } catch (err) {
      setError('Error fetching data. Please try again later.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, fetchData]);

  const fetchItemDetails = async (id: number) => {
    try {
      const token = getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/company-data/${id}`, {
        headers,
      });

      if (response.status === 401) {
        handleTokenExpiration();
        return null;
      }

      const result: CompanyDataResponse<CompanyData> = await response.json();

      if (result.status && result.data) {
        return result.data;
      }
      return null;
    } catch (err) {
      console.error('Error fetching item details:', err);
      return null;
    }
  };

  const handleViewItem = async (item: CompanyData) => {
    try {
      setSelectedItem(item);
      setIsViewModalOpen(true);

      const details = await fetchItemDetails(item.id);
      if (details) {
        setSelectedItem(details);
      }
    } catch (error) {
      console.error('Error in handleViewItem:', error);
    }
  };

  const handleEditItem = (item: CompanyData) => {
    try {
      setSelectedItem(item);
      setEditFormData({
        full_name: item.full_name,
        email: item.email,
        phone_number: item.phone_number,
        company_name: item.company_name,
        property_type: item.property_type,
        location: item.location
      });
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Error in handleEditItem:', error);
    }
  };

  const handleDeleteItem = (item: CompanyData) => {
    try {
      setSelectedItem(item);
      setIsDeleteModalOpen(true);
    } catch (error) {
      console.error('Error in handleDeleteItem:', error);
    }
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatPhoneNumber = (phone: string): string => {
    if (!phone || phone.trim() === '') {
      return '';
    }

    const cleanPhone = phone.replace(/[^\d+]/g, '');

    if (cleanPhone.startsWith('+234')) {
      return cleanPhone;
    }

    if (cleanPhone.startsWith('234')) {
      return '+' + cleanPhone;
    }

    if (cleanPhone.startsWith('0')) {
      return '+234' + cleanPhone.substring(1);
    }

    if (cleanPhone.length >= 10) {
      return '+234' + cleanPhone;
    }

    return phone;
  };

  const submitEditForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const formattedData = {
      ...editFormData,
      phone_number: editFormData.phone_number ? formatPhoneNumber(editFormData.phone_number) : undefined
    };

    setIsSubmitting(true);
    try {
      const token = getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/company-data/${selectedItem.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(formattedData),
      });

      if (response.status === 401) {
        handleTokenExpiration();
        return;
      }

      const result: CompanyDataResponse<CompanyData> = await response.json();

      if (result.status) {
        setData(prevData =>
          prevData.map(item =>
            item.id === selectedItem.id ? { ...item, ...formattedData } as CompanyData : item
          )
        );

        setIsEditModalOpen(false);
        setSelectedItem(null);
        setEditFormData({});
        toast.success('Contact updated successfully!');
      } else {
        console.error('Update failed - API returned error:', result.message);
        toast.error(result.message || 'Failed to update contact. Please try again.');
      }
    } catch (err) {
      console.error('Network/API error during update:', err);
      toast.error('Failed to update contact. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;

    setIsSubmitting(true);
    try {
      const token = getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/company-data/${selectedItem.id}`, {
        method: 'DELETE',
        headers,
      });

      if (response.status === 401) {
        handleTokenExpiration();
        return;
      }

      const result: CompanyDataResponse<CompanyData> = await response.json();

      if (result.status) {
        setData(prevData => prevData.filter(item => item.id !== selectedItem.id));
        setIsDeleteModalOpen(false);
        setSelectedItem(null);
        toast.success('Contact deleted successfully!');
      } else {
        console.error('Delete failed - API returned error:', result.message);
        toast.error(result.message || 'Failed to delete contact. Please try again.');
      }
    } catch (err) {
      console.error('Network/API error during delete:', err);
      toast.error('Failed to delete contact. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredData = data.filter(
    (item) =>
      item.full_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      (item.phone_number &&
        item.phone_number.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
      item.company_name
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase()),
  );

  return (
    <div>
      <DataTable
        data={filteredData}
        currentPage={currentPage}
        totalPages={totalPages}
        isLoading={loading}
        onView={handleViewItem}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
        onPageChange={setCurrentPage}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
      />

      <DataManagementModals
        selectedItem={selectedItem}
        editFormData={editFormData}
        isViewModalOpen={isViewModalOpen}
        isEditModalOpen={isEditModalOpen}
        isDeleteModalOpen={isDeleteModalOpen}
        isSubmitting={isSubmitting}
        onViewModalClose={() => setIsViewModalOpen(false)}
        onEditModalClose={() => setIsEditModalOpen(false)}
        onDeleteModalClose={() => setIsDeleteModalOpen(false)}
        onEditFormChange={handleEditFormChange}
        onSelectChange={handleSelectChange}
        onEditSubmit={submitEditForm}
        onDeleteConfirm={confirmDelete}
      />
    </div>
  );
}

export { DataManagementClient };