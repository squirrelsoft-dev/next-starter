import { requireAuthWithRedirect } from "@/lib/auth-utils";
import { signOut } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UpdateProfileForm } from "@/components/dashboard/update-profile-form";
import { getUserStats } from "@/app/actions/user-actions";

/**
 * Dashboard Page - PROTECTED ROUTE
 *
 * LAYER 2 DEFENSE: Page-level authentication check
 *
 * Defense Layers:
 * 1. Proxy middleware - Blocks unauthenticated requests
 * 2. Page check (this) - Redirects if somehow bypassed
 * 3. Server actions - Final validation before mutations
 */
export default async function DashboardPage() {
  // LAYER 2 DEFENSE: Require authentication
  const session = await requireAuthWithRedirect("/dashboard");

  // Fetch user stats using a server action (demonstrates Layer 3)
  const statsResult = await getUserStats();
  const stats = statsResult.success ? statsResult.data : null;

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button type="submit" variant="outline">
              Sign Out
            </Button>
          </form>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome! 🎉</CardTitle>
            <CardDescription>
              You're signed in with a passkey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-lg">{session.user.name || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-lg">{session.user.email || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">User ID</p>
              <p className="font-mono text-sm">{session.user.id}</p>
            </div>
            {stats && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Account Age</p>
                <p className="text-lg">{stats.accountAge} days</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Example: Using server actions with Layer 3 defense */}
        <Card>
          <CardHeader>
            <CardTitle>Update Profile</CardTitle>
            <CardDescription>
              This form uses server actions with Layer 3 authentication defense
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UpdateProfileForm currentName={session.user.name || ""} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Examples</CardTitle>
            <CardDescription>
              Example protected API routes with Layer 2 defense
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">GET /api/user/profile</p>
                <p className="text-sm text-muted-foreground">Fetch your profile data</p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/api/user/profile" target="_blank">
                  Try it
                </Link>
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">GET /api/user/settings</p>
                <p className="text-sm text-muted-foreground">Fetch your settings</p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/api/user/settings" target="_blank">
                  Try it
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Passkeys & Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              ✅ You're now authenticated using a passkey stored securely on your device
            </p>
            <p>
              🔐 No password was stored or transmitted - only cryptographic keys
            </p>
            <p>
              🛡️ Protected by three layers of authentication defense
            </p>
            <p>
              📱 Your passkey can sync across your devices via iCloud Keychain or Google Password Manager
            </p>
            <p>
              🚀 Next time you visit, just use Face ID/Touch ID to sign in instantly
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
