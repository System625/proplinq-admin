import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get authorization token from request headers
    const authorization = request.headers.get('authorization');
    
    console.log('🔐 API Route: Authorization header:', authorization ? 'Present' : 'Missing');
    console.log('🌐 API Route: Backend URL:', API_BASE_URL);
    
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    if (authorization) {
      headers['Authorization'] = authorization;
    }

    // Build query parameters properly, excluding undefined values
    const queryParams = new URLSearchParams();
    
    // Add page parameter
    const page = searchParams.get('page');
    if (page) {
      queryParams.append('page', page);
    }
    
    // Add status parameter only if it's not undefined or 'all'
    const status = searchParams.get('status');
    if (status && status !== 'undefined' && status !== 'all') {
      queryParams.append('status', status);
    }
    
    // Add search parameter
    const search = searchParams.get('search');
    if (search && search.trim()) {
      queryParams.append('search', search.trim());
    }
    
    // Add any other parameters
    Array.from(searchParams.entries()).forEach(([key, value]) => {
      if (key !== 'page' && key !== 'status' && key !== 'search' && value && value !== 'undefined') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const url = queryString ? `${API_BASE_URL}/admin/bookings?${queryString}` : `${API_BASE_URL}/admin/bookings`;
    
    console.log('📡 API Route: Making request to:', url);
    console.log('📋 API Route: Request headers:', headers);

    const response = await fetch(url, {
      headers,
    });
    
    console.log('📊 API Route: Response status:', response.status);
    console.log('📊 API Route: Response ok:', response.ok);

    const data = await response.json();
    console.log('📦 API Route: Raw response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch bookings' },
        { status: response.status }
      );
    }

    // Transform Laravel pagination format to our expected format
    console.log('🔍 API Route: data.data structure:', data.data ? 'Present' : 'Missing');
    console.log('🔍 API Route: data.data.data structure:', data.data?.data ? 'Present' : 'Missing');
    
    const bookingsData = data.data?.data || [];
    console.log('📋 API Route: Bookings data length:', bookingsData.length);
    
    // Transform each booking to match our interface
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedBookings = bookingsData.map((booking: any) => ({
      id: booking.id.toString(),
      userId: booking.guest_id?.toString() || '',
      propertyId: booking.property_id?.toString() || '',
      checkIn: booking.check_in,
      checkOut: booking.check_out,
      totalAmount: parseFloat(booking.amount),
      status: booking.status,
      guestName: booking.guest?.full_name || '',
      guestEmail: booking.guest?.email || '',
      createdAt: booking.created_at,
      property: booking.property,
      guest: booking.guest,
      host: booking.host
    }));

    const transformedData = {
      data: transformedBookings,
      pagination: {
        page: data.data?.current_page || 1,
        limit: data.data?.per_page || 15,
        total: data.data?.total || 0,
        totalPages: data.data?.last_page || 1,
      }
    };
    
    console.log('✅ API Route: Final transformed data:', JSON.stringify(transformedData, null, 2));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Bookings API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}