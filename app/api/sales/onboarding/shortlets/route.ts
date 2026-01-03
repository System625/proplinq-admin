import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');
    const searchParams = request.nextUrl.searchParams;

    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (authorization) headers['Authorization'] = authorization;

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/sales/onboarding/shortlets${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      headers,
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch shortlet onboarding requests' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    console.error('Sales shortlet onboarding API error:');
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
