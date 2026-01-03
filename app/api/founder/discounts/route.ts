import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);

    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (authorization) headers['Authorization'] = authorization;

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/founder/discounts${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, { headers, cache: 'no-store' });
    const data = await response.json();

    console.log('=== FETCH DISCOUNTS ===');
    console.log('Backend Response Status:', response.status);
    console.log('Number of Discounts:', data?.data?.length || 0);
    if (data?.data?.length > 0) {
      console.log('First Discount:', JSON.stringify(data.data[0], null, 2));
    }
    console.log('=== END FETCH DISCOUNTS ===');

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch discounts' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Founder discounts list API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');
    const body = await request.json();

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    if (authorization) headers['Authorization'] = authorization;

    const response = await fetch(`${API_BASE_URL}/founder/discounts`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to create discount' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    console.error('Founder discount create API error:');
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
