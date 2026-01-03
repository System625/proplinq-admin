import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function POST(
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

    const response = await fetch(`${API_BASE_URL}/support/chats/${id}/close`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to close chat' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    console.error('Support Chat Close API error:');
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
