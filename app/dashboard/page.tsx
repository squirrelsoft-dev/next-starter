import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Passkeys</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              ✅ You're now authenticated using a passkey stored securely on your device
            </p>
            <p>
              🔐 No password was stored or transmitted - only cryptographic keys
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
