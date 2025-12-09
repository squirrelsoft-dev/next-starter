import { requireAuthWithRedirect } from "@/lib/auth-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

/**
 * Home Page - PROTECTED ROUTE
 *
 * LAYER 2 DEFENSE: This page validates authentication using requireAuthWithRedirect().
 *
 * Defense Layers:
 * 1. Proxy middleware (proxy.ts) - Blocks unauthenticated requests
 * 2. Page-level check (this) - Redirects if somehow bypassed
 *
 * If a user reaches this page unauthenticated (e.g., middleware misconfiguration),
 * they will be redirected to /auth/signin.
 */
export default async function Home() {
  // LAYER 2 DEFENSE: Require authentication with redirect
  // If not authenticated, redirects to /auth/signin
  const session = await requireAuthWithRedirect();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="mx-auto max-w-2xl space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Next.js + Passkeys
          </h1>
          <p className="text-xl text-muted-foreground">
            A modern authentication starter with Auth.js v5 and WebAuthn passkeys
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome back, {session.user.name || session.user.email}!</CardTitle>
            <CardDescription>You're authenticated and viewing the protected home page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-left">
            <div className="space-y-2">
              <h3 className="font-semibold">🔐 Passkey Authentication</h3>
              <p className="text-sm text-muted-foreground">
                Secure, passwordless authentication using WebAuthn and device biometrics
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">🛡️ Defense-in-Depth Security</h3>
              <p className="text-sm text-muted-foreground">
                Three-layer authentication: proxy middleware, page guards, and server action validation
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">⚡ Next.js 16</h3>
              <p className="text-sm text-muted-foreground">
                Built with the latest Next.js features including App Router and Server Actions
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">🎨 shadcn/ui</h3>
              <p className="text-sm text-muted-foreground">
                Beautiful, accessible UI components built with Radix UI and Tailwind CSS
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">🗄️ Prisma ORM</h3>
              <p className="text-sm text-muted-foreground">
                Type-safe database access with PostgreSQL support
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
