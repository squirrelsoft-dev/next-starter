import { requireApiAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * GET /api/user/profile
 *
 * Returns the authenticated user's profile information.
 *
 * LAYER 2 DEFENSE: API Route Authentication
 *
 * Defense Layers:
 * 1. Proxy middleware - Blocks unauthenticated API requests
 * 2. API route guard (this) - Returns 401 if somehow bypassed
 *
 * This pattern should be used in ALL API routes that require authentication.
 *
 * @returns 200 with user profile data, or 401 if unauthorized
 */
export async function GET() {
  // LAYER 2 DEFENSE: Validate authentication
  const authResult = await requireApiAuth();

  // If not authenticated, return 401 response
  if ("error" in authResult) {
    return authResult.response;
  }

  const { user } = authResult;

  try {
    // Fetch additional user data from database
    // The user.id from session is guaranteed to exist if we got this far
    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
      },
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      profile: userProfile,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
