import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🔄 [Onboarding Details] GET request for ID: ${params.id}`);
    const authorization = request.headers.get('authorization');
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (authorization) headers['Authorization'] = authorization;

    const url = `${API_BASE_URL}/sales/onboarding/${params.id}`;
    console.log('📡 [Onboarding Details] Fetching from:', url);

    const response = await fetch(url, {
      headers,
      cache: 'no-store',
    });

    console.log('📊 [Onboarding Details] Response status:', response.status);
    const data = await response.json();
    console.log('📦 [Onboarding Details] Response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('❌ [Onboarding Details] Request failed:', data);
      return NextResponse.json(
        { message: data.message || 'Failed to fetch onboarding details' },
        { status: response.status }
      );
    }

    console.log('✅ [Onboarding Details] Request successful');
    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 [Onboarding Details] Exception:', error);
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
    console.log(`🔄 [Onboarding Update] PUT request for ID: ${params.id}`);
    const authorization = request.headers.get('authorization');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (authorization) headers['Authorization'] = authorization;

    const body = await request.json();
    console.log('📝 [Onboarding Update] Request body:', JSON.stringify(body, null, 2));

    const url = `${API_BASE_URL}/sales/onboarding/${params.id}`;
    console.log('📡 [Onboarding Update] PUTing to:', url);

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    console.log('📊 [Onboarding Update] Response status:', response.status);
    const data = await response.json();
    console.log('📦 [Onboarding Update] Response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('❌ [Onboarding Update] Request failed:', data);
      return NextResponse.json(
        { message: data.message || 'Failed to update onboarding request' },
        { status: response.status }
      );
    }

    console.log('✅ [Onboarding Update] Request successful');
    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 [Onboarding Update] Exception:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
