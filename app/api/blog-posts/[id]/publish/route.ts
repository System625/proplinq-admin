import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('🔄 Blog Post Publish API: POST request started for ID:', params.id);

  try {
    const authHeader = request.headers.get('authorization');
    console.log('🔐 Blog Post Publish API: Auth header present:', !!authHeader);

    if (!authHeader) {
      console.log('❌ Blog Post Publish API: No authorization header');
      return NextResponse.json(
        { message: 'Authorization header required' },
        { status: 401 }
      );
    }

    const apiUrl = `${API_BASE_URL}/admin/blog-posts/${params.id}/publish`;
    console.log('🌐 Blog Post Publish API: Making POST request to:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('📡 Blog Post Publish API: Backend POST response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('❌ Blog Post Publish API: Backend POST error:', errorData);
      return NextResponse.json(
        { message: errorData.message || 'Failed to publish blog post' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Blog Post Publish API: POST successful:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Blog Post Publish API: POST error:');
    console.error('❌ Blog Post Publish API: Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}