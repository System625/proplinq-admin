import { NextRequest, NextResponse } from 'next/server';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get('url');

  if (!fileUrl) {
    return new NextResponse('Missing file URL', { status: 400 });
  }

  const allowedHost = 'proapi.proplinq.com';
  try {
    const url = new URL(fileUrl);
    if (url.hostname !== allowedHost) {
      return new NextResponse('Invalid file host', { status: 400 });
    }
  } catch {
    return new NextResponse('Invalid URL', { status: 400 });
  }

  try {
    const response = await fetch(fileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      return new NextResponse(await response.text(), {
        status: response.status,
      });
    }

    const buffer = await response.arrayBuffer();

    const headers = new Headers();
    headers.set(
      'Content-Type',
      response.headers.get('Content-Type') || 'application/octet-stream',
    );
    
    // Add CORS headers
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    const disposition = searchParams.get('disposition');
    
    if (disposition === 'inline') {
      // For inline viewing, set headers to prevent download managers from interfering
      headers.set('Cache-Control', 'no-cache');
      headers.set('X-Content-Type-Options', 'nosniff');
      // Don't set Content-Disposition to avoid IDM interference
    } else {
      // For downloads, set the attachment disposition
      const filename = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
      headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    }

    return new NextResponse(buffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new NextResponse('Error fetching file', { status: 500 });
  }
}
