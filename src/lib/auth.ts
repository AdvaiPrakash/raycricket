import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function isAuthenticated(request?: NextRequest): Promise<boolean> {
  try {
    if (request) {
      // For middleware or server components
      const authToken = request.cookies.get('auth_token');
      return authToken?.value === 'authenticated';
    } else {
      // For server components
      const cookieStore = await cookies();
      const authToken = cookieStore.get('auth_token');
      return authToken?.value === 'authenticated';
    }
  } catch (error) {
    return false;
  }
}

export async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token');
    return authToken?.value || null;
  } catch (error) {
    return null;
  }
} 