import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Authentication Utilities
 *
 * Centralized helpers for implementing defense-in-depth authentication.
 * These utilities provide consistent auth checking across all three security layers:
 *
 * - Layer 1: Proxy middleware (proxy.ts)
 * - Layer 2: Page and API route guards (use these helpers)
 * - Layer 3: Server action authorization (use these helpers)
 */

/**
 * Authentication Error
 * Thrown when authentication is required but not present
 */
export class AuthenticationError extends Error {
  constructor(message: string = "Authentication required") {
    super(message);
    this.name = "AuthenticationError";
  }
}

/**
 * Require Authentication - For Server Components & Server Actions
 *
 * Throws AuthenticationError if user is not authenticated.
 * Use this when you need the full session object.
 *
 * @throws {AuthenticationError} If not authenticated
 * @returns The authenticated session
 *
 * @example
 * // In a Server Component
 * export default async function ProtectedPage() {
 *   const session = await requireAuth();
 *   return <div>Welcome {session.user.email}</div>;
 * }
 *
 * @example
 * // In a Server Action
 * export async function updateProfile(data: FormData) {
 *   "use server";
 *   const session = await requireAuth();
 *   // ... perform update
 * }
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    throw new AuthenticationError("You must be signed in to access this resource");
  }

  return session;
}

/**
 * Require User - Convenience wrapper for getting user object
 *
 * Returns the authenticated user or throws.
 * Use this when you only need the user object.
 *
 * @throws {AuthenticationError} If not authenticated
 * @returns The authenticated user
 *
 * @example
 * export async function MyServerAction() {
 *   "use server";
 *   const user = await requireUser();
 *   console.log(`Action called by: ${user.email}`);
 * }
 */
export async function requireUser() {
  const session = await requireAuth();
  return session.user;
}

/**
 * Require Authentication with Page Redirect
 *
 * Redirects to sign-in page if not authenticated.
 * Use this in page components for better UX.
 *
 * @param redirectTo - Optional path to redirect to after sign-in
 * @returns The authenticated session
 *
 * @example
 * export default async function ProfilePage() {
 *   const session = await requireAuthWithRedirect();
 *   return <div>Profile for {session.user.email}</div>;
 * }
 */
export async function requireAuthWithRedirect(redirectTo?: string) {
  const session = await auth();

  if (!session?.user) {
    const signInUrl = redirectTo
      ? `/auth/signin?callbackUrl=${encodeURIComponent(redirectTo)}`
      : "/auth/signin";
    redirect(signInUrl);
  }

  return session;
}

/**
 * Get Optional Auth - For pages that show different content based on auth
 *
 * Returns session if authenticated, null otherwise.
 * Does not throw or redirect.
 *
 * @returns The session or null
 *
 * @example
 * export default async function HomePage() {
 *   const session = await getOptionalAuth();
 *   return session ? <AuthenticatedHome /> : <PublicHome />;
 * }
 */
export async function getOptionalAuth() {
  return await auth();
}

/**
 * API Route Authentication Helper
 *
 * Returns user if authenticated, or returns a 401 Response.
 * Use this in API route handlers.
 *
 * @returns Object with { user } or { error, response }
 *
 * @example
 * export async function GET() {
 *   const authResult = await requireApiAuth();
 *   if ('error' in authResult) {
 *     return authResult.response;
 *   }
 *   const { user } = authResult;
 *   return Response.json({ user });
 * }
 */
export async function requireApiAuth() {
  const session = await auth();

  if (!session?.user) {
    return {
      error: "Unauthorized",
      response: Response.json(
        { error: "Authentication required" },
        { status: 401 }
      ),
    };
  }

  return { user: session.user };
}
