import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

if (!API_BASE_URL) {
  console.error('BACKEND_API_URL environment variable is not set');
}

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

    const response = await fetch(`${API_BASE_URL}/company-data/${id}`, {
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch company data' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    console.error('Company data GET by ID API error:');
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

    // Filter out undefined values to avoid sending them to the API
    const cleanedData = Object.fromEntries(
      Object.entries(body).filter(([, value]) => value !== undefined)
    );

    // Get authorization token from request headers
    const authorization = request.headers.get('authorization');
    
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    
    if (authorization) {
      headers['Authorization'] = authorization;
    }

    const response = await fetch(`${API_BASE_URL}/company-data/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(cleanedData),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to update company data' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    console.error('Company data PUT API error:');
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    console.log('DELETE request for company data ID:', id);
    console.log('Backend API URL:', API_BASE_URL);

    // Get authorization token from request headers
    const authorization = request.headers.get('authorization');
    
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    
    if (authorization) {
      headers['Authorization'] = authorization;
    }

    console.log('Making DELETE request to:', `${API_BASE_URL}/company-data/${id}`);
    console.log('Headers:', headers);

    const response = await fetch(`${API_BASE_URL}/company-data/${id}`, {
      method: 'DELETE',
      headers,
    });

    console.log('Backend response status:', response.status);

    // Handle cases where backend returns no content (204) or empty response
    let data;
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : { status: true, message: 'Deleted successfully' };
    } catch {
      console.log('Response is not JSON, treating as success for 2xx status');
      data = { status: true, message: 'Deleted successfully' };
    }

    console.log('Backend response data:', data);

    if (!response.ok) {
      console.error('Backend DELETE failed:', response.status, data);
      return NextResponse.json(
        { message: data.message || 'Failed to delete company data' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Company data DELETE API error:');
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}