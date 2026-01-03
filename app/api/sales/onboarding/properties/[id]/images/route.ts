import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🔄 [Property Images Upload] POST request for Property ID: ${params.id}`);
    const authorization = request.headers.get('authorization');
    const headers: Record<string, string> = {};
    if (authorization) headers['Authorization'] = authorization;

    const formData = await request.formData();
    console.log('📝 [Property Images Upload] Form data fields:', Array.from(formData.keys()));

    // Expected form data from Postman:
    // images[] - file array

    const url = `${API_BASE_URL}/sales/onboarding/properties/${params.id}/images`;
    console.log('📡 [Property Images Upload] POSTing to:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
      cache: 'no-store',
    });

    console.log('📊 [Property Images Upload] Response status:', response.status);
    const data = await response.json();
    console.log('📦 [Property Images Upload] Response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('❌ [Property Images Upload] Request failed:', data);
      return NextResponse.json(
        { message: data.message || 'Failed to upload property images' },
        { status: response.status }
      );
    }

    console.log('✅ [Property Images Upload] Request successful');
    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 [Property Images Upload] Exception:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
