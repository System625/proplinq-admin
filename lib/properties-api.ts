import {
  PropertyItem,
  ListPropertiesResponse,
  UpdatePropertyListingRequest,
  UpdatePropertyListingStatusRequest,
} from '@/types/api';

export const propertiesApiService = {
  // ==========================================
  // PROPERTIES MANAGEMENT
  // ==========================================

  async listProperties(params?: Record<string, unknown>): Promise<ListPropertiesResponse> {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('proplinq_admin_token')
        : null;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const queryString = params
      ? new URLSearchParams(params as Record<string, string>).toString()
      : '';

    const url = `/api/properties${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }

    const data = await response.json();
    return data;
  },

  async getPropertyById(id: number): Promise<PropertyItem> {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('proplinq_admin_token')
        : null;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/properties/${id}`, { headers });

    if (!response.ok) {
      throw new Error('Failed to fetch property details');
    }

    const data = await response.json();
    return data.data || data;
  },

  async updateProperty(
    id: number,
    updateData: UpdatePropertyListingRequest
  ): Promise<PropertyItem> {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('proplinq_admin_token')
        : null;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/properties/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error('Failed to update property');
    }

    const data = await response.json();
    return data.data || data;
  },

  async updatePropertyStatus(
    id: number,
    statusData: UpdatePropertyListingStatusRequest
  ): Promise<PropertyItem> {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('proplinq_admin_token')
        : null;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/properties/${id}/status`, {
      method: 'POST',
      headers,
      body: JSON.stringify(statusData),
    });

    if (!response.ok) {
      throw new Error('Failed to update property status');
    }

    const data = await response.json();
    return data.data || data;
  },

  async deleteProperty(id: number): Promise<void> {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('proplinq_admin_token')
        : null;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/properties/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to delete property');
    }
  },
};
