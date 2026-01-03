import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🔄 [Partner Activity] GET request for ID: ${params.id}`);
    const authorization = request.headers.get('authorization');
    const searchParams = request.nextUrl.searchParams;

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (authorization) headers['Authorization'] = authorization;

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/sales/partners/${params.id}/activity${queryString ? `?${queryString}` : ''}`;
    console.log('📡 [Partner Activity] Fetching from:', url);
    console.log('🔍 [Partner Activity] Query params:', queryString || 'none');

    const response = await fetch(url, {
      headers,
      cache: 'no-store',
    });

    console.log('📊 [Partner Activity] Response status:', response.status);
    const data = await response.json();
    console.log('📦 [Partner Activity] Response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('❌ [Partner Activity] Request failed:', data);
      return NextResponse.json(
        { message: data.message || 'Failed to fetch partner activity' },
        { status: response.status }
      );
    }

    console.log('✅ [Partner Activity] Request successful');
    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 [Partner Activity] Exception:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
