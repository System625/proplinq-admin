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
    const url = queryString ? `${API_BASE_URL}/admin/users?${queryString}` : `${API_BASE_URL}/admin/users`;

    const response = await fetch(url, {
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch users' },
        { status: response.status }
      );
    }

    // Return raw Laravel pagination response
    return NextResponse.json(data);
  } catch {
    console.error('Users API error:');
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}