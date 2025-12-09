/**
 * Authentication Proxy (Next.js 16 Middleware)
 *
 * First line of defense - blocks unauthenticated requests before page render.
 * This is the modern Next.js 16 approach to authentication middleware.
 *
 * Three-Layer Security Architecture:
 * - Layer 1 (HERE): Block unauthenticated requests, redirect to sign-in
 * - Layer 2 (Server Components): Check auth in layout/page components
 * - Layer 3 (Server Actions): Fine-grained authorization when mutating data
 *
 * @see https://nextjs.org/docs/app/getting-started/proxy
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

/**
 * Authentication routes that should bypass authentication checks
 * to prevent redirect loops.
 */
const authRoutes = ['/auth/signin', '/auth/error', '/auth/signout', '/api/auth'];

/**
 * Public routes that don't require authentication.
 * Currently empty - all routes require authentication.
 * Extend this array to allow unauthenticated access to specific routes.
 *
 * Example: ['/about', '/pricing', '/blog']
 */
const publicRoutes: string[] = [];

/**
 * Check if a pathname matches any route in the given array.
 * Supports exact matches and prefix matches for API routes.
 *
 * @param pathname - The request pathname to check
 * @param routes - Array of route patterns to match against
 * @returns True if pathname matches any route
 */
function isRouteMatch(pathname: string, routes: string[]): boolean {
  return routes.some((route) => {
    // Exact match
    if (pathname === route) return true;
    // Prefix match for API routes (e.g., /api/auth matches /api/auth/callback/credentials)
    if (route.startsWith('/api/') && pathname.startsWith(route)) return true;
    // Prefix match for auth routes (e.g., /auth matches /auth/signin)
    if (route.startsWith('/auth') && pathname.startsWith(route)) return true;
    return false;
  });
}

/**
 * Proxy Function (Next.js 16 Middleware)
 *
 * Intercepts ALL requests (except static assets) and enforces authentication.
 *
 * Flow:
 * 1. Allow auth routes (prevent redirect loops)
 * 2. Allow public routes (if any configured)
 * 3. Check session with Auth.js
 * 4. Redirect unauthenticated users to /auth/signin with callback URL
 * 5. Allow authenticated users to proceed
 *
 * @param request - Next.js request object
 * @returns Next.js response (redirect or continue)
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow auth routes (prevent redirect loops)
  if (isRouteMatch(pathname, authRoutes)) {
    return NextResponse.next();
  }

  // Allow public routes (if any configured)
  if (isRouteMatch(pathname, publicRoutes)) {
    return NextResponse.next();
  }

  // Check authentication
  const session = await auth();

  // Redirect unauthenticated users to sign-in with callback URL
  if (!session?.user) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // User is authenticated - allow request to proceed
  return NextResponse.next();
}

/**
 * Middleware Configuration
 *
 * Matcher Pattern:
 * - Intercepts ALL routes EXCEPT:
 *   - /api/auth/* (Auth.js API routes)
 *   - /_next/static/* (Next.js static files)
 *   - /_next/image/* (Next.js Image Optimization API)
 *   - /favicon.ico (favicon)
 *   - Static files with extensions (.png, .jpg, .svg, etc.)
 *
 * Runtime:
 * - Runs on Node.js runtime by default (NOT Edge Runtime)
 * - Auth.js requires Node.js crypto APIs
 * - Prisma Client works in Node.js runtime
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /api/auth/* (Auth.js API routes)
     * - /auth/* (sign-in, error pages)
     * - /_next/static/* (static files)
     * - /_next/image/* (image optimization)
     * - /favicon.ico
     * - Any file with extension (.*\\..*) - handles .png, .jpg, .svg, .ico, etc.
     */
    '/((?!api/auth|auth|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
