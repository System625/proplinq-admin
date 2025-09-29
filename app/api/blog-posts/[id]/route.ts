import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header required' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/admin/blog-posts/${params.id}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || 'Failed to fetch blog post' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Get blog post API error:', error);
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
  console.log('🔄 Blog Post API: PUT request started for ID:', params.id);

  try {
    const authHeader = request.headers.get('authorization');
    console.log('🔐 Blog Post API: Auth header present:', !!authHeader);

    if (!authHeader) {
      console.log('❌ Blog Post API: No authorization header');
      return NextResponse.json(
        { message: 'Authorization header required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('📊 Blog Post API: PUT body received:', body);

    const apiUrl = `${API_BASE_URL}/admin/blog-posts/${params.id}`;
    console.log('🌐 Blog Post API: Making PUT request to:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('📡 Blog Post API: Backend PUT response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('❌ Blog Post API: Backend PUT error:', errorData);
      return NextResponse.json(
        { message: errorData.message || 'Failed to update blog post' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Blog Post API: PUT successful:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Blog Post API: PUT error:', error);
    console.error('❌ Blog Post API: Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
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
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header required' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/admin/blog-posts/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || 'Failed to delete blog post' },
        { status: response.status }
      );
    }

    // For DELETE requests, we might get an empty response
    if (response.status === 204) {
      return NextResponse.json({ message: 'Blog post deleted successfully' });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Delete blog post API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}