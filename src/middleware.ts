import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if user is authenticated
  const authToken = request.cookies.get('auth_token');
  const isAuthenticated = authToken?.value === 'authenticated';

  // Protected routes that require authentication
  const protectedRoutes = ['/players'];
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // If accessing a protected route without authentication, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing login page while already authenticated, redirect to players
  if (pathname === '/login' && isAuthenticated) {
    const playersUrl = new URL('/players', request.url);
    return NextResponse.redirect(playersUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/players/:path*', '/login', '/signup'],
}; 