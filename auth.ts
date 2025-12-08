import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import type { NextAuthConfig } from "next-auth";
import Passkey from "next-auth/providers/passkey";

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Passkey({
      // Relying Party ID - your domain (localhost for dev)
      // This should match RP_ID in your .env file
      rpID: process.env.RP_ID || "localhost",
      // Relying Party Name - shown in the passkey creation dialog
      rpName: process.env.RP_NAME || "Next.js Starter with Passkeys",
      // Origin - full URL of your app
      origin: process.env.RP_ORIGIN || "http://localhost:3000",
    }),
  ],
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    /**
     * LAYER 1 DEFENSE: Proxy Middleware Authorization
     *
     * This callback determines if a request is authorized to proceed.
     * It runs BEFORE any page or API route handler executes.
     *
     * Return true: Allow the request to proceed
     * Return false: Redirect to sign-in page (Auth.js handles redirect)
     *
     * ROUTE AUTHORIZATION STRATEGY:
     * ================================
     *
     * PUBLIC ROUTES (allow without auth):
     * - None by default in this template
     *
     * Example - To add public routes:
     * if (pathname === "/about" || pathname === "/pricing") {
     *   return true;
     * }
     *
     * PROTECTED ROUTES (require auth):
     * - / (home page) - Requires authentication
     * - /dashboard - Requires authentication
     * - All other routes - Require authentication by default
     */
    authorized: async ({ auth, request }) => {
      const { pathname } = request.nextUrl;

      // All routes matched by the proxy require authentication
      // If user is not authenticated, Auth.js redirects to /auth/signin
      return !!auth;
    },
  },
  experimental: {
    enableWebAuthn: true,
  },
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
