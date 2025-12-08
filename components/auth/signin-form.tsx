"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/webauthn";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"signin" | "register">("signin");

  const handlePasskeyAuth = async (action: "signin" | "register") => {
    setIsLoading(true);
    setError(null);

    try {
      if (action === "register") {
        // Register a new passkey
        if (!email) {
          setError("Email is required for registration");
          setIsLoading(false);
          return;
        }

        await signIn("passkey", {
          action: "register",
          email,
        });
      } else {
        // Sign in with existing passkey
        await signIn("passkey", {
          action: "authenticate",
        });
      }
    } catch (err) {
      console.error("Passkey error:", err);
      setError(
        err instanceof Error ? err.message : "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          {mode === "signin" ? "Sign In" : "Create Account"}
        </CardTitle>
        <CardDescription>
          {mode === "signin"
            ? "Use your passkey to sign in securely"
            : "Register a new passkey to create your account"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mode === "register" && (
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Button
            onClick={() => handlePasskeyAuth(mode)}
            disabled={isLoading || (mode === "register" && !email)}
            className="w-full"
          >
            {isLoading
              ? "Loading..."
              : mode === "signin"
              ? "Sign In with Passkey"
              : "Register Passkey"}
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              setMode(mode === "signin" ? "register" : "signin");
              setError(null);
            }}
            disabled={isLoading}
            className="w-full"
          >
            {mode === "signin"
              ? "Need an account? Register"
              : "Already have an account? Sign In"}
          </Button>
        </div>

        <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">
          <p className="font-semibold">What is a passkey?</p>
          <p className="mt-1 text-xs">
            Passkeys use biometric authentication (Face ID, Touch ID) or your device's
            security to sign you in securely without passwords.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
