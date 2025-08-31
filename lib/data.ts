import { DashboardStats } from '@/types/api';
import { unstable_noStore as noStore } from 'next/cache';

export async function getDashboardStats(): Promise<DashboardStats | undefined> {
  noStore();
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch dashboard stats:', response.statusText);
      return undefined;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('An error occurred while fetching dashboard stats:', error);
    return undefined;
  }
}
