import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 [Sales Onboarding API] Incoming request');
    const authorization = request.headers.get('authorization');
    const searchParams = request.nextUrl.searchParams;

    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (authorization) headers['Authorization'] = authorization;

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/sales/onboarding${queryString ? `?${queryString}` : ''}`;
    console.log('📡 [Sales Onboarding API] Fetching from:', url);
    console.log('🔍 [Sales Onboarding API] Query params:', queryString || 'none');

    const response = await fetch(url, {
      headers,
      cache: 'no-store',
    });

    console.log('📊 [Sales Onboarding API] Response status:', response.status);
    const data = await response.json();
    console.log('📦 [Sales Onboarding API] Response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('❌ [Sales Onboarding API] Request failed:', data);
      return NextResponse.json(
        { message: data.message || 'Failed to fetch onboarding requests' },
        { status: response.status }
      );
    }

    console.log('✅ [Sales Onboarding API] Request successful');
    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 [Sales Onboarding API] Exception:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 [Sales Onboarding API] POST - Creating onboarding request');
    const authorization = request.headers.get('authorization');
    const headers: Record<string, string> = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    if (authorization) headers['Authorization'] = authorization;

    const body = await request.json();
    console.log('📝 [Sales Onboarding API] Request body:', JSON.stringify(body, null, 2));

    const url = `${API_BASE_URL}/sales/onboarding`;
    console.log('📡 [Sales Onboarding API] POSTing to:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    console.log('📊 [Sales Onboarding API] Response status:', response.status);
    const data = await response.json();
    console.log('📦 [Sales Onboarding API] Response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('❌ [Sales Onboarding API] Request failed:', data);
      return NextResponse.json(
        { message: data.message || 'Failed to create onboarding request' },
        { status: response.status }
      );
    }

    console.log('✅ [Sales Onboarding API] POST Request successful');
    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 [Sales Onboarding API] POST Exception:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
