export { auth as middleware } from "@/auth";

export const config = {
  // Match all routes except static files and API routes (unless you want to protect those too)
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - auth pages (signin, error)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$|auth).*)",
  ],
};
