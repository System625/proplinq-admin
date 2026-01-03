import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🔄 [KYC Initiate] POST request for Onboarding ID: ${params.id}`);
    const authorization = request.headers.get('authorization');
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (authorization) headers['Authorization'] = authorization;

    const url = `${API_BASE_URL}/sales/onboarding/${params.id}/initiate-kyc`;
    console.log('📡 [KYC Initiate] POSTing to:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      cache: 'no-store',
    });

    console.log('📊 [KYC Initiate] Response status:', response.status);
    const data = await response.json();
    console.log('📦 [KYC Initiate] Response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('❌ [KYC Initiate] Request failed:', data);
      return NextResponse.json(
        { message: data.message || 'Failed to initiate KYC' },
        { status: response.status }
      );
    }

    console.log('✅ [KYC Initiate] Request successful');
    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 [KYC Initiate] Exception:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
