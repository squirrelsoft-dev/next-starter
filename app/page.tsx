import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

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

        {session?.user ? (
          <Card>
            <CardHeader>
              <CardTitle>Welcome back, {session.user.name || session.user.email}!</CardTitle>
              <CardDescription>You're currently signed in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Sign in or create an account using a passkey - no password required!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full">
                <Link href="/auth/signin">Sign In with Passkey</Link>
              </Button>
            </CardContent>
          </Card>
        )}

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
                Type-safe database access with PostgreSQL support (+ other databases on different branches)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
