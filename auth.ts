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
    authorized: async ({ auth, request }) => {
      const { pathname } = request.nextUrl;

      // Allow access to home page without authentication
      if (pathname === "/") return true;

      // All other pages require authentication
      return !!auth;
    },
  },
  experimental: {
    enableWebAuthn: true,
  },
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
