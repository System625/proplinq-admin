import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🔄 [KYC Required] GET request for Onboarding ID: ${params.id}`);
    const authorization = request.headers.get('authorization');
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (authorization) headers['Authorization'] = authorization;

    const url = `${API_BASE_URL}/sales/onboarding/${params.id}/kyc-required`;
    console.log('📡 [KYC Required] Fetching from:', url);

    const response = await fetch(url, {
      headers,
      cache: 'no-store',
    });

    console.log('📊 [KYC Required] Response status:', response.status);
    const data = await response.json();
    console.log('📦 [KYC Required] Response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('❌ [KYC Required] Request failed:', data);
      return NextResponse.json(
        { message: data.message || 'Failed to check KYC requirements' },
        { status: response.status }
      );
    }

    console.log('✅ [KYC Required] Request successful');
    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 [KYC Required] Exception:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
