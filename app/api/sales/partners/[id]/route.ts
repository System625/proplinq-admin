import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🔄 [Partner Details] GET request for ID: ${params.id}`);
    const authorization = request.headers.get('authorization');
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (authorization) headers['Authorization'] = authorization;

    const url = `${API_BASE_URL}/sales/partners/${params.id}`;
    console.log('📡 [Partner Details] Fetching from:', url);

    const response = await fetch(url, {
      headers,
      cache: 'no-store',
    });

    console.log('📊 [Partner Details] Response status:', response.status);
    const data = await response.json();
    console.log('📦 [Partner Details] Response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('❌ [Partner Details] Request failed:', data);
      return NextResponse.json(
        { message: data.message || 'Failed to fetch partner details' },
        { status: response.status }
      );
    }

    console.log('✅ [Partner Details] Request successful');
    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 [Partner Details] Exception:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
