import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authorization = request.headers.get('authorization');
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (authorization) headers['Authorization'] = authorization;

    const response = await fetch(`${API_BASE_URL}/founder/discounts/${params.id}`, {
      headers,
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch discount' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    console.error('Founder discount get API error:');
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
    const authorization = request.headers.get('authorization');
    const body = await request.json();

    console.log('=== UPDATE DISCOUNT REQUEST ===');
    console.log('Discount ID:', params.id);
    console.log('Request Body:', JSON.stringify(body, null, 2));

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    if (authorization) headers['Authorization'] = authorization;

    const response = await fetch(`${API_BASE_URL}/founder/discounts/${params.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    console.log('Backend Response Status:', response.status);
    console.log('Backend Response Data:', JSON.stringify(data, null, 2));
    console.log('=== END UPDATE DISCOUNT ===');

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to update discount' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Founder discount update API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authorization = request.headers.get('authorization');
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (authorization) headers['Authorization'] = authorization;

    const response = await fetch(`${API_BASE_URL}/founder/discounts/${params.id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(
        { message: data.message || 'Failed to delete discount' },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: 'Discount deleted successfully' });
  } catch {
    console.error('Founder discount delete API error:');
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
