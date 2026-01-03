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

    const response = await fetch(`${API_BASE_URL}/founder/staff/${params.id}`, {
      headers,
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch staff' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    console.error('Founder staff get API error:');
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

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    if (authorization) headers['Authorization'] = authorization;

    const response = await fetch(`${API_BASE_URL}/founder/staff/${params.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to update staff' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    console.error('Founder staff update API error:');
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

    const response = await fetch(`${API_BASE_URL}/founder/staff/${params.id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(
        { message: data.message || 'Failed to delete staff' },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: 'Staff deleted successfully' });
  } catch {
    console.error('Founder staff delete API error:');
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
