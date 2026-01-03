import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🔄 [Onboarding Complete] POST request for ID: ${params.id}`);
    const authorization = request.headers.get('authorization');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (authorization) headers['Authorization'] = authorization;

    const body = await request.json();
    console.log('📝 [Onboarding Complete] Request body:', JSON.stringify(body, null, 2));

    const url = `${API_BASE_URL}/sales/onboarding/${params.id}/complete`;
    console.log('📡 [Onboarding Complete] POSTing to:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    console.log('📊 [Onboarding Complete] Response status:', response.status);
    const data = await response.json();
    console.log('📦 [Onboarding Complete] Response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('❌ [Onboarding Complete] Request failed:', data);
      return NextResponse.json(
        { message: data.message || 'Failed to complete onboarding' },
        { status: response.status }
      );
    }

    console.log('✅ [Onboarding Complete] Request successful');
    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 [Onboarding Complete] Exception:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
