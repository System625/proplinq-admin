import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (authorization) {
      headers['Authorization'] = authorization;
    }

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = queryString
      ? `${API_BASE_URL}/support/tickets?${queryString}`
      : `${API_BASE_URL}/support/tickets`;

    const response = await fetch(url, {
      headers,
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch tickets' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    console.error('Support Tickets API error:');
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (authorization) {
      headers['Authorization'] = authorization;
    }

    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/support/tickets`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to create ticket' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    console.error('Support Tickets API error:');
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
