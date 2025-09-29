import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function GET(request: NextRequest) {
  console.log('🔄 Blog Posts API: GET request started');

  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '15';

    console.log('📊 Blog Posts API: GET params:', { page, limit });

    const authHeader = request.headers.get('authorization');
    console.log('🔐 Blog Posts API: Auth header present:', !!authHeader);

    if (!authHeader) {
      console.log('❌ Blog Posts API: No authorization header');
      return NextResponse.json(
        { message: 'Authorization header required' },
        { status: 401 }
      );
    }

    const queryParams = new URLSearchParams({
      page,
      limit,
    });

    const apiUrl = `${API_BASE_URL}/admin/blog-posts?${queryParams}`;
    console.log('🌐 Blog Posts API: Making request to:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('📡 Blog Posts API: Backend response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('❌ Blog Posts API: Backend error:', errorData);
      return NextResponse.json(
        { message: errorData.message || 'Failed to fetch blog posts' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Blog Posts API: GET successful, data type:', typeof data);
    console.log('📄 Blog Posts API: Data preview:', JSON.stringify(data).substring(0, 200) + '...');

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Blog Posts API: GET error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log('🔄 Blog Posts API: POST request started');

  try {
    const authHeader = request.headers.get('authorization');
    console.log('🔐 Blog Posts API: Auth header present:', !!authHeader);

    if (!authHeader) {
      console.log('❌ Blog Posts API: No authorization header');
      return NextResponse.json(
        { message: 'Authorization header required' },
        { status: 401 }
      );
    }

    const contentType = request.headers.get('content-type');
    console.log('📝 Blog Posts API: Content-Type:', contentType);

    let body;
    if (contentType?.includes('application/json')) {
      body = await request.json();
      console.log('📊 Blog Posts API: JSON body received:', body);
    } else {
      // Handle FormData (though we should be using JSON according to endpoints.md)
      const formData = await request.formData();
      console.log('📊 Blog Posts API: FormData received with keys:', Array.from(formData.keys()));

      // Convert FormData to JSON for the backend
      body = {
        title: formData.get('title'),
        excerpt: formData.get('excerpt'),
        content: formData.get('content'),
        image: formData.get('image'), // This will be a File object, needs handling
      };
      console.log('📊 Blog Posts API: Converted FormData to:', body);
    }

    const apiUrl = `${API_BASE_URL}/admin/blog-posts`;
    console.log('🌐 Blog Posts API: Making request to:', apiUrl);
    console.log('📤 Blog Posts API: Request body:', JSON.stringify(body, null, 2));

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('📡 Blog Posts API: Backend response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('❌ Blog Posts API: Backend error:', errorData);
      return NextResponse.json(
        { message: errorData.message || 'Failed to create blog post' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Blog Posts API: POST successful:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Blog Posts API: POST error:', error);
    console.error('❌ Blog Posts API: Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}