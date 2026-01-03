import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🔄 [Upload Room] POST request for Onboarding ID: ${params.id}`);
    const authorization = request.headers.get('authorization');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (authorization) headers['Authorization'] = authorization;

    const body = await request.json();
    console.log('📝 [Upload Room] Request body:', JSON.stringify(body, null, 2));

    const url = `${API_BASE_URL}/sales/onboarding/${params.id}/rooms`;
    console.log('📡 [Upload Room] POSTing to:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    console.log('📊 [Upload Room] Response status:', response.status);
    const data = await response.json();
    console.log('📦 [Upload Room] Response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('❌ [Upload Room] Request failed:', data);
      return NextResponse.json(
        { message: data.message || 'Failed to upload room' },
        { status: response.status }
      );
    }

    console.log('✅ [Upload Room] Request successful');
    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 [Upload Room] Exception:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
