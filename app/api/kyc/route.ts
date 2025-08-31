import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get authorization token from request headers
    const authorization = request.headers.get('authorization');
    
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    if (authorization) {
      headers['Authorization'] = authorization;
    }

    // Build query parameters
    const queryString = searchParams.toString();
    const url = queryString ? `${API_BASE_URL}/admin/kyc?${queryString}` : `${API_BASE_URL}/admin/kyc`;

    const response = await fetch(url, {
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch KYC verifications' },
        { status: response.status }
      );
    }

    // Transform Laravel pagination format to our expected format
    const transformedData = {
      data: data.data || [],
      pagination: {
        page: data.current_page || 1,
        limit: data.per_page || 15,
        total: data.total || 0,
        totalPages: data.last_page || 1,
      }
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('KYC API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}