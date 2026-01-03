import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);

    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (authorization) headers['Authorization'] = authorization;

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/marketing/kyc/breakdown${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      headers,
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch KYC breakdown' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    console.error('Marketing KYC breakdown API error:');
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
