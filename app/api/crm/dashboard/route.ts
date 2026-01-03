import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header missing' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const myLeads = searchParams.get('my_leads');

    const queryString = myLeads ? `?my_leads=${myLeads}` : '';
    const response = await fetch(
      `${BACKEND_API_URL}/crm/dashboard${queryString}`,
      {
        method: 'GET',
        headers: {
          Authorization: authHeader,
          Accept: 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    console.error('CRM dashboard error:');
    return NextResponse.json(
      { message: 'Failed to fetch CRM dashboard' },
      { status: 500 }
    );
  }
}
