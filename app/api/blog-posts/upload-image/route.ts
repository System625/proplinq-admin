import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function POST(request: NextRequest) {
  console.log('🔄 Upload Image API: POST request started');

  try {
    const authHeader = request.headers.get('authorization');
    console.log('🔐 Upload Image API: Auth header present:', !!authHeader);

    if (!authHeader) {
      console.log('❌ Upload Image API: No authorization header');
      return NextResponse.json(
        { message: 'Authorization header required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const imageFile = formData.get('image_file');

    console.log('📊 Upload Image API: FormData keys:', Array.from(formData.keys()));
    console.log('📊 Upload Image API: Image file:', imageFile instanceof File ? `${imageFile.name} (${imageFile.size} bytes)` : 'Not a file');

    if (!imageFile || !(imageFile instanceof File)) {
      console.log('❌ Upload Image API: No valid image file provided');
      return NextResponse.json(
        { message: 'Image file is required' },
        { status: 400 }
      );
    }

    // Forward the FormData to the backend
    const backendFormData = new FormData();
    backendFormData.append('image_file', imageFile);

    const apiUrl = `${API_BASE_URL}/admin/blog-posts/upload-image`;
    console.log('🌐 Upload Image API: Making request to:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      },
      body: backendFormData,
    });

    console.log('📡 Upload Image API: Backend response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('❌ Upload Image API: Backend error:', errorData);
      return NextResponse.json(
        { message: errorData.message || 'Failed to upload image' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Upload Image API: Upload successful:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Upload Image API: Error:', error);
    console.error('❌ Upload Image API: Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}