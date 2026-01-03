import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    if (authorization) headers['Authorization'] = authorization;

    const body = await request.json();
    const url = `${API_BASE_URL}/operations/reports/export`;

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(
        { message: data.message || 'Failed to export report' },
        { status: response.status }
      );
    }

    // Return blob for file download
    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
        'Content-Disposition': response.headers.get('Content-Disposition') || 'attachment',
      },
    });
  } catch {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
