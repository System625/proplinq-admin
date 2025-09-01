import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get authorization token from request headers
    const authorization = request.headers.get('authorization');
    
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    if (authorization) {
      headers['Authorization'] = authorization;
    }

    const response = await fetch(`${API_BASE_URL}/admin/bookings/${id}`, {
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch booking' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Booking GET API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    console.log('📡 Booking API Route: Updating booking', id, 'with data:', body);

    // Get authorization token from request headers
    const authorization = request.headers.get('authorization');
    
    console.log('🔐 Booking API Route: Authorization header:', authorization ? 'Present' : 'Missing');
    
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    
    if (authorization) {
      headers['Authorization'] = authorization;
    }

    const url = `${API_BASE_URL}/admin/bookings/${id}`;
    console.log('📡 Booking API Route: Making PUT request to:', url);

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    console.log('📊 Booking API Route: Response status:', response.status);

    const data = await response.json();
    console.log('📦 Booking API Route: Response data:', data);

    if (!response.ok) {
      console.error('❌ Booking API Route: Update failed:', data);
      return NextResponse.json(
        { message: data.message || 'Failed to update booking' },
        { status: response.status }
      );
    }

    console.log('✅ Booking API Route: Update successful');
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Booking update API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}