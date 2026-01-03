import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 [Sales Partners API] Incoming request');
    const authorization = request.headers.get('authorization');
    const searchParams = request.nextUrl.searchParams;

    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (authorization) headers['Authorization'] = authorization;

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/sales/partners${queryString ? `?${queryString}` : ''}`;
    console.log('📡 [Sales Partners API] Fetching from:', url);
    console.log('🔍 [Sales Partners API] Query params:', queryString || 'none');

    const response = await fetch(url, {
      headers,
      cache: 'no-store',
    });

    console.log('📊 [Sales Partners API] Response status:', response.status);
    const data = await response.json();
    console.log('📦 [Sales Partners API] Response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('❌ [Sales Partners API] Request failed:', data);
      return NextResponse.json(
        { message: data.message || 'Failed to fetch partners' },
        { status: response.status }
      );
    }

    console.log('✅ [Sales Partners API] Request successful');
    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 [Sales Partners API] Exception:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
