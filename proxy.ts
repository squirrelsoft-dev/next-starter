export { auth as proxy } from "@/auth";

/**
 * Proxy Middleware Configuration
 *
 * LAYER 1 DEFENSE: This is the first line of authentication defense.
 * It runs on ALL matched routes before any page renders or API handler executes.
 *
 * The `authorized` callback in auth.ts controls access at this layer.
 */

export const config = {
  /**
   * Route Matcher Configuration
   *
   * This matcher determines which routes the middleware runs on.
   * It uses Next.js path matching (NOT regex) - be careful with special characters.
   *
   * EXCLUDED ROUTES (middleware doesn't run on these):
   * - /api/auth/*           - Auth.js authentication endpoints (required for sign-in/out)
   * - /auth/*               - Auth pages like /auth/signin, /auth/error
   * - /_next/static/*       - Next.js static files (JS, CSS bundles)
   * - /_next/image/*        - Next.js image optimization API
   * - /favicon.ico          - Favicon
   * - Static files          - Any file with an extension (png, jpg, svg, etc.)
   *
   * PUBLIC ROUTES PATTERN:
   * To make additional routes public, add them to the exclusion pattern.
   *
   * Example - Make /about and /pricing public:
   * "/((?!api/auth|auth|_next/static|_next/image|favicon.ico|about|pricing|.*\\..*).*)"
   *
   * PROTECTED ROUTES PATTERN:
   * By default, ALL routes not excluded are protected and require authentication.
   * The authorized callback in auth.ts determines if a user can access them.
   *
   * Current Configuration:
   * - Home page (/) is PROTECTED (requires auth)
   * - Dashboard (/dashboard) is PROTECTED (requires auth)
   * - Auth pages (/auth/*) are PUBLIC (anyone can access)
   * - Static assets are PUBLIC
   */
  matcher: [
    /*
     * Match all routes except:
     * - /api/auth/* (Auth.js endpoints)
     * - /auth/* (sign-in, error pages)
     * - /_next/static/* (static files)
     * - /_next/image/* (image optimization)
     * - /favicon.ico
     * - Any file with extension (.*\\..*) - handles .png, .jpg, .svg, .ico, etc.
     */
    "/((?!api/auth|auth|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
