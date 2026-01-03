import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🔄 [Partner Engagement] GET request for ID: ${params.id}`);
    const authorization = request.headers.get('authorization');
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (authorization) headers['Authorization'] = authorization;

    const url = `${API_BASE_URL}/sales/partners/${params.id}/engagement`;
    console.log('📡 [Partner Engagement] Fetching from:', url);

    const response = await fetch(url, {
      headers,
      cache: 'no-store',
    });

    console.log('📊 [Partner Engagement] Response status:', response.status);
    const data = await response.json();
    console.log('📦 [Partner Engagement] Response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('❌ [Partner Engagement] Request failed:', data);
      return NextResponse.json(
        { message: data.message || 'Failed to fetch partner engagement' },
        { status: response.status }
      );
    }

    console.log('✅ [Partner Engagement] Request successful');
    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 [Partner Engagement] Exception:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
