import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🔄 [Update Property] PUT request for Property ID: ${params.id}`);
    const authorization = request.headers.get('authorization');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (authorization) headers['Authorization'] = authorization;

    const body = await request.json();
    console.log('📝 [Update Property] Request body:', JSON.stringify(body, null, 2));

    const url = `${API_BASE_URL}/sales/onboarding/properties/${params.id}`;
    console.log('📡 [Update Property] PUTing to:', url);

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    console.log('📊 [Update Property] Response status:', response.status);
    const data = await response.json();
    console.log('📦 [Update Property] Response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('❌ [Update Property] Request failed:', data);
      return NextResponse.json(
        { message: data.message || 'Failed to update property' },
        { status: response.status }
      );
    }

    console.log('✅ [Update Property] Request successful');
    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 [Update Property] Exception:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
