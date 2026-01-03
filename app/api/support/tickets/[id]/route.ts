import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const authorization = request.headers.get('authorization');

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (authorization) {
      headers['Authorization'] = authorization;
    }

    const response = await fetch(`${API_BASE_URL}/support/tickets/${id}`, {
      headers,
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch ticket' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    console.error('Support Ticket API error:');
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
    const { id } = params;
    const authorization = request.headers.get('authorization');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (authorization) {
      headers['Authorization'] = authorization;
    }

    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/support/tickets/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to update ticket' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    console.error('Support Ticket API error:');
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
