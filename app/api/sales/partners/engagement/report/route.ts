import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 [Engagement Report] GET request');
    const authorization = request.headers.get('authorization');
    const searchParams = request.nextUrl.searchParams;

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (authorization) headers['Authorization'] = authorization;

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/sales/partners/engagement/report${queryString ? `?${queryString}` : ''}`;
    console.log('📡 [Engagement Report] Fetching from:', url);
    console.log('🔍 [Engagement Report] Query params:', queryString || 'none');

    const response = await fetch(url, {
      headers,
      cache: 'no-store',
    });

    console.log('📊 [Engagement Report] Response status:', response.status);
    const data = await response.json();
    console.log('📦 [Engagement Report] Response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('❌ [Engagement Report] Request failed:', data);
      return NextResponse.json(
        { message: data.message || 'Failed to fetch engagement report' },
        { status: response.status }
      );
    }

    console.log('✅ [Engagement Report] Request successful');
    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 [Engagement Report] Exception:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
